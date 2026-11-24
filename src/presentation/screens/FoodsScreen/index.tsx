import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { categoryColors, colors } from '../../../core/constants/colors'
import { MEAL_TIME_LABELS, MEAL_TIME_ORDER } from '../../../core/constants/meals'
import { Food } from '../../../domain/entities/Food'
import { MealTime } from '../../../domain/entities/Meal'
import { useDiary } from '../../hooks/useDiary'
import { useFoods } from '../../hooks/useFoods'

export default function FoodsScreen() {
  const { localFoods, remoteFoods, loadingLocal, loadingRemote, remoteError, query, onSearch } = useFoods()
  const [selected, setSelected] = useState<Food | null>(null)

  const sections = [
    ...(localFoods.length > 0 ? [{ title: '📍 Base local', data: localFoods }] : []),
    ...(remoteFoods.length > 0 ? [{ title: '🌐 Open Food Facts', data: remoteFoods }] : []),
  ]

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar alimento..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={onSearch}
        />
        {loadingRemote && <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 8 }} />}
        {query.length > 0 && !loadingRemote && (
          <TouchableOpacity
            onPress={() => onSearch('')}
            accessibilityRole="button"
            accessibilityLabel="Limpiar búsqueda"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {query.trim().length > 0 && query.trim().length < 3 && (
        <Text style={styles.hintText}>Escribe al menos 3 letras para buscar en Internet</Text>
      )}

      {remoteError && (
        <Text style={styles.hintText}>Sin conexión: solo resultados locales</Text>
      )}

      {loadingLocal ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={{ padding: 16, paddingTop: 4 }}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderSectionFooter={() => <View style={{ height: 16 }} />}
          ListEmptyComponent={
            !loadingRemote ? (
              <View style={styles.center}>
                <Ionicons name="search-outline" size={48} color={colors.divider} />
                <Text style={styles.emptyText}>No se encontraron alimentos</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelected(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, ${item.category}, ${item.calories} calorías`}
            >
              <View style={[styles.categoryDot, { backgroundColor: categoryColors[item.category] ?? categoryColors.Otros }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.foodCategory}>{item.category} · {item.portionG}g</Text>
              </View>
              <View style={styles.calBadge}>
                <Text style={styles.calText}>{item.calories}</Text>
                <Text style={styles.calUnit}>kcal</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && <FoodDetail food={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </View>
  )
}

function getDefaultMealTime(): MealTime {
  const hour = new Date().getHours()
  if (hour < 11) return 'breakfast'
  if (hour < 16) return 'lunch'
  if (hour < 20) return 'dinner'
  return 'snack'
}

function FoodDetail({ food, onClose }: { food: Food; onClose: () => void }) {
  const { add } = useDiary()
  const catColor = categoryColors[food.category] ?? categoryColors.Otros
  const isUltraprocessed = food.category === 'Ultraprocesados'
  const isRemote = food.id >= 10000

  const [gramsText, setGramsText] = useState(String(food.portionG || 100))
  const [mealTime, setMealTime] = useState<MealTime>(getDefaultMealTime)
  const [isAdding, setIsAdding] = useState(false)
  const [feedback, setFeedback] = useState(false)

  const grams = Number(gramsText.trim())
  const isValidGrams = !Number.isNaN(grams) && grams >= 1 && grams <= 2000

  const handleAdd = async () => {
    if (!isValidGrams || isAdding) return
    setIsAdding(true)
    try {
      await add(food, grams, mealTime)
      setFeedback(true)
      setTimeout(() => {
        setFeedback(false)
      }, 2000)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.detailContainer}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={[styles.detailHeader, { backgroundColor: catColor }]}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Cerrar detalle"
          >
            <Ionicons name="close" size={24} color={colors.onPrimary} />
          </TouchableOpacity>
          <Text style={styles.detailName} numberOfLines={2}>{food.name}</Text>
          <View style={styles.detailMeta}>
            <Text style={styles.detailCategory}>{food.category}</Text>
            {isRemote && (
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceText}>🌐 Open Food Facts</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ padding: 20 }}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Porción de referencia</Text>
            <Text style={styles.detailPortion}>{food.portionG} g</Text>
            <Text style={styles.detailCalories}>{food.calories} kcal</Text>
          </View>

          <View style={styles.addSectionCard}>
            <Text style={styles.sectionTitle}>Agregar a mi día</Text>

            <Text style={styles.inputLabel}>Gramos (1 - 2000)</Text>
            <View style={[styles.gramsInputRow, !isValidGrams && gramsText.length > 0 && styles.inputError]}>
              <TextInput
                style={styles.gramsInput}
                keyboardType="numeric"
                value={gramsText}
                onChangeText={(text) => {
                  setGramsText(text)
                  if (feedback) setFeedback(false)
                }}
                accessibilityLabel="Cantidad en gramos"
                placeholder={String(food.portionG || 100)}
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.gramsUnit}>g</Text>
            </View>
            {!isValidGrams && gramsText.length > 0 && (
              <Text style={styles.errorText}>Ingresa entre 1 y 2000 g</Text>
            )}

            <Text style={styles.inputLabel}>Comida</Text>
            <View style={styles.chipsContainer}>
              {MEAL_TIME_ORDER.map((time) => {
                const isSelected = mealTime === time
                return (
                  <TouchableOpacity
                    key={time}
                    style={[styles.mealChip, isSelected && styles.mealChipSelected]}
                    onPress={() => {
                      setMealTime(time)
                      if (feedback) setFeedback(false)
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Comida: ${MEAL_TIME_LABELS[time]}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={[styles.mealChipText, isSelected && styles.mealChipTextSelected]}>
                      {MEAL_TIME_LABELS[time]}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.addBtn,
                feedback && styles.addBtnSuccess,
                (!isValidGrams || isAdding) && !feedback && styles.addBtnDisabled,
              ]}
              onPress={handleAdd}
              disabled={!isValidGrams || isAdding}
              accessibilityRole="button"
              accessibilityLabel={feedback ? 'Agregado ✓' : 'Agregar'}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <Text style={styles.addBtnText}>{feedback ? 'Agregado ✓' : 'Agregar'}</Text>
              )}
            </TouchableOpacity>

            {feedback && (
              <View style={styles.feedbackRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.feedbackText}>Agregado ✓</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Macronutrientes</Text>
          <View style={styles.macroGrid}>
            <MacroBar label="Proteínas"     value={food.proteinG} color={categoryColors['Proteínas']} kcal={food.proteinG * 4} />
            <MacroBar label="Carbohidratos" value={food.carbsG}   color={colors.accent}               kcal={food.carbsG * 4} />
            <MacroBar label="Grasas"        value={food.fatG}     color={categoryColors.Ultraprocesados} kcal={food.fatG * 9} />
            <MacroBar label="Fibra"         value={food.fiberG}   color={colors.primary}              kcal={0} />
          </View>

          {isUltraprocessed && (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color={colors.error} />
              <Text style={styles.warningText}>
                Este alimento es ultraprocesado. Su consumo frecuente está asociado con mayor riesgo de enfermedades crónicas.
              </Text>
            </View>
          )}

          {isRemote && (
            <Text style={styles.sourceNote}>
              Datos obtenidos de Open Food Facts (world.openfoodfacts.org). Valores por 100g.
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function MacroBar({ label, value, color, kcal }: { label: string; value: number; color: string; kcal: number }) {
  const pct = Math.min(value / 60, 1)
  return (
    <View style={styles.macroBarContainer}>
      <View style={styles.macroBarRow}>
        <Text style={styles.macroBarLabel}>{label}</Text>
        <Text style={styles.macroBarValue}>{value}g{kcal > 0 ? ` · ${Math.round(kcal)} kcal` : ''}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.divider,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
  clearBtn: {
    minWidth: 44, minHeight: 44,
    alignItems: 'center', justifyContent: 'center',
  },
  hintText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginBottom: 8 },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 8, marginTop: 4 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    minHeight: 48,
    elevation: 1, shadowColor: colors.shadow, shadowOpacity: 0.04,
    shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  categoryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  foodName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  foodCategory: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  calBadge: { alignItems: 'center', marginLeft: 8 },
  calText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  calUnit: { fontSize: 10, color: colors.textSecondary },
  emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: 12 },
  detailContainer: { flex: 1, backgroundColor: colors.background },
  detailHeader: { padding: 24, paddingTop: 48, paddingBottom: 28 },
  closeBtn: {
    alignSelf: 'flex-end', marginBottom: 16,
    minWidth: 44, minHeight: 44,
    alignItems: 'center', justifyContent: 'center',
  },
  detailName: { fontSize: 22, fontWeight: '800', color: colors.onPrimary, marginBottom: 6 },
  detailMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  detailCategory: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  sourceBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  sourceText: { fontSize: 11, color: colors.onPrimary, fontWeight: '600' },
  detailCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 20,
    elevation: 2, shadowColor: colors.shadow, shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  detailLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  detailPortion: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  detailCalories: { fontSize: 40, fontWeight: '900', color: colors.primary, marginTop: 4 },
  addSectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  gramsInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 44,
    marginBottom: 14,
  },
  gramsInput: { flex: 1, minHeight: 44, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  gramsUnit: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginLeft: 4 },
  inputError: { borderColor: colors.error },
  errorText: { fontSize: 12, color: colors.errorText, marginTop: -10, marginBottom: 12 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  mealChip: {
    flexGrow: 1,
    minHeight: 44,
    minWidth: 64,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  mealChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  mealChipTextSelected: { color: colors.onPrimary },
  addBtn: {
    minHeight: 44,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  addBtnDisabled: { opacity: 0.5 },
  addBtnSuccess: { backgroundColor: colors.success },
  addBtnText: { fontSize: 15, fontWeight: '700', color: colors.onPrimary },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  feedbackText: { fontSize: 13, fontWeight: '600', color: colors.success },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  macroGrid: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    elevation: 2, shadowColor: colors.shadow, shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  macroBarContainer: { marginBottom: 14 },
  macroBarRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  macroBarLabel: { fontSize: 13, color: colors.textSecondary },
  macroBarValue: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  barTrack: { height: 8, backgroundColor: colors.track, borderRadius: 4 },
  barFill: { height: 8, borderRadius: 4 },
  warningBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: colors.errorBg, borderRadius: 12, padding: 14, marginTop: 16,
    borderLeftWidth: 4, borderLeftColor: colors.error,
  },
  warningText: { flex: 1, fontSize: 13, color: colors.errorText, lineHeight: 18 },
  sourceNote: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginTop: 20, fontStyle: 'italic' },
})
