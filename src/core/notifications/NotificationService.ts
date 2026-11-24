import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

const WATER_REMINDER_IDS_KEY = 'water-reminders'

class NotificationService {
  private static instance: NotificationService

  static getInstance(): NotificationService {
    if (!this.instance) this.instance = new NotificationService()
    return this.instance
  }

  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('water-reminders', {
        name: 'Recordatorios de agua',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
      })
    }

    const { status: existing } = await Notifications.getPermissionsAsync()
    if (existing === 'granted') return true

    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
  }

  async scheduleWaterReminders(): Promise<void> {
    const granted = await this.requestPermission()
    if (!granted) return

    await this.cancelAll()

    // 6 recordatorios distribuidos durante el día
    const hours = [8, 10, 12, 15, 17, 20]

    for (const hour of hours) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Hora de hidratarte',
          body: 'Recuerda tomar agua para cumplir tu meta diaria.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute: 0,
          channelId: 'water-reminders',
        },
      })
    }
  }

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync()
  }
}

export const notificationService = NotificationService.getInstance()
