"use client";

import { useEffect, useState } from "react";
// import { ANALYTICS_COLORS, getRechartsTheme } from "@/lib/recharts-theme";
// import { useTheme } from "next-themes";
import { ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface OutgoingLinksTableProps {
  timeRange: string;
}

export function OutgoingLinksTable({ timeRange }: OutgoingLinksTableProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            insightType: "outgoing_links",
            params: { timeRange, limit: 50 }
          }),
        });
        if (response.ok) {
          const json = await response.json();
          setData(json.result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange]);

  const filteredData = data.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-64 flex items-center justify-center animate-pulse bg-muted/10 rounded-3xl">Loading links...</div>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Filter domains..." 
          className="pl-10 rounded-xl border-border/40 bg-background/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/5 backdrop-blur-md">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-muted/20 font-bold google-sans">
              <th className="px-6 py-4">Domain</th>
              <th className="px-6 py-4 text-right">Clicks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    {item.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-primary font-bold">
                    {item.value}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground italic">
                  No links found for this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
