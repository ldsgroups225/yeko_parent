import borderRadius from '@styles/borderRadius';
import { spacing } from '@styles/spacing';
import type { ITheme } from '@styles/theme';
import { typography } from '@styles/typography';
import { StyleSheet } from 'react-native';

export const styles = (theme: ITheme) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.medium,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    buttonprimary: {
      backgroundColor: theme.primary,
    },
    buttonsecondary: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    buttontext: {
      backgroundColor: 'transparent',
    },
    buttonsmall: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    buttonmedium: {
      paddingVertical: spacing.sm * 1.5,
      paddingHorizontal: spacing.lg,
    },
    buttonlarge: {
      paddingVertical: spacing.sm * 2,
      paddingHorizontal: spacing.xl,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      ...typography.button,
      textAlign: 'center',
      color: theme.textLight,
    },
    textprimary: {
      color: theme.background,
    },
    textsecondary: {
      color: theme.primary,
    },
    texttext: {
      color: theme.primary,
    },
    textsmall: {
      fontSize: 14,
    },
    textmedium: {
      fontSize: 16,
    },
    textlarge: {
      fontSize: 18,
    },
    textDisabled: {},
    icon: {
      marginRight: 8,
    },
  });
