import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const contentDirectory = path.join(process.cwd(), "content");

export type PostType = "blog" | "projects" | "wiki" | "articles" | "quizzes" | "tutorials";

export interface PostMetadata {
  title: string;
  slug: string;
  date: string;
  status: string;
  description: string;
  tags?: string[];
  category?: string;
  technical?: string;
  aiAssisted?: boolean;
  final?: boolean;
  author?: string;
  type?: PostType;
  image?: string;
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

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface Post extends PostMetadata {
  content: string;
  headings: Heading[];
}

export async function getAllPosts(type: PostType): Promise<PostMetadata[]> {
  const dirPath = path.join(contentDirectory, type);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(dirPath);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".html"))
    .map((fileName) => {
      const fullPath = path.join(dirPath, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const slug = fileName.replace(/\.(md|html)$/, "");

      // Extract first image if not provided in frontmatter
      let firstImage = (data as PostMetadata).image;
      if (!firstImage) {
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i) || content.match(/!\[.*\]\((.*)\)/i);
        if (imgMatch) {
          firstImage = imgMatch[1];
        }
      }

      return {
        ...(data as PostMetadata),
        slug,
        type,
        image: firstImage,
      };
    })
    .filter((post) => post.status === "Published")
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

  return allPostsData;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

function extractHeadings(content: string, isHtml: boolean = false): Heading[] {
  const headings: Heading[] = [];
  
  if (isHtml) {
    const headingRegex = /<h([2-4])[^>]*>(.*?)<\/h\1>/gi;
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, ""); // Strip nested tags
      headings.push({ level, text, id: slugify(text) });
    }
  } else {
    const headingRegex = /^(#{2,4})\s+(.+)$/gm;
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      headings.push({ level, text, id: slugify(text) });
    }
  }

  return headings;
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const fullPath = path.join(contentDirectory, "authors", `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);

  return {
    ...(data as Author),
    slug,
  };
}

export async function getAllAuthors(): Promise<Author[]> {
  const dirPath = path.join(contentDirectory, "authors");

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(dirPath);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(dirPath, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        ...(data as Author),
        slug,
      };
    });
}

function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      if (attrs.toLowerCase().includes("id=")) return match;
      const id = slugify(text.replace(/<[^>]*>/g, ""));
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    },
  );
}

function injectQuiz(html: string): string {
  const placeholders: string[] = [];
  const protectedHtml = html.replace(/<(pre|code)[\s\S]*?<\/\1>/gi, (match) => {
    placeholders.push(match);
    return `__QUIZ_PROTECTED_BLOCK_${placeholders.length - 1}__`;
  });

  const injectedHtml = protectedHtml.replace(
    /\[quiz\]([\s\S]*?)\[\/quiz\]/g,
    (match, jsonContent) => {
      try {
        let cleanJson = jsonContent.replace(/<[^>]*>/g, "").trim();
        
        // Handle common HTML entities that might be introduced by processors
        cleanJson = cleanJson
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#39;/g, "'");

        cleanJson = cleanJson.replace(/[\r\n\t]+/g, " ");
        cleanJson = cleanJson.replace(
          /\\(["\\\/bfnrt]|u[0-9a-fA-F]{4})|\\/g,
          (match: string, p1: string) => (p1 ? match : "\\\\"),
        );

        const parsedJson = JSON.parse(cleanJson);
        const minifiedJson = JSON.stringify(parsedJson);
        const encodedJson = Buffer.from(minifiedJson).toString('base64');
        return `<div class="interactive-quiz-placeholder" data-quiz-payload="${encodedJson}"></div>`;
      } catch (e) {
        console.error("Quiz HTML inject parse error:", e);
        return `<div class="bg-red-500/10 border border-red-500 p-4 rounded-lg text-red-500 my-4">
        <p><strong>Quiz Error:</strong> Invalid JSON format.</p>
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

  return html.replace(
    /\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<\/p>|<br\/?>)?([\s\S]*?)(?=(?:\[!|$))/gi,
    (match, type, content) => {
      const upperType = type.toUpperCase() as keyof typeof alertTypes;
      const config = alertTypes[upperType];
      const colors: Record<string, string> = {
        BLUE: "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400",
        GREEN: "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
        PURPLE: "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400",
        YELLOW: "border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        RED: "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
      };
      
      const colorClass = colors[upperType] || colors.BLUE;

      return `<div class="my-6 border-l-4 p-4 rounded-r-lg ${colorClass}">
      <p class="flex items-center gap-2 font-bold mb-2 uppercase text-xs tracking-widest">
        <span class="opacity-80">${upperType}</span>
      </p>
      <div class="prose-direct text-sm leading-relaxed">${content.trim()}</div>
    </div>`;
    },
  );
}

export async function getPostBySlug(type: PostType, slug: string): Promise<Post | null> {
  const dirPath = path.join(contentDirectory, type);
  const mdPath = path.join(dirPath, `${slug}.md`);
  const htmlPath = path.join(dirPath, `${slug}.html`);

  let fullPath = "";
  let isHtml = false;

  if (fs.existsSync(mdPath)) {
    fullPath = mdPath;
  } else if (fs.existsSync(htmlPath)) {
    fullPath = htmlPath;
    isHtml = true;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const headings = extractHeadings(content, isHtml);
  let contentHtml = "";

  if (isHtml) {
    const rawHtml = injectAlerts(injectHeadingIds(content));
    // Wrap the HTML content with Shiki syntax highlighting support
    const processedContent = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeShiki, {
        theme: "one-dark-pro",
      })
      .use(rehypeStringify)
      .process(rawHtml);
    contentHtml = injectQuiz(processedContent.toString());
  } else {
    const rawMarkdown = content;
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: "append",
        properties: {
          className: ["anchor"],
        },
      })
      .use(rehypeShiki, {
        theme: "one-dark-pro",
      })
      .use(rehypeKatex)
      .use(rehypeStringify)
      .process(rawMarkdown);

    contentHtml = injectQuiz(processedContent.toString());
  }

  const metadata = data as PostMetadata;
  return {
    ...metadata,
    slug,
    content: contentHtml,
    headings,
  };
}
