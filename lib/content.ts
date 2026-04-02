import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMetadata } from '@/types';

const contentDirectory = path.join(process.cwd(), 'content');

export async function getPostSlugs(type: 'blog' | 'projects' | 'wiki') {
  const directory = path.join(contentDirectory, type);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory);
}

export async function getPostBySlug(type: 'blog' | 'projects' | 'wiki', slug: string): Promise<Post | null> {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(contentDirectory, type, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    ...(data as PostMetadata),
    slug: realSlug,
    content,
  } as Post;
}

export async function getAllPosts(type: 'blog' | 'projects' | 'wiki'): Promise<PostMetadata[]> {
  const slugs = await getPostSlugs(type);
  const posts = slugs
    .map((slug) => {
      const fullPath = path.join(contentDirectory, type, slug);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        ...(data as PostMetadata),
        slug: slug.replace(/\.md$/, ''),
      };
    })
    // Filter out drafts unless in development (though for this project we'll just stick to Published)
    .filter((post) => post.status === 'Published')
    // Sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}
