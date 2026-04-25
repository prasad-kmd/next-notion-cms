/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React from 'react';
import { StatusIndicator } from "@/components/system/StatusIndicator";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Database, 
  FileText, 
  MessageSquare, 
  Globe,
  ArrowRight,
  Mail
} from "lucide-react";
import Link from "next/link";

// Server component with revalidation
export const revalidate = 3600;

import { checkNotionHealth, checkSupabaseHealth } from "@/lib/system-monitor/health-checks";
import { getPublicOverallStatus, getPublicServices } from "@/lib/system-monitor/public-status";

async function getStatusData() {
  try {
    // During build or if API is unreachable, use direct health checks
    const [notion, supabase] = await Promise.all([
        checkNotionHealth().catch(() => ({ status: 'error' as const })),
        checkSupabaseHealth().catch(() => ({ status: 'error' as const }))
    ]);
    
    return {
        overall_status: getPublicOverallStatus(notion.status, supabase.status),
        services: getPublicServices(notion.status, supabase.status),
        last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching status for page:', error);
    return {
      overall_status: 'major_outage',
      services: [
        { name: 'Website', status: 'operational', description: 'Main application and user interface' },
        { name: 'Content', status: 'error', description: 'Articles, Blog, Wiki, and Projects' },
        { name: 'Authentication', status: 'error', description: 'User login and account management' },
        { name: 'Comments', status: 'error', description: 'Native commenting system' }
      ],
      last_updated: new Date().toISOString()
    };
  }
}

export default async function PublicStatusPage() {
  const data = await getStatusData();
  
  const statusConfig = {
    operational: {
      label: 'All Systems Operational',
      color: 'bg-green-500',
      text: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    partial_outage: {
      label: 'Partial System Outage',
      color: 'bg-yellow-500',
      text: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
    },
    major_outage: {
      label: 'Major System Outage',
      color: 'bg-red-500',
      text: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    }
  };

  const currentStatus = statusConfig[data.overall_status as keyof typeof statusConfig] || statusConfig.major_outage;

  const serviceIcons = {
    'Website': <Globe className="w-5 h-5" />,
    'Content': <FileText className="w-5 h-5" />,
    'Authentication': <ShieldCheck className="w-5 h-5" />,
    'Comments': <MessageSquare className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-20 px-4">
      <div className="max-w-3xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="group flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black amoriaregular text-xl shadow-lg group-hover:scale-105 transition-transform">
              PM
            </div>
            <span className="text-xl font-black amoriaregular tracking-tighter">PMEngineerLK</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black amoriaregular tracking-tight">System Status</h1>
          <p className="text-muted-foreground font-medium max-w-md">
            Real-time status updates for our engineering platform services and infrastructure.
          </p>
        </div>

        {/* Overall Status Badge */}
        <div className={`w-full rounded-[2rem] border-2 ${currentStatus.border} ${currentStatus.bg} p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-sm relative overflow-hidden`}>
           <div className="absolute top-0 left-0 w-full h-1 opacity-20 bg-gradient-to-r from-transparent via-current to-transparent" />
           
           <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-full ${currentStatus.color} flex items-center justify-center shadow-[0_0_20px_rgba(var(--status-color),0.4)] relative`}>
                <div className={`absolute inset-0 rounded-full ${currentStatus.color} animate-ping opacity-20`} />
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className={`text-2xl md:text-3xl font-black amoriaregular tracking-tight ${currentStatus.text}`}>
                  {currentStatus.label}
                </h2>
                <p className="text-sm font-mono text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                  Last Updated: {new Date(data.last_updated).toLocaleString()}
                </p>
              </div>
           </div>
           
           <Badge variant="outline" className={`${currentStatus.border} ${currentStatus.text} px-4 py-1.5 rounded-full font-mono text-xs font-black`}>
             REFRESHES EVERY HOUR
           </Badge>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.services.map((service: any) => (
            <div key={service.name} className="group rounded-[1.5rem] border border-border/50 bg-card/40 p-6 flex flex-col gap-4 hover:border-primary/30 transition-all hover:shadow-md backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-muted/50 text-muted-foreground group-hover:text-primary transition-colors border border-border/40">
                  {serviceIcons[service.name as keyof typeof serviceIcons] || <Database className="w-5 h-5" />}
                </div>
                <StatusIndicator status={service.status} withLabel size="md" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold tracking-tight text-foreground">{service.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-border/40">
          <div className="flex items-center gap-4">
             <Link href="/contact" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
               <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
               Report an Issue
             </Link>
             <span className="text-muted-foreground/30">|</span>
             <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
               Return Home
               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest font-black">
            Powered by PM Platform Engineering
          </div>
        </div>
      </div>
    </div>
  );
}
