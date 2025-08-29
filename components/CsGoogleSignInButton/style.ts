import { StyleSheet } from 'react-native';
import { ITheme, spacing, typography } from '@/styles';

export const styles = (theme: ITheme) =>
  StyleSheet.create({
    // Base button styles
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      shadowColor: theme.gray800,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },

    // Size variants
    buttonsmall: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      minHeight: 36,
    },
    
    buttonmedium: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      minHeight: 44,
    },

    buttonlarge: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      minHeight: 52,
    },

    // Disabled state
    buttonDisabled: {
      opacity: 0.6,
      backgroundColor: theme.gray100,
    },

    // Text styles
    buttonText: {
      ...typography.body,
      fontWeight: '600',
      color: theme.text,
      textAlign: 'center',
      marginLeft: spacing.sm,
    },

    // Size-specific text styles
    textsmall: {
      fontSize: 14,
    },

    textmedium: {
      fontSize: 16,
    },

    textlarge: {
      fontSize: 18,
    },

    // Disabled text
    textDisabled: {
      color: theme.textLight,
    },

    // Google icon container
    iconContainer: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Google logo SVG styles
    googleLogo: {
      width: 18,
      height: 18,
    },
  });
