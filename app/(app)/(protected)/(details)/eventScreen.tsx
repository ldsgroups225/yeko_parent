// app/(app)/(protected)/(details)/eventScreen.tsx

import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View, Platform, SectionList, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { format, parseISO, isPast, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { event as schoolEvent } from '@/services/eventService';

import {
  CsText,
  LoadingScreen,
  CsButton,
  CsCard,
} from "@/components";

import { useTheme, useThemedStyles } from "@/hooks";
import { type ITheme, shadows, spacing, typography } from "@/styles";
import borderRadius from "@/styles/borderRadius";
import { IEventDTO } from '@/types/IEventDTO';
import { Header } from "@/components/Header";

const PAGE_SIZE = 10;

const EventScreen: React.FC = () => {
  const theme = useTheme();
  const themedStyles = useThemedStyles(styles);

  const [allEvents, setAllEvents] = useState<IEventDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEventsFromSource = useCallback(async (pageToFetch: number): Promise<IEventDTO[]> => {
    // Simuler une récupération de données avec pagination
    return schoolEvent.getAllEvents({ page: pageToFetch, pageSize: PAGE_SIZE });
  }, []);

  const loadEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
      setCurrentPage(1);
      setHasMoreData(true);
    } else if (currentPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const newEvents = await fetchEventsFromSource(isRefresh ? 1 : currentPage);
      if (newEvents.length < PAGE_SIZE) {
        setHasMoreData(false);
      }
      setAllEvents(prevEvents => isRefresh ? newEvents : [...prevEvents, ...newEvents]);
      if (!isRefresh) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      // Gérer l'erreur, par exemple afficher un message à l'utilisateur
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [fetchEventsFromSource, currentPage]);

  const handleRefresh = () => {
    loadEvents(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreData && !isRefreshing) {
      loadEvents();
    }
  };

  const getPriorityStyle = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          borderColor: theme.error,
          icon: 'alert-circle' as const,
          iconColor: theme.error,
          titleColor: theme.error,
        };
      case 'medium':
        return {
          borderColor: theme.warning,
          icon: 'information-circle' as const,
          iconColor: theme.warning,
          titleColor: theme.warning,
        };
      case 'low':
      default:
        return {
          borderColor: theme.info,
          icon: 'checkmark-circle' as const, // Changed to a more neutral "info" icon
          iconColor: theme.info,
          titleColor: theme.info,
        };
    }
  };

  const formatDateDisplay = (dateString: string) => {
    const eventDate = parseISO(dateString);
    if (isToday(eventDate)) return "Aujourd'hui";
    if (isTomorrow(eventDate)) return "Demain";
    return format(eventDate, "eeee dd MMMM yyyy", { locale: fr });
  };

  const renderEventItem = ({ item }: { item: IEventDTO }) => {
    const priorityStyle = getPriorityStyle(item.priority);
    const cardStyle = StyleSheet.flatten([
      themedStyles.eventCard,
      { borderLeftColor: priorityStyle.borderColor },
      item.isDone && themedStyles.doneEventCard,
    ]);
    const titleStyle = StyleSheet.flatten([
      themedStyles.eventTitle,
      { color: item.isDone ? theme.textLight : priorityStyle.titleColor }, // Adjust color if done
      item.isDone && themedStyles.doneEventTextDecoration,
    ]);
    const descriptionStyle = StyleSheet.flatten([
      themedStyles.eventDescription,
      item.isDone && themedStyles.doneEventTextDecoration,
      item.isDone && { color: theme.textLight }
    ]);
    const dateStyle = StyleSheet.flatten([
      themedStyles.eventDate,
      item.isDone && themedStyles.doneEventTextDecoration,
      item.isDone && { color: theme.textLight }
    ]);


    return (
      <CsCard style={cardStyle}>
        <View style={themedStyles.eventHeader}>
          <Ionicons name={priorityStyle.icon} size={22} color={item.isDone ? theme.textLight : priorityStyle.iconColor} style={themedStyles.priorityIcon} />
          <CsText variant="h3" style={titleStyle}>{item.title}</CsText>
          {item.isClassEvent && !item.isDone && (
            <View style={themedStyles.classEventBadge}>
              <Ionicons name="people-outline" size={14} color={theme.primary} />
              <CsText style={themedStyles.classEventText}>Classe</CsText>
            </View>
          )}
        </View>
        <CsText style={descriptionStyle}>
          {item.description}
        </CsText>
        <View style={themedStyles.eventFooter}>
          <Ionicons name="calendar-outline" size={16} color={item.isDone ? theme.textLight : theme.gray500} />
          <CsText style={dateStyle}>
            {formatDateDisplay(item.date)}
          </CsText>
        </View>
        {item.isDone && (
          <View style={themedStyles.doneOverlayTextContainer}>
            <CsText style={themedStyles.doneOverlayText}>TERMINÉ</CsText>
          </View>
        )}
      </CsCard>
    );
  };

  const groupedEvents = useMemo(() => {
    if (!allEvents) return [];
    const upcoming = allEvents.filter(event => !event.isDone)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const done = allEvents.filter(event => event.isDone)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const sections = [];
    if (upcoming.length > 0) {
      sections.push({ title: "Événements à venir", data: upcoming });
    }
    if (done.length > 0) {
      sections.push({ title: "Événements passés", data: done });
    }
    return sections;
  }, [allEvents]);


  if (loading && currentPage === 1 && !isRefreshing) return <LoadingScreen />;

  if (!loading && allEvents.length === 0 && !isRefreshing) return (
    <View style={themedStyles.container}>
      <Header
        title="Événements & Avis"
      />

      <View style={themedStyles.emptyState}>
        <Ionicons name="calendar-outline" size={60} color={theme.textLight} />
        <CsText style={themedStyles.emptyListText}>Aucun événement programmé pour le moment.</CsText>
        <CsButton title="Actualiser" onPress={handleRefresh} style={{ marginTop: spacing.lg }} />
      </View>
    </View>
  );

  return (
    <View style={themedStyles.container}>
      <Header
        title="Événements & Avis"
      />

      {groupedEvents.length > 0 ? (
        <SectionList
          sections={groupedEvents}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={renderEventItem}
          renderSectionHeader={({ section: { title } }) => (
            <CsText style={themedStyles.sectionHeader}>{title}</CsText>
          )}
          contentContainerStyle={themedStyles.listContentContainer}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: spacing.md }} /> : null}
        />
      ) : (
        !loading && !isRefreshing && ( // Only show empty state if not loading or refreshing
          <View style={themedStyles.emptyListContainer}>
            <Ionicons name="calendar-outline" size={60} color={theme.textLight} />
            <CsText style={themedStyles.emptyListText}>Aucun événement trouvé.</CsText>
          </View>
        )
      )}
    </View>
  );
};

const styles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  listContentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionHeader: {
    fontSize: 20, // Augmentation de la taille
    fontWeight: '700', // Plus gras
    color: theme.primaryDark, // Couleur plus foncée
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: theme.primaryLight,
    paddingBottom: spacing.sm,
  },
  eventCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderLeftWidth: 6, // Bordure plus épaisse
    backgroundColor: theme.card,
    ...shadows.small,
    borderRadius: borderRadius.medium,
  },
  doneEventCard: {
    backgroundColor: theme.gray200,
    opacity: 0.75,
  },
  doneEventTextDecoration: {
    textDecorationLine: 'line-through',
  },
  doneOverlayTextContainer: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: theme.gray500,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
  },
  doneOverlayText: {
    color: theme.background,
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priorityIcon: {
    marginRight: spacing.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
  classEventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primaryLight + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.large,
    marginLeft: spacing.sm,
  },
  classEventText: {
    color: theme.primaryDark,
    fontSize: 11,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  eventDescription: {
    color: theme.text,
    marginBottom: spacing.md,
    fontSize: 14,
    lineHeight: 21,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: spacing.sm,
  },
  eventDate: {
    color: theme.textLight,
    fontSize: 13,
    marginLeft: spacing.sm,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  emptyListText: {
    marginTop: spacing.md,
    color: theme.textLight,
    fontSize: 16,
    textAlign: 'center',
  }
});

export default EventScreen;
