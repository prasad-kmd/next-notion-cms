import { toast } from "sonner";

/**
 * Shows a validation error toast.
 */
export function showValidationError(message: string, description?: string, duration = 4000) {
  toast.error(message, {
    description,
    duration,
  });
}

/**
 * Shows a toast about disposable email.
 */
export function showTempMailError() {
  showValidationError(
    "Disposable email detected",
    "Please use a permanent email address. Disposable email addresses are not accepted.",
    6000
  );
}

/**
 * Shows a toast about profanity detected.
 */
export function showProfanityError(blockedWordCount: number) {
  const message = blockedWordCount === 1
    ? "Inappropriate word detected"
    : "Inappropriate language detected";

  const description = `Your message contains ${blockedWordCount} inappropriate word(s). Please revise and try again.`;

  showValidationError(message, description, 8000);
}
