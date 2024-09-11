import { spacing } from '@styles/spacing';
import { ITheme } from '@styles/theme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ITheme) =>
  StyleSheet.create({
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.md,
      width: '100%',
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      marginHorizontal: spacing.sm,
      color: theme.textLight,
    },
  });
