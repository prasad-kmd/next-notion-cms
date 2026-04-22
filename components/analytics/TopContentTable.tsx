"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Content Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
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
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[60px]">Rank</TableHead>
              <TableHead>Title / Slug</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => {
                const type = item.type || contentType || 'unknown';
                const href = `/${type === 'article' ? 'articles' : type === 'blog' ? 'blog' : type === 'tutorial' ? 'tutorials' : type === 'project' ? 'projects' : 'wiki'}/${item.slug}`;

                return (
                  <TableRow key={item.slug} className="border-border/40">
                    <TableCell className="font-medium text-muted-foreground">
                      #{index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm truncate max-w-[200px] lg:max-w-[400px]">
                          {item.title}
                        </span>
                        <span className="font-local-jetbrains-mono text-[10px] text-muted-foreground truncate max-w-[200px] lg:max-w-[400px]">
                          {item.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold">
                        {type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.views.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={href}
                        target="_blank"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        title="View Page"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No data available for this selection.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
