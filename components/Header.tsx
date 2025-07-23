import {
  Dimensions,
} from 'react-native';
import React, { } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import {
  CsText,
} from "@/components";
import { useTheme, useThemedStyles } from "@/hooks";
import { type ITheme, shadows, spacing, typography } from "@/styles";
import borderRadius from "@/styles/borderRadius";
import { RootState } from '@/store';
import { useSelector } from 'react-redux';


Dimensions.get('window');

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Header: React.FC<Props> = ({ children, title }) => {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const selectedStudent = useSelector((state: RootState) => state.AppReducer.selectedStudent);

  return (
    <View style={themedStyles.header}>
      <CsText variant="h1" style={themedStyles.headerTitleText}>{title}</CsText>
      {selectedStudent && (
        <View style={themedStyles.studentInfoContainer}>
          <Ionicons name="person-circle-outline" size={20} color={theme.background} style={{ marginRight: spacing.xs }} />
          <CsText variant="body" style={themedStyles.studentInfoText}>
            {selectedStudent.firstName} {selectedStudent.lastName} - {selectedStudent.class.name}
          </CsText>
        </View>
      )}

      {children}
    </View>
  );
};

const styles = (theme: ITheme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomLeftRadius: borderRadius.large,
      borderBottomRightRadius: borderRadius.large,
      rowGap: spacing.md,
      ...shadows.medium,
    },
    headerTitleText: {
      ...typography.h1, // Utilisation de h1 pour le titre principal
      color: theme.background,
      paddingTop: spacing.md,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    studentInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primaryLight + '33', // Léger fond pour contraster
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.medium,
    },
    studentInfoText: {
      color: theme.background,
      fontSize: 15,
      fontWeight: '500',
    },
  });
