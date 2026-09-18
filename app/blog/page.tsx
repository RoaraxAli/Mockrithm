"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBlogs } from "@/lib/actions/admin.action";
import ResourcesSection from "@/components/landing/ResourcesSection";
import { ArrowRight, BookOpen, Terminal, Rss, ArrowLeft, ArrowUpRight } from "lucide-react";

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

export default function BlogsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await getBlogs();
        if (res.success && res.data) {
          setArticles(res.data as any[]);
        }
      } catch (err) {
        console.error("Failed to load blogs on standalone blogs page:", err);
      } finally {
        setLoadingBlogs(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mona-sans relative overflow-hidden flex flex-col justify-between">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 premium-grid-dot opacity-40 pointer-events-none z-0" />

      {/* Standalone Blog Navigation Header */}
      <header className="w-full border-b border-white/5 bg-zinc-950/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-900 border border-white/5 px-2 py-0.5 rounded">
              Blog
            </span>
          </div>

          <nav className="flex items-center space-x-6">
            <Link 
              href="https://mockrithm.me" 
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Main Site <ArrowUpRight className="size-3" />
            </Link>
            <Link 
              href="https://docs.mockrithm.me" 
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Link 
              href="https://mockrithm.me/sign-up" 
              className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded border border-white hover:bg-zinc-200 transition-all flex items-center gap-1.5"
            >
              Launch App <ArrowRight className="size-3" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Standalone Blog Hero Section */}
      <main className="flex-1 relative z-10">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-6">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <Rss className="size-4" />
              <span className="text-[10px] font-black tracking-widest uppercase">Mockrithm Publications</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
              Insights & <br />
              <span className="text-zinc-500">Preparation Logs.</span>
            </h1>
            <p className="text-sm text-zinc-450 leading-relaxed font-medium">
              Vocal pacing science, engineering diaries, and advanced interview metrics directly from our core build team.
            </p>
          </div>
        </div>

        {/* ResourcesSection renders the actual articles */}
        <div className="-mt-16">
          <ResourcesSection articles={articles} loadingBlogs={loadingBlogs} />
        </div>
      </main>

      {/* Dedicated Blog Footer */}
      <footer className="w-full border-t border-white/5 bg-zinc-950/40 py-10 mt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
            <Link href="https://mockrithm.me" className="text-[10px] text-zinc-500 hover:text-white font-bold uppercase tracking-wider transition-colors">
              App
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
