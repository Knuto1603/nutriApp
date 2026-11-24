import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../core/constants/colors'
import ChallengesScreen from '../screens/ChallengesScreen'
import DiaryScreen from '../screens/DiaryScreen'
import FoodsScreen from '../screens/FoodsScreen'
import MenuScreen from '../screens/MenuScreen'
import NutritionScreen from '../screens/NutritionScreen'
import WaterScreen from '../screens/WaterScreen'
import { useChallengeAutomation } from '../hooks/useChallengeAutomation'

const Tab = createBottomTabNavigator()

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

const tabIcon = (icon: IoniconsName) =>
  ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={icon} size={size} color={color} />
  )

export default function AppNavigator() {
  useChallengeAutomation()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.divider },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.surface,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="Nutrición"
        component={NutritionScreen}
        options={{ tabBarLabel: 'Nutrición', tabBarIcon: tabIcon('nutrition-outline') }}
      />
      <Tab.Screen
        name="Alimentos"
        component={FoodsScreen}
        options={{ tabBarLabel: 'Alimentos', tabBarIcon: tabIcon('search-outline') }}
      />
      <Tab.Screen
        name="Diario"
        component={DiaryScreen}
        options={{ tabBarLabel: 'Diario', tabBarIcon: tabIcon('book-outline') }}
      />
      <Tab.Screen
        name="Menú"
        component={MenuScreen}
        options={{ tabBarLabel: 'Menú', tabBarIcon: tabIcon('restaurant-outline') }}
      />
      <Tab.Screen
        name="Agua"
        component={WaterScreen}
        options={{ tabBarLabel: 'Agua', tabBarIcon: tabIcon('water-outline') }}
      />
      <Tab.Screen
        name="Retos"
        component={ChallengesScreen}
        options={{ tabBarLabel: 'Retos', tabBarIcon: tabIcon('trophy-outline') }}
      />
    </Tab.Navigator>
  )
}
