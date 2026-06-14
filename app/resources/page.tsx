"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft, Clock, Calendar, User, Loader2 } from "lucide-react";
import { getBlogs } from "@/lib/actions/admin.action";

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

export default function ResourcesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await getBlogs();
        if (res.success && res.data) {
          setArticles(res.data as any[]);
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 bg-black min-h-screen text-white select-none pb-20 pt-12">
      {/* Background Overlays */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-15 z-0" />
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none z-0" />

      {/* Hero Header (Monochrome) */}
      <section className="relative w-full py-16 flex flex-col justify-center text-center">
        <div className="max-w-3xl mx-auto w-full px-6 flex flex-col items-center gap-4 z-10">
          <h1 className="text-xs font-black tracking-widest text-zinc-550 uppercase">Resources & Guides</h1>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
            Expert articles, <br />
            <span className="text-zinc-500">proven preparation guides.</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed max-w-xl">
            Read comprehensive preparation logs, vocal studies, and technical screening guidelines compiled by senior software engineers.
          </p>
        </div>
      </section>

      {/* Articles Grid / Loading Spinner */}
      <section className="max-w-5xl mx-auto w-full px-6 z-10 mt-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Loader2 className="size-8 animate-spin text-zinc-500" />
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Loading Resources...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900 bg-zinc-950/20 rounded-2xl">
            <BookOpen className="size-10 mx-auto text-zinc-650 mb-3" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">No articles found</h3>
            <p className="text-xs text-zinc-500 mt-1">Check back later for newly published developer logs.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 transition-all flex flex-col justify-between min-h-80 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800/80 text-zinc-450">{article.category}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-zinc-300 transition-colors leading-snug">{article.title}</h3>
                  <p className="text-xs text-zinc-450 leading-relaxed font-medium">{article.excerpt}</p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-900 pt-5 mt-8 text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {article.date}</span>
                  <span className="flex items-center gap-1.5"><User className="size-3.5" /> {article.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
