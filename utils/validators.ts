import { AttendanceStatus } from "@/types/IAttendanceDTO";
import { z } from "zod";

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}

export function isValidAttendanceStatus(
  status: string,
): status is AttendanceStatus {
  return ["present", "absent", "late"].includes(status);
}

export function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 50;
}


export const FeedbackTypeEnum = z.enum(["bug", "recommendation"]);
export const FeedbackSchema = z.object({
  feedbackType: FeedbackTypeEnum,
  message: z.string().min(1, "Message requis"),
  userEmail: z.string().email().optional().nullable(),
});

export type FeedbackFormValues = z.infer<typeof FeedbackSchema>;
