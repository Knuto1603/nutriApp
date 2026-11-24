import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../../../core/constants/colors'
import { spacing } from '../../../core/constants/spacing'
import { typography } from '../../../core/constants/typography'
import { WaterLog } from '../../../domain/entities/WaterLog'
import { useWater } from '../../hooks/useWater'

const QUICK_OPTIONS = [150, 250, 350, 500]

export default function WaterScreen() {
  const { totalMl, goalMl, progress, remaining, goalReached, history, loading, add, reset } = useWater()

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.water} size="large" />
      </View>
    )
  }

  const glasses = Math.round(totalMl / 250)
  const goalGlasses = Math.round(goalMl / 250)

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

      {/* Indicador principal */}
      <View style={styles.mainCard}>
        <Text style={styles.dropEmoji}>💧</Text>

        {goalReached ? (
          <Text style={styles.goalReached}>¡Meta cumplida! 🎉</Text>
        ) : (
          <Text style={styles.remaining}>Faltan {remaining} ml</Text>
        )}

        {/* Barra de progreso */}
        <View
          style={styles.progressTrack}
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: Math.min(Math.round(progress * 100), 100) }}
          accessibilityLabel={`Progreso de hidratación: ${Math.min(Math.round(progress * 100), 100)}%`}
        >
          <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
        </View>

        <Text style={styles.totalText}>
          {totalMl} <Text style={styles.goalText}>/ {goalMl} ml</Text>
        </Text>
        <Text style={styles.glassesText}>
          {glasses} de {goalGlasses} vasos (250 ml)
        </Text>
      </View>

      {/* Botones rápidos */}
      <Text style={styles.sectionTitle}>Agregar agua</Text>
      <View style={styles.quickGrid}>
        {QUICK_OPTIONS.map((ml) => (
          <TouchableOpacity
            key={ml}
            style={styles.quickBtn}
            onPress={() => add(ml)}
            accessibilityRole="button"
            accessibilityLabel={`Agregar un vaso de ${ml} mililitros`}
          >
            <Text style={styles.quickMl}>+{ml}</Text>
            <Text style={styles.quickUnit}>ml</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón personalizado grande */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => add(250)}
        accessibilityRole="button"
        accessibilityLabel="Agregar un vaso de 250 mililitros"
      >
        <Ionicons name="water" size={22} color={colors.onPrimary} />
        <Text style={styles.addBtnText}>Agregar vaso (250 ml)</Text>
      </TouchableOpacity>

      {/* Historial 7 días */}
      {history.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Últimos 7 días</Text>
          <View style={styles.historyCard}>
            {history.map((log, i) => (
              <HistoryRow key={i} log={log} />
            ))}
          </View>
        </>
      )}

      {/* Resetear día */}
      <TouchableOpacity
        style={styles.resetBtn}
        onPress={reset}
        accessibilityRole="button"
        accessibilityLabel="Reiniciar registro de hoy"
      >
        <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.resetText}>Reiniciar registro de hoy</Text>
      </TouchableOpacity>

      {/* Recordatorio info */}
      <View style={styles.infoBox}>
        <Ionicons name="notifications-outline" size={16} color={colors.water} />
        <Text style={styles.infoText}>
          Recibirás 6 recordatorios diarios para mantenerte hidratado.
        </Text>
      </View>
    </ScrollView>
  )
}

function HistoryRow({ log }: { log: WaterLog }) {
  const pct = Math.min(log.totalMl / log.goalMl, 1)
  const reached = log.totalMl >= log.goalMl
  const label = formatDayLabel(log.date)

  return (
    <View style={styles.historyRow}>
      <Text style={styles.historyDay}>{label}</Text>
      <View style={styles.historyBarTrack}>
        <View style={[styles.historyBarFill, { width: `${pct * 100}%`, backgroundColor: reached ? colors.water : colors.divider }]} />
      </View>
      <Text style={[styles.historyMl, reached && { color: colors.water }]}>
        {log.totalMl} ml {reached ? '✓' : ''}
      </Text>
    </View>
  )
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' })
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mainCard: {
    backgroundColor: colors.surface, borderRadius: spacing.lg, padding: spacing.lg,
    alignItems: 'center', marginBottom: spacing.lg,
    elevation: 3, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
  },
  dropEmoji: { fontSize: 52, marginBottom: spacing.sm },
  goalReached: { fontSize: 20, fontWeight: '800', color: colors.success, marginBottom: spacing.md },
  remaining: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  progressTrack: { width: '100%', height: 14, backgroundColor: colors.track, borderRadius: 7, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: 14, backgroundColor: colors.water, borderRadius: 7 },
  totalText: { fontSize: 36, fontWeight: '900', color: colors.water },
  goalText: { fontSize: typography.sizes.lg, fontWeight: '500', color: colors.textSecondary },
  glassesText: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs },
  sectionTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  quickBtn: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.water,
    minHeight: 44,
    elevation: 1, shadowColor: colors.shadow, shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  quickMl: { fontSize: typography.sizes.md, fontWeight: '800', color: colors.water },
  quickUnit: { fontSize: 10, color: colors.textSecondary },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.water, borderRadius: spacing.md, padding: spacing.md, marginBottom: 28,
    minHeight: 44,
  },
  addBtnText: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.onPrimary },
  historyCard: {
    backgroundColor: colors.surface, borderRadius: spacing.md, padding: spacing.md, marginBottom: spacing.md,
    elevation: 2, shadowColor: colors.shadow, shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  historyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  historyDay: { width: 44, fontSize: typography.sizes.sm, color: colors.textSecondary, textTransform: 'capitalize' },
  historyBarTrack: { flex: 1, height: 8, backgroundColor: colors.track, borderRadius: 4, overflow: 'hidden' },
  historyBarFill: { height: 8, borderRadius: 4 },
  historyMl: { width: 68, fontSize: typography.sizes.xs, fontWeight: '600', color: colors.textSecondary, textAlign: 'right' },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, paddingHorizontal: spacing.md, marginBottom: 12,
    minHeight: 44,
  },
  resetText: { fontSize: 13, color: colors.textSecondary },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.track, borderRadius: 12, padding: 12,
  },
  infoText: { flex: 1, fontSize: typography.sizes.sm, color: colors.primary, lineHeight: 18 },
})
