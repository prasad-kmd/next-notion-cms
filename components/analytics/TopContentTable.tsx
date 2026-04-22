"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopContentTableProps {
  timeRange: string;
  contentType?: string;
}

export function TopContentTable({ timeRange, contentType }: TopContentTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            insightType: "top_content",
            params: { timeRange, contentType, limit: 15 },
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setData(result.result);
        }
      } catch (error) {
        console.error("Failed to fetch top content table:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, contentType]);

  if (isLoading) {
    return (
      <Card className="col-span-full border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-google-sans">Content Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-full rounded-xl bg-muted/20 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-google-sans">Content Performance Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground font-medium">
                <th className="py-3 px-4 w-[60px]">Rank</th>
                <th className="py-3 px-4">Title / Slug</th>
                <th className="py-3 px-4 hidden md:table-cell">Type</th>
                <th className="py-3 px-4 text-right">Views</th>
                <th className="py-3 px-4 w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => {
                  const type = item.type || contentType || 'unknown';
                  const href = `/${type === 'article' ? 'articles' : type === 'blog' ? 'blog' : type === 'tutorial' ? 'tutorials' : type === 'project' ? 'projects' : 'wiki'}/${item.slug}`;
                  
                  return (
                    <tr key={item.slug} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                      <td className="py-4 px-4 font-medium text-muted-foreground">
                        #{index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm truncate max-w-[200px] lg:max-w-[400px]">
                            {item.title}
                          </span>
                          <span className="font-local-jetbrains-mono text-[10px] text-muted-foreground truncate max-w-[200px] lg:max-w-[400px]">
                            {item.slug}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold">
                          {type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">
                        {item.views.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={href}
                          target="_blank"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          title="View Page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No data available for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
