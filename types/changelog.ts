export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: string[];
  type: "feature" | "fix" | "improvement" | "start" | "Start";
  automated?: boolean; // Flag to indicate if entry was auto-generated
}

export interface CommitData {
  sha: string;
  date: string;
  author: string;
  message: string;
  body: string;
}
