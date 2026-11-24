export const colors = {
  primary: '#003176',
  primaryLight: '#4A6FA5',
  accent: '#F57C00',
  accentLight: '#FFB74D',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  water: '#29B6F6',
  onPrimary: '#FFFFFF',
  divider: '#E0E0E0',
  track: '#F0F0F0',
  shadow: '#000000',
  errorBg: '#FFEBEE',
  errorText: '#C62828',
} as const

export const categoryColors: Record<string, string> = {
  Cereales: '#F57C00',
  'Proteínas': '#5C6BC0',
  Legumbres: '#8D6E63',
  Verduras: '#43A047',
  Frutas: '#E91E63',
  'Lácteos': '#29B6F6',
  Grasas: '#FDD835',
  Ultraprocesados: '#EF5350',
  Otros: '#90A4AE',
}

export const levelColors = ['#90A4AE', '#66BB6A', '#29B6F6', '#F57C00', '#8E24AA'] as const
