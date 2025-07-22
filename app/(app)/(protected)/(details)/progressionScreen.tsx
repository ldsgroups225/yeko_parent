// app/(app)/(protected)/(details)/progressionScreen.tsx

import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, View, Platform, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from '@/store';
import useDataFetching from '@/hooks/useDataFetching';
import { Ionicons } from '@expo/vector-icons';

import {
  CsText,
  LoadingScreen,
  CsButton,
} from "@/components";
import ScreenWrapper from "@/components/ScreenWrapper";

import { useTheme, useThemedStyles } from "@/hooks";

import { type ITheme, shadows, spacing } from "@/styles";
import borderRadius from "@/styles/borderRadius";
import { progression } from "@/services/progressionService";
import { GroupedProgressionData, SubjectWithProgression } from "@/types/IProgressionDTO";
import { Header } from "@/components/Header";

const ProgressionScreen: React.FC = () => {
  const selectedStudent = useSelector((state: RootState) => state.AppReducer.selectedStudent);
  const theme = useTheme();
  const themedStyles = useThemedStyles(styles);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjectsWithProgress, setSubjectsWithProgress] = useState<SubjectWithProgression[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedProgressionData>({});

  const fetchProgressionData = useCallback(async () => {
    if (!selectedStudent) return {};
    const classId = selectedStudent.class.id;

    try {
      const { groupedData, subjectsWithProgress, subjectSummary } = await progression.getProgressionConfig(classId);

      if (!selectedSubject && subjectSummary) {
        setSelectedSubject(subjectSummary);
      }

      setSubjectsWithProgress(subjectsWithProgress);
      setGroupedData(groupedData);

      return groupedData;
    } catch (error) {
      console.error('Error fetching progression data:', error);
      setSubjectsWithProgress([]);
      setGroupedData({});
      return {};
    }
  }, [selectedStudent, selectedSubject]);

  const {
    data,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching<GroupedProgressionData>(fetchProgressionData, [selectedStudent]);

  useEffect(() => {
    if (data && Object.keys(data).length > 0 && !selectedSubject) {
      setSelectedSubject(Object.keys(data)[0]);
    }
  }, [data, selectedSubject]);

  const formatDateDisplay = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading && Object.keys(groupedData).length === 0) return <LoadingScreen />;

  if (!loading && Object.keys(groupedData).length === 0 && subjectsWithProgress.length === 0) {
    return (
      <View style={themedStyles.emptyState}>
        <Ionicons name="cloud-offline-outline" size={48} color={theme.textLight} />
        <CsText style={{ marginTop: spacing.md, color: theme.textLight, textAlign: 'center' }}>
          Pas de progression des cours. Vérifiez votre connexion et réessayez.
        </CsText>
        <CsButton title="Réessayer" onPress={refetchData} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  if (subjectsWithProgress.length === 0 && !loading) {
    return (
      <ScreenWrapper>
        <View style={themedStyles.header}>
          <CsText variant="h2" style={themedStyles.title}>Progression des cours</CsText>
          <CsText variant="body" style={themedStyles.studentInfo}>
            Classe: {selectedStudent?.class?.name || 'N/A'}
          </CsText>
        </View>
        <View style={themedStyles.emptyState}>
          <Ionicons name="book-outline" size={48} color={theme.textLight} />
          <CsText style={{ marginTop: spacing.md, color: theme.textLight, textAlign: 'center' }}>
            Aucune progression de cours n'est disponible pour cette classe pour le moment.
          </CsText>
          <CsButton title="Actualiser" onPress={refetchData} style={{ marginTop: spacing.lg }} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header
        title="Progression des cours"
      >
        <View style={themedStyles.subjectTabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={themedStyles.subjectTabs}
          >
            {subjectsWithProgress.map((subject) => {
              const isSelected = selectedSubject === subject.id;
              return (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    themedStyles.subjectTab,
                    isSelected && themedStyles.selectedSubjectTab
                  ]}
                  onPress={() => setSelectedSubject(subject.id)}
                >
                  <CsText
                    style={StyleSheet.flatten([
                      themedStyles.subjectTabText,
                      isSelected && themedStyles.selectedSubjectTabText
                    ])}
                  >
                    {subject.name}
                  </CsText>
                  <View style={StyleSheet.flatten([
                    themedStyles.progressBadge,
                    isSelected && themedStyles.selectedTabProgressBadge
                  ])}>
                    <CsText style={StyleSheet.flatten([
                      themedStyles.progressBadgeText,
                      isSelected && themedStyles.selectedTabProgressBadgeText
                    ])}>
                      {subject.completedLessons}/{subject.totalLessons}
                    </CsText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Header>
      <View style={themedStyles.container}>
        <View style={themedStyles.header}>
          <CsText variant="h2" style={themedStyles.title}>Progression des cours</CsText>
          <CsText variant="body" style={themedStyles.studentInfo}>
            Classe: {selectedStudent?.class?.name || 'N/A'}
          </CsText>
        </View>



        {loading && !groupedData[selectedSubject!] && (
          <View style={themedStyles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}
        {selectedSubject && groupedData[selectedSubject] ? (
          <FlatList
            data={groupedData[selectedSubject].lessons}
            keyExtractor={(item) => item.id}
            contentContainerStyle={themedStyles.progressionList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refetchData} />
            }
            ListEmptyComponent={
              <View style={themedStyles.emptyStateSmall}>
                <Ionicons name="information-circle-outline" size={32} color={theme.textLight} />
                <CsText style={{ color: theme.textLight, textAlign: 'center' }}>
                  Aucune leçon trouvée pour cette matière.
                </CsText>
              </View>
            }
            renderItem={({ item, index }) => {
              const isCompleted = item.report?.is_completed || false;
              const lessonsForSubject = groupedData[selectedSubject]?.lessons || [];
              const firstUpcomingIndex = lessonsForSubject.findIndex(l => !l.report?.is_completed);
              const isCurrent = !isCompleted && index === (firstUpcomingIndex === -1 ? lessonsForSubject.length : firstUpcomingIndex);
              const isUpcoming = !isCompleted && !isCurrent;

              return (
                <View style={themedStyles.progressionItem}>
                  {index > 0 && (
                    <View style={[
                      themedStyles.connectorLine,
                      item.report?.is_completed ? themedStyles.completedConnector :
                        (lessonsForSubject[index - 1]?.report?.is_completed && isCurrent) ? themedStyles.currentConnectorLeadingFromCompleted :
                          isCurrent ? themedStyles.currentConnector :
                            themedStyles.upcomingConnector
                    ]} />
                  )}

                  <View
                    style={[themedStyles.stepCircle,
                    isCompleted ? themedStyles.completedStep :
                      isCurrent ? themedStyles.currentStep :
                        themedStyles.upcomingStep
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={20} color={theme.background} />
                    ) : isCurrent ? (
                      <View style={themedStyles.currentStepInner} />
                    ) : (
                      <CsText style={themedStyles.stepNumber}>{index + 1}</CsText>
                    )}
                  </View>

                  <View style={themedStyles.stepContent}>
                    <View style={themedStyles.stepHeader}>
                      <CsText
                        variant="h3"
                        style={{
                          ...themedStyles.stepTitle,
                          ...(isCompleted ? themedStyles.completedText :
                            isCurrent ? themedStyles.currentText :
                              themedStyles.upcomingText)
                        }}
                      >
                        {`${item.lesson}`}
                      </CsText>

                      {isCompleted && (
                        <View style={[themedStyles.statusBadge, themedStyles.completedBadge]}>
                          <Ionicons name="checkmark-done-outline" size={16} color={theme.success} style={{ marginRight: spacing.xs }} />
                          <CsText style={themedStyles.completedBadgeText}>Terminé</CsText>
                        </View>
                      )}

                      {isCurrent && (
                        <View style={[themedStyles.statusBadge, themedStyles.currentBadge]}>
                          <Ionicons name="play-forward-outline" size={16} color={theme.primary} style={{ marginRight: spacing.xs }} />
                          <CsText style={themedStyles.currentBadgeText}>En cours</CsText>
                        </View>
                      )}
                      {isUpcoming && (
                        <View style={[themedStyles.statusBadge, themedStyles.upcomingBadge]}>
                          <Ionicons name="time-outline" size={16} color={theme.textLight} style={{ marginRight: spacing.xs }} />
                          <CsText style={themedStyles.upcomingBadgeText}>À venir</CsText>
                        </View>
                      )}
                    </View>

                    <View style={themedStyles.stepDetails}>
                      {(isCompleted || isCurrent) && item.sessions_count > 0 && (
                        <>
                          <View style={themedStyles.progressBar}>
                            <View
                              style={[
                                themedStyles.progressFill,
                                { width: `${item.progress}%` },
                                isCompleted && { backgroundColor: theme.success }
                              ]}
                            />
                          </View>

                          <View style={themedStyles.progressDetails}>
                            <CsText style={themedStyles.progressText}>
                              {item.report?.sessions_completed || 0} / {item.sessions_count} séance{item.sessions_count > 1 ? 's' : ''}
                            </CsText>

                            {isCompleted && item.report?.completed_at && (
                              <CsText style={themedStyles.dateText}>
                                {formatDateDisplay(item.report.completed_at)}
                              </CsText>
                            )}

                            {isCurrent && item.report?.started_at && !item.report?.is_completed && (
                              <CsText style={themedStyles.dateText}>
                                Début: {formatDateDisplay(item.report.started_at)}
                              </CsText>
                            )}
                          </View>
                        </>
                      )}

                      {isUpcoming && (
                        <CsText style={StyleSheet.flatten([themedStyles.upcomingText, { fontSize: 14 }])}>
                          {item.sessions_count} séance{item.sessions_count > 1 ? 's' : ''} prévue{item.sessions_count > 1 ? 's' : ''}
                        </CsText>
                      )}
                    </View>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          !loading && selectedSubject && (
            <View style={themedStyles.emptyStateSmall}>
              <Ionicons name="file-tray-outline" size={32} color={theme.textLight} />
              <CsText style={{ color: theme.textLight, textAlign: 'center', marginTop: spacing.sm }}>
                Aucune donnée de progression pour cette matière.
              </CsText>
            </View>
          )
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'android' ? spacing.sm : 0,
    paddingBottom: spacing.lg,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    marginBottom: spacing.xs,
    color: theme.text,
    fontWeight: 'bold',
  },
  studentInfo: {
    color: theme.textLight,
    fontSize: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateSmall: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  subjectTabsContainer: {
    backgroundColor: theme.background + '10',
  },
  subjectTabs: {
    paddingHorizontal: spacing.xs,
  },
  subjectTab: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginRight: spacing.sm,
    borderRadius: borderRadius.large,
    backgroundColor: theme.gray100,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    ...shadows.small,
  },
  selectedSubjectTab: {
    backgroundColor: theme.primary,
    borderColor: theme.background,
    ...shadows.medium,
  },
  subjectTabText: {
    color: theme.text,
    fontWeight: '700',
    fontSize: 15,
  },
  selectedSubjectTabText: {
    color: theme.background,
  },
  progressBadge: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.medium,
    backgroundColor: theme.gray200,
  },
  progressBadgeText: {
    fontSize: 13,
    color: theme.text,
    fontWeight: 'bold',
  },
  selectedTabProgressBadge: {
    backgroundColor: theme.background,
  },
  selectedTabProgressBadgeText: {
    color: theme.primary,
  },
  progressionList: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  progressionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    left: 17,
    width: 3,
    top: 36,
    height: '110%',
    zIndex: 0,
  },
  completedConnector: { backgroundColor: theme.success },
  currentConnector: { backgroundColor: theme.primary },
  upcomingConnector: { backgroundColor: theme.gray300 },
  currentConnectorLeadingFromCompleted: { backgroundColor: theme.primary },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    zIndex: 1,
    backgroundColor: theme.card,
    ...shadows.small,
  },
  completedStep: {
    backgroundColor: theme.success,
    borderColor: theme.success,
    borderWidth: 2,
  },
  currentStep: {
    backgroundColor: theme.background,
    borderColor: theme.primary,
    borderWidth: 3,
  },
  currentStepInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.primary,
  },
  upcomingStep: {
    backgroundColor: theme.background,
    borderWidth: 2.5,
    borderColor: theme.gray400,
  },
  stepNumber: {
    color: theme.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: theme.border,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepTitle: {
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: spacing.sm,
    fontSize: 18,
    color: theme.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.large,
  },
  completedBadge: { backgroundColor: theme.success + '30' },
  completedBadgeText: { color: theme.success, fontSize: 13, fontWeight: 'bold' },
  currentBadge: { backgroundColor: theme.primary + '30' },
  currentBadgeText: { color: theme.primary, fontSize: 13, fontWeight: 'bold' },
  upcomingBadge: { backgroundColor: theme.gray200 },
  upcomingBadgeText: { color: theme.textLight, fontSize: 13, fontWeight: 'bold' },

  completedText: { color: theme.text },
  currentText: { color: theme.primary },
  upcomingText: { color: theme.textLight },

  stepDetails: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 10,
    backgroundColor: theme.gray200,
    borderRadius: 5,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 5,
  },
  progressDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  progressText: {
    fontSize: 14,
    color: theme.textLight,
    marginBottom: spacing.xs,
  },
  dateText: {
    fontSize: 14,
    color: theme.textLight,
    fontStyle: 'italic',
  },
});

export default ProgressionScreen;
