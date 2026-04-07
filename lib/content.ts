import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const contentDirectory = path.join(process.cwd(), "content");

export type PostType = "blog" | "projects" | "wiki";

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
      const { data } = matter(fileContents);
      const slug = fileName.replace(/\.(md|html)$/, "");

      return {
        ...(data as PostMetadata),
        slug,
        type,
      };
    })
    .filter((post) => post.status === "Published")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

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
    // For HTML files, we inject IDs if they are missing
    contentHtml = content.replace(
      /<h([2-4])([^>]*)>(.*?)<\/h\1>/gi,
      (match, level, attrs, text) => {
        if (attrs.toLowerCase().includes("id=")) return match;
        const id = slugify(text.replace(/<[^>]*>/g, ""));
        return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
      }
    );
  } else {
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
      .process(content);

    contentHtml = processedContent.toString();
  }

  const metadata = data as PostMetadata;
  return {
    ...metadata,
    slug,
    content: contentHtml,
    headings,
  };
}
