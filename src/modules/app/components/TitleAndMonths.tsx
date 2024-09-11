import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CsText from "@components/CsText";
import { ITheme } from "@styles/theme";
import { borderRadius, spacing } from "@src/styles";
import { useThemedStyles } from "@src/hooks";

const SCHOOL_MONTHS = [
  "SEP",
  "OCT",
  "NOV",
  "DEC",
  "JAN",
  "FEV",
  "MAR",
  "AVR",
  "MAI",
  "JUN",
] as const;

type SchoolMonth = (typeof SCHOOL_MONTHS)[number];

interface TitleAndMonthsProps {
  title: string;
  defaultSelectedMonth?: number;
  onMonthChange: (month: number) => void;
  customMonths?: readonly string[];
}

export const getSchoolMonthIndex = (date: Date): number => {
  const month = date.getMonth();
  if (month >= 0 && month <= 5) return month + 4;
  if (month >= 8 && month <= 11) return month - 8;
  return 0;
};

const TitleAndMonths: React.FC<TitleAndMonthsProps> = ({
  title,
  defaultSelectedMonth,
  onMonthChange,
  customMonths = SCHOOL_MONTHS,
}) => {
  const [activeMonth, setActiveMonth] = useState(
    defaultSelectedMonth ?? getSchoolMonthIndex(new Date())
  );
  const themedStyles = useThemedStyles<typeof styles>(styles);

  useEffect(() => {
    onMonthChange(activeMonth);
  }, [activeMonth, onMonthChange]);

  const handleMonthPress = (index: number) => {
    setActiveMonth(index);
  };

  return (
    <View style={themedStyles.header}>
      <CsText style={themedStyles.headerTitle}>{title}</CsText>
      <View style={themedStyles.monthsContainer}>
        {customMonths.map((month, index) => (
          <TouchableOpacity
            key={month}
            style={[
              themedStyles.monthButton,
              activeMonth === index && themedStyles.activeMonthButton,
            ]}
            onPress={() => handleMonthPress(index)}
          >
            <CsText
              style={StyleSheet.flatten([
                themedStyles.monthButtonText,
                activeMonth === index && themedStyles.activeMonthButtonText,
              ])}
            >
              {month}
            </CsText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = (theme: ITheme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.primary,
      padding: spacing.md,
      paddingTop: spacing.xl,
    },
    headerTitle: {
      color: theme.background,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: spacing.sm,
    },
    monthsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderRadius: borderRadius.medium,
      padding: spacing.xs,
    },
    monthButton: {
      alignItems: "center",
      padding: spacing.xs,
      borderRadius: borderRadius.small,
    },
    activeMonthButton: {
      backgroundColor: theme.primary,
    },
    monthButtonText: {
      color: theme.text,
      fontSize: 12,
    },
    activeMonthButtonText: {
      color: theme.background,
    },
  });

export default TitleAndMonths;
