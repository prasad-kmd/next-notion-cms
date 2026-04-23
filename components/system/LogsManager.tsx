"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, 
  History,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LogEntry } from "@/components/system/LogEntry";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

interface LogsManagerProps {
  initialLogs: any[];
  initialTotal: number;
}

export function LogsManager({ initialLogs, initialTotal }: LogsManagerProps) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>(initialLogs);
  const [total, setTotal] = useState(initialTotal);
  const [logFilter, setLogFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [limit, setLimit] = useState(50);
  
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/system/logs?limit=${limit}&service=${logFilter}&level=${levelFilter}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
      }
    } catch (error) {
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [logFilter, levelFilter, limit]);

  useEffect(() => {
    // Only fetch if filters are NOT the initial state
    if (logFilter !== 'all' || levelFilter !== 'all' || limit !== 50) {
        fetchLogs();
    }
  }, [logFilter, levelFilter, limit, fetchLogs]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/system-monitor">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-black amoriaregular tracking-tight">System Logs</h1>
            <Badge variant="outline" className="font-mono text-[10px]">{total} TOTAL</Badge>
          </div>
          <p className="text-xs font-mono text-muted-foreground ml-10">
            Historical activity and error logs for all platform services.
          </p>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLogs} 
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh Logs
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-card/30 p-4 rounded-2xl border border-border/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Filter className="w-3 h-3" />
          Filters
        </div>
        
        <Tabs value={logFilter} onValueChange={setLogFilter} className="w-auto">
          <TabsList className="bg-muted/50 border border-border/50 h-8">
            <TabsTrigger value="all" className="text-[10px] uppercase font-bold tracking-widest px-3 h-6">All Services</TabsTrigger>
            <TabsTrigger value="notion" className="text-[10px] uppercase font-bold tracking-widest px-3 h-6">Notion</TabsTrigger>
            <TabsTrigger value="supabase" className="text-[10px] uppercase font-bold tracking-widest px-3 h-6">Supabase</TabsTrigger>
            <TabsTrigger value="posthog" className="text-[10px] uppercase font-bold tracking-widest px-3 h-6">PostHog</TabsTrigger>
            <TabsTrigger value="system" className="text-[10px] uppercase font-bold tracking-widest px-3 h-6">System</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={levelFilter} onValueChange={setLevelFilter} className="w-auto">
          <TabsList className="bg-muted/50 border border-border/50 h-8">
            <TabsTrigger value="all" className="text-[10px] uppercase font-bold tracking-widest px-3 h-6">All Levels</TabsTrigger>
            <TabsTrigger value="info" className="text-[10px] uppercase font-bold tracking-widest px-3 h-6 text-blue-500">Info</TabsTrigger>
            <TabsTrigger value="warning" className="text-[10px] uppercase font-bold tracking-widest px-3 h-6 text-yellow-500">Warning</TabsTrigger>
            <TabsTrigger value="error" className="text-[10px] uppercase font-bold tracking-widest px-3 h-6 text-red-500">Error</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden shadow-sm min-h-[400px]">
        {logs.length > 0 ? (
          <div className="flex flex-col">
            {logs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Terminal className="w-12 h-12 opacity-20" />
            <p className="text-sm font-mono">No logs found matching your criteria</p>
            <Button variant="link" onClick={() => {setLogFilter('all'); setLevelFilter('all');}} className="text-primary text-xs">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>Showing {logs.length} of {total} logs</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled className="h-8 w-8 rounded-xl opacity-50"><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" disabled={total <= limit} className="h-8 w-8 rounded-xl"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}
