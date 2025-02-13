import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Components
import { CsCard, CsText, AnimatedFlatList, LoadingScreen, SummaryCard, getSchoolMonthIndex, TitleAndMonths } from "@/components";

// Hooks
import { useNote, useThemedStyles } from "@/hooks/index";
import useDataFetching from "@/hooks/useDataFetching";

// Types
import { type ITheme, spacing } from "@/styles";

// Utils
import {
  calculateAverage,
  formatDate,
  formatNote,
  groupBy,
  truncateText,
} from "@/utils";
import { useAppSelector } from "@/store";
import { IGroupedNotesDTO, INoteDTO, INoteSummaryDTO } from "@/types/INoteDTO";
import { NOTE_TYPE } from "@/lib/supabase";
import { FlatList } from "react-native";
import { ISemester } from "@/types/ISchoolYearDTO";

const NoteScreen: React.FC = () => {
  // Hooks
  const { getNotes } = useNote();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const semesters = useAppSelector((s) => s?.AppReducer?.semesters);
  const currentSchoolYear = useAppSelector((s) => s?.AppReducer?.currentSchoolYear);
  const selectedStudent = useAppSelector((s) => s?.AppReducer?.selectedStudent);

  // States
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<ISemester>();
  const [selectedMonth, setSelectedMonth] = useState<number>();

  // Data Fetching
  const fetchNotes = useCallback(async () => {
    try {
      if (!selectedStudent) return [];
      return await getNotes(
        selectedStudent.id,
        [NOTE_TYPE.WRITING_QUESTION, NOTE_TYPE.CLASS_TEST, NOTE_TYPE.LEVEL_TEST],
        currentSchoolYear!.id,
        selectedSemester?.id,
        selectedMonth,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    }
  }, [selectedStudent, selectedSemester, selectedMonth]);

  const {
    data: notes,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchNotes, []);

  // Computed Data
  const summary: INoteSummaryDTO = useMemo(() => {
    if (!notes || notes.length === 0)
      return { averageNote: 0, bestSubject: "", worstSubject: "" };

    const averageNote = calculateAverage(notes.map((note) => note.note));
    const subjectAverages = Object.entries(groupBy(notes, "subjectName")).map(
      ([subject, subjectNotes]) => ({
        subject,
        average: calculateAverage(subjectNotes.map((note) => note.note)),
      })
    );

    const bestSubject = subjectAverages.reduce((best, current) =>
      current.average > best.average ? current : best
    ).subject;

    const worstSubject = subjectAverages.reduce((worst, current) =>
      current.average < worst.average ? current : worst
    ).subject;

    return {
      averageNote: Number(averageNote.toFixed(2)),
      bestSubject,
      worstSubject,
    };
  }, [notes]);

  const groupedNotes: IGroupedNotesDTO[] = useMemo(() => {
    if (!notes) return [];
    const grouped = groupBy(notes, "subjectName");
    return Object.entries(grouped).map(([subject, subjectNotes]) => ({
      title: truncateText(subject, 27),
      average: calculateAverage(subjectNotes.map((note) => note.note)),
      data: subjectNotes.sort((a, b) => b.date.getTime() - a.date.getTime()),
    }));
  }, [notes]);

  const summaryItems = [
    {
      label: "Moyenne Générale",
      value: formatNote(summary.averageNote),
      icon: "school-outline" as const,
      color: themedStyles.primary.color,
    },
    {
      label: "Meilleure Matière",
      value: truncateText(summary.bestSubject, 9),
      icon: "trophy-outline" as const,
      color: themedStyles.success.color,
    },
    {
      label: "Matière à Améliorer",
      value: truncateText(summary.worstSubject, 9),
      icon: "trending-up-outline" as const,
      color: themedStyles.warning.color,
    },
  ];

  // Callbacks
  const handleMonthChange = (month: number) => {
    if (selectedMonth && month === selectedMonth) {
      setSelectedMonth(undefined);
    } else {
      setSelectedMonth(month);
    }
  };

  // Main Render
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      <TitleAndMonths
        title="Notes et moyennes"
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
        style={themedStyles.notesList}
        data={groupedNotes}
        renderItem={({ item }) => (
          <SubjectCard
            title={item.title}
            average={item.average}
            notes={item.data}
          />
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
        onRefresh={refetchData}
        refreshing={refreshing}
      />
    </View>
  );
};

// Subject Card Component
const SubjectCard: React.FC<{ title: string; average: number; notes: INoteDTO[] }> =
  React.memo(({ title, average, notes }) => {
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
      <Animated.View style={[themedStyles.subjectCard, animatedStyle]}>
        <CsCard>
          <View style={themedStyles.subjectHeader}>
            <CsText variant="h3" style={themedStyles.subjectTitle}>
              {title}
            </CsText>
            <CsText variant="h3" style={themedStyles.subjectAverage}>
              {formatNote(average)}/20
            </CsText>
          </View>
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </CsCard>
      </Animated.View>
    );
  });

// Note Item Component
const NoteItem: React.FC<{ note: INoteDTO }> = React.memo(({ note }) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const formattedDate = formatDate(note.date, "d MMM");

  const getNoteColor = (note: number): string => {
    if (note >= 16) return themedStyles.excellentNote.color;
    if (note >= 14) return themedStyles.goodNote.color;
    if (note >= 10) return themedStyles.averageNote.color;
    return themedStyles.poorNote.color;
  };

  return (
    <View style={themedStyles.noteItem}>
      <CsText variant="body" style={themedStyles.noteDate}>
        {formattedDate}
      </CsText>
      <CsText
        variant="h3"
        style={StyleSheet.flatten([
          themedStyles.noteValue,
          { color: getNoteColor(note.note) },
        ])}
      >
        {formatNote(note.note)}/20
      </CsText>
    </View>
  );
});

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
    notesList: {
      flex: 1,
      padding: spacing.md,
    },

    datePickerContainer: {
      padding: spacing.md,
      backgroundColor: theme.primary,
    },
    datePickerTitle: {
      color: theme.background,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: spacing.sm,
    },
    subjectCard: {
      marginBottom: spacing.md,
    },
    subjectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    subjectTitle: {
      flex: 1,
      marginRight: spacing.sm,
    },
    subjectAverage: {
      color: theme.textLight,
    },
    noteItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    noteDate: {
      color: theme.textLight,
    },
    noteValue: {
      fontWeight: "bold",
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
    excellentNote: { color: "#4CAF50" },
    goodNote: { color: "#2196F3" },
    averageNote: { color: "#FFC107" },
    poorNote: { color: "#F44336" },
    primary: { color: theme.primary },
    success: { color: "#4CAF50" },
    warning: { color: "#FFA500" },
  });

export default NoteScreen;
