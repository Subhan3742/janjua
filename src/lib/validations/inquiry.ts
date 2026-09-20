import { z } from "zod";
import { SERVICE_OPTIONS } from "@/lib/site";

const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "That name is too long."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Please enter a valid phone number.")
    .regex(phoneRegex, "Please enter a valid phone number."),
  email: z
    .union([z.literal(""), z.email("Please enter a valid email address.")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  service: z.enum(SERVICE_OPTIONS, "Please choose a service."),
  preferred_date: z
    .union([z.literal(""), z.iso.date("Please choose a valid date.")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  message: z
    .string()
    .trim()
    .max(1000, "Please keep your message under 1000 characters.")
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryValues = z.output<typeof inquirySchema>;
