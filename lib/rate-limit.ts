export interface RateLimitConfig {
  limit: number;
  window: number;
}

const rateLimitMap = new Map<string, number[]>();

export function isRateLimited(
  identifier: string,
  config: RateLimitConfig,
): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) || [];
  const recentTimestamps = timestamps.filter((ts) => now - ts < config.window);

  if (recentTimestamps.length >= config.limit) {
    return true;
  }

  recentTimestamps.push(now);
  rateLimitMap.set(identifier, recentTimestamps);
  return false;
}
