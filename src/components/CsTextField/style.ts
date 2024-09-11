import borderRadius from "@styles/borderRadius";
import { spacing } from "@styles/spacing";
import type { ITheme } from "@styles/theme";
import { manipulateColor } from "@utils/ManipulateColor";
import { StyleSheet } from "react-native";

export const styles = (theme: ITheme) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.medium,
      paddingHorizontal: spacing.sm * 1.5,
    },
    input: {
      flex: 1,
      height: 48,
      color: theme.text,
      fontSize: 16,
    },
    inputError: {
      borderColor: theme.notification,
    },
    inputDisabled: {
      backgroundColor: theme.background,
      color: theme.text,
    },
    label: {
      position: "absolute",
      left: 12,
      top: 14,
      color: manipulateColor(theme.text, 0.2),
      backgroundColor: theme.background,
      paddingHorizontal: spacing.xs,
      zIndex: 1,
    },
    labelFocused: {
      color: theme.primary,
    },
    labelError: {
      color: theme.notification,
    },
    errorText: {
      color: theme.notification,
      fontSize: 12,
      marginTop: spacing.xs,
    },
    iconContainer: {
      padding: spacing.sm,
    },
    icon: {
      fontSize: 18,
      color: theme.text,
    },
  });
