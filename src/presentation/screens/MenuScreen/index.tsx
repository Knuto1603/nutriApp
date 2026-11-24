import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { categoryColors, colors } from '../../../core/constants/colors'
import { spacing } from '../../../core/constants/spacing'
import { typography } from '../../../core/constants/typography'
import { Meal, MealTime } from '../../../domain/entities/Meal'
import { useMenu } from '../../hooks/useMenu'

const MEAL_CONFIG: Record<MealTime, { label: string; icon: string; color: string; time: string }> = {
  breakfast: { label: 'Desayuno',  icon: '🌅', color: colors.accent, time: '7:00 – 9:00 am' },
  lunch:     { label: 'Almuerzo', icon: '☀️', color: categoryColors.Verduras, time: '12:00 – 2:00 pm' },
  dinner:    { label: 'Cena',     icon: '🌙', color: categoryColors['Proteínas'], time: '7:00 – 9:00 pm'  },
  snack:     { label: 'Snack',    icon: '🍎', color: categoryColors.Frutas, time: 'Entre comidas'    },
}

export default function MenuScreen() {
  const { menu, hasProfile, error, regenerate } = useMenu()

  if (hasProfile === null) return <View style={styles.container} />

  if (!hasProfile) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🥗</Text>
        <Text style={styles.emptyTitle}>Perfil incompleto</Text>
        <Text style={styles.emptyText}>
          Ve a la pestaña Nutrición e ingresa tus datos para recibir un menú personalizado.
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>⚠️</Text>
        <Text style={styles.emptyTitle}>Error al generar menú</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={regenerate}
          accessibilityRole="button"
          accessibilityLabel="Reintentar generar menú"
        >
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!menu) return <View style={styles.container} />

  const meals = [menu.breakfast, menu.lunch, menu.dinner, menu.snack]
  const totalCal = meals.reduce((s, m) => s + m.totalCalories, 0)

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>

      {/* Encabezado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Menú de hoy</Text>
          <Text style={styles.headerDate}>{formatDate(menu.date)}</Text>
        </View>
        <View style={styles.calSummary}>
          <Text style={styles.calTotal}>{totalCal}</Text>
          <Text style={styles.calLabel}>de {menu.targetCalories} kcal</Text>
        </View>
      </View>

      {/* Barra de progreso calórico */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(totalCal / menu.targetCalories, 1) * 100}%` }]} />
      </View>
      <Text style={styles.progressLabel}>
        {Math.round((totalCal / menu.targetCalories) * 100)}% del objetivo diario cubierto
      </Text>

      {/* Cards de comidas */}
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}

      {/* Botón regenerar */}
      <TouchableOpacity
        style={styles.regenBtn}
        onPress={regenerate}
        accessibilityRole="button"
        accessibilityLabel="Regenerar menú"
      >
        <Ionicons name="refresh-outline" size={18} color={colors.primary} />
        <Text style={styles.regenText}>Generar otro menú</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

function MealCard({ meal }: { meal: Meal }) {
  const cfg = MEAL_CONFIG[meal.time]

  return (
    <View style={styles.card}>
      {/* Header de la card */}
      <View style={[styles.cardHeader, { backgroundColor: cfg.color }]}>
        <Text style={styles.cardEmoji}>{cfg.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardMealType}>{cfg.label}</Text>
          <Text style={styles.cardTitle}>{meal.title}</Text>
        </View>
        <View style={styles.cardCalBadge}>
          <Text style={styles.cardCal}>{meal.totalCalories}</Text>
          <Text style={styles.cardCalUnit}>kcal</Text>
        </View>
      </View>

      {/* Ítems de la comida */}
      <View style={styles.cardBody}>
        {meal.items.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={styles.itemDot} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPortion}>{item.portionG}g</Text>
            <Text style={styles.itemCal}>{item.calories} kcal</Text>
          </View>
        ))}

        {/* Macros */}
        <View style={styles.macroRow}>
          <MacroPill label="P" value={meal.proteinG} color={categoryColors['Proteínas']} />
          <MacroPill label="C" value={meal.carbsG}   color={colors.accent} />
          <MacroPill label="G" value={meal.fatG}     color={categoryColors.Ultraprocesados} />
        </View>
      </View>

      {/* Horario */}
      <View style={styles.cardFooter}>
        <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
        <Text style={styles.cardTime}>{cfg.time}</Text>
      </View>
    </View>
  )
}

function MacroPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.pillLabel, { color }]}>{label}</Text>
      <Text style={styles.pillValue}>{value}g</Text>
    </View>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyIcon: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.sizes.base, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  headerDate: { fontSize: 13, color: colors.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  calSummary: { alignItems: 'flex-end' },
  calTotal: { fontSize: 28, fontWeight: '900', color: colors.primary },
  calLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  progressTrack: { height: 8, backgroundColor: colors.divider, borderRadius: 4, marginBottom: 6 },
  progressFill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  progressLabel: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: 20 },
  card: {
    backgroundColor: colors.surface, borderRadius: 18, marginBottom: spacing.md,
    overflow: 'hidden', elevation: 2,
    shadowColor: colors.shadow, shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  cardEmoji: { fontSize: 28 },
  cardMealType: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.8)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.onPrimary, marginTop: 2 },
  cardCalBadge: { alignItems: 'center' },
  cardCal: { fontSize: 22, fontWeight: '900', color: colors.onPrimary },
  cardCalUnit: { fontSize: 10, color: 'rgba(255,255,255,0.8)' },
  cardBody: { padding: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  itemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.divider, marginRight: 10 },
  itemName: { flex: 1, fontSize: 13, color: colors.textPrimary },
  itemPortion: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginRight: spacing.sm },
  itemCal: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.textSecondary, width: 56, textAlign: 'right' },
  macroRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: spacing.xs,
  },
  pillLabel: { fontSize: typography.sizes.sm, fontWeight: '800' },
  pillValue: { fontSize: typography.sizes.sm, color: colors.textPrimary, fontWeight: '500' },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: 14, paddingBottom: 12,
  },
  cardTime: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  regenBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    borderWidth: 1.5, borderColor: colors.primary, borderRadius: 14,
    padding: 14, marginTop: spacing.xs, minHeight: 44,
  },
  regenText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  retryBtn: {
    backgroundColor: colors.primary, borderRadius: 14,
    paddingHorizontal: spacing.lg, paddingVertical: 12, marginTop: 20,
    minHeight: 44, justifyContent: 'center', alignItems: 'center',
  },
  retryBtnText: { color: colors.onPrimary, fontSize: 15, fontWeight: '700' },
})
