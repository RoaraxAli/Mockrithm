"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Calendar, User, BookOpen, Loader2 } from "lucide-react";

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

interface ResourcesSectionProps {
  articles: Article[];
  loadingBlogs: boolean;
}

export default function ResourcesSection({ articles, loadingBlogs }: ResourcesSectionProps) {
  const springTransition = { type: "spring" as const, stiffness: 85, damping: 18 };
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".reveal-char");
      if (chars.length === 0) return;

      const tween = gsap.from(chars, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.03,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, headingRef);

    return () => ctx.revert();
  }, []);

  const headingWords = [
    { text: "Expert", tone: "text-white" },
    { text: "articles,", tone: "text-white" },
    { text: "proven", tone: "text-zinc-500" },
    { text: "preparation", tone: "text-zinc-500" },
    { text: "logs.", tone: "text-zinc-500" },
  ];

  return (
    <section id="resources" className="py-28 relative scroll-mt-16 z-10 text-white bg-transparent">
      {/* Background gradients */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springTransition}
          className="text-center space-y-4 mb-20"
        >
          <span className="text-xs font-black tracking-[0.2em] text-zinc-400 uppercase">Guides & Resources</span>
          <h2
            ref={headingRef}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.03)] flex flex-wrap justify-center gap-x-4"
          >
            {headingWords.map((word, wi) => (
              <span key={wi} className="inline-flex overflow-hidden">
                {word.text.split("").map((char, ci) => (
                  <span key={ci} className={`reveal-char inline-block ${word.tone}`}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed font-semibold">
            Read preparation feedback, vocal studies, and technical interview layouts compiled by senior developers.
          </p>
        </motion.div>

        {loadingBlogs ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3 bg-zinc-950/20 backdrop-blur-md rounded-2xl border border-white/5 max-w-md mx-auto">
            <Loader2 className="size-8 animate-spin text-white" />
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Loading Resources...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 border border-white/5 bg-zinc-950/20 backdrop-blur-md rounded-2xl max-w-xl mx-auto shadow-2xl">
            <BookOpen className="size-8 mx-auto text-zinc-500 mb-3" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">No articles found</h3>
            <p className="text-[11px] text-zinc-500 mt-1">Check back later for newly published guides.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-16 pt-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring" as const, stiffness: 85, damping: 18, delay: index * 0.08 }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 20px 45px -10px rgba(0,0,0,0.8), 0 0 25px rgba(255, 255, 255, 0.03)",
                  borderColor: "rgba(255, 255, 255, 0.12)"
                }}
                className={`p-8 rounded-2xl border border-white/5 bg-zinc-950/30 backdrop-blur-md transition-all duration-300 flex flex-col justify-between min-h-[270px] relative group overflow-hidden shadow-2xl w-full ${
                  index % 2 !== 0 ? "md:translate-y-12" : ""
                }`}
              >
                {/* Subtle top highlighting line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[9px] text-zinc-400 font-black uppercase tracking-wider">
                    <span className="bg-zinc-900 px-3 py-1 rounded-full border border-white/5 text-zinc-350">{article.category}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3 text-white" /> {article.readTime}</span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-zinc-200 transition-colors leading-snug tracking-tight">{article.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-semibold">{article.excerpt}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6 text-[9px] text-zinc-400 font-bold uppercase tracking-[0.1em]">
                  <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {article.date}</span>
                  <span className="flex items-center gap-1.5"><User className="size-3.5" /> {article.author}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
