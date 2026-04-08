import React from "react";
import type { Metadata } from "next";
import { GitCommit, Tag, ArrowRight } from "lucide-react";
import { promises as fs } from "fs";
import path from "path";
import type { ChangelogEntry } from "@/types/changelog";

const title = "Changelog";
const description = "A timeline of updates and improvements to this website.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/changelog",
  },
};

// Fallback manual entries (will be merged with automated ones)
const manualUpdates: ChangelogEntry[] = [
  {
    version: "0.0", // Will be recalculated
    date: "March 03, 2026",
    title: "Add workflow to generate and commit changelog",
    description: "",
    changes: [
      "Add workflow to generate and commit changelog - This workflow generates a changelog in JSON format from git commit history and commits it to the repository if there are changes.",
      "Add GitHub Actions workflow to generate changelog - This workflow generates a changelog in JSON format from git commit history, processes it, and commits the changes if there are updates.",
    ],
    type: "improvement",
  },
  {
    version: "0.0", // Will be recalculated
    date: "November 06, 2025",
    title: "Merge pull request #3 from prasad-kmd/pwa-sidebar-updates",
    description: "",
    changes: [
      "Merge pull request #3 from prasad-kmd/pwa-sidebar-updates - Pwa sidebar updates",
      'Align sidebar buttons and refactor navigation - - Refactors the sidebar navigation to visually align the "Share" and "Notifications" buttons with the other navigation items.',
      "Update sidebar share and notification functionality - - Removes the dedicated `/share` and `/notifications` pages.",
      "Merge pull request #2 from prasad-kmd/pwa-implementation - Pwa implementation",
    ],
    type: "improvement",
  },
  {
    version: "0.0", // Will be recalculated
    date: "October 11, 2025",
    title: "Address PWA warnings and update UI",
    description: "",
    changes: [
      "Address PWA warnings and update UI - - Moved `themeColor` from `metadata` to `viewport` export in `app/layout.tsx` to resolve build warnings.",
      "Implement PWA features - This change turns the web application into a Progressive Web App (PWA).",
    ],
    type: "feature",
  },
  {
    version: "0.0", // Will be recalculated
    date: "October 10, 2025",
    title: "Add waste management project ideas and workflows for Sri Lanka",
    description: "",
    changes: [
      "Add waste management project ideas and workflows for Sri Lanka - - Created new HTML files for three project ideas focused on waste management and circular economy:",
      "Merge pull request #1 from prasad-kmd/fix/dynamic-metadata-generation - feat: Add dynamic metadata for diary and idea entries",
      "Add dynamic metadata for diary and idea entries - This commit introduces dynamic metadata generation for individual diary and idea pages.",
    ],
    type: "feature",
  },
  {
    version: "0.0", // Will be recalculated
    date: "October 09, 2025",
    title:
      "Update font paths for local fonts and apply 'mozilla-headline' class to project title",
    description: "",
    changes: [
      "Update font paths for local fonts and apply 'mozilla-headline' class to project title",
      "Add ESLint configuration for Next.js with TypeScript support",
      "Refactor code structure for improved readability and maintainability",
      "Enhance content handling by adding firstImage extraction for improved visual representation; streamline description formatting across multiple pages.",
    ],
    type: "fix",
  },
  {
    version: "0.0", // Will be recalculated
    date: "October 07, 2025",
    title:
      "Update OG image links and enhance content across multiple files; remove unused welcome2.md",
    description: "",
    changes: [
      "Update OG image links and enhance content across multiple files; remove unused welcome2.md",
      "Add SpeedInsights component and update package dependencies",
      "Refactor code structure for improved readability and maintainability",
      "Refactor scrollbar styles for improved aesthetics; update design methodology for clarity; modify package dependencies and configurations for better compatibility.",
      "Refactor About and Contact pages to enhance layout and accessibility; add HeroSlideshow component for dynamic visuals; create sample ideas document for project brainstorming.",
      "Add placeholder images in various formats - - Added a PNG placeholder logo image.",
      "Refactor diary, ideas, posts, and workflow pages to highlight the first entry with a distinct border color and improve content structure",
      "Enhance documentation and layout: - Update README.md for improved code block formatting. - Add About and Contact pages with team information and contact details. - Update navigation to include About and Contact links. - Modify layout metadata and icons for better project representation.",
      "Add introductory post for Engineering Project 02 - - Created a new markdown file for the project overview",
      "Update dependencies and improve font imports in layout",
      "Initialized repository for project Engineering project webapp - Co-authored-by: PRASAD MADHURANGA <102537177+prasad-kmd@users.noreply.github.com>",
    ],
    type: "start",
  },
];

async function getChangelogData(): Promise<ChangelogEntry[]> {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "changelog.json",
    );
    const fileContents = await fs.readFile(filePath, "utf8");
    const automatedEntries: ChangelogEntry[] = JSON.parse(fileContents);

    // Combine all entries
    const allEntries = [...automatedEntries, ...manualUpdates];

    // Deduplicate by date and title (since titles are quite specific)
    const uniqueEntries = allEntries.filter(
      (entry, index, self) =>
        index ===
        self.findIndex((e) => e.date === entry.date && e.title === entry.title),
    );

    // Sort chronologically (oldest first) to assign versions
    const chronSorted = uniqueEntries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    // Assign versions dynamically (0.1, 0.2, etc.)
    const versionedEntries = chronSorted.map((entry, idx) => ({
      ...entry,
      version: ((idx + 1) * 0.1).toFixed(1),
    }));

    // Return reversed (newest first) for display
    return versionedEntries.reverse();
  } catch (error) {
    console.error("Error reading changelog:", error);
    // Fallback to manual entries if JSON file doesn't exist, also versioned
    return manualUpdates
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((entry, idx) => ({
        ...entry,
        version: ((idx + 1) * 0.1).toFixed(1),
      }))
      .reverse();
  }
}

export default async function ChangelogPage() {
  const updates = await getChangelogData();

  return (
    <div className="min-h-screen pb-20 px-6 lg:px-8 pt-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 amoriaregular">
            Changelog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Following the evolution of this platform as it grows into a
            comprehensive engineering workspace.
          </p>
        </header>

        <div className="relative space-y-12 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border lg:before:left-1/2 lg:before:-ml-[1px]">
          {updates.map((update, idx) => (
            <div
              key={idx}
              className="relative flex flex-col lg:flex-row lg:justify-between lg:items-start group"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 z-10 h-9 w-9 rounded-full border-4 border-background bg-primary flex items-center justify-center lg:left-1/2 lg:-ml-[18px]">
                <GitCommit className="h-5 w-5 text-primary-foreground" />
              </div>

              <div
                className={`lg:w-[45%] ${idx % 2 === 0 ? "lg:order-1" : "lg:order-2 lg:text-right"}`}
              >
                <div className="pl-12 lg:pl-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                    <Tag className="h-3 w-3" />v{update.version}
                  </span>
                  <h3 className="text-2xl font-bold mb-1 philosopher">
                    {update.title}
                  </h3>
                  <p className="text-sm text-primary/70 font-semibold mb-4">
                    {update.date}
                  </p>
                </div>
              </div>

              <div
                className={`lg:w-[45%] mt-4 lg:mt-0 ${idx % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
              >
                <div className="pl-12 lg:pl-0">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow group-hover:shadow-md">
                    {update.description && (
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed googleSans">
                        {update.description}
                      </p>
                    )}
                    <ul className="space-y-2">
                      {update.changes.map((change, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-foreground/80"
                        >
                          <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
