
import React, { useState } from "react";
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
import { type ITheme, shadows, spacing } from "@/styles";

// Utils
import { formatDate, groupBy } from "@/utils/index";
import { Ionicons } from "@expo/vector-icons";
import borderRadius from "@/styles/borderRadius";
import { NOTE_TYPE } from "@/lib/supabase";
import { INoteDTO } from "@/types/INoteDTO";
import { FlatList } from "react-native";
import { Pressable } from "react-native";
import { Header } from "@/components/Header";

const HomeworkScreen: React.FC = () => {
  // Hooks and Redux
  const semesters = useAppSelector((s) => s?.AppReducer?.semesters);
  const currentSchoolYear = useAppSelector((s) => s?.AppReducer?.currentSchoolYear);
  const selectedStudent = useAppSelector((s) => s?.AppReducer?.selectedStudent);

  const themedStyles = useThemedStyles<typeof styles>(styles);
  const { getNotes } = useNote();

  // States
  const [selectedSemester, setSelectedSemester] = useState<number>();
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

  // Data Fetching
  async function fetchHomework() {
    if (!selectedStudent) return [];
    if (!selectedSemester) {
      setSelectedSemester(semesters.find(s => s.isCurrent)?.id ?? undefined);
    }
    const noteGroups = await getNotes(
      selectedStudent.id,
      selectedStudent.class.id,
      [NOTE_TYPE.HOMEWORK],
      currentSchoolYear!.id,
      selectedSemester ?? semesters.find(s => s.isCurrent)?.id ?? undefined,
      selectedMonth,
    );
    return noteGroups ? noteGroups.flatMap(group => group.notes) : [];
  }

  const {
    data: homeworks,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchHomework, [selectedStudent, selectedSemester, selectedMonth, currentSchoolYear]);

  // Computed Data
  let summary = { totalHomework: 0, gradeableHomework: 0 };
  if (homeworks) {
    summary = {
      totalHomework: homeworks.length,
      gradeableHomework: homeworks.filter((hw) => hw.isGraded).length,
    };
  }

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

  let groupedHomeworks: { title: string; data: INoteDTO[] }[] = [];
  if (homeworks) {
    const grouped = groupBy(homeworks, (hw) =>
      formatDate(hw.dueDate!, "yyyy-MM-dd")
    );
    groupedHomeworks = Object.entries(grouped).map(([date, items]) => ({
      title: formatDate(new Date(date), "EEEE d MMMM yyyy"),
      data: items,
    }));
  }

  // Callbacks
  function handleMonthChange(month: number) {
    if (selectedMonth && month === selectedMonth) {
      setSelectedMonth(undefined);
    } else {
      setSelectedMonth(month);
    }
  }

  function renderHomeworkItem({ item }: { item: INoteDTO }) {
    return <HomeworkItem homework={item} />;
  }

  function renderEmptyState() {
    return (
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
  }

  // Main Render
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      <Header
        title="Exercice de maison"
      >
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
                selectedSemester === item.id && themedStyles.selectedSemesterButton,
              ]}
              onPress={() => {
                if (selectedSemester === item.id) setSelectedSemester(undefined);
                else setSelectedSemester(item.id);
              }}
            >
              <CsText
                style={StyleSheet.flatten([
                  themedStyles.semesterButtonText,
                  selectedSemester === item.id &&
                  themedStyles.selectedSemesterButtonText,
                ])}
              >
                {item.name}
              </CsText>
            </Pressable>
          )}
        />
      </Header>
      {/* <TitleAndMonths
        title="Devoirs"
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      /> */}



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
      backgroundColor: theme.gray200 + '33',
      opacity: 0.7,
    },
    semesterButtonText: {
      color: theme.text,
    },
    selectedSemesterButton: {
      backgroundColor: theme.primary,
      borderColor: theme.border,
      borderRadius: 8,
      opacity: 1,
    },
    selectedSemesterButtonText: {
      color: theme.background,
      fontWeight: "semibold",
    },
    success: { color: "#4CAF50" },
    warning: { color: "#FFA500" },
  });

export default HomeworkScreen;
