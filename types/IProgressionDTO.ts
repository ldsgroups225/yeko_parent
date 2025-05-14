// types/IProgressionDTO.ts

interface ProgressionConfig {
  id: string;
  lesson: string;
  lesson_order: number;
  sessions_count: number;
  subject_id: string;
  subjects?: {
    id: string;
    name: string;
  } | null;
}

interface ProgressionReport {
  id: string;
  class_id: string;
  lessons_progress_reports_config_id: string;
  is_completed: boolean;
  sessions_completed: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SubjectWithProgression {
  id: string;
  name: string;
  totalLessons: number;
  completedLessons: number;
}

interface LessonWithProgress extends ProgressionConfig {
  report?: ProgressionReport;
  progress: number;
  subject_name: string;
}

interface GroupedProgressionData {
  [subjectId: string]: {
    subjectName: string;
    lessons: LessonWithProgress[];
  };
}

export { ProgressionConfig, ProgressionReport, SubjectWithProgression, LessonWithProgress, GroupedProgressionData };
