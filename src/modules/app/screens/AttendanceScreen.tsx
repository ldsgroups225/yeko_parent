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
import {
  AnimatedFlatList,
  LoadingScreen,
  SummaryCard,
} from "../components/index";
import TitleAndMonths, {
  getSchoolMonthIndex,
} from "@modules/app/components/TitleAndMonths";

// Hooks
import { useThemedStyles } from "@hooks/index";
import { useAttendance } from "@hooks/useAttendance";
import useDataFetching from "@hooks/useDataFetching";
import { useAppSelector } from "@src/store";

// Types
import {
  AttendanceStatus,
  IAttendanceDTO,
} from "@modules/app/types/IAttendanceDTO";

// Styles
import { shadows } from "@src/styles";
import { spacing } from "@styles/spacing";
import { ITheme } from "@styles/theme";

// Utils
import { formatDate, groupBy } from "../utils/index";

const AttendanceScreen: React.FC = () => {
  // Hooks and Redux
  const selectedStudent = useAppSelector((s) => s?.AppReducer?.selectedStudent);
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const { getAttendances } = useAttendance();

  // States
  const [selectedMonth, setSelectedMonth] = useState(
    getSchoolMonthIndex(new Date())
  );

  // Data Fetching
  const fetchAttendances = useCallback(async () => {
    if (!selectedStudent) return [];
    return await getAttendances(selectedStudent.id);
  }, [selectedStudent, getAttendances]);

  const {
    data: attendances,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchAttendances, []);

  // Computed Data
  const summary = useMemo(() => {
    if (!attendances)
      return { totalAbsences: 0, totalLates: 0, excusedAbsences: 0 };
    return {
      totalAbsences: attendances.filter((a) => a.status === "absent").length,
      totalLates: attendances.filter((a) => a.status === "late").length,
      excusedAbsences: attendances.filter(
        (a) => a.status === "absent" && a.isExcused
      ).length,
    };
  }, [attendances]);

  const summaryItems = [
    {
      label: "Total Absences",
      value: summary.totalAbsences,
      icon: "close-circle-outline" as const,
      color: themedStyles.error.color,
    },
    {
      label: "Total retards",
      value: summary.totalLates,
      icon: "time-outline" as const,
      color: themedStyles.warning.color,
    },
    {
      label: "Abs justifiées",
      value: summary.excusedAbsences,
      icon: "checkmark-circle-outline" as const,
      color: themedStyles.success.color,
    },
  ];

  const groupedAttendances = useMemo(() => {
    if (!attendances) return [];
    const grouped = groupBy(attendances, (a) =>
      formatDate(a.date, "yyyy-MM-dd")
    );
    return Object.entries(grouped).map(([date, items]) => ({
      title: formatDate(new Date(date), "EEEE d MMMM yyyy"),
      data: items,
    }));
  }, [attendances]);

  // Callbacks
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    // TODO: Fetch attendance data for the selected month (if needed)
  };

  const renderAttendanceItem = useCallback(
    ({ item }: { item: IAttendanceDTO }) => (
      <AttendanceItem attendance={item} />
    ),
    []
  );

  // Main Render
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      <TitleAndMonths
        title="Ponctualité"
        defaultSelectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />
      <AnimatedFlatList
        style={themedStyles.attendanceList}
        data={groupedAttendances}
        renderItem={({ item }) => (
          <>
            <CsText style={themedStyles.dateHeader}>{item.title}</CsText>
            {item.data.map((attendance) => (
              <React.Fragment key={attendance.id}>
                {renderAttendanceItem({ item: attendance })}
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
        onRefresh={refetchData}
        refreshing={refreshing}
      />
    </View>
  );
};

// Attendance Item Component
const AttendanceItem: React.FC<{ attendance: IAttendanceDTO }> = React.memo(
  ({ attendance }) => {
    const themedStyles = useThemedStyles<typeof styles>(styles);
    const opacity = useSharedValue(0);

    React.useEffect(() => {
      opacity.value = withTiming(1, { duration: 500 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: withTiming(0, { duration: 500 }) }],
    }));

    const getStatusColor = (): "error" | "warning" | "success" => {
      if (attendance.status === "absent")
        return attendance.isExcused ? "warning" : "error";
      if (attendance.status === "late") return "warning";
      return "success";
    };

    const statusColor = getStatusColor();

    return (
      <Animated.View style={[themedStyles.attendanceItem, animatedStyle]}>
        <CsCard
          style={{
            ...themedStyles.attendanceCard,
            ...themedStyles[`${statusColor}Border`],
          }}
        >
          <View style={themedStyles.attendanceHeader}>
            <View>
              <CsText variant="h3">{attendance.subject}</CsText>
              <CsText variant="caption" style={themedStyles.timeText}>
                {attendance.startTime} - {attendance.endTime}
              </CsText>
            </View>
            <AttendanceStatusBadge
              status={attendance.status}
              isExcused={attendance.isExcused}
            />
          </View>
        </CsCard>
      </Animated.View>
    );
  }
);

// Attendance Status Badge Component
const AttendanceStatusBadge: React.FC<{
  status: AttendanceStatus;
  isExcused: boolean;
}> = React.memo(({ status, isExcused }) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const getStatusColor = () => {
    if (status === "absent")
      return isExcused ? themedStyles.warningBadge : themedStyles.errorBadge;
    if (status === "late") return themedStyles.warningBadge;
    return themedStyles.successBadge;
  };

  const getStatusText = () => {
    if (status === "absent") return isExcused ? "Absence justifiée" : "Absent";
    if (status === "late") return "En retard";
    return "Présent";
  };

  return (
    <View style={[themedStyles.statusBadge, getStatusColor()]}>
      <CsText variant="caption" style={themedStyles.statusText}>
        {getStatusText()}
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
    attendanceList: {
      flex: 1,
      padding: spacing.md,
    },
    dateHeader: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    attendanceItem: {
      marginBottom: spacing.md,
    },
    attendanceCard: {
      padding: spacing.md,
      borderLeftWidth: 4,
      ...shadows.small,
    },
    attendanceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    timeText: {
      marginTop: spacing.xs,
      color: theme.textLight,
    },
    statusBadge: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: 16,
    },
    statusText: {
      color: theme.background,
      fontWeight: "bold",
    },
    errorBorder: {
      borderLeftColor: theme.notification,
    },
    warningBorder: {
      borderLeftColor: "#FFA500",
    },
    successBorder: {
      borderLeftColor: "#4CAF50",
    },
    errorBadge: {
      backgroundColor: theme.notification,
    },
    warningBadge: {
      backgroundColor: "#FFA500",
    },
    successBadge: {
      backgroundColor: "#4CAF50",
    },
    primary: {
      color: theme.primary,
    },
    error: {
      color: theme.notification,
    },
    warning: {
      color: "#FFA500",
    },
    success: {
      color: "#4CAF50",
    },
  });

export default AttendanceScreen;
