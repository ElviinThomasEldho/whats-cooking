import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Terracotta Orange as primary
    primary: '#E07A5F', // Terracotta orange
    onPrimary: '#FFFFFF',
    primaryContainer: '#FFE8E3', // Soft terracotta background
    onPrimaryContainer: '#3D1F1A',
    
    // Green as secondary
    secondary: '#81B29A', // Sage green
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8F5E8', // Soft green background
    onSecondaryContainer: '#1B3A2A',
    
    // Complementary green as tertiary
    tertiary: '#3D5A3D', // Forest green
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#D4E8D4', // Light forest green background
    onTertiaryContainer: '#1A2F1A',
    
    // Error colors (keeping accessible)
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    
    // Background and surface colors (warmer, more inviting)
    background: '#FEFCF8', // Warm off-white
    onBackground: '#2D2A24', // Warm dark text
    surface: '#FEFCF8',
    onSurface: '#2D2A24',
    surfaceVariant: '#F5F0EB', // Warm surface variant
    onSurfaceVariant: '#52443D',
    
    // Outline and shadow (softer)
    outline: '#A89B94', // Softer outline
    outlineVariant: '#E0D5CE', // Very soft outline variant
    shadow: '#000000',
    scrim: '#000000',
    
    // Inverse colors
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#FFB59D',
    
    // Elevation (warmer tones)
    elevation: {
      level0: 'transparent',
      level1: '#FEFCF8',
      level2: '#FDFAF5',
      level3: '#FCF8F2',
      level4: '#FBF6EF',
      level5: '#FAF4EC',
    },
    
    // Disabled states
    surfaceDisabled: '#2D2A24',
    onSurfaceDisabled: '#A89B94',
    backdrop: '#2D2A24',
    disabled: '#D0C8C0',
  },
  roundness: 16, // Increased roundness for more friendly feel
}; 