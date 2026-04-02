export type PostStatus = 'Published' | 'Draft';

export interface PostMetadata {
  title: string;
  slug: string;
  date: string;
  status: PostStatus;
  description: string;
  tags: string[];
  category: string;
  final?: boolean;
  aiAssisted?: boolean;
  technical?: string;
  image?: string;
}

export interface Post extends PostMetadata {
  content: string;
}
