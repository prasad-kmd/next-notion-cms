import { z } from "zod";
import { ValidationResult } from "@/types/validation";
import { isDisposableEmail } from "./email";
import { findBlockedWords } from "./profanity";
import { env } from "@/lib/env";

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

export async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey =
    env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

  try {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
      },
    );

    const verifyData = await verifyRes.json();
    return !!verifyData.success;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

export async function validateContactForm(
  data: unknown,
  turnstileToken: string | null,
): Promise<ValidationResult<z.infer<typeof contactSchema>>> {
  // 1. Turnstile verification
  if (!turnstileToken) {
    return {
      success: false,
      error: {
        type: "turnstile",
        message: "Security verification missing",
      },
    };
  }

  const isTurnstileValid = await verifyTurnstile(turnstileToken);
  if (!isTurnstileValid) {
    return {
      success: false,
      error: {
        type: "turnstile",
        message: "Security verification failed",
      },
    };
  }

  // 2. Zod validation
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

  // 3. Email check (Fakeout)
  const isDisposable = await isDisposableEmail(email);
  if (isDisposable) {
    return {
      success: false,
      error: {
        type: "temp_mail",
        message:
          "Please use a permanent email address. Disposable email addresses are not accepted.",
      },
    };
  }

  // 4. Profanity check (Obscenity)
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

export async function validateComment(
  text: string,
): Promise<ValidationResult<string>> {
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
