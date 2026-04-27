"use client";

import { siteConfig } from "@/lib/config";

interface PrintHeaderFooterProps {
  title: string;
  author?: string;
  date?: string;
}

export function PrintHeaderFooter({ title, author, date }: PrintHeaderFooterProps) {
  const authorName = author || siteConfig.author;
  const publishedDate = date
    ? new Date(date).toLocaleDateString("en-UK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <div className="print-header px-4">
        <span className="font-bold truncate max-w-[70%]">{title}</span>
        <span className="text-muted-foreground">{siteConfig.title}</span>
      </div>
      <div className="print-footer px-4">
        <span>{authorName}</span>
        <span className="page-number"></span>
        <span>{publishedDate}</span>
      </div>
    </>
  );
}
