export const LightTheme = {
  // Existing colors
  primary: '#0047AB', // Blue Yeko
  secondary: '#FFA500', // Orange Yeko
  background: '#F5F5F5', // Soft background for readability
  card: '#FFFFFF', // White card for clarity
  text: '#333333', // Dark text for contrast
  textLight: '#666666', // Light grey text for subtitles
  border: '#D8D8D8', // Subtle border color
  notification: '#FF0000', // Red for critical notifications
  rippleColor: '#0000001a', // Soft ripple effect

  // New colors
  success: '#4CAF50', // Green for success states
  warning: '#FFC107', // Amber for warning states
  info: '#2196F3', // Blue for informational states
  error: '#F44336', // Red for error states (separate from notification)

  // Additional shades
  primaryLight: '#4D7CC3', // Lighter shade of primary
  primaryDark: '#003380', // Darker shade of primary
  secondaryLight: '#FFB733', // Lighter shade of secondary
  secondaryDark: '#CC8400', // Darker shade of secondary

  // Grayscale
  gray100: '#F7F7F7',
  gray200: '#E1E1E1',
  gray300: '#CFCFCF',
  gray400: '#B1B1B1',
  gray500: '#9E9E9E',
  gray600: '#7E7E7E',
  gray700: '#626262',
  gray800: '#515151',
  gray900: '#3B3B3B',

  // Additional UI colors
  surfaceVariant: '#E1E2EC', // Alternative surface color
  onSurfaceVariant: '#44474F', // Text on surface variant
  outline: '#74777F', // Outline color for components
};

export type ITheme = typeof LightTheme;

export const DarkTheme: ITheme = {
  // Existing colors
  primary: '#0047AB', // Blue Yeko
  secondary: '#FFA500', // Orange Yeko
  background: '#010101', // Deep black background
  card: '#121212', // Dark card for consistency
  text: '#E5E5E7', // Light text for readability
  textLight: '#FFFFFF', // White text for highlights
  border: '#272729', // Subtle border for dark mode
  notification: '#FF0000', // Red for notifications
  rippleColor: '#ffffff1a', // Light ripple effect

  // New colors
  success: '#66BB6A', // Slightly lighter green for dark mode
  warning: '#FFCA28', // Slightly lighter amber for dark mode
  info: '#42A5F5', // Slightly lighter blue for dark mode
  error: '#EF5350', // Slightly lighter red for dark mode

  // Additional shades
  primaryLight: '#5C8ED6', // Lighter shade of primary for dark mode
  primaryDark: '#003380', // Darker shade of primary (same as light theme)
  secondaryLight: '#FFB733', // Lighter shade of secondary (same as light theme)
  secondaryDark: '#CC8400', // Darker shade of secondary (same as light theme)

  // Grayscale
  gray100: '#1E1E1E',
  gray200: '#2C2C2C',
  gray300: '#3D3D3D',
  gray400: '#4F4F4F',
  gray500: '#5C5C5C',
  gray600: '#757575',
  gray700: '#9E9E9E',
  gray800: '#CFCFCF',
  gray900: '#E1E1E1',

  // Additional UI colors
  surfaceVariant: '#2F3033', // Alternative surface color for dark mode
  onSurfaceVariant: '#C4C6D0', // Text on surface variant for dark mode
  outline: '#8C8E93', // Outline color for components in dark mode
};
