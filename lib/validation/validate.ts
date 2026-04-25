import { z } from "zod";
import { ValidationResult } from "@/types/validation";
import { isDisposableEmail } from "./email";
import { findBlockedWords } from "./profanity";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-]{8,}$/.test(val), {
      message: "Invalid phone number format",
    }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

export async function validateContactForm(data: unknown): Promise<ValidationResult<z.infer<typeof contactSchema>>> {
  // 1. Zod validation
  const result = contactSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: {
        type: "zod",
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  const { email, message } = result.data;

  // 2. Email check (Fakeout)
  const isDisposable = await isDisposableEmail(email);
  if (isDisposable) {
    return {
      success: false,
      error: {
        type: "temp_mail",
        message: "Please use a permanent email address. Disposable email addresses are not accepted.",
      },
    };
  }

  // 3. Profanity check (Obscenity)
  const blockedWords = findBlockedWords(message);
  if (blockedWords.length > 0) {
    return {
      success: false,
      error: {
        type: "profanity",
        message: "Inappropriate language detected.",
        blockedWords,
      },
    };
  }

  return { success: true, data: result.data };
}

export async function validateComment(text: string): Promise<ValidationResult<string>> {
  // Profanity check only
  const blockedWords = findBlockedWords(text);
  if (blockedWords.length > 0) {
    return {
      success: false,
      error: {
        type: "profanity",
        message: "Inappropriate language detected.",
        blockedWords,
      },
    };
  }

  return { success: true, data: text };
}
