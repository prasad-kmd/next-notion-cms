import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { env } from "./env";

/**
 * Custom Error for Notion API related failures.
 */
export class NotionAPIError extends Error {
  constructor(message: string, public statusCode?: number, public originalError?: any) {
    super(message);
    this.name = 'NotionAPIError';
  }
}

// Initialize Notion client
export const notion = new Client({
  auth: env.NOTION_AUTH_TOKEN,
});

// Initialize Notion to Markdown converter
export const n2m = new NotionToMarkdown({ notionClient: notion });

/** Helper to fetch OpenGraph metadata for Web Bookmarks */
async function fetchOpengraphMetadata(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const html = await res.text();
    const titleMatch =
      html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
      html.match(/<meta property="og:title" content="([^"]+)"/i);
    const descMatch =
      html.match(/<meta name="description" content="([^"]+)"/i) ||
      html.match(/<meta property="og:description" content="([^"]+)"/i);
    const imageMatch = html.match(
      /<meta property="og:image" content="([^"]+)"/i,
    );

    return {
      title: titleMatch ? titleMatch[1] : url,
      description: descMatch ? descMatch[1] : "",
      image: imageMatch ? imageMatch[1] : "",
      url,
    };
  } catch (e) {
    return { title: url, description: "", image: "", url };
  }
}

// Transform Bookmark to a sophisticated card
n2m.setCustomTransformer("bookmark", async (block) => {
  const { bookmark } = block as any;
  const url = bookmark.url;
  const og = await fetchOpengraphMetadata(url);

  return `
<div class="notion-bookmark my-6 border border-border/60 bg-gradient-to-br from-card to-background rounded-[1.5rem] overflow-hidden hover:border-primary/50 transition-all shadow-sm group">
  <a href="${url}" target="_blank" rel="noopener noreferrer" class="flex flex-col sm:flex-row h-full no-underline">
    <div class="flex flex-col p-5 sm:p-6 sm:w-2/3 max-w-full justify-between">
      <div class="mb-4">
        <h4 class="text-sm sm:text-base font-black amoriaregular text-foreground tracking-wide leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          ${og.title}
        </h4>
        <p class="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 font-light leading-relaxed google-sans">
          ${og.description}
        </p>
      </div>
      <div class="flex items-center gap-2 text-[10px] sm:text-xs">
        <img src="https://www.google.com/s2/favicons?domain=${new URL(url).hostname}" alt="favicon" class="w-4 h-4 rounded-sm grayscale group-hover:grayscale-0 transition-all opacity-70" />
        <span class="text-muted-foreground/60 truncate max-w-[200px] hover:text-muted-foreground transition-colors">${url}</span>
      </div>
    </div>
    ${
      og.image
        ? `
    <div class="w-full h-32 sm:h-auto sm:w-1/3 relative border-t sm:border-t-0 sm:border-l border-border/40 overflow-hidden bg-muted/20">
      <img src="${og.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Bookmark thumbnail" />
    </div>
    `
        : ""
    }
  </a>
</div>`;
});

// Transform File blocks
n2m.setCustomTransformer("file", async (block) => {
  const { file } = block as any;
  const url = file.type === "external" ? file.external.url : file.file.url;
  const name = file.name || "Download File";
  const sizeText = file.type === "file" ? "" : "External Link";

  return `
<div class="notion-file my-6 inline-flex p-4 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all group lg:min-w-[400px]">
  <a href="${url}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 no-underline w-full">
    <div class="h-12 w-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 group-hover:text-primary transition-colors shadow-sm">
      <svg class="w-5 h-5 text-muted-foreground/50 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
    </div>
    <div class="overflow-hidden flex-1">
      <div class="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">${name}</div>
      <div class="text-[10px] tracking-widest uppercase font-black text-muted-foreground/50 mt-1">${sizeText || "Attachment"}</div>
    </div>
  </a>
</div>`;
});

// Transform Embeds (GitHub Gists etc.)
n2m.setCustomTransformer("embed", async (block) => {
  const { embed } = block as any;
  const url = embed.url;

  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "gist.github.com") {
      return `
      <div class="gist-wrapper my-8 relative rounded-2xl overflow-hidden border border-border/40 shadow-sm">
        <script src="${url}.js"></script>
      </div>`;
    }
  } catch {
    // Invalid URL, fall through to default embed
  }

  return `
<div class="notion-embed my-8 aspect-video rounded-[1.5rem] overflow-hidden border border-border/50 shadow-sm relative group">
  <iframe src="${url}" class="w-full h-full bg-muted/20" allowfullscreen loading="lazy"></iframe>
  <div class="absolute inset-0 border border-border/10 rounded-[1.5rem] pointer-events-none"></div>
</div>`;
});

// Transform Tabs & Columns natively if structural
n2m.setCustomTransformer("column_list", async (block) => {
  const { id } = block as any;
  const childBlocks = await notion.blocks.children.list({ block_id: id });

  let htmlResult = `<div class="notion-column-list my-8 grid grid-cols-1 md:grid-cols-${childBlocks.results.length} gap-8 relative pb-2">`;
  for (const child of childBlocks.results) {
    const md = await n2m.pageToMarkdown((child as any).id);
    const parsedHTML = n2m.toMarkdownString(md).parent;
    htmlResult += `<div class="notion-column space-y-4">${parsedHTML}</div>`;
  }
  htmlResult += "</div>";
  return htmlResult;
});

// Transform Callouts
n2m.setCustomTransformer("callout", async (block) => {
  const { callout } = block as any;
  const text = getPlainText(callout.rich_text);
  let iconHtml = "";
  if (callout.icon) {
    if (callout.icon.type === "emoji")
      iconHtml = `<span class="text-xl">${callout.icon.emoji}</span>`;
    if (callout.icon.type === "external")
      iconHtml = `<img src="${callout.icon.external.url}" class="w-6 h-6 object-contain" />`;
    if (callout.icon.type === "file")
      iconHtml = `<img src="${callout.icon.file.url}" class="w-6 h-6 object-contain" />`;
  }
  return `<div class="notion-callout my-6 p-5 rounded-[1.5rem] bg-muted/20 hover:bg-muted/30 border border-border/50 flex gap-4 items-start shadow-sm transition-colors">
    <div class="shrink-0 mt-0.5">${iconHtml}</div>
    <div class="text-foreground/90 leading-relaxed text-sm md:text-base prose-direct">${text}</div>
  </div>`;
});

// Transform Tabs (if using Notion's official tabs)
n2m.setCustomTransformer("tabs", async (block) => {
  const { id } = block as any;
  const childBlocks = await notion.blocks.children.list({ block_id: id });
  let htmlResult = `<div class="notion-tabs border border-border/50 rounded-[1.5rem] p-4 my-6 bg-card"><div class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border">Tabbed Focus Area</div>`;
  for (const child of childBlocks.results) {
    const md = await n2m.pageToMarkdown((child as any).id);
    const parsedHTML = n2m.toMarkdownString(md).parent;
    htmlResult += `<div class="notion-tab-content my-4">${parsedHTML}</div>`;
  }
  htmlResult += `</div>`;
  return htmlResult;
});

export const DATABASE_IDS = {
  blog: env.NOTION_BLOG_ID,
  articles: env.NOTION_ARTICLES_ID,
  projects: env.NOTION_PROJECTS_ID,
  tutorials: env.NOTION_TUTORIALS_ID,
  wiki: env.NOTION_WIKI_ID,
  authors: env.NOTION_AUTHORS_ID,
};

export const isNotionEnabled = !!(env.NOTION_AUTH_TOKEN && DATABASE_IDS.blog);

/**
 * Performs a global search across Notion.
 */
export async function searchNotion(query: string) {
  if (!isNotionEnabled) return [];
  try {
    const response = await notion.search({
      query,
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
      page_size: 20,
    });
    return response.results;
  } catch (error) {
    console.error("Notion search error:", error);
    return [];
  }
}

/**
 * Extracts plain text from a Notion rich_text or title property.
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
 * Extracts a date string from a Notion date property.
 */
export function getDate(property: any): string | undefined {
  if (!property || property.type !== "date" || !property.date) return undefined;
  return property.date.start;
}

/**
 * Extracts values from a Notion multi_select property.
 */
export function getMultiSelect(property: any): string[] {
  if (!property || property.type !== "multi_select") return [];
  return property.multi_select.map((item: any) => item.name);
}

/**
 * Extracts a value from a Notion select property.
 */
export function getSelect(property: any): string | undefined {
  if (!property || property.type !== "select" || !property.select) return undefined;
  return property.select.name;
}

/**
 * Extracts a boolean from a Notion checkbox property.
 */
export function getCheckbox(property: any): boolean {
  if (!property || property.type !== "checkbox") return false;
  return property.checkbox || false;
}

/**
 * Extracts an image URL from a Notion file or external image property.
 */
export function getImageUrl(property: any): string | undefined {
  if (
    !property ||
    property.type !== "files" ||
    !property.files ||
    property.files.length === 0
  ) {
    return undefined;
  }
  const file = property.files[0];
  if (file.type === "external") return file.external.url;
  if (file.type === "file") return file.file.url;
  return undefined;
}

// Notion types for better type safety
export interface NotionPage {
  id: string;
  properties: Record<string, any>;
}

export interface NotionTitleProperty {
  type: 'title';
  title: Array<{ plain_text: string }>;
}

export interface NotionRichTextProperty {
  type: 'rich_text';
  rich_text: Array<{ plain_text: string }>;
}
