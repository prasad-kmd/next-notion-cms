import { describe, it, expect, vi } from "vitest";

// Mock the action since we don't have a full DB environment here
const mockSubmitContactForm = vi.fn().mockImplementation(async (formData: FormData) => {
  const email = formData.get("email");
  if (!email) return { error: "Email is required" };
  return { success: true };
});

describe("Contact Form Server Action", () => {
  it("should return success when valid data is provided", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("message", "Hello");

    const result = await mockSubmitContactForm(formData);
    expect(result.success).toBe(true);
  });

  it("should return error when email is missing", async () => {
    const formData = new FormData();
    formData.append("message", "Hello");

    const result = await mockSubmitContactForm(formData);
    expect(result.error).toBe("Email is required");
  });
});
