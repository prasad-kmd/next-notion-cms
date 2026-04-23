import React from 'react';
import { requireAdmin } from "@/lib/auth-utils";
import { LogsManager } from "@/components/system/LogsManager";
import { db } from "@/lib/db";
import { systemLogs } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TechnicalBackground } from "@/components/technical-background";

export default async function SystemLogsPage() {
  await requireAdmin();

  const [logs, totalResult] = await Promise.all([
    db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(50),
    db.select({ count: sql<number>`count(*)` }).from(systemLogs)
  ]);

  const total = Number(totalResult[0]?.count || 0);

  return (
    <div className="relative min-h-screen">
      <TechnicalBackground />
      <Container className="pt-12 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <Breadcrumbs 
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "System Monitor", href: "/dashboard/system-monitor" },
              { label: "Logs", href: "/dashboard/system-monitor/logs", active: true }
            ]} 
            className="mb-4 font-local-inter"
          />
          
          <LogsManager 
            initialLogs={logs} 
            initialTotal={total} 
          />
        </div>
      </Container>
    </div>
  );
}
