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
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(dirPath, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        ...(data as PostMetadata),
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

function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    headings.push({ level, text, id: slugify(text) });
  }

  return headings;
}

export async function getPostBySlug(type: PostType, slug: string): Promise<Post | null> {
  const dirPath = path.join(contentDirectory, type);
  const fullPath = path.join(dirPath, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const headings = extractHeadings(content);

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

  const contentHtml = processedContent.toString();

  const metadata = data as PostMetadata;
  return {
    ...metadata,
    slug,
    content: contentHtml,
    headings,
  };
}
