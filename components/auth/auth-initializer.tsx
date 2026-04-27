"use client";

import { useAuthSync } from "@/hooks/use-auth-sync";

export function AuthInitializer() {
  useAuthSync();
  return null;
}
