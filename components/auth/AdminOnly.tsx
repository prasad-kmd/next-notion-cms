"use client";

import React from "react";
import { useIsAdmin } from "@/lib/auth-utils";

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client component that conditionally renders children based on admin role
 */
export const AdminOnly: React.FC<AdminOnlyProps> = ({
  children,
  fallback = null,
}) => {
  const { isAdmin, isPending } = useIsAdmin();

  if (isPending) {
    return null; // Or a small loading spinner if preferred
  }

  if (!isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AdminOnly;
