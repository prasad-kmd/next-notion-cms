import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowUpRight, MessageSquare, Clock, ArrowRight, Layers, Tag, FileText, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContentItem, getAuthorBySlug } from "@/lib/content";

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "Recent";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

interface BlogCardProps {
  post: ContentItem;
}

export function BlogCard({ post }: BlogCardProps) {
  const author = post.author ? getAuthorBySlug(post.author) : null;
  const d = post.date ? new Date(post.date) : null;
  const day = d ? String(d.getDate()).padStart(2, '0') : '--';
  const month = d ? d.toLocaleString('default', { month: 'short' }) : '---';
  const year = d ? d.getFullYear() : '----';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col h-full bg-card/30 backdrop-blur-xl border border-border/40 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-primary/40 hover:bg-card/50 hover:-translate-y-2 shadow-2xl dark:border-white/5"
    >
      <div className="p-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-center justify-center bg-primary/10 rounded-2xl p-3 min-w-[70px] border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
               <span className="text-2xl font-black text-primary group-hover:text-primary-foreground amoriaregular leading-none py-1">{day}</span>
               <div className="flex flex-col items-center -mt-1">
                 <span className="text-[12px] font-black uppercase tracking-tighter text-primary/60 group-hover:text-primary-foreground/60 leading-none font-google-sans">{month}</span>
                 <span className="text-[10px] font-bold text-primary/40 group-hover:text-primary-foreground/40 mt-0.5 font-local-jetbrains-mono">{year}</span>
               </div>
             </div>
          </div>
          <div className="flex flex-wrap justify-end gap-1.5 max-w-[120px]">
            {post.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-black text-primary/70 uppercase tracking-widest bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-md group-hover:bg-primary/20 transition-colors font-local-inter">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-3xl font-black mb-6 amoriaregular text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-[1.1] tracking-tight">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-4 mb-10 google-sans leading-relaxed italic font-light">
          "{post.description}"
        </p>

        <div className="mt-auto pt-8 border-t border-border/40 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl overflow-hidden border border-border/40 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500">
              {author?.avatar ? (
                <Image src={author.avatar} alt={author.name} width={36} height={36} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center"><User size={16}/></div>
              )}
            </div>
            <div className="flex flex-col">
               <span className="text-[14px] font-black tracking-widest uppercase text-muted-foreground font-mozilla-headline">{author?.name || "Anonymous"}</span>
               <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5 font-local-inter">
                 <Clock size={8} /> {post.readingTime} MIN READ
               </span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full border border-border/40 dark:border-white/10 flex items-center justify-center text-muted-foreground/40 group-hover:border-primary group-hover:text-primary transition-all duration-500">
             <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
      
      {/* Dynamic light effect */}
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Link>
  );
}

interface ArticleCardProps {
  post: ContentItem;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const author = post.author ? getAuthorBySlug(post.author) : null;
  const formatDateStandard = (dateStr: string | undefined) => {
    if (!dateStr) return "YYYY MM DD";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year} ${month} ${day}`;
  };

  return (
    <Link
      href={`/articles/${post.slug}`}
      className="group relative flex flex-col h-full bg-card border border-border/40 dark:border-white/5 rounded-[1rem] overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border/40 dark:border-white/5">
        <Image
          src={post.firstImage || "/img/page/diary_page.webp"}
          alt={post.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 left-4 flex gap-2">
           <div className="px-3 py-1 bg-background/80 backdrop-blur-xl border border-border/40 dark:border-white/10 rounded-lg text-[10px] font-black text-primary uppercase tracking-[0.2em] font-local-inter">
             {formatDateStandard(post.date)}
           </div>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1 relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-0.5 w-6 bg-primary" />
          <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.4em] local-jetbrains-mono">Technical Document</span>
        </div>

        <h3 className="text-2xl font-black mb-4 amoriaregular text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground text-xs line-clamp-3 mb-6 google-sans leading-relaxed font-light">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-8">
          {post.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[7px] font-black text-muted-foreground uppercase tracking-widest bg-muted/30 border border-border/40 dark:border-white/10 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg overflow-hidden border border-border/40 dark:border-white/10 ring-2 ring-muted/5">
              {author?.avatar ? (
                <Image src={author.avatar} alt={author.name} width={32} height={32} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center"><User size={12} className="text-muted-foreground/20"/></div>
              )}
            </div>
            <span className="text-[12px] font-mozilla-headline font-black text-muted-foreground uppercase tracking-widest">{author?.name || "Anonymous"}</span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/40 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
             <FileText size={14} />
          </div>
        </div>
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-border/40 dark:border-white/10 rounded-tr-[1rem] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-border/40 dark:border-white/10 rounded-bl-[1rem] pointer-events-none" />
    </Link>
  );
}

interface ProjectCardProps {
  post: ContentItem;
}

export function ProjectCard({ post }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${post.slug}`}
      className="group relative flex flex-col h-full bg-card border border-border/40 dark:border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-primary/40 hover:translate-y-[-8px] shadow-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden m-4 rounded-[1.8rem]">
        <Image
          src={post.firstImage || "/img/page/workflow.webp"}
          alt={post.title}
          fill
          className="object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
           <div className="px-4 py-1.5 bg-background/40 backdrop-blur-xl border border-white/10 rounded-xl text-[9px] font-black text-foreground uppercase tracking-[0.3em] dark:text-white">
             {post.category || "General"}
           </div>
           <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
             <Rocket size={18} />
           </div>
        </div>
      </div>

      <div className="px-8 pb-10 pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-6">
           <div className="flex gap-1.5">
              {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40" />)}
           </div>
           <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] local-jetbrains-mono">Project Blueprint</span>
        </div>

        <h3 className="text-3xl font-black mb-6 amoriaregular text-foreground group-hover:text-primary transition-colors leading-[1.1] tracking-tight">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-10 google-sans leading-relaxed font-light">
          {post.description}
        </p>
        
        <div className="mt-auto pt-8 border-t border-border/40 dark:border-white/5 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.technical?.split(',').slice(0, 3).map(tech => (
              <span key={tech} className="text-[8px] font-black text-primary/60 uppercase tracking-widest border border-primary/10 px-2.5 py-1 rounded-md bg-primary/5">
                {tech.trim().split(' ')[0]}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
            Analyze <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Internal Grid Lines Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
    </Link>
  );
}
