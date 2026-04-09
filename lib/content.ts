import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { cache } from "react";
import { createHighlighter } from "shiki";

let highlighter: any = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["one-dark-pro"],
      langs: [
        "javascript",
        "typescript",
        "python",
        "bash",
        "json",
        "html",
        "css",
        "markdown",
        "rust",
        "go",
        "cpp",
        "c",
        "sql",
        "matlab",
        "yaml",
        "java",
        "php",
      ],
    });
  }
  return highlighter;
}

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
    // Just wrap it in a placeholder that injectQuiz will handle later
    // to ensure consistent cleaning and parsing logic
    return `[quiz]${token.json}[/quiz]`;
  },
};

marked.use({
  renderer,
  async: true,
  extensions: [quizExtension as any],
});

async function highlightCodeBlocks(html: string): Promise<string> {
  try {
    const sh = await getHighlighter();
    // Improved regex to handle various pre/code structures that might come from marked/html
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

      // Append everything before the match
      result += html.substring(lastIndex, matchIndex);

      const decodedCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      try {
        const highlighted = sh.codeToHtml(decodedCode.trim(), {
          lang: lang,
          theme: "one-dark-pro",
          transformers: [
            {
              line(node: any, line: number) {
                node.properties.class = (node.properties.class || "") + " line";
                node.properties["data-line"] = line;
              },
            },
          ],
        });

        // Create the enhanced UI wrapper with a more premium aesthetic
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
  <div class="absolute top-[52px] right-0 bottom-0 w-8 bg-gradient-to-l from-[#1e1e1e] to-transparent pointer-events-none z-10 opacity-0 group-hover/code:opacity-100 transition-opacity"></div>
</div>`;
        result += enhancedHtml;
      } catch (e) {
        result += fullMatch;
      }

      lastIndex = matchIndex + fullMatch.length;
    }

    // Append everything after the last match
    result += html.substring(lastIndex);
    return result;
  } catch (e) {
    console.error("Shiki highlighting error:", e);
    return html;
  }
}

function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      if (attrs.toLowerCase().includes("id=")) return match;
      const id = text
        .replace(/<[^>]*>/g, "")
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    },
  );
}

function injectQuiz(html: string): string {
  // This is now a fallback for HTML content that doesn't go through marked
  // To avoid rendering quizzes inside code blocks, we temporarily protect them
  const placeholders: string[] = [];
  const protectedHtml = html.replace(/<(pre|code)[\s\S]*?<\/\1>/gi, (match) => {
    placeholders.push(match);
    return `__QUIZ_PROTECTED_BLOCK_${placeholders.length - 1}__`;
  });

  const injectedHtml = protectedHtml.replace(
    /\[quiz\]([\s\S]*?)\[\/quiz\]/g,
    (match, jsonContent) => {
      try {
        // Normalize JSON content:
        // 1. Remove any HTML tags that might have been injected by the markdown parser
        let cleanJson = jsonContent.replace(/<[^>]*>/g, "").trim();
        // 2. Replace literal newlines and tabs with spaces
        cleanJson = cleanJson.replace(/[\r\n\t]+/g, " ");
        // 3. Escape backslashes that are not part of a valid JSON escape sequence.
        // We must consume valid escapes to prevent their second characters (like in \\)
        // from being processed as lone backslashes.
        cleanJson = cleanJson.replace(
          /\\(["\\\/bfnrt]|u[0-9a-fA-F]{4})|\\/g,
          (match: string, p1: string) => (p1 ? match : "\\\\"),
        );

        // Minify and validate JSON
        const minifiedJson = JSON.stringify(JSON.parse(cleanJson));
        const encodedJson = minifiedJson.replace(/'/g, "&apos;");
        return `<div class="interactive-quiz-placeholder" data-quiz='${encodedJson}'></div>`;
      } catch (e) {
        console.error(
          "Quiz HTML inject parse error:",
          e,
          "\nContent:",
          jsonContent,
        );
        return `<div class="bg-red-500/10 border border-red-500 p-4 rounded-lg text-red-500 my-4">
        <p><strong>Quiz Error:</strong> Invalid JSON format.</p>
        <pre class="text-[10px] mt-2 overflow-auto">${jsonContent.substring(0, 100)}...</pre>
      </div>`;
      }
    },
  );

  return injectedHtml.replace(
    /__QUIZ_PROTECTED_BLOCK_(\d+)__/g,
    (match, index) => {
      return placeholders[parseInt(index)];
    },
  );
}

function injectAlerts(html: string): string {
  const alertTypes = {
    NOTE: { color: "blue", icon: "info" },
    TIP: { color: "green", icon: "lightbulb" },
    IMPORTANT: { color: "purple", icon: "alert-circle" },
    WARNING: { color: "yellow", icon: "alert-triangle" },
    CAUTION: { color: "red", icon: "alert-octagon" },
  };

  // Match blockquotes containing [!TYPE]
  // Markdown output varies: sometimes [!TYPE] is in its own <p>, sometimes not
  // This version is more flexible to handle attributes and various spacing
  return html.replace(
    /<blockquote[^>]*>\s*<p[^>]*>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<\/p>|<br\/?>)?([\s\S]*?)<\/blockquote>/gi,
    (match, type, content) => {
      const upperType = type.toUpperCase() as keyof typeof alertTypes;
      const config = alertTypes[upperType];

      const colors: Record<string, string> = {
        blue: "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400",
        green:
          "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
        purple:
          "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400",
        yellow:
          "border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        red: "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
      };

      return `<div class="my-6 border-l-4 p-4 rounded-r-lg ${colors[config.color] || colors.blue}">
      <p class="flex items-center gap-2 font-bold mb-2 uppercase text-xs tracking-widest">
        <span class="opacity-80">${upperType}</span>
      </p>
      <div class="prose-direct text-sm leading-relaxed">${content.trim()}</div>
    </div>`;
    },
  );
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

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function extractFirstImage(
  content: string,
  isMarkdown: boolean,
): string | undefined {
  if (isMarkdown) {
    // Match markdown image syntax: ![alt](url)
    const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
    const match = content.match(markdownImageRegex);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Match HTML image syntax: <img src="url" or <img ... src="url"
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match = content.match(htmlImageRegex);
  if (match && match[1]) {
    return match[1];
  }

  return undefined;
}

function sanitizeContent(html: string): string {
  // Remove script tags to prevent React warnings and accidental execution
  return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
}

const contentDirectory = path.join(process.cwd(), "content");

export const getContentByType = cache(function (
  type: "blog" | "articles" | "projects" | "tutorials" | "wiki" | "quizzes",
): ContentItem[] {
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

      // Shallow fetch: No marked or injection processing for lists
      const firstImage = extractFirstImage(content, file.endsWith(".md"));

      return {
        slug,
        title: data.title || slug,
        date: data.date,
        description: data.description,
        content: "", // Content empty for lists to save memory/rendering
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

export const getContentItem = cache(async function (
  type: "blog" | "articles" | "projects" | "tutorials" | "wiki" | "quizzes",
  slug: string,
): Promise<ContentItem | null> {
  const typeDirectory = path.join(contentDirectory, type);

  // Try .md first, then .html
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
    // Try to find by frontmatter slug
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

    // Protect display math
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

export const getAuthorBySlug = cache(function (slug: string): Author | null {
  const authorPath = path.join(contentDirectory, "authors", `${slug}.md`);

  if (!fs.existsSync(authorPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(authorPath, "utf8");
  const { data } = matter(fileContents);

  return {
    ...(data as Author),
    slug,
  };
});

export const getAllAuthors = cache(async function (): Promise<Author[]> {
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
