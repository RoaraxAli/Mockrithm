"use client";

import { useEffect, useState } from "react";
import { getBlogs } from "@/lib/actions/admin.action";
import ResourcesSection from "@/components/landing/ResourcesSection";

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
    <div className="min-h-screen bg-black text-white py-12">
      <ResourcesSection articles={articles} loadingBlogs={loadingBlogs} />
    </div>
  );
}
