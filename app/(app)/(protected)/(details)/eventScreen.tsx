// app/(app)/(protected)/(details)/eventScreen.tsx

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { StyleSheet, View, Platform, SectionList, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { format, parseISO, isPast, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  CsText,
  LoadingScreen,
  CsButton,
  CsCard,
} from "@/components";

import { useTheme, useThemedStyles } from "@/hooks";
import { type ITheme, shadows, spacing, typography } from "@/styles"; // Ajout de typography
import borderRadius from "@/styles/borderRadius";

// Interface EventData et données mockées
interface EventData {
    id: number;
    title: string;
    description: string;
    date: string;               // format YYYY-MM-DD
    isClassEvent: boolean;      // true si c'est un événement ciblant une classe
    isDone: boolean;            // true si l'événement est passé
    priority: 'high' | 'medium' | 'low';
}

const mockEvents: EventData[] = [
  {
    id: 1,
    title: "Bal de fin d'année",
    description: "Soirée dansante pour célébrer la fin de l'année scolaire. N'oubliez pas votre tenue de soirée !",
    date: "2025-06-20",
    isClassEvent: false,
    isDone: false,
    priority: "medium",
  },
  {
    id: 2,
    title: "Examen blanc - Mathématiques",
    description: "Simulation d'examen pour préparer le Bac. Durée : 4 heures. Calculatrice autorisée.",
    date: "2025-05-30",
    isClassEvent: true,
    isDone: false,
    priority: "high",
  },
  {
    id: 3,
    title: "Devoir de classe - Français",
    description: "Rédaction sur le thème du roman réaliste. À rendre pour le début du cours.",
    date: "2025-05-18",
    isClassEvent: true,
    isDone: false,
    priority: "medium",
  },
  {
    id: 4,
    title: "Séminaire orientation post-bac",
    description: "Présentation des filières universitaires et BTS. Ouvert à tous les élèves de Terminale.",
    date: "2025-06-05",
    isClassEvent: false,
    isDone: false,
    priority: "low",
  },
  {
    id: 5,
    title: "Alerte scolarité - Retard de paiement",
    description: "Rappel : régulariser les frais de scolarité avant le 25 mai pour éviter toute interruption de service.",
    date: "2025-05-25",
    isClassEvent: false,
    isDone: false,
    priority: "high",
  },
  {
    id: 6,
    title: "Convocation parents - Comportement élève",
    description: "Entretien avec le coordinateur suite à incivilités en classe. Votre présence est requise.",
    date: "2025-05-22",
    isClassEvent: false,
    isDone: false,
    priority: "high",
  },
  {
    id: 7,
    title: "Devoir maison - Histoire-Géographie",
    description: "Etude de cas sur la colonisation en Afrique. À rendre sur la plateforme en ligne.",
    date: "2025-05-21",
    isClassEvent: true,
    isDone: false,
    priority: "low",
  },
  {
    id: 8,
    title: "Examen blanc - Physique",
    description: "Examen blanc session P1 pour les classes de Première. Programme : Mécanique et Optique.",
    date: "2025-05-28",
    isClassEvent: true,
    isDone: false,
    priority: "high",
  },
  {
    id: 9,
    title: "Réunion parents-professeurs",
    description: "Bilan du 2ᵉ trimestre et perspectives pour le 3ᵉ. Inscription préalable obligatoire.",
    date: "2025-06-10",
    isClassEvent: false,
    isDone: false,
    priority: "medium",
  },
  {
    id: 10,
    title: "Devoir de niveau - Anglais",
    description: "Test de compréhension écrite niveau A2. Apportez vos écouteurs.",
    date: "2025-05-19",
    isClassEvent: true,
    isDone: false,
    priority: "medium",
  },
  {
    id: 11,
    title: "Journée portes ouvertes",
    description: "Découverte des ateliers et laboratoires de l’école. Venez nombreux !",
    date: "2025-06-12",
    isClassEvent: false,
    isDone: false,
    priority: "low",
  },
  {
    id: 12,
    title: "Examen blanc - Chimie",
    description: "Examen blanc session C1 pour les classes de Terminale. Programme : Chimie organique.",
    date: "2025-05-29",
    isClassEvent: true,
    isDone: false,
    priority: "high",
  },
  {
    id: 13,
    title: "Atelier prévention santé",
    description: "Intervention d’un infirmier sur l’hygiène de vie et les addictions.",
    date: "2025-05-27",
    isClassEvent: false,
    isDone: false,
    priority: "low",
  },
  {
    id: 14,
    title: "Concours d’orthographe",
    description: "Compétition inter-classes pour tous les niveaux. Lots à gagner pour les meilleurs.",
    date: "2025-06-08",
    isClassEvent: true,
    isDone: false,
    priority: "medium",
  },
  {
    id: 15,
    title: "Alerte scolarité - Absences fréquentes",
    description: "Signalement des absences répétées de votre enfant. Merci de justifier rapidement.",
    date: "2025-05-20",
    isClassEvent: false,
    isDone: false,
    priority: "high",
  },
  {
    id: 16,
    title: "Soutien scolaire",
    description: "Séances de rattrapage en petits groupes pour les élèves en difficulté. Inscription auprès du professeur principal.",
    date: "2025-05-23",
    isClassEvent: true,
    isDone: false,
    priority: "medium",
  },
  {
    id: 17,
    title: "Convocation parents - Retard répété",
    description: "Entretien suite aux retards réguliers de votre enfant. Merci de prendre contact avec le secrétariat.",
    date: "2025-05-24",
    isClassEvent: false,
    isDone: false,
    priority: "high",
  },
  {
    id: 18,
    title: "Spectacle de fin d’année",
    description: "Représentation théâtrale des élèves de la 3ᵉ à la Terminale. Vente des billets à l'entrée.",
    date: "2025-06-18",
    isClassEvent: false,
    isDone: false,
    priority: "medium",
  },
  {
    id: 19,
    title: "Devoir de classe - SVT",
    description: "Exercice sur la génétique et l’hérédité. Documents autorisés.",
    date: "2025-05-17",
    isClassEvent: true,
    isDone: true,
    priority: "low",
  },
  {
    id: 20,
    title: "Examen blanc - Philosophie",
    description: "Simulation d’épreuve pour les Terminales L. Dissertation et commentaire de texte.",
    date: "2025-05-31",
    isClassEvent: true,
    isDone: false,
    priority: "high",
  },
];

const PAGE_SIZE = 10;

const EventScreen: React.FC = () => {
  const selectedStudent = useSelector((state: RootState) => state.AppReducer.selectedStudent);
  const theme = useTheme();
  const themedStyles = useThemedStyles(styles);

  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEventsFromSource = useCallback(async (pageToFetch: number): Promise<EventData[]> => {
    // Simuler une récupération de données avec pagination
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date();
        // Simuler le traitement initial des événements (marquer isDone)
        // Dans une vraie application, cela serait fait côté backend ou une seule fois au chargement initial
        const allProcessedEvents = mockEvents.map(event => ({
          ...event,
          isDone: isPast(parseISO(event.date)) && !isToday(parseISO(event.date))
        }));

        const startIndex = (pageToFetch - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const paginatedEvents = allProcessedEvents.slice(startIndex, endIndex);
        resolve(paginatedEvents);
      }, 700);
    });
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

  useEffect(() => {
    loadEvents(true); // Load initial data
  }, [selectedStudent]); // Re-fetch if student changes

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

  const renderEventItem = ({ item }: { item: EventData }) => {
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
      item.isDone && {color: theme.textLight}
    ]);
    const dateStyle = StyleSheet.flatten([
      themedStyles.eventDate,
      item.isDone && themedStyles.doneEventTextDecoration,
       item.isDone && {color: theme.textLight}
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
         <View style={themedStyles.header}>
            <CsText variant="h1" style={themedStyles.headerTitleText}>Événements & Avis</CsText>
            {selectedStudent && (
            <View style={themedStyles.studentInfoContainer}>
                <Ionicons name="person-circle-outline" size={20} color={theme.background} style={{marginRight: spacing.xs}} />
                <CsText variant="body" style={themedStyles.studentInfoText}>
                    {selectedStudent.firstName} {selectedStudent.lastName} - {selectedStudent.class.name}
                </CsText>
            </View>
            )}
        </View>
        <View style={themedStyles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color={theme.textLight} />
            <CsText style={themedStyles.emptyListText}>Aucun événement programmé pour le moment.</CsText>
            <CsButton title="Actualiser" onPress={handleRefresh} style={{ marginTop: spacing.lg }} />
        </View>
    </View>
  );

  return (
    <View style={themedStyles.container}>
        <View style={themedStyles.header}>
            <CsText variant="h1" style={themedStyles.headerTitleText}>Événements & Avis</CsText>
            {selectedStudent && (
            <View style={themedStyles.studentInfoContainer}>
                <Ionicons name="person-circle-outline" size={20} color={theme.background} style={{marginRight: spacing.xs}} />
                <CsText variant="body" style={themedStyles.studentInfoText}>
                    {selectedStudent.firstName} {selectedStudent.lastName} - {selectedStudent.class.name}
                </CsText>
            </View>
            )}
        </View>

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
    header: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      paddingTop: Platform.OS === 'ios' ? spacing.lg + Constants.statusBarHeight : spacing.lg,
      borderBottomLeftRadius: borderRadius.large,
      borderBottomRightRadius: borderRadius.large,
      ...shadows.medium,
    },
    headerTitleText: {
        ...typography.h1, // Utilisation de h1 pour le titre principal
        color: theme.background,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    studentInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.primaryLight + '33', // Léger fond pour contraster
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.medium,
    },
    studentInfoText: {
        color: theme.background,
        fontSize: 15,
        fontWeight: '500',
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
      backgroundColor: theme.card, // Assurer que la carte a un fond
      ...shadows.small, // Ajouter une légère ombre
      borderRadius: borderRadius.medium,
    },
    doneEventCard: {
      backgroundColor: theme.gray200,
      opacity: 0.75, // Un peu moins transparent
    },
    doneEventTextDecoration: { // Style spécifique pour le texte barré
      textDecorationLine: 'line-through',
    },
    doneOverlayTextContainer: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      backgroundColor: theme.gray500, // Couleur plus neutre
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
      fontSize: 17, // Un peu plus grand
      fontWeight: '600', // Semi-gras
    },
    classEventBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primaryLight + '30',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.large, // Plus arrondi
      marginLeft: spacing.sm,
    },
    classEventText: {
      color: theme.primaryDark, // Texte plus foncé pour le badge
      fontSize: 11, // Plus petit
      marginLeft: spacing.xs,
      fontWeight: '600',
    },
    eventDescription: {
      color: theme.text,
      marginBottom: spacing.md, // Plus d'espace en bas
      fontSize: 14,
      lineHeight: 21, // Hauteur de ligne améliorée
    },
    eventFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm, // Plus d'espace en haut
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: spacing.sm,
    },
    eventDate: {
      color: theme.textLight,
      fontSize: 13,
      marginLeft: spacing.sm, // Plus d'espace
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
        marginTop: spacing.xxl, // Plus d'espace si la liste est complètement vide
    },
    emptyListText: {
        marginTop: spacing.md,
        color: theme.textLight,
        fontSize: 16,
        textAlign: 'center',
    }
});

export default EventScreen;
