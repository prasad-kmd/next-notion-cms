import { isDisposableEmail as checkDisposable } from "fakeout";

const domainCache = new Map<string, boolean>();

/**
 * Checks if the provided email domain is a known disposable/temporary email provider.
 * Uses a fail-open approach: if the check fails, it allows the email.
 */
export async function isDisposableEmail(email: string): Promise<boolean> {
  try {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;

    // Check cache
    if (domainCache.has(domain)) {
      return domainCache.get(domain)!;
    }

    const result = checkDisposable(email);
    domainCache.set(domain, result);
    return result;
  } catch (error) {
    console.error("Error checking disposable email:", error);
    return false; // Fail-open
  }
}
