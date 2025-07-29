import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Components
import { CsCard, CsText, AnimatedFlatList, LoadingScreen, SummaryCard } from "@/components";

// Hooks
import { useNote, useThemedStyles } from "@/hooks/index";
import useDataFetching from "@/hooks/useDataFetching";

// Types
import { type ITheme, spacing } from "@/styles";

// Utils
import {
  formatDate,
  formatNote,
  truncateText,
} from "@/utils";
import { useAppSelector } from "@/store";
import { IGroupedNotesDTO, INoteDTO, INoteSummaryDTO } from "@/types/INoteDTO";
import { NOTE_TYPE } from "@/lib/supabase";
import { FlatList } from "react-native";
import { Header } from "@/components/Header";

const NoteScreen: React.FC = () => {
  // Hooks
  const { getNotes } = useNote();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const semesters = useAppSelector((s) => s?.AppReducer?.semesters);
  const currentSchoolYear = useAppSelector((s) => s?.AppReducer?.currentSchoolYear);
  const selectedStudent = useAppSelector((s) => s?.AppReducer?.selectedStudent);

  // States
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number>();

  // Data Fetching
  const fetchNotes = async () => {
    try {
      if (!selectedStudent) return [];
      if (!selectedSemester) {
        setSelectedSemester(semesters.find(s => s.isCurrent)?.id ?? undefined);
      }

      return await getNotes(
        selectedStudent.id,
        selectedStudent.class.id,
        [NOTE_TYPE.WRITING_QUESTION, NOTE_TYPE.CLASS_TEST, NOTE_TYPE.LEVEL_TEST],
        currentSchoolYear!.id,
        selectedSemester ?? semesters.find(s => s.isCurrent)?.id ?? undefined,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
      return [];
    }
  };

  const {
    data: noteGroups,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchNotes, [selectedStudent, selectedSemester, currentSchoolYear]);

  // Computed Data
  const summary: INoteSummaryDTO = useMemo(() => {
    if (!noteGroups || noteGroups.length === 0)
      return { averageNote: 0, bestSubject: '', worstSubject: '' };

    // Use the average from the backend for each subject
    const averages = noteGroups.map(group => group.average ?? 0);
    const averageNote = averages.length > 0 ? averages.reduce((a, b) => a + b, 0) / averages.length : 0;

    // Best subject: subject with the lowest rank (rank as number, 1 is best)
    const sortedByRank = noteGroups
      .map((group, idx) => ({
        idx,
        rank: Number(group.rank),
        average: group.average,
        subjectName: group.notes[0]?.subjectName || '',
      }))
      .filter(g => !isNaN(g.rank))
      .sort((a, b) => a.rank - b.rank);

    const bestSubject = sortedByRank.length > 0 ? sortedByRank[0].subjectName : '';
    const worstSubject = sortedByRank.length > 0 ? sortedByRank[sortedByRank.length - 1].subjectName : '';

    return {
      averageNote: Number(averageNote.toFixed(2)),
      bestSubject,
      worstSubject,
    };
  }, [noteGroups]);

  // For display, flatten all notes
  const notes: INoteDTO[] = useMemo(() => {
    if (!noteGroups) return [];
    return noteGroups.flatMap(group => group.notes);
  }, [noteGroups]);

  const groupedNotes: IGroupedNotesDTO[] = useMemo(() => {
    if (!noteGroups) return [];
    return noteGroups.map(group => ({
      title: truncateText(group.notes[0]?.subjectName || '', 27),
      average: group.average,
      data: group.notes.sort((a, b) => b.date.getTime() - a.date.getTime()),
    }));
  }, [noteGroups]);

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

  // Main Render
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      <Header
        title="Notes et moyennes"
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
                if (selectedSemester === item.id) {
                  setSelectedSemester(undefined);
                }
                else {
                  setSelectedSemester(item.id);
                }
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
    excellentNote: { color: "#4CAF50" },
    goodNote: { color: "#2196F3" },
    averageNote: { color: "#FFC107" },
    poorNote: { color: "#F44336" },
    primary: { color: theme.primary },
    success: { color: "#4CAF50" },
    warning: { color: "#FFA500" },
  });

export default NoteScreen;
