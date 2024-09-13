import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import { useThemedStyles } from "@hooks/index";
import useDataFetching from "@hooks/useDataFetching";
import { spacing } from "@styles/spacing";
import { ITheme } from "@styles/theme";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimatedFlatList, LoadingScreen } from "../components/index";

interface Schedule {
  id: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string | null;
}

const daysOfWeek = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
const fullDaysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const ScheduleScreen: React.FC = () => {
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeIndicator, setShowTimeIndicator] = useState(false);

  const fetchSchedule = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData: Schedule[] = [
      {
        id: "1",
        classId: "class1",
        subjectId: "subject1",
        subjectName: "Mathématiques",
        teacherId: "teacher1",
        teacherName: "M. Kouassi",
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "09:30",
        room: "Salle 101",
      },
      {
        id: "2",
        classId: "class1",
        subjectId: "subject2",
        subjectName: "Français",
        teacherId: "teacher2",
        teacherName: "Mme Bamba",
        dayOfWeek: 1,
        startTime: "10:00",
        endTime: "11:30",
        room: "Salle 102",
      },
      {
        id: "3",
        classId: "class1",
        subjectId: "subject3",
        subjectName: "Histoire-Géo",
        teacherId: "teacher3",
        teacherName: "M. Kone",
        dayOfWeek: 1,
        startTime: "13:00",
        endTime: "14:30",
        room: "Salle 103",
      },
      {
        id: "4",
        classId: "class1",
        subjectId: "subject4",
        subjectName: "Anglais",
        teacherId: "teacher4",
        teacherName: "Mme Diallo",
        dayOfWeek: 1,
        startTime: "15:00",
        endTime: "16:30",
        room: "Salle 104",
      },
      {
        id: "5",
        classId: "class1",
        subjectId: "subject5",
        subjectName: "Physique-Chimie",
        teacherId: "teacher5",
        teacherName: "M. Toure",
        dayOfWeek: 2,
        startTime: "08:00",
        endTime: "09:30",
        room: "Labo 1",
      },
      {
        id: "6",
        classId: "class1",
        subjectId: "subject6",
        subjectName: "SVT",
        teacherId: "teacher6",
        teacherName: "Mme Coulibaly",
        dayOfWeek: 2,
        startTime: "10:00",
        endTime: "11:30",
        room: "Labo 2",
      },
      {
        id: "7",
        classId: "class1",
        subjectId: "subject7",
        subjectName: "EPS",
        teacherId: "teacher7",
        teacherName: "M. Cisse",
        dayOfWeek: 2,
        startTime: "14:00",
        endTime: "16:00",
        room: "Terrain de sport",
      },
      // Add more mock data for other days...
    ];

    return mockData;
  }, []);

  const {
    data: schedules,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchSchedule, []);

  const currentDaySchedule = useMemo(() => {
    if (!schedules) return [];
    return schedules.filter((schedule) => schedule.dayOfWeek === selectedDay);
  }, [schedules, selectedDay]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const totalMinutes = currentHour * 60 + currentMinute;
      setShowTimeIndicator(totalMinutes >= 8 * 60 && totalMinutes <= 17 * 60);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const renderDatePicker = () => {
    const today = new Date();
    const currentDay = today.getDay() || 7;
    const mondayDate = new Date(
      today.setDate(today.getDate() - currentDay + 1)
    );

    return (
      <View style={themedStyles.datePickerContainer}>
        <CsText style={themedStyles.datePickerTitle}>Emploi du temps</CsText>
        <View style={themedStyles.daysContainer}>
          {daysOfWeek.map((day, index) => {
            const date = new Date(mondayDate);
            date.setDate(mondayDate.getDate() + index);
            const isSelected = selectedDay === index + 1;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  themedStyles.dateButton,
                  isSelected && themedStyles.selectedDateButton,
                ]}
                onPress={() => setSelectedDay(index + 1)}
              >
                <CsText
                  style={StyleSheet.flatten([
                    themedStyles.dateButtonText,
                    isSelected && themedStyles.selectedDateButtonText,
                  ])}
                >
                  {day}
                </CsText>
                <CsText
                  style={StyleSheet.flatten([
                    themedStyles.dateButtonDay,
                    isSelected && themedStyles.selectedDateButtonText,
                  ])}
                >
                  {date.getDate()}
                </CsText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderScheduleItem = useCallback(
    ({ item }: { item: Schedule }) => <ScheduleItem schedule={item} />,
    []
  );

  const renderCurrentTimeLine = () => {
    if (!showTimeIndicator) return null;

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const totalMinutes = currentHour * 60 + currentMinute;
    const startOfDay = 7 * 60; // Assuming school day starts at 7:00
    const endOfDay = 18 * 60; // Assuming school day ends at 18:00
    const position =
      ((totalMinutes - startOfDay) / (endOfDay - startOfDay)) * 100;

    return (
      <View style={[themedStyles.currentTimeLine, { top: `${position}%` }]}>
        <View style={themedStyles.currentTimeBubble}>
          <CsText style={themedStyles.currentTimeText}>
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </CsText>
        </View>
      </View>
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      {renderDatePicker()}
      <CsText style={themedStyles.dayTitle}>
        {fullDaysOfWeek[selectedDay - 1]}
      </CsText>
      <View style={themedStyles.scheduleContainer}>
        {renderCurrentTimeLine()}
        <AnimatedFlatList
          style={themedStyles.scheduleList}
          data={currentDaySchedule}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id}
          onRefresh={refetchData}
          refreshing={refreshing}
        />
      </View>
    </View>
  );
};

const ScheduleItem: React.FC<{ schedule: Schedule }> = React.memo(
  ({ schedule }) => {
    const themedStyles = useThemedStyles<typeof styles>(styles);
    const opacity = useSharedValue(0);

    useEffect(() => {
      opacity.value = withTiming(1, { duration: 500 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ translateY: withTiming(0, { duration: 500 }) }],
      };
    });

    return (
      <Animated.View style={[themedStyles.scheduleItem, animatedStyle]}>
        <View style={themedStyles.timeContainer}>
          <CsText style={themedStyles.timeText}>{schedule.startTime}</CsText>
          <View style={themedStyles.timeLine} />
          <CsText style={themedStyles.timeText}>{schedule.endTime}</CsText>
        </View>
        <CsCard style={themedStyles.scheduleCard}>
          <CsText variant="h3" style={themedStyles.subjectName}>
            {schedule.subjectName}
          </CsText>
          <CsText style={themedStyles.teacherName}>
            {schedule.teacherName}
          </CsText>
          {schedule.room && (
            <CsText style={themedStyles.roomText}>{schedule.room}</CsText>
          )}
        </CsCard>
      </Animated.View>
    );
  }
);

const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
    daysContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: spacing.xs,
    },
    dateButton: {
      alignItems: "center",
      padding: spacing.xs,
    },
    selectedDateButton: {
      backgroundColor: theme.primary,
      borderRadius: 8,
    },
    dateButtonText: {
      color: theme.text,
      fontSize: 12,
    },
    dateButtonDay: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },
    selectedDateButtonText: {
      color: theme.background,
    },
    dayTitle: {
      fontSize: 24,
      fontWeight: "bold",
      padding: spacing.md,
    },
    scheduleList: {
      flex: 1,
      padding: spacing.md,
    },
    scheduleItem: {
      flexDirection: "row",
      marginBottom: spacing.md,
    },
    timeContainer: {
      width: 60,
      alignItems: "center",
    },
    timeText: {
      fontSize: 12,
      color: theme.textLight,
    },
    timeLine: {
      flex: 1,
      width: 2,
      backgroundColor: theme.primary,
      marginVertical: spacing.xs,
    },
    scheduleCard: {
      flex: 1,
      marginLeft: spacing.md,
      padding: spacing.sm,
    },
    subjectName: {
      marginBottom: spacing.xs,
    },
    teacherName: {
      color: theme.textLight,
      fontSize: 14,
    },
    roomText: {
      color: theme.textLight,
      fontSize: 12,
      marginTop: spacing.xs,
    },
    scheduleContainer: {
      flex: 1,
      position: "relative",
    },
    currentTimeLine: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: theme.primary,
      zIndex: 1,
    },
    currentTimeCircle: {
      position: "absolute",
      left: -4,
      top: -4,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.primary,
    },
    currentTimeText: {
      fontSize: 12,
      color: theme.background,
      fontWeight: "bold",
    },
    currentTimeBubble: {
      position: "absolute",
      left: -30,
      top: -14,
      backgroundColor: theme.primary,
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
  });

export default ScheduleScreen;
