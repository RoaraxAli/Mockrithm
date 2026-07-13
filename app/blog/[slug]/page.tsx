"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBlogs } from "@/lib/actions/admin.action";
import { ArrowLeft, Clock, Calendar, User, ArrowUpRight, Loader2, BookOpen } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await getBlogs();
        if (res.success && res.data) {
          const matched = (res.data as Article[]).find(a => {
            const aSlug = a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return aSlug === slug;
          });
          setArticle(matched || null);
        }
      } catch (err) {
        console.error("Failed to load blog post:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center gap-3">
        <Loader2 className="size-8 animate-spin text-white" />
        <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Loading Article...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center">
        <BookOpen className="size-12 text-zinc-600 mb-4" />
        <h1 className="text-xl font-black uppercase tracking-wider text-white">404 - Article Not Found</h1>
        <p className="text-xs text-zinc-500 mt-2 max-w-sm">The publication you are looking for does not exist or has been removed.</p>
        <Link 
          href="/blog" 
          className="mt-6 text-xs font-black uppercase tracking-widest border border-white/10 hover:border-white/20 bg-zinc-900/60 px-6 py-3 rounded-full hover:bg-zinc-900 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="size-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mona-sans relative overflow-x-hidden flex flex-col justify-between selection:bg-white selection:text-black">
      
      {/* Background visual components */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 premium-grid-dot opacity-30 pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="w-full border-b border-white/5 bg-zinc-950/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="https://mockrithm.me" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <Image
                src="/logo.svg"
                alt="Mockrithm Logo"
                width={20}
                height={20}
                className="w-5 h-5 brightness-0 invert opacity-80"
              />
              <span className="text-[13px] font-black tracking-wider uppercase text-white">
                Mockrithm
              </span>
            </Link>
            <div className="w-[1px] h-4 bg-white/20" />
            <Link href="/blog" className="text-[10px] font-black tracking-widest text-zinc-400 hover:text-white uppercase">
              Blog
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link 
              href="https://mockrithm.me" 
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Main Site <ArrowUpRight className="size-3" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 py-16 px-6 max-w-3xl mx-auto w-full">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="size-4" /> Back to publications
        </Link>

        {/* Article Meta */}
        <article className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[10px] text-zinc-450 font-black uppercase tracking-wider">
              <span className="bg-zinc-900 border border-white/5 px-3 py-1 rounded-full text-zinc-350">{article.category}</span>
              <span className="flex items-center gap-1"><Clock className="size-3" /> {article.readTime}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {article.title}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed font-semibold italic border-l-2 border-zinc-800 pl-4">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center gap-6 border-y border-white/5 py-4 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em]">
            <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {article.date}</span>
            <span className="flex items-center gap-1.5"><User className="size-3.5" /> {article.author}</span>
          </div>

          {/* Render content paragraphs */}
          <div className="text-zinc-300 text-sm leading-relaxed font-medium space-y-6 pt-4 whitespace-pre-line">
            {article.content}
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-zinc-950/40 py-10 mt-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            <span>© 2026 Mockrithm Blog.</span>
            <span>•</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="https://mockrithm.me/privacy-policy" className="text-[10px] text-zinc-500 hover:text-white font-bold uppercase tracking-wider transition-colors">
              Privacy
            </Link>
            <Link href="https://mockrithm.me/terms" className="text-[10px] text-zinc-500 hover:text-white font-bold uppercase tracking-wider transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
