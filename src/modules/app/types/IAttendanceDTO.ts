export type AttendanceStatus = "present" | "absent" | "late";

export interface IAttendanceDTO {
  id: string;
  status: AttendanceStatus;
  isExcused: boolean;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
}
