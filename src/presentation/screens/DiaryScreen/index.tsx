import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { categoryColors, colors } from '../../../core/constants/colors'
import { MEAL_TIME_LABELS, MEAL_TIME_ORDER } from '../../../core/constants/meals'
import { spacing } from '../../../core/constants/spacing'
import { typography } from '../../../core/constants/typography'
import { DiaryEntry } from '../../../domain/entities/DiaryEntry'
import { useDiary } from '../../hooks/useDiary'

interface TabNavigationProp {
  navigate: (screen: string) => void
}

interface MacroBarProps {
  label: string
  current: number
  target: number | null
  color: string
}

function MacroBar({ label, current, target, color }: MacroBarProps) {
  const pct = target !== null && target > 0 ? Math.min(current / target, 1) : 0
  const pctDisplay = Math.min(Math.round(pct * 100), 100)

  return (
    <View style={styles.macroItem}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>
          {current}
          {target !== null ? ` / ${target} g` : ' g'}
        </Text>
      </View>
      <View
        style={styles.macroTrack}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: target ?? 100, now: current }}
        accessibilityLabel={`${label}: ${current}${target !== null ? ` de ${target}` : ''} gramos (${pctDisplay}%)`}
      >
        <View
          style={[
            styles.macroFill,
            {
              width: target !== null ? `${pctDisplay}%` : '0%',
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  )
}

export default function DiaryScreen() {
  const navigation = useNavigation<TabNavigationProp>()
  const { entries, summary, grouped, targetCalories, remaining, loading, remove } = useDiary()

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  const targetProtein = targetCalories !== null ? Math.round((targetCalories * 0.2) / 4) : null
  const targetCarbs = targetCalories !== null ? Math.round((targetCalories * 0.5) / 4) : null
  const targetFat = targetCalories !== null ? Math.round((targetCalories * 0.3) / 9) : null

  const calProgress =
    targetCalories !== null && targetCalories > 0
      ? Math.min(summary.calories / targetCalories, 1)
      : 0
  const calPercent = Math.min(Math.round(calProgress * 100), 100)

  const confirmDelete = (entry: DiaryEntry) => {
    Alert.alert(
      'Eliminar alimento',
      `¿Deseas eliminar ${entry.foodName} de tu diario?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            void remove(entry.id)
          },
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {targetCalories === null && (
        <TouchableOpacity
          style={styles.noProfileCard}
          onPress={() => navigation.navigate('Nutrición')}
          accessibilityRole="button"
          accessibilityLabel="Ir a Nutrición para calcular meta calórica diaria"
        >
          <Ionicons name="information-circle-outline" size={22} color={colors.accent} />
          <Text style={styles.noProfileText}>
            Configura tu perfil en la pestaña Nutrición para calcular tu meta calórica diaria.
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}

      <View style={styles.mainCard}>
        <Text style={styles.summaryTitle}>Calorías de hoy</Text>
        <Text style={styles.totalCalories}>
          {summary.calories}{' '}
          <Text style={styles.goalCalories}>
            {targetCalories !== null ? `/ ${targetCalories} kcal` : 'kcal'}
          </Text>
        </Text>

        {targetCalories !== null ? (
          <>
            <View
              style={styles.progressTrack}
              accessible={true}
              accessibilityRole="progressbar"
              accessibilityValue={{ min: 0, max: targetCalories, now: summary.calories }}
              accessibilityLabel={`Progreso de calorías: ${summary.calories} de ${targetCalories} kcal (${calPercent}%)`}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${calPercent}%`,
                    backgroundColor:
                      remaining !== null && remaining < 0 ? colors.warning : colors.primary,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.remainingText,
                remaining !== null && remaining < 0 && styles.remainingExceeded,
              ]}
            >
              {remaining !== null && remaining >= 0
                ? `Restan ${remaining} kcal`
                : remaining !== null
                  ? `Excedido por ${Math.abs(remaining)} kcal`
                  : ''}
            </Text>
          </>
        ) : (
          <Text style={styles.remainingText}>Sin meta diaria calculada</Text>
        )}

        <View style={styles.macrosContainer}>
          <MacroBar
            label="Proteínas"
            current={summary.proteinG}
            target={targetProtein}
            color={categoryColors['Proteínas'] ?? colors.primaryLight}
          />
          <MacroBar
            label="Carbohidratos"
            current={summary.carbsG}
            target={targetCarbs}
            color={colors.accent}
          />
          <MacroBar
            label="Grasas"
            current={summary.fatG}
            target={targetFat}
            color={categoryColors.Grasas ?? colors.warning}
          />
        </View>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="book-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>
            Aún no registras nada hoy. Ve a Alimentos y toca Agregar a mi día
          </Text>
          <TouchableOpacity
            style={styles.goToFoodsBtn}
            onPress={() => navigation.navigate('Alimentos')}
            accessibilityRole="button"
            accessibilityLabel="Ir a Alimentos para agregar alimentos al diario"
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.onPrimary} />
            <Text style={styles.goToFoodsBtnText}>Explorar Alimentos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        MEAL_TIME_ORDER.map((mealTime) => {
          const mealEntries = grouped[mealTime] ?? []
          if (mealEntries.length === 0) return null
          const mealCalories = mealEntries.reduce((sum, item) => sum + item.calories, 0)

          return (
            <View key={mealTime} style={styles.mealSection}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>{MEAL_TIME_LABELS[mealTime]}</Text>
                <Text style={styles.mealCalories}>{mealCalories} kcal</Text>
              </View>
              <View style={styles.mealCard}>
                {mealEntries.map((entry, index) => {
                  const isLast = index === mealEntries.length - 1
                  return (
                    <View
                      key={entry.id}
                      style={[styles.entryRow, !isLast && styles.entryDivider]}
                    >
                      <View style={styles.entryInfo}>
                        <Text style={styles.entryName} numberOfLines={1}>
                          {entry.foodName}
                        </Text>
                        <Text style={styles.entryDetails}>
                          {entry.grams} g • {entry.category}
                        </Text>
                      </View>
                      <Text style={styles.entryCalories}>{entry.calories} kcal</Text>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => confirmDelete(entry)}
                        accessibilityRole="button"
                        accessibilityLabel={`Eliminar ${entry.foodName}`}
                      >
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  noProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accentLight,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 44,
    gap: spacing.sm,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  noProfileText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  summaryTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  totalCalories: {
    fontSize: 34,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  goalCalories: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  progressTrack: {
    width: '100%',
    height: 12,
    backgroundColor: colors.track,
    borderRadius: 6,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: 12,
    borderRadius: 6,
  },
  remainingText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  remainingExceeded: {
    color: colors.warning,
  },
  macrosContainer: {
    width: '100%',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.md,
  },
  macroItem: {
    width: '100%',
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  macroLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  macroValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  macroTrack: {
    width: '100%',
    height: 8,
    backgroundColor: colors.track,
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroFill: {
    height: 8,
    borderRadius: 4,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  goToFoodsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  goToFoodsBtnText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.onPrimary,
  },
  mealSection: {
    marginBottom: spacing.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  mealTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  mealCalories: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  entryDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  entryInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  entryName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  entryDetails: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  entryCalories: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  deleteBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
