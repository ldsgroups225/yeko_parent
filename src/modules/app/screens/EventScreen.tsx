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
import { Ionicons } from "@expo/vector-icons";
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
import useDataFetching from "@hooks/useDataFetching";

// Types
import { ITheme } from "@styles/theme";

// Styles
import { shadows, spacing } from "@src/styles";

// Utils
import { formatDate, groupBy } from "../utils/index";

// Event Interfaces
interface BaseEvent {
  id: string;
  title: string;
  date: Date;
  type: "tuition" | "meeting" | "convocation" | "extracurricular";
}

interface TuitionEvent extends BaseEvent {
  type: "tuition";
  amountDue: number;
  dueDate: Date;
}

interface MeetingEvent extends BaseEvent {
  type: "meeting";
  location: string;
  description: string;
}

interface ConvocationEvent extends BaseEvent {
  type: "convocation";
  reason: string;
}

interface ExtracurricularEvent extends BaseEvent {
  type: "extracurricular";
  description: string;
  location: string;
}

type Event =
  | TuitionEvent
  | MeetingEvent
  | ConvocationEvent
  | ExtracurricularEvent;

const EventScreen: React.FC = () => {
  // Hooks
  const themedStyles = useThemedStyles<typeof styles>(styles);

  // States
  const [selectedMonth, setSelectedMonth] = useState(
    getSchoolMonthIndex(new Date())
  );

  // Data Fetching
  const fetchEvents = useCallback(async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with actual API call to fetch event data
    const mockData: Event[] = [
      {
        id: "1",
        type: "tuition",
        title: "Frais de scolarité",
        date: new Date(2024, 3, 15),
        amountDue: 100000,
        dueDate: new Date(2024, 3, 30),
      },
      {
        id: "2",
        type: "meeting",
        title: "Réunion parents-professeurs",
        date: new Date(2024, 3, 20),
        location: "Salle de conférence",
        description: "Discussion sur les progrès des élèves",
      },
      {
        id: "3",
        type: "convocation",
        title: "Convocation du directeur",
        date: new Date(2024, 3, 25),
        reason: "Discussion sur le comportement en classe",
      },
      {
        id: "4",
        type: "extracurricular",
        title: "Bal de fin d'année",
        date: new Date(2024, 5, 15),
        description: "Célébration de fin d'année scolaire",
        location: "Grande salle de l'école",
      },
    ];

    return mockData;
  }, []);

  const {
    data: events,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchEvents, []);

  // Computed Data
  const summary = useMemo(() => {
    if (!events) return { totalEvents: 0, tuitionDue: 0 };
    return {
      totalEvents: events.length,
      tuitionDue: events
        .filter((e): e is TuitionEvent => e.type === "tuition")
        .reduce((sum, e) => sum + e.amountDue, 0),
    };
  }, [events]);

  const summaryItems = [
    {
      label: "Total des événements",
      value: summary.totalEvents,
      icon: "calendar-outline" as const,
      color: themedStyles.primary.color,
    },
    {
      label: "Frais de scolarité dus",
      value: `${summary.tuitionDue} FCFA`,
      icon: "cash-outline" as const,
      color: themedStyles.warning.color,
    },
  ];

  const groupedEvents = useMemo(() => {
    if (!events) return [];
    const grouped = groupBy(events, (event: Event) =>
      formatDate(event.date, "yyyy-MM-dd")
    );
    return Object.entries(grouped).map(([date, items]) => ({
      title: formatDate(new Date(date), "EEEE d MMMM yyyy"),
      data: items,
    }));
  }, [events]);

  // Callbacks
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    // TODO: Fetch event data for the selected month (if needed)
  };

  const renderEventItem = useCallback(
    ({ item }: { item: Event }) => <EventItem event={item} />,
    []
  );

  // Main Render
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      <TitleAndMonths
        title="Info et scolarité"
        defaultSelectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />
      <AnimatedFlatList
        style={themedStyles.eventList}
        data={groupedEvents}
        renderItem={({ item }) => (
          <>
            <CsText style={themedStyles.dateHeader}>{item.title}</CsText>
            {item.data.map((event) => (
              <React.Fragment key={event.id}>
                {renderEventItem({ item: event })}
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

// Event Item Component
const EventItem: React.FC<{ event: Event }> = React.memo(({ event }) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: withTiming(0, { duration: 500 }) }],
  }));

  const renderEventDetails = () => {
    switch (event.type) {
      case "tuition":
        return (
          <>
            <CsText variant="body" style={themedStyles.eventDetail}>
              Montant dû: {event.amountDue} FCFA
            </CsText>
            <CsText variant="body" style={themedStyles.eventDetail}>
              Date limite: {formatDate(event.dueDate, "d MMMM yyyy")}
            </CsText>
          </>
        );
      case "meeting":
      case "extracurricular":
        return (
          <>
            <CsText variant="body" style={themedStyles.eventDetail}>
              Lieu: {event.location}
            </CsText>
            <CsText variant="body" style={themedStyles.eventDetail}>
              {event.description}
            </CsText>
          </>
        );
      case "convocation":
        return (
          <CsText variant="body" style={themedStyles.eventDetail}>
            Raison: {event.reason}
          </CsText>
        );
    }
  };

  const getEventIcon = () => {
    switch (event.type) {
      case "tuition":
        return "cash-outline";
      case "meeting":
        return "people-outline";
      case "convocation":
        return "alert-circle-outline";
      case "extracurricular":
        return "musical-notes-outline";
    }
  };

  return (
    <Animated.View style={[themedStyles.eventItem, animatedStyle]}>
      <CsCard style={themedStyles.eventCard}>
        <View style={themedStyles.eventHeader}>
          <Ionicons
            name={getEventIcon()}
            size={24}
            color={themedStyles.icon.color}
          />
          <CsText variant="h3" style={themedStyles.eventTitle}>
            {event.title}
          </CsText>
        </View>
        <View style={themedStyles.eventDetails}>
          <CsText variant="body" style={themedStyles.eventDate}>
            {formatDate(event.date, "d MMMM yyyy HH:mm")}
          </CsText>
          {renderEventDetails()}
        </View>
      </CsCard>
    </Animated.View>
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
    eventList: {
      flex: 1,
      padding: spacing.md,
    },
    dateHeader: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    eventItem: {
      marginBottom: spacing.md,
    },
    eventCard: {
      padding: spacing.md,
      ...shadows.small,
    },
    eventHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    eventTitle: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    eventDetails: {
      marginTop: spacing.xs,
    },
    eventDate: {
      color: theme.textLight,
      marginBottom: spacing.xs,
    },
    eventDetail: {
      marginBottom: spacing.xs,
    },
    icon: {
      color: theme.primary,
    },
    primary: {
      color: theme.primary,
    },
    success: { color: "#4CAF50" },
    warning: { color: "#FFA500" },
  });

export default EventScreen;
