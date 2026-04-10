import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const NOTION_AUTH_TOKEN = process.env.NOTION_AUTH_TOKEN;

export const notion = new Client({
  auth: NOTION_AUTH_TOKEN,
});

export const n2m = new NotionToMarkdown({ notionClient: notion });

// Map content types to their database IDs
export const DATABASE_IDS = {
  blog: process.env.NOTION_BLOG_ID,
  articles: process.env.NOTION_ARTICLES_ID,
  projects: process.env.NOTION_PROJECTS_ID,
  tutorials: process.env.NOTION_TUTORIALS_ID,
  wiki: process.env.NOTION_WIKI_ID,
  authors: process.env.NOTION_AUTHORS_ID,
};

export const isNotionEnabled = !!(NOTION_AUTH_TOKEN && DATABASE_IDS.blog);

/**
 * Extracts plain text from a Notion property
 */
export function getPlainText(property: any): string {
  if (!property) return "";
  if (property.type === "title") {
    return property.title.map((t: any) => t.plain_text).join("");
  }
  if (property.type === "rich_text") {
    return property.rich_text.map((t: any) => t.plain_text).join("");
  }
  return "";
}

/**
 * Extracts a date from a Notion property
 */
export function getDate(property: any): string | undefined {
  if (!property || property.type !== "date" || !property.date) return undefined;
  return property.date.start;
}

/**
 * Extracts tags/multi-select values from a Notion property
 */
export function getMultiSelect(property: any): string[] {
  if (!property || property.type !== "multi_select") return [];
  return property.multi_select.map((item: any) => item.name);
}

/**
 * Extracts a select value from a Notion property
 */
export function getSelect(property: any): string | undefined {
  if (!property || property.type !== "select" || !property.select) return undefined;
  return property.select.name;
}

/**
 * Extracts a checkbox value from a Notion property
 */
export function getCheckbox(property: any): boolean {
  if (!property || property.type !== "checkbox") return false;
  return property.checkbox;
}

/**
 * Extracts an image URL from Notion Files property
 */
export function getImageUrl(property: any): string | undefined {
  if (!property || property.type !== "files" || !property.files || property.files.length === 0) {
    return undefined;
  }
  const file = property.files[0];
  if (file.type === "external") return file.external.url;
  if (file.type === "file") return file.file.url;
  return undefined;
}
