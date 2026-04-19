import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { cache } from "react";
import {
  notion,
  n2m,
  DATABASE_IDS,
  isNotionEnabled,
  getPlainText,
  getDate,
  getMultiSelect,
  getSelect,
  getCheckbox,
  getImageUrl,
  NotionAPIError,
} from "./notion";
import { unstable_cache } from "next/cache";
import { highlightCode } from "./content/highlighter";
import {
  injectAlerts,
  injectHeadingIds,
  injectQuiz,
  sanitizeContent,
} from "./content/transformers";
import { contentConfig, notionConfig } from "./constants";

// Custom renderer to add IDs to headings for TOC
const renderer = new marked.Renderer();
renderer.heading = ({ text, depth }) => {
  const id = text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

// Custom quiz extension for marked
const quizExtension = {
  name: "quiz",
  level: "block" as const,
  tokenizer(src: string) {
    const rule = /^\[quiz\]\s*([\s\S]*?)\s*\[\/quiz\](?:\s*\n|$)/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "quiz",
        raw: match[0],
        json: match[1],
      };
    }
  },
  renderer(token: any) {
    return `[quiz]${token.json}[/quiz]`;
  },
};

marked.use({
  renderer,
  async: true,
  extensions: [quizExtension as any],
});

/**
 * Highlights code blocks in HTML using Shiki with an enhanced UI wrapper.
 */
async function highlightCodeBlocks(html: string): Promise<string> {
  try {
    const codeRegex =
      /<pre[^>]*><code(?:\s+class="language-([^"]+)")?[^>]*>([\s\S]*?)<\/code><\/pre>/g;
    const matches = Array.from(html.matchAll(codeRegex));
    if (matches.length === 0) return html;

    let result = "";
    let lastIndex = 0;

    for (const match of matches) {
      const [fullMatch, langMatch, code] = match;
      const lang = langMatch || "text";
      const matchIndex = match.index!;

      result += html.substring(lastIndex, matchIndex);

      const decodedCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      if (lang === "mermaid") {
        result += `
<div class="mermaid-preview my-12 rounded-3xl border border-border/50 bg-card p-8 shadow-sm overflow-x-auto flex justify-center items-center">
  <pre class="mermaid m-0 bg-transparent p-0">${decodedCode.trim()}</pre>
</div>`;
        lastIndex = matchIndex + fullMatch.length;
        continue;
      }

      try {
        const highlighted = await highlightCode(decodedCode.trim(), lang);

        const enhancedHtml = `
<div class="code-block-wrapper my-12 rounded-2xl overflow-hidden border border-border/40 bg-[#1e1e1e] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group/code relative transition-all duration-500 hover:shadow-[0_35px_70px_-10px_rgba(var(--primary-rgb),0.15)]">
  <div class="code-block-header flex items-center justify-between px-3 py-1 bg-[#252526] border-b border-white/5 select-none">
    <div class="flex items-center gap-5">
      <div class="flex gap-2.5">
        <div class="w-3.5 h-3.5 rounded-full bg-[#ff5f57] shadow-inner shadow-black/10 hover:brightness-110 transition-all cursor-pointer"></div>
        <div class="w-3.5 h-3.5 rounded-full bg-[#febc2e] shadow-inner shadow-black/10 hover:brightness-110 transition-all cursor-pointer"></div>
        <div class="w-3.5 h-3.5 rounded-full bg-[#28c840] shadow-inner shadow-black/10 hover:brightness-110 transition-all cursor-pointer"></div>
      </div>
      <div class="h-5 w-px bg-white/10"></div>
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 local-jetbrains-mono flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"></span>
          ${lang}
        </span>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <button class="copy-button group/copy p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300 text-white/30 hover:text-white flex items-center gap-2.5 border border-transparent hover:border-white/10 shadow-sm" 
              onclick="const codeBlock = this.closest('.code-block-wrapper'); const code = codeBlock.querySelector('code').innerText; navigator.clipboard.writeText(code); const btn = this; const originalContent = btn.innerHTML; btn.innerHTML = '<span class=\\'text-[9px] font-black uppercase tracking-widest text-green-400\\'>Copied!</span><svg class=\\'w-4 h-4 text-green-400 animate-in zoom-in-75 duration-300\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2.5\\' d=\\'M5 13l4 4L19 7\\'></path></svg>'; btn.classList.add('bg-green-400/5', 'border-green-400/20'); setTimeout(() => { btn.innerHTML = originalContent; btn.classList.remove('bg-green-400/5', 'border-green-400/20'); }, 2000);">
        <span class="text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover/copy:opacity-100 transition-all duration-300 translate-x-2 group-hover/copy:translate-x-0 hidden sm:inline">Copy Code</span>
        <svg class="w-4 h-4 transition-all duration-300 group-hover/copy:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      </button>
    </div>
  </div>
  <div class="shiki-container relative overflow-x-auto custom-scrollbar-code p-1 bg-[#1e1e1e]">
    ${highlighted}
  </div>
  <div class="absolute bottom-3 right-5 pointer-events-none opacity-20">
     <span class="text-[9px] font-black text-white uppercase tracking-[0.5em] select-none italic">Engineering Excellence</span>
  </div>
  <div class="absolute top-[52px] right-0 bottom-0 w-8 bg-linear-to-l from-[#1e1e1e] to-transparent pointer-events-none z-10 opacity-0 group-hover/code:opacity-100 transition-opacity"></div>
</div>`;
        result += enhancedHtml;
      } catch (e) {
        console.error("Shiki individual block highlight error:", e);
        result += fullMatch;
      }

      lastIndex = matchIndex + fullMatch.length;
    }

    result += html.substring(lastIndex);
    return result;
  } catch (e) {
    console.error("Shiki highlighting error:", e);
    return html;
  }
}

export interface Author {
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  bodyContent?: string;
}

export interface ContentItem {
  slug: string;
  title: string;
  date?: string;
  description?: string;
  content: string;
  rawContent: string;
  final?: boolean;
  firstImage?: string;
  readingTime?: number;
  technical?: string;
  category?: string;
  tags?: string[];
  aiAssisted?: boolean;
  author?: string;
  type?: "blog" | "articles" | "projects" | "tutorials" | "wiki" | "quizzes";
}

/**
 * Calculates estimated reading time based on word count.
 */
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / contentConfig.wordsPerMinute);
}

/**
 * Extracts the first image URL from Markdown or HTML content.
 */
function extractFirstImage(
  content: string,
  isMarkdown: boolean,
): string | undefined {
  if (isMarkdown) {
    const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
    const match = content.match(markdownImageRegex);
    if (match && match[1]) {
      return match[1];
    }
  }

  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match = content.match(htmlImageRegex);
  if (match && match[1]) {
    return match[1];
  }

  return undefined;
}

const contentDirectory = path.join(process.cwd(), "content");

/**
 * Low-level fetcher for Notion content list.
 */
async function fetchNotionContentByType(type: string): Promise<ContentItem[]> {
  const databaseId = (DATABASE_IDS as any)[type];
  if (!databaseId) return [];

  try {
    const dbObj = await notion.databases.retrieve({ database_id: databaseId });
    const dataSourceId = (dbObj as any).data_sources?.[0]?.id || databaseId;
    const response: any = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const items = await Promise.all(
      response.results.map(async (page: any) => {
        const props = page.properties;
        const slug = getPlainText(props.Slug);
        const title = getPlainText(props.Name || props.Title);
        const date = getDate(props.Date);
        const description = getPlainText(props.Description);
        const tags = getMultiSelect(props.Tags);
        const category = getSelect(props.Categories);
        const aiAssisted = getCheckbox(props.AIAssisted);
        const technical = getMultiSelect(props.Technical).join(", ");

        let authorSlug = "";
        if (
          props.Authors &&
          props.Authors.relation &&
          props.Authors.relation.length > 0
        ) {
          const authorPage: any = await notion.pages.retrieve({
            page_id: props.Authors.relation[0].id,
          });
          authorSlug = getPlainText(authorPage.properties.Slug);
        }

        return {
          slug,
          title,
          date,
          description,
          content: "",
          rawContent: "",
          final: true,
          firstImage: undefined,
          readingTime: 0,
          technical,
          category,
          tags,
          aiAssisted,
          author: authorSlug,
          type: type as any,
        };
      }),
    );

    return items;
  } catch (error) {
    console.error(`Error fetching Notion content for ${type}:`, error);
    throw new NotionAPIError(`Failed to fetch Notion content for ${type}`, 500, error);
  }
}

/**
 * Gets all content items of a specific type.
 * Uses React cache and Next.js unstable_cache for optimal performance.
 */
export const getContentByType = cache(async function (
  type: "blog" | "articles" | "projects" | "tutorials" | "wiki" | "quizzes",
): Promise<ContentItem[]> {
  if (isNotionEnabled) {
    const fetcher = unstable_cache(
      async () => fetchNotionContentByType(type),
      [`content-list-${type}`],
      { 
        revalidate: notionConfig.revalidate, 
        tags: [`content-${type}`, ...notionConfig.defaultTags] 
      },
    );
    try {
      return await fetcher();
    } catch (e) {
      console.error(`Cache fetch failed for ${type}:`, e);
      return [];
    }
  }

  const typeDirectory = path.join(contentDirectory, type);

  if (!fs.existsSync(typeDirectory)) {
    return [];
  }

  const files = fs.readdirSync(typeDirectory);

  const items = files
    .filter((file) => file.endsWith(".md") || file.endsWith(".html"))
    .map((file) => {
      const fullPath = path.join(typeDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const filenameSlug = file.replace(/\.(md|html)$/, "");
      const slug = data.slug || filenameSlug;

      const firstImage = extractFirstImage(content, file.endsWith(".md"));

      return {
        slug,
        title: data.title || slug,
        date: data.date,
        description: data.description,
        content: "",
        rawContent: content,
        final: data.final || false,
        firstImage,
        readingTime: calculateReadingTime(content),
        technical: data.technical,
        category: data.category,
        tags: data.tags,
        aiAssisted: data.aiAssisted || false,
        author: data.author,
        type: type,
      };
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  return items;
});

/**
 * Low-level fetcher for a single Notion content item.
 */
async function fetchNotionContentItem(
  type: string,
  slug: string,
): Promise<ContentItem | null> {
  const databaseId = (DATABASE_IDS as any)[type];
  if (!databaseId) return null;

  try {
    const dbObj = await notion.databases.retrieve({ database_id: databaseId });
    const dataSourceId = (dbObj as any).data_sources?.[0]?.id || databaseId;
    const response: any = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });

    if (response.results.length === 0) return null;

    const page: any = response.results[0];
    const props = page.properties;

    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks).parent;

    const title = getPlainText(props.Name || props.Title);
    const date = getDate(props.Date);
    const description = getPlainText(props.Description);
    const tags = getMultiSelect(props.Tags);
    const category = getSelect(props.Categories);
    const aiAssisted = getCheckbox(props.AIAssisted);
    const technical = getMultiSelect(props.Technical).join(", ");

    let authorSlug = "";
    if (
      props.Authors &&
      props.Authors.relation &&
      props.Authors.relation.length > 0
    ) {
      const authorPage: any = await notion.pages.retrieve({
        page_id: props.Authors.relation[0].id,
      });
      authorSlug = getPlainText(authorPage.properties.Slug);
    }

    const protectedContent = mdString.replace(
      /\$\$\s*([\s\S]*?)\s*\$\$/g,
      (match, math) => {
        return `\n\n<div class="math-display">$$${math.trim()}$$</div>\n\n`;
      },
    );

    const htmlContent = (await marked.parse(protectedContent)) as string;
    const highlightedHtml = await highlightCodeBlocks(htmlContent);
    const firstImage = extractFirstImage(mdString, true);

    return {
      slug,
      title,
      date,
      description,
      content: sanitizeContent(
        injectQuiz(injectAlerts(injectHeadingIds(highlightedHtml))),
      ),
      rawContent: mdString,
      final: true,
      firstImage,
      readingTime: calculateReadingTime(mdString),
      technical,
      category,
      tags,
      aiAssisted,
      author: authorSlug,
      type: type as any,
    };
  } catch (error) {
    console.error(`Error fetching Notion item ${slug} for ${type}:`, error);
    throw new NotionAPIError(`Failed to fetch Notion item ${slug}`, 500, error);
  }
}

/**
 * Gets a single content item by type and slug.
 */
export const getContentItem = cache(async function (
  type: "blog" | "articles" | "projects" | "tutorials" | "wiki" | "quizzes",
  slug: string,
): Promise<ContentItem | null> {
  if (isNotionEnabled) {
    const fetcher = unstable_cache(
      async () => fetchNotionContentItem(type, slug),
      [`content-item-${type}-${slug}`],
      { 
        revalidate: notionConfig.revalidate, 
        tags: [`content-${type}`, `content-item-${slug}`, ...notionConfig.defaultTags] 
      },
    );
    try {
      return await fetcher();
    } catch (e) {
      console.error(`Cache fetch failed for ${type}/${slug}:`, e);
      return null;
    }
  }

  const typeDirectory = path.join(contentDirectory, type);

  const mdPath = path.join(typeDirectory, `${slug}.md`);
  const htmlPath = path.join(typeDirectory, `${slug}.html`);

  let fullPath: string;
  let isMarkdown: boolean;

  if (fs.existsSync(mdPath)) {
    fullPath = mdPath;
    isMarkdown = true;
  } else if (fs.existsSync(htmlPath)) {
    fullPath = htmlPath;
    isMarkdown = false;
  } else {
    if (!fs.existsSync(typeDirectory)) return null;
    const files = fs.readdirSync(typeDirectory);
    const foundFile = files.find((file) => {
      if (!file.endsWith(".md") && !file.endsWith(".html")) return false;
      const filePath = path.join(typeDirectory, file);
      const content = fs.readFileSync(filePath, "utf8");
      const { data } = matter(content);
      return data.slug === slug;
    });

    if (foundFile) {
      fullPath = path.join(typeDirectory, foundFile);
      isMarkdown = foundFile.endsWith(".md");
    } else {
      return null;
    }
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  if (isMarkdown) {
    const { data, content } = matter(fileContents);

    const protectedContent = content.replace(
      /\$\$\s*([\s\S]*?)\s*\$\$/g,
      (match, math) => {
        return `\n\n<div class="math-display">$$${math.trim()}$$</div>\n\n`;
      },
    );

    const htmlContent = (await marked.parse(protectedContent)) as string;
    const highlightedHtml = await highlightCodeBlocks(htmlContent);

    const firstImage = extractFirstImage(content, true);

    return {
      slug,
      title: data.title || slug,
      date: data.date,
      description: data.description,
      content: sanitizeContent(
        injectQuiz(injectAlerts(injectHeadingIds(highlightedHtml))),
      ),
      rawContent: content,
      final: data.final || false,
      firstImage,
      readingTime: calculateReadingTime(content),
      technical: data.technical,
      category: data.category,
      tags: data.tags,
      aiAssisted: data.aiAssisted || false,
      author: data.author,
      type: type,
    };
  } else {
    const { data, content } = matter(fileContents);
    const highlightedHtml = await highlightCodeBlocks(content);
    const firstImage = extractFirstImage(content, false);

    return {
      slug,
      title: data.title || slug,
      date: data.date,
      description: data.description,
      content: sanitizeContent(
        injectQuiz(injectAlerts(injectHeadingIds(highlightedHtml))),
      ),
      rawContent: content,
      final: data.final || false,
      firstImage,
      readingTime: calculateReadingTime(content),
      technical: data.technical,
      category: data.category,
      tags: data.tags,
      aiAssisted: data.aiAssisted || false,
      author: data.author,
      type: type,
    };
  }
});

/** Sync variant — only reads frontmatter, no body parsing. For use in card components. */
export const getAuthorBasic = cache(async function (
  slug: string,
): Promise<Author | null> {
  if (isNotionEnabled) {
    const fetcher = unstable_cache(
      async () => {
        const databaseId = DATABASE_IDS.authors;
        if (!databaseId) return null;
        const dbObj = await notion.databases.retrieve({
          database_id: databaseId,
        });
        const dataSourceId = (dbObj as any).data_sources?.[0]?.id || databaseId;
        const response: any = await notion.dataSources.query({
          data_source_id: dataSourceId,
          filter: {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
        });
        if (response.results.length === 0) return null;
        const page: any = response.results[0];
        const props = page.properties;
        return {
          name: getPlainText(props.Name || props.Title),
          slug,
          role: getPlainText(props.Role),
          bio: getPlainText(props.Biography),
          avatar: getImageUrl(props.avatar || props.Avatar) || "",
          twitter: getPlainText(props.twitter || props.Twitter),
          github: getPlainText(props.GitHub || props.github),
          linkedin: getPlainText(
            props.linkedin || props.LinkedIn || props.Linkedin,
          ),
        };
      },
      [`author-basic-${slug}`],
      { 
        revalidate: notionConfig.revalidate, 
        tags: ["authors", ...notionConfig.defaultTags] 
      },
    );
    try {
      return await fetcher();
    } catch (e) {
      return null;
    }
  }

  const authorPath = path.join(contentDirectory, "authors", `${slug}.md`);
  if (!fs.existsSync(authorPath)) return null;
  const fileContents = fs.readFileSync(authorPath, "utf8");
  const { data } = matter(fileContents);
  return { ...(data as Author), slug };
});

/**
 * Gets full author details including bio and body content.
 */
export const getAuthorBySlug = cache(async function (
  slug: string,
): Promise<Author | null> {
  if (isNotionEnabled) {
    const fetcher = unstable_cache(
      async () => {
        const databaseId = DATABASE_IDS.authors;
        if (!databaseId) return null;
        const dbObj = await notion.databases.retrieve({
          database_id: databaseId,
        });
        const dataSourceId = (dbObj as any).data_sources?.[0]?.id || databaseId;
        const response: any = await notion.dataSources.query({
          data_source_id: dataSourceId,
          filter: {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
        });
        if (response.results.length === 0) return null;
        const page: any = response.results[0];
        const props = page.properties;

        const mdblocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdblocks).parent;

        let bodyContent: string | undefined;
        if (mdString.trim()) {
          const rawHtml = (await marked.parse(mdString)) as string;
          bodyContent = sanitizeContent(
            injectAlerts(injectHeadingIds(rawHtml)),
          );
        }

        return {
          name: getPlainText(props.Name || props.Title),
          slug,
          role: getPlainText(props.Role),
          bio: getPlainText(props.Biography),
          avatar: getImageUrl(props.avatar || props.Avatar) || "",
          twitter: getPlainText(props.twitter || props.Twitter),
          github: getPlainText(props.GitHub || props.github),
          linkedin: getPlainText(
            props.linkedin || props.LinkedIn || props.Linkedin,
          ),
          bodyContent,
        };
      },
      [`author-full-${slug}`],
      { 
        revalidate: notionConfig.revalidate, 
        tags: ["authors", ...notionConfig.defaultTags] 
      },
    );
    try {
      return await fetcher();
    } catch (e) {
      return null;
    }
  }

  const authorPath = path.join(contentDirectory, "authors", `${slug}.md`);

  if (!fs.existsSync(authorPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(authorPath, "utf8");
  const { data, content } = matter(fileContents);

  let bodyContent: string | undefined;
  if (content.trim()) {
    const rawHtml = (await marked.parse(content)) as string;
    bodyContent = sanitizeContent(injectAlerts(injectHeadingIds(rawHtml)));
  }

  return {
    ...(data as Author),
    slug,
    bodyContent,
  };
});

/**
 * Gets all authors.
 */
export const getAllAuthors = cache(async function (): Promise<Author[]> {
  if (isNotionEnabled) {
    const fetcher = unstable_cache(
      async () => {
        const databaseId = DATABASE_IDS.authors;
        if (!databaseId) return [];
        const dbObj = await notion.databases.retrieve({
          database_id: databaseId,
        });
        const dataSourceId = (dbObj as any).data_sources?.[0]?.id || databaseId;
        const response: any = await notion.dataSources.query({
          data_source_id: dataSourceId,
          filter: {
            property: "Status",
            select: {
              equals: "Published",
            },
          },
        });

        return response.results.map((page: any) => {
          const props = page.properties;
          return {
            name: getPlainText(props.Name || props.Title),
            slug: getPlainText(props.Slug),
            role: getPlainText(props.Role),
            bio: getPlainText(props.Biography),
            avatar: getImageUrl(props.avatar || props.Avatar) || "",
            twitter: getPlainText(props.twitter || props.Twitter),
            github: getPlainText(props.GitHub || props.github),
            linkedin: getPlainText(
              props.linkedin || props.LinkedIn || props.Linkedin,
            ),
          };
        });
      },
      ["all-authors"],
      { 
        revalidate: notionConfig.revalidate, 
        tags: ["authors", ...notionConfig.defaultTags] 
      },
    );
    try {
      return await fetcher();
    } catch (e) {
      return [];
    }
  }

  const authorsDirectory = path.join(contentDirectory, "authors");

  if (!fs.existsSync(authorsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(authorsDirectory);
  const authors = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(authorsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        ...(data as Author),
        slug,
      };
    });

  return authors;
});
