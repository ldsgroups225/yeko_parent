
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Components
import { CsCard, CsText, AnimatedFlatList, LoadingScreen, SummaryCard, TitleAndMonths } from "@/components";

// Hooks
import { useThemedStyles, useNote } from "@/hooks";
import useDataFetching from "@/hooks/useDataFetching";
import { useAppSelector } from "@/store";

// Types
import { IHomeworkDTO } from "@/types/IHomeworkDTO";
import { type ITheme, shadows, spacing } from "@/styles";

// Utils
import { formatDate, groupBy } from "@/utils/index";
import { Ionicons } from "@expo/vector-icons";
import borderRadius from "@/styles/borderRadius";
import { NOTE_TYPE } from "@/lib/supabase";
import { INoteDTO } from "@/types/INoteDTO";
import { ISemester } from "@/types/ISchoolYearDTO";
import { FlatList } from "react-native";
import { Pressable } from "react-native";

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
  const semesters = useAppSelector((s) => s?.AppReducer?.semesters);
  const currentSchoolYear = useAppSelector((s) => s?.AppReducer?.currentSchoolYear);
  const selectedStudent = useAppSelector((s) => s?.AppReducer?.selectedStudent);

  const themedStyles = useThemedStyles<typeof styles>(styles);
  const { getNotes } = useNote();

  // States
  const [selectedSemester, setSelectedSemester] = useState<ISemester>();
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

  // Data Fetching
  const fetchHomework = useCallback(async () => {
    if (!selectedStudent) return [];

    return await getNotes(
      selectedStudent.id,
      [NOTE_TYPE.HOMEWORK],
      currentSchoolYear!.id,
      selectedSemester?.id,
      selectedMonth,
    );
  }, [selectedStudent, selectedSemester, selectedMonth]);

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
      formatDate(hw.dueDate!, "yyyy-MM-dd")
    );
    return Object.entries(grouped).map(([date, items]) => ({
      title: formatDate(new Date(date), "EEEE d MMMM yyyy"),
      data: items,
    }));
  }, [homeworks]);

  // Callbacks
  const handleMonthChange = (month: number) => {
    if (selectedMonth && month === selectedMonth) {
      setSelectedMonth(undefined);
    } else {
      setSelectedMonth(month);
    }
  };

  const renderHomeworkItem = useCallback(
    ({ item }: { item: INoteDTO }) => <HomeworkItem homework={item} />,
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
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />

      <View>
        <Text style={{ fontSize: 14, paddingHorizontal: 20 }}>Filter par trimestre</Text>
        <FlatList
          data={semesters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ columnGap: 10, paddingVertical: 4, paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={[
                themedStyles.semesterButton,
                selectedSemester?.id === item.id && themedStyles.selectedSemesterButton,
              ]}
              onPress={() => {
                if (selectedSemester?.id === item.id) setSelectedSemester(undefined);
                else setSelectedSemester(item);
              }}
            >
              <CsText
                style={StyleSheet.flatten([
                  themedStyles.semesterButtonText,
                  selectedSemester?.id === item.id &&
                    themedStyles.selectedSemesterButtonText,
                ])}
              >
                {item.name}
              </CsText>
            </Pressable>
          )}
        />
      </View>

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
const HomeworkItem: React.FC<{ homework: INoteDTO }> = React.memo(
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
            <CsText variant="h3">{homework.subjectName}</CsText>
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
              À rendre le {formatDate(homework.dueDate!, "d MMMM")}
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
    semesterButton: {
      borderRadius: 8,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderWidth: 1,
      borderColor: theme.border,
    },
    semesterButtonText: {
      color: theme.text,
    },
    selectedSemesterButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      borderRadius: 8,
    },
    selectedSemesterButtonText: {
      color: theme.background,
      fontWeight: "semibold",
    },
    success: { color: "#4CAF50" },
    warning: { color: "#FFA500" },
  });

export default HomeworkScreen;
