"use server";

import { z } from "zod";
import fs from "fs";
import path from "path";

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

export async function submitContactForm(prevState: any, formData: FormData) {
  // We don't have easy access to IP in Server Actions without headers()
  // But we can use email as a simple identifier for rate limiting
  const email = formData.get("email") as string;

  if (email && isRateLimited(email)) {
    return {
      success: false,
      message: "Too many requests. Please try again later.",
    };
  }

  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email: validatedEmail, phone, message } = validatedFields.data;

  try {
    // Check temp mail
    const tempMailPath = path.join(process.cwd(), "public/data/tempmail.json");
    const tempMailData = JSON.parse(fs.readFileSync(tempMailPath, "utf8"));
    const domainSet = new Set(tempMailData.domains);
    const emailDomain = validatedEmail.split("@")[1]?.toLowerCase();

    if (emailDomain && domainSet.has(emailDomain)) {
      return {
        success: false,
        message:
          "Temporary email domains are not allowed. Please use a valid email address.",
      };
    }

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
      return { success: true, message: `Hey ${name}, your message has been sent!` };
    } else {
      console.error("Telegram API error:", result);
      return { success: false, message: "Failed to send message via Telegram." };
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
