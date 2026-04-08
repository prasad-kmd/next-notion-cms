import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

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
  extensions: [quizExtension as any],
});

function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h\1>/gi,
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

const contentDirectory = path.join(process.cwd(), "content");

export function getContentByType(
  type: "blog" | "articles" | "projects" | "tutorials" | "wiki" | "quizzes",
): ContentItem[] {
  const typeDirectory = path.join(contentDirectory, type);

  // Create directory if it doesn't exist
  if (!fs.existsSync(typeDirectory)) {
    return [];
  }

  const files = fs.readdirSync(typeDirectory);

  const items = files
    .filter((file) => file.endsWith(".md") || file.endsWith(".html"))
    .map((file) => {
      const slug = file.replace(/\.(md|html)$/, "");
      const fullPath = path.join(typeDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      if (file.endsWith(".md")) {
        const { data, content } = matter(fileContents);

        // Protect display math from marked mangling by ensuring it's not treated as markdown
        // but keep the $$ symbols for the math renderer
        const protectedContent = content.replace(
          /\$\$\s*([\s\S]*?)\s*\$\$/g,
          (match, math) => {
            return `\n\n<div class="math-display">$$${math.trim()}$$</div>\n\n`;
          },
        );

        const htmlContent = marked(protectedContent) as string;
        const firstImage = extractFirstImage(content, true);

        return {
          slug,
          title: data.title || slug,
          date: data.date,
          description: data.description,
          content: injectQuiz(injectAlerts(injectHeadingIds(htmlContent))),
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
        // HTML file
        const { data, content } = matter(fileContents);
        const firstImage = extractFirstImage(content, false);

        return {
          slug,
          title: data.title || slug,
          date: data.date,
          description: data.description,
          content: injectQuiz(injectAlerts(injectHeadingIds(content))),
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
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  return items;
}

export function getContentItem(
  type: "blog" | "articles" | "projects" | "tutorials" | "wiki" | "quizzes",
  slug: string,
): ContentItem | null {
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
    return null;
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

    const htmlContent = marked(protectedContent) as string;
    const firstImage = extractFirstImage(content, true);

    return {
      slug,
      title: data.title || slug,
      date: data.date,
      description: data.description,
      content: injectQuiz(injectAlerts(injectHeadingIds(htmlContent))),
      rawContent: content,
      final: data.final || false,
      firstImage,
      readingTime: calculateReadingTime(content),
      technical: data.technical,
      category: data.category,
      tags: data.tags,
      aiAssisted: data.aiAssisted || false,
      type: type,
    };
  } else {
    const { data, content } = matter(fileContents);
    const firstImage = extractFirstImage(content, false);

    return {
      slug,
      title: data.title || slug,
      date: data.date,
      description: data.description,
      content: injectQuiz(injectAlerts(injectHeadingIds(content))),
      rawContent: content,
      final: data.final || false,
      firstImage,
      readingTime: calculateReadingTime(content),
      technical: data.technical,
      category: data.category,
      tags: data.tags,
      aiAssisted: data.aiAssisted || false,
      type: type,
    };
  }
}

export function getAuthorBySlug(slug: string): Author | null {
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
}

export function getAllAuthors(): Author[] {
  const authorsDirectory = path.join(contentDirectory, "authors");

  if (!fs.existsSync(authorsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(authorsDirectory);
  return files
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
}
