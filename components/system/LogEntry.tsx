import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Database, Shield, Activity, Terminal } from "lucide-react";

interface LogEntryProps {
  log: {
    id: string;
    service: string;
    level: string;
    message: string;
    metadata: any;
    createdAt: string;
  };
}

export const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const levelStyles = {
    info: "text-blue-500 border-blue-500/20 bg-blue-500/5",
    warning: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5",
    error: "text-red-500 border-red-500/20 bg-red-500/5",
  };

  const serviceIcons = {
    notion: <Database className="w-3 h-3" />,
    supabase: <Shield className="w-3 h-3" />,
    posthog: <Activity className="w-3 h-3" />,
    system: <Terminal className="w-3 h-3" />,
  };

  return (
    <div className="group border-b border-border/40 last:border-0">
      <div 
        className="flex items-center gap-4 py-3 px-2 hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
          levelStyles[log.level as keyof typeof levelStyles] || levelStyles.info
        )}>
          {log.level}
        </div>
        
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground min-w-[100px]">
          {serviceIcons[log.service as keyof typeof serviceIcons]}
          <span className="capitalize">{log.service}</span>
        </div>

        <div className="flex-1 text-sm text-foreground font-medium line-clamp-1">
          {log.message}
        </div>

        <div className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
        </div>

        <div className="text-muted-foreground/40 group-hover:text-foreground">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-14 pb-4 animate-in slide-in-from-top-1 duration-200">
          <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Metadata</h4>
            <pre className="text-xs font-mono text-muted-foreground overflow-x-auto p-2 bg-background/50 rounded-lg">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
