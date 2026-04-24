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
  initialStatus: unknown;
  initialLogs: unknown[];
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
            <h1 className="text-3xl font-black font-google-sans tracking-tight">System Monitor</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px]">ADMIN</Badge>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <StatusIndicator status={getGlobalStatus()} size="sm" />
              <span className="uppercase tracking-widest font-bold font-local-inter">
                {getGlobalStatus() === 'operational' ? 'All Systems Operational' : 
                 getGlobalStatus() === 'degraded' ? 'Partial System Degradation' : 
                 getGlobalStatus() === 'error' ? 'System Outage Detected' : 'Checking...'}
              </span>
            </div>
            <span>•</span>
            <span className='font-roboto'>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-local-inter">
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
              <h2 className="text-xl font-bold tracking-tight font-google-sans">Recent System Activity</h2>
            </div>
            
            <Tabs value={logFilter} onValueChange={setLogFilter} className="w-auto font-local-inter">
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
                <p className="text-sm font-local-jetbrains-mono">No activity logs found for the current filter</p>
              </div>
            )}
            <div className="p-4 bg-muted/20 border-t border-border/40 text-center">
              <Link href="/dashboard/system-monitor/logs" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest font-local-inter">
                View All System Logs
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight font-google-sans">Quick Actions</h2>
          </div>
          
          <div className="rounded-2xl border border-border/50 bg-card/30 p-6 space-y-4 shadow-sm">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed font-local-inter">
                Perform administrative system tasks. These actions are logged for security.
              </p>
              
              <Button 
                variant="outline" 
                className="relative w-full h-auto p-4 justify-start rounded-2xl border-border/40 bg-card/20 backdrop-blur-md hover:border-primary/40 hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] transition-all duration-300 group overflow-hidden"
                onClick={() => fetchData(true)}
                disabled={refreshing}
              >
                <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center w-full z-10">
                  <div className="flex items-center justify-center p-2.5 mr-4 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300">
                    <Activity className={`w-4 h-4 ${refreshing ? "animate-pulse" : ""}`} />
                  </div>
                  <div className="flex flex-col items-start text-left whitespace-normal">
                    <span className="text-sm font-bold font-google-sans text-foreground group-hover:text-primary transition-colors">Run Health Check</span>
                    <span className="text-[10px] text-muted-foreground font-local-inter uppercase tracking-widest mt-0.5 leading-tight wrap-break-word">Verify all external services</span>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="relative w-full h-auto p-4 justify-start rounded-2xl border-border/40 bg-card/20 backdrop-blur-md hover:border-yellow-500/40 hover:bg-yellow-500/5 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] transition-all duration-300 group overflow-hidden"
                onClick={handlePurgeCache}
                disabled={purging}
              >
                <div className="absolute inset-0 bg-linear-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center w-full z-10">
                  <div className="flex items-center justify-center p-2.5 mr-4 rounded-xl bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all duration-300">
                    <RefreshCw className={`w-4 h-4 ${purging ? "animate-spin" : ""}`} />
                  </div>
                  <div className="flex flex-col items-start text-left whitespace-normal">
                    <span className="text-sm font-bold font-google-sans text-foreground group-hover:text-yellow-600 transition-colors">Purge Notion Cache</span>
                    <span className="text-[10px] text-muted-foreground font-local-inter uppercase tracking-widest mt-0.5 leading-tight wrap-break-word">Force refresh content from API</span>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="relative w-full h-auto p-4 justify-start rounded-2xl border-border/40 bg-card/20 backdrop-blur-md hover:border-red-500/40 hover:bg-red-500/5 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all duration-300 group overflow-hidden"
                onClick={handleCleanupLogs}
                disabled={cleaning}
              >
                <div className="absolute inset-0 bg-linear-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center w-full z-10">
                  <div className="flex items-center justify-center p-2.5 mr-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300">
                    <Trash2 className={`w-4 h-4 ${cleaning ? "animate-pulse" : ""}`} />
                  </div>
                  <div className="flex flex-col items-start text-left whitespace-normal">
                    <span className="text-sm font-bold font-google-sans text-foreground group-hover:text-red-500 transition-colors">Cleanup Old Logs</span>
                    <span className="text-[10px] text-muted-foreground font-local-inter uppercase tracking-widest mt-0.5 leading-tight wrap-break-word">Remove logs older than 7 days</span>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
