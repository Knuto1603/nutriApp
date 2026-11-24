import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, levelColors } from '../../../core/constants/colors'
import { spacing } from '../../../core/constants/spacing'
import { localDateString } from '../../../core/utils/date'
import { Challenge, ChallengeCategory } from '../../../domain/entities/Challenge'
import { AUTO_CHALLENGE_IDS } from '../../../domain/usecases/AutoChallenges'
import { isCompletedToday } from '../../../domain/usecases/GetChallenges'
import { useChallenges } from '../../hooks/useChallenges'

const CATEGORY_CONFIG: Record<ChallengeCategory, { icon: string; color: string }> = {
  agua:         { icon: '💧', color: colors.water },
  alimentacion: { icon: '🥗', color: colors.primary },
  habitos:      { icon: '⭐', color: colors.accent },
}

const TYPE_LABEL: Record<string, string> = {
  daily: 'Diario', weekly: 'Semanal', challenge: 'Desafío',
}

export default function ChallengesScreen() {
  const { active, completed, available, progress, nextPoints, completeDay, activate, loaded } = useChallenges()

  if (!loaded) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} size="large" /></View>
  }

  const levelColor = levelColors[Math.min(progress.level - 1, levelColors.length - 1)]
  const levelPct   = progress.totalPoints / nextPoints

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }}>

      <View style={[styles.levelCard, { borderLeftColor: levelColor }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.levelLabel}>Tu nivel</Text>
          <Text style={[styles.levelTitle, { color: levelColor }]}>{progress.levelTitle}</Text>
          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: nextPoints, now: progress.totalPoints }}
          >
            <View style={[styles.progressFill, { width: `${Math.min(levelPct, 1) * 100}%`, backgroundColor: levelColor }]} />
          </View>
          <Text style={styles.pointsText}>
            {progress.totalPoints} / {nextPoints} pts para el siguiente nivel
          </Text>
        </View>
        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={styles.levelNumber}>{progress.level}</Text>
        </View>
      </View>

      {active.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🔥 En progreso</Text>
          {active.map((c) => (
            <ChallengeCard key={c.id} challenge={c} onComplete={() => completeDay(c.id)} />
          ))}
        </>
      )}

      {available.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>⚡ Disponibles</Text>
          {available.map((c) => (
            <AvailableCard key={c.id} challenge={c} onActivate={() => activate(c.id)} />
          ))}
        </>
      )}

      {completed.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>✅ Completados</Text>
          {completed.map((c) => (
            <CompletedCard key={c.id} challenge={c} />
          ))}
        </>
      )}
    </ScrollView>
  )
}

function ChallengeCard({ challenge: c, onComplete }: { challenge: Challenge; onComplete: () => void }) {
  const cfg = CATEGORY_CONFIG[c.category]
  const pct = c.completedDays / c.targetDays
  const doneToday = isCompletedToday(c, localDateString())
  const isAuto = AUTO_CHALLENGE_IDS.includes(c.id)

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{cfg.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{c.title}</Text>
          <Text style={styles.cardDesc}>{c.description}</Text>
        </View>
        <View style={styles.badgesCol}>
          <View style={[styles.typeBadge, { backgroundColor: cfg.color + '22', borderColor: cfg.color }]}>
            <Text style={[styles.typeText, { color: cfg.color }]}>{TYPE_LABEL[c.type]}</Text>
          </View>
          {isAuto && (
            <View
              style={styles.autoBadge}
              accessibilityRole="text"
              accessibilityLabel="Reto automático"
            >
              <Ionicons name="sparkles" size={10} color={colors.accent} />
              <Text style={styles.autoBadgeText}>Automático</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.progressRow}>
        <View
          style={styles.progressTrackCard}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: c.targetDays, now: c.completedDays }}
        >
          <View style={[styles.progressFillCard, { width: `${pct * 100}%`, backgroundColor: cfg.color }]} />
        </View>
        <Text style={styles.progressLabel}>{c.completedDays}/{c.targetDays} días</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.pointsBadge}>
          <Ionicons name="star" size={13} color={colors.accent} />
          <Text style={styles.pointsLabel}>+{c.points} pts al completar</Text>
        </View>
        {isAuto ? (
          <View
            style={styles.autoStatusContainer}
            accessibilityRole="text"
            accessibilityLabel="Se completa automáticamente"
          >
            <Ionicons name="sync-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.autoStatusText}>Se completa automáticamente</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.completeBtn,
              { backgroundColor: doneToday ? colors.textSecondary : cfg.color, opacity: doneToday ? 0.5 : 1 },
            ]}
            onPress={onComplete}
            disabled={doneToday}
            accessibilityRole="button"
            accessibilityLabel={doneToday ? `Hecho hoy: ${c.title}` : `Completar hoy: ${c.title}`}
            accessibilityState={{ disabled: doneToday }}
          >
            <Text style={styles.completeBtnText}>{doneToday ? 'Hecho hoy ✓' : '✓ Marcar día'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

function AvailableCard({ challenge: c, onActivate }: { challenge: Challenge; onActivate: () => void }) {
  const cfg = CATEGORY_CONFIG[c.category]
  const isAuto = AUTO_CHALLENGE_IDS.includes(c.id)

  return (
    <View style={[styles.card, styles.cardDimmed]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{cfg.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{c.title}</Text>
          <Text style={styles.cardDesc}>{c.description}</Text>
        </View>
        {isAuto && (
          <View
            style={styles.autoBadge}
            accessibilityRole="text"
            accessibilityLabel="Reto automático"
          >
            <Ionicons name="sparkles" size={10} color={colors.accent} />
            <Text style={styles.autoBadgeText}>Automático</Text>
          </View>
        )}
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.pointsBadge}>
          <Ionicons name="star" size={13} color={colors.accent} />
          <Text style={styles.pointsLabel}>+{c.points} pts</Text>
        </View>
        <TouchableOpacity
          style={styles.activateBtn}
          onPress={onActivate}
          accessibilityRole="button"
          accessibilityLabel={`Aceptar reto: ${c.title}`}
        >
          <Text style={styles.activateBtnText}>Aceptar reto</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function CompletedCard({ challenge: c }: { challenge: Challenge }) {
  const cfg = CATEGORY_CONFIG[c.category]
  const isAuto = AUTO_CHALLENGE_IDS.includes(c.id)

  return (
    <View style={[styles.card, styles.cardCompleted]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{cfg.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{c.title}</Text>
          <Text style={styles.cardDesc}>{c.targetDays} días completados</Text>
        </View>
        {isAuto && (
          <View
            style={styles.autoBadge}
            accessibilityRole="text"
            accessibilityLabel="Reto automático"
          >
            <Ionicons name="sparkles" size={10} color={colors.accent} />
            <Text style={styles.autoBadgeText}>Automático</Text>
          </View>
        )}
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          <Text style={styles.completedPts}>+{c.points}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  levelCard: {
    backgroundColor: colors.surface, borderRadius: 18, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
    borderLeftWidth: 5, elevation: 3,
    shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
  },
  levelLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  levelTitle: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
  progressTrack: { height: 6, backgroundColor: colors.track, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  pointsText: { fontSize: 11, color: colors.textSecondary },
  levelBadge: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginLeft: 16 },
  levelNumber: { fontSize: 24, fontWeight: '900', color: colors.onPrimary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, marginTop: 4 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing.md, marginBottom: 12,
    elevation: 2, shadowColor: colors.shadow, shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  cardDimmed: { opacity: 0.75 },
  cardCompleted: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  cardEmoji: { fontSize: 26, marginTop: 2 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 3 },
  cardDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  badgesCol: { alignItems: 'flex-end', gap: spacing.xs },
  typeBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  typeText: { fontSize: 10, fontWeight: '700' },
  autoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.track,
    borderColor: colors.divider,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-end',
  },
  autoBadgeText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  progressTrackCard: { flex: 1, height: 8, backgroundColor: colors.track, borderRadius: 4, overflow: 'hidden' },
  progressFillCard: { height: 8, borderRadius: 4 },
  progressLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, width: 56 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pointsLabel: { fontSize: 12, color: colors.textSecondary },
  autoStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  autoStatusText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  completeBtn: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  completeBtnText: { fontSize: 13, fontWeight: '700', color: colors.onPrimary },
  activateBtn: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.primary,
  },
  activateBtnText: { fontSize: 13, fontWeight: '700', color: colors.onPrimary },
  completedBadge: { alignItems: 'center' },
  completedPts: { fontSize: 11, fontWeight: '700', color: colors.success },
})
