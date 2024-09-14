/**
 * @author Ali Burhan Keskin <alikeskin@milvasoft.com>
 */
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Components
import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import { Ionicons } from "@expo/vector-icons";
import {
  AnimatedFlatList,
  LoadingScreen,
  SummaryCard,
} from "../components/index";
import TitleAndMonths from "@modules/app/components/TitleAndMonths";

// Hooks
import { useThemedStyles } from "@hooks/index";
import useDataFetching from "@hooks/useDataFetching";
import { useHomework } from "@hooks/useHomework";
import { useAppSelector } from "@src/store";

// Types
import { IHomeworkDTO } from "@modules/app/types/IHomeworkDTO";
import { ITheme } from "@styles/theme";

// Styles
import { borderRadius, shadows, spacing } from "@styles/index";

// Utils
import { formatDate, groupBy } from "../utils/index";

// Helper Function
const getSchoolMonthIndex = (date: Date): number => {
  const month = date.getMonth();
  // If it's January to June, add 4 to the index (because September is index 0)
  if (month >= 0 && month <= 5) {
    return month + 4;
  }
  // If it's September to December, subtract 8 from the index
  if (month >= 8 && month <= 11) {
    return month - 8;
  }
  // For July and August, default to September (index 0)
  return 0;
};

const HomeworkScreen: React.FC = () => {
  // Hooks and Redux
  const selectedStudent = useAppSelector((s) => s?.AppReducer?.selectedStudent);
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const { getHomeworks } = useHomework();

  // States
  const [selectedMonth, setSelectedMonth] = useState(
    getSchoolMonthIndex(new Date())
  );

  // Data Fetching
  const fetchHomework = useCallback(async () => {
    if (!selectedStudent) return [];

    return getHomeworks(selectedStudent.class.id);
  }, [selectedStudent, getHomeworks]);

  const {
    data: homeworks,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchHomework, []);

  // Computed Data
  const summary = useMemo(() => {
    if (!homeworks) return { totalHomework: 0, gradeableHomework: 0 };
    return {
      totalHomework: homeworks.length,
      gradeableHomework: homeworks.filter((hw) => hw.isGraded).length,
    };
  }, [homeworks]);

  const summaryItems = [
    {
      label: "Total des devoirs",
      value: summary.totalHomework,
      icon: "book-outline" as const,
      color: themedStyles.primary.color,
    },
    {
      label: "Devoirs notés",
      value: summary.gradeableHomework,
      icon: "school-outline" as const,
      color: themedStyles.warning.color,
    },
  ];

  const groupedHomeworks = useMemo(() => {
    if (!homeworks) return [];
    const grouped = groupBy(homeworks, (hw) =>
      formatDate(hw.dueDate, "yyyy-MM-dd")
    );
    return Object.entries(grouped).map(([date, items]) => ({
      title: formatDate(new Date(date), "EEEE d MMMM yyyy"),
      data: items,
    }));
  }, [homeworks]);

  // Callbacks
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    // TODO: Fetch homework data for the selected month (if needed)
  };

  const renderHomeworkItem = useCallback(
    ({ item }: { item: IHomeworkDTO }) => <HomeworkItem homework={item} />,
    []
  );

  const renderEmptyState = () => (
    <View style={themedStyles.emptyStateContainer}>
      <Ionicons
        name="book-outline"
        size={80}
        color={themedStyles.emptyStateIcon.color}
      />
      <CsText style={themedStyles.emptyStateTitle}>Pas de devoirs</CsText>
      <CsText style={themedStyles.emptyStateDescription}>
        Votre enfant n'a pas de devoirs pour le moment. Profitez-en pour passer
        du temps en famille !
      </CsText>
    </View>
  );

  // Main Render
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      <TitleAndMonths
        title="Devoirs"
        defaultSelectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />
      <AnimatedFlatList
        style={themedStyles.homeworkList}
        data={groupedHomeworks}
        renderItem={({ item }) => (
          <>
            <CsText style={themedStyles.dateHeader}>{item.title}</CsText>
            {item.data.map((homework) => (
              <React.Fragment key={homework.id}>
                {renderHomeworkItem({ item: homework })}
              </React.Fragment>
            ))}
          </>
        )}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={
          <SummaryCard
            items={summaryItems}
            primaryColor={themedStyles.primary.color}
            successColor={themedStyles.success.color}
            warningColor={themedStyles.warning.color}
          />
        }
        ListEmptyComponent={renderEmptyState}
        onRefresh={refetchData}
        refreshing={refreshing}
      />
    </View>
  );
};

// Homework Item Component
const HomeworkItem: React.FC<{ homework: IHomeworkDTO }> = React.memo(
  ({ homework }) => {
    const themedStyles = useThemedStyles<typeof styles>(styles);
    const opacity = useSharedValue(0);

    React.useEffect(() => {
      opacity.value = withTiming(1, { duration: 500 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: withTiming(0, { duration: 500 }) }],
    }));

    return (
      <Animated.View style={[themedStyles.homeworkItem, animatedStyle]}>
        <CsCard style={themedStyles.homeworkCard}>
          <View style={themedStyles.homeworkHeader}>
            <CsText variant="h3">{homework.subject}</CsText>
            {homework.isGraded && (
              <View style={themedStyles.gradeBadge}>
                <CsText variant="caption" style={themedStyles.gradeBadgeText}>
                  Noté
                </CsText>
              </View>
            )}
          </View>
          <View style={themedStyles.homeworkDetails}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={themedStyles.icon.color}
            />
            <CsText variant="body" style={themedStyles.dueDate}>
              À rendre le {formatDate(homework.dueDate, "d MMMM")}
            </CsText>
          </View>
        </CsCard>
      </Animated.View>
    );
  }
);

// Styles
const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
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
      borderRadius: 8,
      padding: spacing.xs,
    },
    monthButton: {
      alignItems: "center",
      padding: spacing.xs,
    },
    selectedMonthButton: {
      backgroundColor: theme.primary,
      borderRadius: 8,
    },
    monthButtonText: {
      color: theme.text,
      fontSize: 12,
    },
    selectedMonthButtonText: {
      color: theme.background,
    },
    homeworkList: {
      flex: 1,
      padding: spacing.md,
    },
    dateHeader: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    homeworkItem: {
      marginBottom: spacing.md,
    },
    homeworkCard: {
      padding: spacing.md,
      ...shadows.small,
    },
    homeworkHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    homeworkDetails: {
      flexDirection: "row",
      alignItems: "center",
    },
    dueDate: {
      marginLeft: spacing.xs,
      color: theme.textLight,
    },
    gradeBadge: {
      backgroundColor: "#FFA500",
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.medium,
    },
    gradeBadgeText: {
      color: theme.background,
      fontWeight: "bold",
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.xl,
      marginTop: spacing.xxl,
    },
    emptyStateIcon: {
      color: theme.textLight,
    },
    emptyStateTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    emptyStateDescription: {
      fontSize: 16,
      color: theme.textLight,
      textAlign: "center",
    },
    icon: {
      color: theme.text,
    },
    primary: {
      color: theme.primary,
    },
    success: { color: "#4CAF50" },
    warning: { color: "#FFA500" },
  });

export default HomeworkScreen;
