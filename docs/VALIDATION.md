# Validation System

This document describes the validation system used for forms and user-submitted content in the Engineering Workspace.

## Overview

The validation system uses a multi-layered approach to ensure data integrity, security, and a positive user experience. It combines Zod for schema validation, Cloudflare Turnstile for bot protection, and automated tools for spam and profanity detection.

## Validation Pipeline

### Contact Form
1.  **Rate Limiting**: Checks if the user (by email) has exceeded the submission limit.
2.  **Schema Validation (Zod)**: Ensures fields meet format, length, and requirement constraints.
3.  **Disposable Email Detection (Fakeout)**: Blocks temporary/burnable email domains.
4.  **Profanity Filtering (Obscenity)**: Detects inappropriate language in the message body.
5.  **Submission**: Sends the validated content to the backend (e.g., Telegram).

### Comment System
1.  **Authentication**: Requires a valid session via OAuth.
2.  **Rate Limiting**: Checks if the user has exceeded the comment limit.
3.  **Bot Protection (Cloudflare Turnstile)**: Verifies the user is human.
4.  **Profanity Filtering (Obscenity)**: Detects inappropriate language in the comment content.
5.  **Submission**: Posts the validated comment to Notion.

## Key Technologies

### Disposable Email Detection (`fakeout`)
The contact form uses the `fakeout` package to automatically detect and block disposable email addresses. This is a fail-open system: if the check fails for any reason, the email is allowed to prevent blocking legitimate users.

### Profanity Filtering (`obscenity`)
Both the contact form and the comment system use the `obscenity` package for profanity detection. 
- **Language Support**: Primarily configured for English.
- **Fail-open**: Like the email check, if the profanity filter fails, the content is allowed.
- **Visual Feedback**: When profanity is detected, the system returns the positions of the blocked words, which are then highlighted in the UI using the `HighlightedTextArea` component.

### Notifications (`sonner`)
Validation failures are communicated to the user via Sonner toast notifications.
- **Temporary Email**: "Please use a permanent email address. Disposable email addresses are not accepted."
- **Profanity**: "Your message contains {count} inappropriate word(s). Please revise and try again."

## UX Patterns

- **Form Preservation**: User input is never cleared on validation failure. The form fields retain their values so the user can easily revise them.
- **Visual Highlighting**: Blocked words are highlighted with a subtle background color in the textarea after a failed submission attempt.
- **Unified Response**: Both the server actions and API routes return a consistent error structure for validation failures.
