import { remark } from 'remark';
import html from 'remark-html';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Server Component to render Markdown with syntax highlighting and LaTeX support.
 */
export async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: 'one-dark-pro',
      keepBackground: true,
    })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
    })
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processedContent.toString();

  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none
                 prose-headings:font-bold prose-headings:tracking-tight
                 prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                 prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5
                 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-border/40
                 prose-img:rounded-xl prose-img:shadow-lg
                 prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
