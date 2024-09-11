import type { ITheme } from '@styles/theme';
import { typography } from '@styles/typography';
import { StyleSheet } from 'react-native';

export const styles = (theme: ITheme) =>
  StyleSheet.create({
    base: {
      ...typography.body,
      color: theme.text,
    },
    h1: {
      ...typography.h1,
    },
    h2: {
      ...typography.h2,
    },
    h3: {
      ...typography.h3,
    },
    body: {
      ...typography.body,
    },
    caption: {
      ...typography.caption,
    },
    overline: {
      ...typography.overline,
    },
    primary: {
      color: theme.primary,
    },
    secondary: {
      color: theme.secondary,
    },
    error: {
      color: theme.notification,
    },
    light: {
      color: theme.textLight,
    },
  });
