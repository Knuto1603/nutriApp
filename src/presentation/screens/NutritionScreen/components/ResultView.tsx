import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { categoryColors, colors } from '../../../../core/constants/colors'
import { spacing } from '../../../../core/constants/spacing'
import { typography } from '../../../../core/constants/typography'
import { Goal, NutritionResult, User } from '../../../../domain/entities/User'
import { useDemoMode } from '../../../hooks/useDemoMode'
import { useDiary } from '../../../hooks/useDiary'

const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Bajar peso',
  maintain: 'Mantener peso',
  gain: 'Subir peso',
}

export interface ResultViewProps {
  user: User
  result: NutritionResult
  onEdit: () => void
  onReset: () => void
}

interface MacroCardProps {
  label: string
  value: number
  unit: string
  color: string
}

export default function ResultView({ user, result, onEdit, onReset }: ResultViewProps) {
  const { summary } = useDiary()
  const { resetAll } = useDemoMode()

  const bmiColor =
    result.bmiCategory === 'Normal'
      ? colors.success
      : result.bmiCategory === 'Bajo peso'
        ? colors.water
        : colors.warning

  const goalKey: Goal = result.goal ?? user.goal ?? 'maintain'
  const goalLabel = GOAL_LABELS[goalKey]

  const consumedCalories = summary.calories
  const dailyTarget = result.dailyCalories
  const progressPercent = Math.min(
    100,
    Math.max(0, dailyTarget > 0 ? Math.round((consumedCalories / dailyTarget) * 100) : 0)
  )

  const handleDeleteAll = () => {
    Alert.alert(
      'Borrar todos los datos',
      '¿Estás seguro de que deseas borrar todos los datos? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            await resetAll()
            onReset()
          },
        },
      ]
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Hola, {user.name} 👋</Text>
      <Text style={styles.subtitle}>Tu requerimiento nutricional diario</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Calorías diarias</Text>
          <View style={styles.goalBadge}>
            <Text style={styles.goalBadgeText}>{goalLabel}</Text>
          </View>
        </View>
        <Text style={styles.calories}>{dailyTarget} kcal</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Mantenimiento: {result.maintenanceCalories} kcal</Text>
          <Text style={styles.metaText}>TMB: {result.bmr} kcal</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hoy</Text>
        <Text style={styles.todayCalories}>
          {consumedCalories}{' '}
          <Text style={styles.todayCaloriesSub}>/ {dailyTarget} kcal</Text>
        </Text>
        <View
          style={styles.progressBarTrack}
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityValue={{
            min: 0,
            max: dailyTarget,
            now: consumedCalories,
          }}
          accessibilityLabel={`Calorías de hoy: ${consumedCalories} de ${dailyTarget} kcal`}
        >
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      <View style={styles.macroRow}>
        <MacroCard label="Proteínas" value={result.proteinG} unit="g" color={categoryColors['Proteínas']} />
        <MacroCard label="Carbos" value={result.carbsG} unit="g" color={colors.accent} />
        <MacroCard label="Grasas" value={result.fatG} unit="g" color={categoryColors.Ultraprocesados} />
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>IMC</Text>
            <Text style={[styles.bmiValue, { color: bmiColor }]}>{result.bmi}</Text>
          </View>
          <View style={[styles.bmiTag, { backgroundColor: bmiColor }]}>
            <Text style={styles.bmiTagText}>{result.bmiCategory}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meta de agua diaria</Text>
        <Text style={[styles.calories, { color: colors.water }]}>
          {result.waterGoalMl} ml
        </Text>
        <Text style={styles.metaText}>~{Math.round(result.waterGoalMl / 250)} vasos de 250 ml</Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel="Editar perfil"
      >
        <Text style={styles.btnText}>Editar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnDangerOutline]}
        onPress={handleDeleteAll}
        accessibilityRole="button"
        accessibilityLabel="Borrar todos los datos"
      >
        <Text style={styles.btnDangerText}>Borrar todos los datos</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

function MacroCard({ label, value, unit, color }: MacroCardProps) {
  return (
    <View style={[styles.macroCard, { borderTopColor: color }]}>
      <Text style={[styles.macroValue, { color }]}>
        {value}
        <Text style={styles.macroUnit}>{unit}</Text>
      </Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  greeting: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md + spacing.xs,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: spacing.sm,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  goalBadge: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  goalBadgeText: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  calories: {
    fontSize: 36,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  todayCalories: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  todayCaloriesSub: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  progressBarTrack: {
    height: spacing.sm + 2,
    backgroundColor: colors.track,
    borderRadius: spacing.xs + 1,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: spacing.xs + 1,
  },
  macroRow: {
    flexDirection: 'row',
    gap: spacing.sm + spacing.xs,
    marginBottom: spacing.md,
  },
  macroCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
    borderTopWidth: 3,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  macroValue: {
    fontSize: 22,
    fontWeight: typography.weights.bold,
  },
  macroUnit: {
    fontSize: typography.sizes.xs + 2,
    fontWeight: typography.weights.medium,
  },
  macroLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
  },
  bmiTag: {
    paddingHorizontal: spacing.sm + spacing.xs,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
  },
  bmiTagText: {
    color: colors.onPrimary,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.xs + 2,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    padding: spacing.md,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  btnText: {
    color: colors.onPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  btnDangerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.error,
    marginTop: spacing.sm,
  },
  btnDangerText: {
    color: colors.error,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
})
