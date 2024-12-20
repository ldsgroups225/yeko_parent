import { ITheme, shadows, spacing, typography } from '@/styles';
import borderRadius from '@/styles/borderRadius';
import { StyleSheet } from 'react-native';

export const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.large,
      padding: spacing.lg,
      ...shadows.medium,
    },
    title: {
      ...typography.h4,
      color: theme.text,
      marginBottom: spacing.md,
    },
    content: {
      ...typography.body,
      color: theme.text,
      marginBottom: spacing.md,
    },
    footer: {
      marginTop: spacing.md,
    },
  });
