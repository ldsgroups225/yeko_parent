import { ITheme, spacing, typography } from '@/styles';
import borderRadius from '@/styles/borderRadius';
import { StyleSheet } from 'react-native';

export const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: theme.card,
      borderRadius: borderRadius.medium,
    },
    contentContainer: {
      flex: 1,
      marginLeft: spacing.md,
    },
    title: {
      ...typography.body,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.caption,
      color: theme.textLight,
    },
    trailing: {
      marginLeft: spacing.md,
    },
    dense: {
      paddingVertical: spacing.sm,
    },
    pressable: {
      opacity: 0.7,
    },
  });
