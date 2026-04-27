export type SystemStatus = "operational" | "degraded" | "error";

export function determineStatus(
  latency: number,
  hasError: boolean,
  rateLimitPercent?: number,
): SystemStatus {
  if (hasError) return "error";

  // Rules:
  // Error if latency > 10 seconds (handled by caller or hasError)
  // Degraded if latency > 2 seconds OR rate limit > 80% used

  if (latency > 2000) return "degraded";
  if (rateLimitPercent !== undefined && rateLimitPercent > 80)
    return "degraded";

  return "operational";
}
