import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import { useThemedStyles } from "@hooks/index";
import { useAttendance } from "@hooks/useAttendance";
import useDataFetching from "@hooks/useDataFetching";
import {
  AttendanceStatus,
  IAttendanceDTO,
} from "@modules/app/types/IAttendanceDTO";
import { shadows } from "@src/styles";
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
import { formatDate, groupBy } from "../utils/index";
import { useAppSelector } from "@src/store";

const PunctualityScreen: React.FC = () => {
  const user = useAppSelector((s) => s?.AppReducer?.user);
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const { getAttendances } = useAttendance();

  const fetchAttendances = useCallback(async () => {
    const selectedStudentId = user?.children?.length
      ? user.children.map((c) => c.id)[0]
      : "";

    if (!selectedStudentId.length) return;
    return await getAttendances(selectedStudentId);
  }, []);

  const {
    data: attendances,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchAttendances, []);

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

  const renderHeader = () => (
    <View style={themedStyles.header}>
      <CsText style={themedStyles.headerTitle}>Ponctualité</CsText>
      <View style={themedStyles.monthsContainer}>
        {[
          "JAN",
          "FEV",
          "MAR",
          "AVR",
          "MAI",
          "JUN",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ].map((month, index) => (
          <TouchableOpacity
            key={month}
            style={[
              themedStyles.monthButton,
              selectedMonth === index && themedStyles.selectedMonthButton,
            ]}
            onPress={() => setSelectedMonth(index)}
          >
            <CsText
              style={StyleSheet.flatten([
                themedStyles.monthButtonText,
                selectedMonth === index && themedStyles.selectedMonthButtonText,
              ])}
            >
              {month}
            </CsText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAttendanceItem = useCallback(
    ({ item }: { item: IAttendanceDTO }) => (
      <AttendanceItem attendance={item} />
    ),
    []
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      {renderHeader()}
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

export default PunctualityScreen;
