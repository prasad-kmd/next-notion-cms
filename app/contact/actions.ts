"use server";

import { validateContactForm } from "@/lib/validation/validate";

// Simple in-memory rate limiting (Note: This will reset on server restart/re-deploy)
// For a more robust solution, use Redis or a similar store.
const rateLimitMap = new Map<string, number[]>();
const LIMIT = 3; // 3 requests
const WINDOW = 60 * 1000; // per 1 minute

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) || [];
  const recentTimestamps = timestamps.filter((ts) => now - ts < WINDOW);

  if (recentTimestamps.length >= LIMIT) {
    return true;
  }

  recentTimestamps.push(now);
  rateLimitMap.set(identifier, recentTimestamps);
  return false;
}

export async function submitContactForm(
  prevState: unknown,
  formData: FormData,
) {
  // We don't have easy access to IP in Server Actions without headers()
  // But we can use email as a simple identifier for rate limiting
  const emailInput = formData.get("email") as string;
  const turnstileToken = formData.get("cf-turnstile-response") as string;

  if (emailInput && isRateLimited(emailInput)) {
    return {
      success: false,
      message: "Too many requests. Please try again later.",
      validationError: {
        type: "rate_limit",
        message: "Too many requests. Please try again later.",
      },
    };
  }

  const validationResult = await validateContactForm(
    {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    },
    turnstileToken,
  );

  if (!validationResult.success) {
    return {
      success: false,
      message: validationResult.error.message,
      errors: validationResult.error.errors, // For Zod field errors
      validationError: validationResult.error, // Unified error object
      formData: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
      },
    };
  }

  const { name, email: validatedEmail, phone, message } = validationResult.data;

  try {
    const telegramToken = process.env.TELEGRAM_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramToken || !telegramChatId) {
      console.error("Telegram configuration is missing");
      return {
        success: false,
        message: "Server configuration error. Please contact me directly.",
      };
    }

    const caption = `
<b>New Contact Form Submission</b>
<b>Name:</b> ${name}
<b>Email:</b> ${validatedEmail}
<b>Phone:</b> ${phone || "N/A"}
<b>Message:</b>
${message}
    `.trim();

    const file = formData.get("file") as File | null;
    let response;

    if (file && file.size > 0) {
      if (file.size > 20 * 1024 * 1024) {
        return { success: false, message: "File is too large (max 20MB)" };
      }

      const tgFormData = new FormData();
      tgFormData.append("chat_id", telegramChatId);
      tgFormData.append("document", file);
      tgFormData.append("caption", caption);
      tgFormData.append("parse_mode", "HTML");

      response = await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendDocument`,
        {
          method: "POST",
          body: tgFormData,
        },
      );
    } else {
      response = await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: caption,
            parse_mode: "HTML",
          }),
        },
      );
    }

    const result = await response.json();

    if (result.ok) {
      return {
        success: true,
        message: `Hey ${name}, your message has been sent!`,
      };
    } else {
      console.error("Telegram API error:", result);
      return {
        success: false,
        message: "Failed to send message via Telegram.",
      };
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
