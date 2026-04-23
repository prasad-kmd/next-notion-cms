"use client";

import { useState } from "react";
import { SummaryMetrics } from "./SummaryMetrics";
import { PageViewsAreaChart } from "./PageViewsAreaChart";
import { TrafficSourcesChart } from "./TrafficSourcesChart";
import { BreakdownChart } from "./BreakdownChart";
import { CountryBreakdownChart } from "./CountryBreakdownChart";
import { CountryTrendChart } from "./CountryTrendChart";
import { OutgoingLinksChart } from "./OutgoingLinksChart";
import { OutgoingLinksTrendChart } from "./OutgoingLinksTrendChart";
import { OutgoingLinksTable } from "./OutgoingLinksTable";
import { StackedAreaChart } from "./StackedAreaChart";
import { MatrixChart } from "./MatrixChart";
import { TopContentTable } from "./TopContentTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Globe, MousePointer2, Smartphone, Monitor, Layout } from "lucide-react";

export function AnalyticsDashboardManager() {
  const [timeRange, setTimeRange] = useState("-30d");

  return (
    <div className="space-y-8">
      {/* Global Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card/5 border border-border/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold google-sans">Analytics Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground font-local-inter">Time Period:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] rounded-xl border-border/50 bg-background/50">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-7d">Last 7 days</SelectItem>
              <SelectItem value="-30d">Last 30 days</SelectItem>
              <SelectItem value="-90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <SummaryMetrics timeRange={timeRange} />

      {/* Primary Trend Chart */}
      <div className="grid grid-cols-1 gap-8">
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Traffic Overview</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Daily pageviews across all content</p>
                </div>
            </div>
            <PageViewsAreaChart timeRange={timeRange} />
        </div>
      </div>

      {/* Content Breakdown Trend */}
      <div className="grid grid-cols-1 gap-8">
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                    <Layout className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Content Type Distribution</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Traffic trends broken down by category</p>
                </div>
            </div>
            <StackedAreaChart 
                timeRange={timeRange} 
                breakdownBy="content_type" 
                title="Content Type" 
            />
        </div>
      </div>

      {/* Sources and Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <MousePointer2 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Traffic Sources</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Where your visitors are coming from</p>
                </div>
            </div>
            <TrafficSourcesChart timeRange={timeRange} />
        </div>
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Smartphone className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Device Breakdown</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">User access methods</p>
                </div>
            </div>
            <BreakdownChart 
                timeRange={timeRange} 
                insightType="device_breakdown" 
                title="Device" 
            />
        </div>
      </div>

      {/* Geo and Technical */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <Globe className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Top Countries</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Geographic distribution of traffic</p>
                </div>
            </div>
            <CountryBreakdownChart timeRange={timeRange} />
        </div>
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                    <Monitor className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Browser Distribution</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Technical environment of visitors</p>
                </div>
            </div>
            <BreakdownChart 
                timeRange={timeRange} 
                insightType="browser_breakdown" 
                title="Browser" 
            />
        </div>
      </div>

      {/* Geographic Trends */}
      <div className="grid grid-cols-1 gap-8">
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <Globe className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Country Traffic Trends</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Top 5 countries over time</p>
                </div>
            </div>
            <CountryTrendChart timeRange={timeRange} />
        </div>
      </div>

      {/* Matrix Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                    <Smartphone className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Device & Browser Matrix</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Device type usage distribution</p>
                </div>
            </div>
            <MatrixChart 
                timeRange={timeRange} 
                primaryDimension="$device_type" 
                secondaryDimension="$browser" 
                title="Device Breakdown" 
            />
        </div>
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Globe className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Country & Device Matrix</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Top countries by traffic volume</p>
                </div>
            </div>
            <MatrixChart 
                timeRange={timeRange} 
                primaryDimension="$geoip_country_name" 
                secondaryDimension="$device_type" 
                title="Country Breakdown" 
            />
        </div>
      </div>

      {/* External Interaction Trends */}
      <div className="grid grid-cols-1 gap-8">
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <MousePointer2 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Link Click Trends</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Top external domains over time</p>
                </div>
            </div>
            <OutgoingLinksTrendChart timeRange={timeRange} />
        </div>
      </div>

      {/* External Interaction Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <MousePointer2 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Top External Links</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Most clicked outbound domains</p>
                </div>
            </div>
            <OutgoingLinksChart timeRange={timeRange} />
        </div>
        <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <MousePointer2 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold google-sans">Link Click Details</h3>
                    <p className="text-xs text-muted-foreground font-local-inter">Recent external navigations</p>
                </div>
            </div>
            <OutgoingLinksTable timeRange={timeRange} />
        </div>
      </div>

      {/* Detailed Content Table */}
      <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
        <h3 className="text-lg font-bold google-sans mb-8">Top Content Performance</h3>
        <TopContentTable timeRange={timeRange} />
      </div>
    </div>
  );
}
