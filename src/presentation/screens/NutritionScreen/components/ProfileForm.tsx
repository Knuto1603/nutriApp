import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors } from '../../../../core/constants/colors'
import { ActivityLevel, Goal, Sex, User } from '../../../../domain/entities/User'
import { useDemoMode } from '../../../hooks/useDemoMode'

const ACTIVITY_OPTIONS: { label: string; value: ActivityLevel }[] = [
  { label: 'Sedentario (sin ejercicio)', value: 'sedentary' },
  { label: 'Ligero (1-3 días/semana)', value: 'light' },
  { label: 'Moderado (3-5 días/semana)', value: 'moderate' },
  { label: 'Intenso (6-7 días/semana)', value: 'intense' },
]

const GOAL_OPTIONS: { label: string; value: Goal }[] = [
  { label: 'Bajar peso', value: 'lose' },
  { label: 'Mantener', value: 'maintain' },
  { label: 'Subir peso', value: 'gain' },
]

export interface ProfileFormProps {
  initialUser?: User | null
  onSubmit: (user: User) => Promise<void> | void
  onCancel?: () => void
}

interface StepOneProps {
  name: string
  setName: (name: string) => void
  age: string
  setAge: (age: string) => void
  sex: Sex
  setSex: (sex: Sex) => void
  onNext: () => void
  onCancel?: () => void
  onLoadDemo?: () => void
  loadingDemo?: boolean
  showDemoButton?: boolean
}

interface StepTwoProps {
  weight: string
  setWeight: (weight: string) => void
  height: string
  setHeight: (height: string) => void
  onBack: () => void
  onNext: () => void
  onCancel?: () => void
}

interface StepThreeProps {
  activity: ActivityLevel
  setActivity: (activity: ActivityLevel) => void
  goal: Goal
  setGoal: (goal: Goal) => void
  onBack: () => void
  onSubmit: () => void
  onCancel?: () => void
  isEditing?: boolean
}

export default function ProfileForm({
  initialUser,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState(initialUser?.name ?? '')
  const [age, setAge] = useState(initialUser?.age ? String(initialUser.age) : '')
  const [sex, setSex] = useState<Sex>(initialUser?.sex ?? 'male')
  const [weight, setWeight] = useState(initialUser?.weightKg ? String(initialUser.weightKg) : '')
  const [height, setHeight] = useState(initialUser?.heightCm ? String(initialUser.heightCm) : '')
  const [activity, setActivity] = useState<ActivityLevel>(initialUser?.activityLevel ?? 'moderate')
  const [goal, setGoal] = useState<Goal>(initialUser?.goal ?? 'maintain')
  const [loadingDemo, setLoadingDemo] = useState(false)

  const { loadDemo } = useDemoMode()

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name)
      setAge(String(initialUser.age))
      setSex(initialUser.sex)
      setWeight(String(initialUser.weightKg))
      setHeight(String(initialUser.heightCm))
      setActivity(initialUser.activityLevel)
      setGoal(initialUser.goal ?? 'maintain')
    } else {
      setName('')
      setAge('')
      setSex('male')
      setWeight('')
      setHeight('')
      setActivity('moderate')
      setGoal('maintain')
    }
    setStep(1)
  }, [initialUser])

  const handleLoadDemo = async () => {
    try {
      setLoadingDemo(true)
      await loadDemo()
    } finally {
      setLoadingDemo(false)
    }
  }

  const handleSubmit = () => {
    const cleanName = name.trim()
    const cleanAge = parseInt(age.trim(), 10)
    const cleanWeight = parseFloat(weight.trim().replace(',', '.'))
    const cleanHeight = parseFloat(height.trim().replace(',', '.'))

    if (
      !cleanName ||
      isNaN(cleanAge) ||
      cleanAge < 10 ||
      cleanAge > 100 ||
      isNaN(cleanWeight) ||
      cleanWeight < 25 ||
      cleanWeight > 250 ||
      isNaN(cleanHeight) ||
      cleanHeight < 100 ||
      cleanHeight > 230
    ) {
      return
    }

    const newUser: User = {
      name: cleanName,
      age: cleanAge,
      sex,
      weightKg: cleanWeight,
      heightCm: cleanHeight,
      activityLevel: activity,
      goal,
    }
    onSubmit(newUser)
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.stepLabel}>Paso {step} de 3</Text>
        <View style={styles.stepBar}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.stepDot, s <= step && styles.stepDotActive]} />
          ))}
        </View>

        {step === 1 && (
          <StepOne
            name={name}
            setName={setName}
            age={age}
            setAge={setAge}
            sex={sex}
            setSex={setSex}
            onNext={() => setStep(2)}
            onCancel={onCancel}
            onLoadDemo={handleLoadDemo}
            loadingDemo={loadingDemo}
            showDemoButton={!initialUser}
          />
        )}
        {step === 2 && (
          <StepTwo
            weight={weight}
            setWeight={setWeight}
            height={height}
            setHeight={setHeight}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            onCancel={onCancel}
          />
        )}
        {step === 3 && (
          <StepThree
            activity={activity}
            setActivity={setActivity}
            goal={goal}
            setGoal={setGoal}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isEditing={!!initialUser}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function StepOne({
  name,
  setName,
  age,
  setAge,
  sex,
  setSex,
  onNext,
  onCancel,
  onLoadDemo,
  loadingDemo,
  showDemoButton,
}: StepOneProps) {
  const [touched, setTouched] = useState(false)

  const isNameValid = name.trim().length > 0
  const ageTrim = age.trim()
  const parsedAge = parseInt(ageTrim, 10)
  const isAgeValid = /^\d+$/.test(ageTrim) && parsedAge >= 10 && parsedAge <= 100

  const valid = isNameValid && isAgeValid

  const nameError =
    (touched || name.length > 0) && !isNameValid ? 'El nombre no puede estar vacío' : null
  const ageError =
    (touched || age.length > 0) && !isAgeValid
      ? 'La edad debe ser un número entero entre 10 y 100 años'
      : null

  const handleNext = () => {
    setTouched(true)
    if (valid) {
      onNext()
    }
  }

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>¡Bienvenido a NutriApp!</Text>
      <Text style={styles.subtitle}>Cuéntanos sobre ti para personalizar tu experiencia</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={[styles.input, nameError ? styles.inputError : null]}
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre"
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel="Nombre"
      />
      {nameError && <Text style={styles.errorText}>{nameError}</Text>}

      <Text style={styles.label}>Edad</Text>
      <TextInput
        style={[styles.input, ageError ? styles.inputError : null]}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Ej: 20"
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel="Edad"
      />
      {ageError && <Text style={styles.errorText}>{ageError}</Text>}

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.row}>
        {(['male', 'female'] as Sex[]).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, sex === s && styles.chipActive]}
            onPress={() => setSex(s)}
            accessibilityRole="button"
            accessibilityLabel={s === 'male' ? 'Sexo masculino' : 'Sexo femenino'}
          >
            <Text style={[styles.chipText, sex === s && styles.chipTextActive]}>
              {s === 'male' ? 'Masculino' : 'Femenino'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btn, !valid && styles.btnDisabled]}
        onPress={handleNext}
        disabled={!valid}
        accessibilityRole="button"
        accessibilityLabel="Siguiente paso"
      >
        <Text style={styles.btnText}>Siguiente</Text>
      </TouchableOpacity>

      {showDemoButton && onLoadDemo && (
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline, { marginTop: 12 }]}
          onPress={onLoadDemo}
          disabled={loadingDemo}
          accessibilityRole="button"
          accessibilityLabel="Cargar datos de ejemplo"
        >
          {loadingDemo ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={[styles.btnText, { color: colors.primary }]}>
              Cargar datos de ejemplo
            </Text>
          )}
        </TouchableOpacity>
      )}

      {onCancel && (
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline, { marginTop: 12 }]}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
        >
          <Text style={[styles.btnText, { color: colors.primary }]}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

function StepTwo({
  weight,
  setWeight,
  height,
  setHeight,
  onBack,
  onNext,
  onCancel,
}: StepTwoProps) {
  const [touched, setTouched] = useState(false)

  const weightNormalized = weight.trim().replace(',', '.')
  const parsedWeight = parseFloat(weightNormalized)
  const isWeightValid =
    /^\d+(\.\d+)?$/.test(weightNormalized) &&
    !isNaN(parsedWeight) &&
    parsedWeight >= 25 &&
    parsedWeight <= 250

  const heightNormalized = height.trim().replace(',', '.')
  const parsedHeight = parseFloat(heightNormalized)
  const isHeightValid =
    /^\d+(\.\d+)?$/.test(heightNormalized) &&
    !isNaN(parsedHeight) &&
    parsedHeight >= 100 &&
    parsedHeight <= 230

  const valid = isWeightValid && isHeightValid

  const weightError =
    (touched || weight.length > 0) && !isWeightValid ? 'El peso debe estar entre 25 y 250 kg' : null
  const heightError =
    (touched || height.length > 0) && !isHeightValid ? 'La talla debe estar entre 100 y 230 cm' : null

  const handleNext = () => {
    setTouched(true)
    if (valid) {
      onNext()
    }
  }

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Medidas corporales</Text>
      <Text style={styles.subtitle}>Necesitamos tu peso y talla para calcular tus necesidades</Text>

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        style={[styles.input, weightError ? styles.inputError : null]}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="Ej: 68.5"
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel="Peso en kilogramos"
      />
      {weightError && <Text style={styles.errorText}>{weightError}</Text>}

      <Text style={styles.label}>Talla (cm)</Text>
      <TextInput
        style={[styles.input, heightError ? styles.inputError : null]}
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
        placeholder="Ej: 170"
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel="Talla en centímetros"
      />
      {heightError && <Text style={styles.errorText}>{heightError}</Text>}

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline, { flex: 1, marginRight: 8 }]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Volver al paso anterior"
        >
          <Text style={[styles.btnText, { color: colors.primary }]}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, !valid && styles.btnDisabled, { flex: 1 }]}
          onPress={handleNext}
          disabled={!valid}
          accessibilityRole="button"
          accessibilityLabel="Siguiente paso"
        >
          <Text style={styles.btnText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      {onCancel && (
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline, { marginTop: 12 }]}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
        >
          <Text style={[styles.btnText, { color: colors.primary }]}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

function StepThree({
  activity,
  setActivity,
  goal,
  setGoal,
  onBack,
  onSubmit,
  onCancel,
  isEditing,
}: StepThreeProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Nivel de actividad</Text>
      <Text style={styles.subtitle}>¿Cuánto ejercicio haces habitualmente?</Text>

      {ACTIVITY_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.activityOption, activity === opt.value && styles.activityOptionActive]}
          onPress={() => setActivity(opt.value)}
          accessibilityRole="button"
          accessibilityLabel={`Nivel de actividad ${opt.label}`}
        >
          <Text style={[styles.activityText, activity === opt.value && styles.activityTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Objetivo</Text>
      <View style={styles.row}>
        {GOAL_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, goal === opt.value && styles.chipActive]}
            onPress={() => setGoal(opt.value)}
            accessibilityRole="button"
            accessibilityLabel={`Objetivo ${opt.label}`}
          >
            <Text
              style={[styles.chipText, goal === opt.value && styles.chipTextActive]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline, { flex: 1, marginRight: 8 }]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Volver al paso anterior"
        >
          <Text style={[styles.btnText, { color: colors.primary }]}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { flex: 1 }]}
          onPress={onSubmit}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? 'Guardar cambios del perfil' : 'Calcular plan nutricional'}
        >
          <Text style={styles.btnText}>{isEditing ? 'Guardar' : 'Calcular'}</Text>
        </TouchableOpacity>
      </View>

      {onCancel && (
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline, { marginTop: 12 }]}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
        >
          <Text style={[styles.btnText, { color: colors.primary }]}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.background },
  stepLabel: { textAlign: 'center', color: colors.textSecondary, fontSize: 13, marginBottom: 8 },
  stepBar: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.divider },
  stepDotActive: { backgroundColor: colors.primary },
  stepContainer: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 14,
    minHeight: 44,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  row: { flexDirection: 'row', marginTop: 16, gap: 8 },
  chip: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.divider,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight + '20' },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500', textAlign: 'center' },
  chipTextActive: { color: colors.primary, fontWeight: '700' },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  btnDisabled: { backgroundColor: colors.divider },
  btnText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  activityOption: {
    padding: 14,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.divider,
    marginBottom: 10,
    backgroundColor: colors.surface,
  },
  activityOptionActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight + '15' },
  activityText: { fontSize: 14, color: colors.textSecondary },
  activityTextActive: { color: colors.primary, fontWeight: '600' },
})
