export type ValidationErrorType =
  | "temp_mail"
  | "profanity"
  | "turnstile"
  | "zod"
  | "auth"
  | "rate_limit"
  | "generic";

export interface BlockedWord {
  word: string;
  startIndex: number;
  endIndex: number;
}

export interface ValidationError {
  type: ValidationErrorType;
  message: string;
  errors?: Record<string, string[]>; // For Zod errors
  blockedWords?: BlockedWord[]; // For profanity errors
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: ValidationError };
