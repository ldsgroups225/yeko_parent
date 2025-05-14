// services/progressionService.ts

import { supabase } from '@/lib/supabase';
import { GroupedProgressionData, SubjectWithProgression, ProgressionConfig, LessonWithProgress } from '@/types/IProgressionDTO';

export const progression = {
  async getProgressionConfig(classId: string): Promise<{ data: GroupedProgressionData, subjectSummary?: string }> {
    let subjectsWithProgress: SubjectWithProgression[] = [];
    let groupedData: GroupedProgressionData = {};

    try {
      const { data: reportsData, error: reportsError } = await supabase
        .from('lessons_progress_reports')
        .select('*')
        .eq('class_id', classId);
        
      if (reportsError) throw reportsError;
      
      const configIds = reportsData.map(report => report.lessons_progress_reports_config_id);
      
      if (configIds.length === 0) {
        subjectsWithProgress = [];
        groupedData = {};
        return { data: groupedData };
      }

      const { data: configData, error: configError } = await supabase
        .from('lessons_progress_reports_config')
        .select(`
          id,
          lesson,
          lesson_order,
          sessions_count,
          subject_id,
          subjects(id, name)
        `)
        .in('id', configIds);
            
      if (configError) throw configError;
      
      const processedData: GroupedProgressionData = {};
      
      (configData as ProgressionConfig[]).forEach((config) => {
        const subjectId = config.subject_id;
        const subjectName = config.subjects?.name || 'Matière inconnue';
        
        if (!processedData[subjectId]) {
          processedData[subjectId] = {
            subjectName,
            lessons: [],
          };
        }
        
        const report = reportsData.find(
          (r) => r.lessons_progress_reports_config_id === config.id
        );
        
        const progress = report && config.sessions_count > 0 ?
          (report.sessions_completed / config.sessions_count) * 100 : 0;
        
        const lessonWithProgress: LessonWithProgress = {
          ...config,
          subject_name: subjectName,
          report,
          progress: Math.min(Math.round(progress), 100),
        };
        
        processedData[subjectId].lessons.push(lessonWithProgress);
      });

      Object.keys(processedData).forEach(subjectId => {
        processedData[subjectId].lessons.sort((a, b) => a.lesson_order - b.lesson_order);
      });
      
      const subjectsSummary = Object.keys(processedData).map(subjectId => {
        const subjectData = processedData[subjectId];
        return {
          id: subjectId,
          name: subjectData.subjectName,
          totalLessons: subjectData.lessons.length,
          completedLessons: subjectData.lessons.filter(l => l.report?.is_completed).length,
        };
      });
      
      subjectsWithProgress = subjectsSummary;
      groupedData = processedData;

      if (subjectsWithProgress.length === 0) {
        return { data: processedData, subjectSummary: undefined};
      }

      return { data: processedData};
    } catch (error) {
      console.error("Error fetching progression config:", error);
      throw error;
    }
  }
}
