import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import { useThemedStyles } from "@hooks/index";
import useDataFetching from "@hooks/useDataFetching";
import { spacing } from "@styles/spacing";
import { ITheme } from "@styles/theme";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  AnimatedFlatList,
  LoadingScreen,
  SummaryCard,
} from "../components/index";
import {
  calculateAverage,
  formatDate,
  formatNote,
  groupBy,
  truncateText,
} from "../utils/index";
import TitleAndMonths, {
  getSchoolMonthIndex,
} from "@modules/app/components/TitleAndMonths";

interface Note {
  id: string;
  subjectId: string;
  subjectName: string;
  note: number;
  date: Date;
}

interface GroupedNotes {
  title: string;
  average: number;
  data: Note[];
}

interface NoteSummary {
  averageNote: number;
  bestSubject: string;
  worstSubject: string;
}

const NoteScreen: React.FC = () => {
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const [selectedMonth, setSelectedMonth] = useState(
    getSchoolMonthIndex(new Date())
  );

  const fetchNotes = useCallback(async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData: Note[] = [
      {
        id: "1",
        subjectId: "1",
        subjectName: "Mathématique",
        note: 17,
        date: new Date(2024, 2, 10),
      },
      {
        id: "2",
        subjectId: "1",
        subjectName: "Mathématique",
        note: 15,
        date: new Date(2024, 2, 1),
      },
      {
        id: "3",
        subjectId: "2",
        subjectName: "Français",
        note: 14,
        date: new Date(2024, 2, 11),
      },
      {
        id: "4",
        subjectId: "2",
        subjectName: "Français",
        note: 13,
        date: new Date(2024, 2, 2),
      },
      // ... add more mock data as needed
    ];

    return mockData;
  }, []);

  const {
    data: notes,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchNotes, []);

  const summary: NoteSummary = useMemo(() => {
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

  const groupedNotes: GroupedNotes[] = useMemo(() => {
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

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    // Fetch homework data for the selected month
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      <TitleAndMonths
        title="Notes et moyennes"
        defaultSelectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />
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

const SubjectCard: React.FC<{ title: string; average: number; notes: Note[] }> =
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

const NoteItem: React.FC<{ note: Note }> = React.memo(({ note }) => {
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

const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.primary,
      padding: spacing.md,
      paddingTop: spacing.xl, // Adjust this value based on your status bar height
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
    excellentNote: { color: "#4CAF50" },
    goodNote: { color: "#2196F3" },
    averageNote: { color: "#FFC107" },
    poorNote: { color: "#F44336" },
    primary: { color: theme.primary },
    success: { color: "#4CAF50" },
    warning: { color: "#FFA500" },
  });

export default NoteScreen;
