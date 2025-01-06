export interface INoteDTO {
  id: string;
  subjectId: string;
  subjectName: string;
  note: number;
  date: Date;
}

export interface IGroupedNotesDTO  {
  title: string;
  average: number;
  data: INoteDTO[];
}

export interface INoteSummaryDTO {
  averageNote: number;
  bestSubject: string;
  worstSubject: string;
}
