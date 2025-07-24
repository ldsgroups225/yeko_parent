import { AttendanceStatus } from "@/types/IAttendanceDTO";
import { z } from "zod";
const firstNameSchema = z.string({
  required_error: 'Le prénom est obligatoire',
}).min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' })
  .max(50, { message: 'Le prénom ne doit pas dépasser 50 caractères.' })
  .regex(/^[A-Za-zÀ-ÿ\-\s]+$/, { message: 'Le prénom ne doit contenir que des lettres.' })
  .transform(value => {
    return value.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  });
const lastNameSchema = z.string({
  required_error: 'Le nom de famille est obligatoire',
}).min(2, { message: 'Le nom de famille doit contenir au moins 2 caractères.' })
  .max(50, { message: 'Le nom de famille ne doit pas dépasser 50 caractères.' })
  .regex(/^[A-Za-zÀ-ÿ\-\s]+$/, { message: 'Le nom de famille ne doit contenir que des lettres.' })
  .transform(value => {
    return value.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  });
const phoneSchema = z.string({
  required_error: 'Le numéro de téléphone est obligatoire',
}).min(10, { message: 'Le numéro de téléphone doit contenir au moins 10 chiffres.' })
  .max(15, { message: 'Le numéro de téléphone ne doit pas dépasser 15 chiffres.' })
  .regex(/^\+?\d+$/, { message: 'Le numéro de téléphone doit être valide.' });

export const completeProfileSchema = z.object({
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  phone: phoneSchema,
});

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

export const parentSignUpSchema = z.object({
  email: z.string({
    required_error: 'L\'adresse email est obligatoire',
  }).email({ message: 'Veuillez entrer une adresse email valide.' }),
  password: z.string({
    required_error: 'Le mot de passe est obligatoire',
  })
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
    .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule.' })
    .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule.' })
    .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre.' })
    .regex(/[^A-Za-z0-9]/, { message: 'Le mot de passe doit contenir au moins un caractère spécial.' }),
  passwordConfirmation: z.string({
    required_error: 'Retapez le mot de passe',
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Les mots de passe ne correspondent pas.',
  path: ['passwordConfirmation'],
});

export type ParentSignUpFormValues = z.infer<typeof parentSignUpSchema>;
export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
