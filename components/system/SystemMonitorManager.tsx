"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Trash2,
  Zap,
  Activity,
  Terminal,
  History,
  LayoutDashboard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/system/ServiceCard";
import { LogEntry } from "@/components/system/LogEntry";
import { StatusIndicator } from "@/components/system/StatusIndicator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

interface SystemMonitorManagerProps {
  initialStatus: any;
  initialLogs: any[];
}

export function SystemMonitorManager({ initialStatus, initialLogs }: SystemMonitorManagerProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [purging, setPurging] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [status, setStatus] = useState<any>(initialStatus);
  const [logs, setLogs] = useState<any[]>(initialLogs);
  const [logFilter, setLogFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [statusRes, logsRes] = await Promise.all([
        fetch('/api/admin/system/all/refresh'),
        fetch(`/api/admin/system/logs?limit=15&service=${logFilter}`)
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setStatus(statusData);
        setLastUpdated(new Date());
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs);
      }
    } catch (error) {
      console.error('Failed to fetch system data:', error);
      toast.error('Failed to update system monitor');
    } finally {
      setRefreshing(false);
    }
  }, [logFilter]);

  useEffect(() => {
    // Only fetch if filter changes, initial data is already provided
    if (logFilter !== 'all') {
        fetchData();
    }
  }, [logFilter, fetchData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchData();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const handlePurgeCache = async () => {
    setPurging(true);
    try {
      const res = await fetch('/api/admin/system/notion/purge-cache', { method: 'POST' });
      if (res.ok) {
        toast.success('Notion cache purged successfully');
        fetchData();
      } else {
        toast.error('Failed to purge Notion cache');
      }
    } catch (error) {
      toast.error('Error purging cache');
    } finally {
      setPurging(false);
    }
  };

  const handleCleanupLogs = async () => {
    setCleaning(true);
    try {
      const res = await fetch('/api/admin/system/logs/cleanup', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Cleaned up ${data.deletedCount} old logs`);
        fetchData();
      } else {
        toast.error('Failed to cleanup logs');
      }
    } catch (error) {
      toast.error('Error cleaning up logs');
    } finally {
      setCleaning(false);
    }
  };

  const getGlobalStatus = () => {
    if (!status) return 'checking';
    const s = [status.notion?.status, status.supabase?.status, status.posthog?.status];
    if (s.includes('error')) return 'error';
    if (s.includes('degraded')) return 'degraded';
    return 'operational';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black amoriaregular tracking-tight">System Monitor</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px]">ADMIN</Badge>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <StatusIndicator status={getGlobalStatus()} size="sm" />
              <span className="uppercase tracking-widest font-bold">
                {getGlobalStatus() === 'operational' ? 'All Systems Operational' :
                 getGlobalStatus() === 'degraded' ? 'Partial System Degradation' :
                 getGlobalStatus() === 'error' ? 'System Outage Detected' : 'Checking...'}
              </span>
            </div>
            <span>•</span>
            <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "border-primary/50 bg-primary/5" : ""}
          >
            <Zap className={`w-4 h-4 mr-2 ${autoRefresh ? "text-primary animate-pulse" : ""}`} />
            {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          title="Notion CMS"
          description="Content delivery and database management via Notion API"
          status={status?.notion?.status || 'checking'}
          loading={refreshing}
          lastChecked={status?.timestamp}
          metrics={[
            { label: 'Latency', value: `${status?.notion?.latency_ms || 0}ms` },
            { label: 'Databases', value: status?.notion?.databases_connected || 0 },
          ]}
          actions={[
            {
              label: 'Purge Cache',
              onClick: handlePurgeCache,
              loading: purging,
              variant: 'outline'
            }
          ]}
        />

        <ServiceCard
          title="Supabase DB"
          description="Authentication, User preferences, and Comment storage"
          status={status?.supabase?.status || 'checking'}
          loading={refreshing}
          lastChecked={status?.timestamp}
          metrics={[
            { label: 'Latency', value: `${status?.supabase?.latency_ms || 0}ms` },
            { label: 'Users', value: status?.supabase?.total_users || 0 },
            { label: 'Active Conn', value: status?.supabase?.active_connections || 'N/A' },
            { label: 'DB Size', value: status?.supabase?.database_size_bytes ? `${(status.supabase.database_size_bytes / 1024 / 1024).toFixed(2)} MB` : 'N/A' },
          ]}
        />

        <ServiceCard
          title="PostHog Analytics"
          description="Product analytics and session recording service"
          status={status?.posthog?.status || 'checking'}
          loading={refreshing}
          lastChecked={status?.timestamp}
          metrics={[
            { label: 'Latency', value: `${status?.posthog?.latency_ms || 0}ms` },
            { label: 'Project', value: status?.posthog?.project_name || 'N/A' },
          ]}
        />
      </div>

      {/* Logs & Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Recent Logs */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Recent System Activity</h2>
            </div>

            <Tabs value={logFilter} onValueChange={setLogFilter} className="w-auto">
              <TabsList className="bg-muted/50 border border-border/50">
                <TabsTrigger value="all" className="text-[10px] uppercase font-bold tracking-widest px-3 h-7">All</TabsTrigger>
                <TabsTrigger value="notion" className="text-[10px] uppercase font-bold tracking-widest px-3 h-7">Notion</TabsTrigger>
                <TabsTrigger value="supabase" className="text-[10px] uppercase font-bold tracking-widest px-3 h-7">Supabase</TabsTrigger>
                <TabsTrigger value="system" className="text-[10px] uppercase font-bold tracking-widest px-3 h-7">System</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden shadow-sm">
            {logs.length > 0 ? (
              <div className="flex flex-col">
                {logs.map((log) => (
                  <LogEntry key={log.id} log={log} />
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Terminal className="w-8 h-8 opacity-20" />
                <p className="text-sm font-mono">No activity logs found for the current filter</p>
              </div>
            )}
            <div className="p-4 bg-muted/20 border-t border-border/40 text-center">
              <Link href="/dashboard/system-monitor/logs" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                View All System Logs
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Quick Actions</h2>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/30 p-6 space-y-4 shadow-sm">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Perform administrative system tasks. These actions are logged for security.
              </p>

              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-border/60 hover:bg-primary/5 hover:text-primary transition-all group"
                onClick={() => fetchData(true)}
                disabled={refreshing}
              >
                <Activity className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold">Run Health Check</span>
                  <span className="text-[10px] text-muted-foreground">Verify all external services</span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-border/60 hover:bg-yellow-500/5 hover:text-yellow-600 transition-all group"
                onClick={handlePurgeCache}
                disabled={purging}
              >
                <RefreshCw className={`w-4 h-4 mr-3 text-muted-foreground group-hover:text-yellow-500 transition-colors ${purging ? "animate-spin" : ""}`} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold">Purge Notion Cache</span>
                  <span className="text-[10px] text-muted-foreground">Force refresh content from API</span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-border/60 hover:bg-red-500/5 hover:text-red-600 transition-all group"
                onClick={handleCleanupLogs}
                disabled={cleaning}
              >
                <Trash2 className={`w-4 h-4 mr-3 text-muted-foreground group-hover:text-red-500 transition-colors ${cleaning ? "animate-pulse" : ""}`} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold">Cleanup Old Logs</span>
                  <span className="text-[10px] text-muted-foreground">Remove logs older than 7 days</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
