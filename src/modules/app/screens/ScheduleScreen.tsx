/**
 * @author Ali Burhan Keskin <alikeskin@milvasoft.com>
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Components
import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import { AnimatedFlatList, LoadingScreen } from "../components/index";

// Hooks
import { useThemedStyles } from "@hooks/index";
import useDataFetching from "@hooks/useDataFetching";

// Types
import { IScheduleDTO } from "@modules/app/types/IScheduleDTO";

// Styles
import { spacing } from "@styles/spacing";
import { ITheme } from "@styles/theme";
import { useSchedule } from "@hooks/useSchedule";
import { useAppSelector } from "@src/store";

// Constants
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
  // Hooks And redux
  const selectedStudent = useAppSelector((s) => s?.AppReducer?.selectedStudent);
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const { getSchedules } = useSchedule();

  // States
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeIndicator, setShowTimeIndicator] = useState(false);

  // Data Fetching
  const fetchSchedule = useCallback(async () => {
    if (!selectedStudent) return;

    return getSchedules(selectedStudent.class.id);
  }, []);

  const {
    data: schedules,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchSchedule, []);

  // Computed Data
  const currentDaySchedule = useMemo(() => {
    if (!schedules) return [];
    return schedules.filter((schedule) => schedule.dayOfWeek === selectedDay);
  }, [schedules, selectedDay]);

  // Effects
  useEffect(() => {
    // Update current time every minute and show/hide time indicator
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const totalMinutes = currentHour * 60 + currentMinute;
      setShowTimeIndicator(totalMinutes >= 8 * 60 && totalMinutes <= 17 * 60);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Render Methods
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
    ({ item }: { item: IScheduleDTO }) => <ScheduleItem schedule={item} />,
    []
  );

  const renderCurrentTimeLine = () => {
    if (!showTimeIndicator) return null;

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const totalMinutes = currentHour * 60 + currentMinute;
    const startOfDay = 7 * 60;
    const endOfDay = 18 * 60;
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

  // Main Render
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

// Schedule Item Component
const ScheduleItem: React.FC<{ schedule: IScheduleDTO }> = React.memo(
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

// Styles
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
