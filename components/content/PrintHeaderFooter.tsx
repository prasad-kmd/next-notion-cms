"use client";

import React from "react";
import { siteConfig } from "@/lib/config";

interface PrintHeaderFooterProps {
  title: string;
  authorName?: string;
  publishDate?: string;
}

export function PrintHeaderFooter({
  title,
  authorName,
  publishDate,
}: PrintHeaderFooterProps) {
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-UK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <header className="print-header print-only" data-print-header="true">
        <div className="flex w-full justify-between items-center">
          <span className="font-bold truncate max-w-[70%]">{title}</span>
          <span className="text-xs uppercase tracking-wider">
            {siteConfig.author}&apos;s Workspace
          </span>
        </div>
      </header>

      <footer className="print-footer print-only" data-print-footer="true">
        <div className="flex w-full justify-between items-center px-4">
          <div className="text-xs">
            {authorName && <span>By {authorName}</span>}
          </div>
          <div className="text-xs flex items-center gap-4">
            <span className="page-number">Page </span>
          </div>
          <div className="text-xs">
            {formattedDate && <span>Published on {formattedDate}</span>}
          </div>
        </div>
      </footer>
    </>
  );
}
