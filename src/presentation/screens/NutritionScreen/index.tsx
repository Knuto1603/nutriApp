import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { colors } from '../../../core/constants/colors'
import { User } from '../../../domain/entities/User'
import { useNutrition } from '../../hooks/useNutrition'
import ProfileForm from './components/ProfileForm'
import ResultView from './components/ResultView'

export default function NutritionScreen() {
  const { user, result, loading, saveProfile, clearProfile } = useNutrition()
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!user) {
      setEditing(false)
    }
  }, [user])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (result && user && !editing) {
    return (
      <ResultView
        user={user}
        result={result}
        onEdit={() => setEditing(true)}
        onReset={async () => {
          setEditing(false)
          await clearProfile()
        }}
      />
    )
  }

  return (
    <ProfileForm
      initialUser={editing ? user : null}
      onSubmit={async (u: User) => {
        await saveProfile(u)
        setEditing(false)
      }}
      onCancel={editing ? () => setEditing(false) : undefined}
    />
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
})
