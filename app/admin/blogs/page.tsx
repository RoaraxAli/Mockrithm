"use client";

import { useEffect, useState } from "react";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "@/lib/actions/admin.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  BookOpen, 
  User, 
  Calendar, 
  Tag, 
  Clock, 
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface Blog {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [readTime, setReadTime] = useState("");
  const [author, setAuthor] = useState("");

  const fetchBlogsList = async () => {
    setLoading(true);
    try {
      const res = await getBlogs();
      if (res.success && res.data) {
        setBlogs(res.data as Blog[]);
      } else {
        toast.error(res.error || "Failed to load blogs.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while fetching blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsList();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setCategory("");
    setExcerpt("");
    setContent("");
    setReadTime("");
    setAuthor("");
    setIsOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setCategory(blog.category);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setReadTime(blog.readTime);
    setAuthor(blog.author);
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !excerpt || !content || !readTime || !author) {
      toast.error("All fields are required.");
      return;
    }

    setActionLoading(true);
    try {
      const payload = { title, category, excerpt, content, readTime, author };
      if (editingId) {
        const res = await updateBlog(editingId, payload);
        if (res.success) {
          toast.success("Blog post updated successfully!");
          setIsOpen(false);
          fetchBlogsList();
        } else {
          toast.error(res.error || "Failed to update blog.");
        }
      } else {
        const res = await createBlog(payload);
        if (res.success) {
          toast.success("Blog post created successfully!");
          setIsOpen(false);
          fetchBlogsList();
        } else {
          toast.error(res.error || "Failed to create blog.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save blog post.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    setActionLoading(true);
    try {
      const res = await deleteBlog(id);
      if (res.success) {
        toast.success("Blog post deleted!");
        fetchBlogsList();
      } else {
        toast.error(res.error || "Failed to delete blog.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog post.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-mona-sans min-h-screen text-white pb-16">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Blog Manager</h1>
          <p className="text-zinc-400 text-xs mt-1 uppercase tracking-wider font-semibold">
            Publish and manage Mockrithm resources & guides
          </p>
        </div>
        <Button 
          onClick={openCreateModal}
          className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="size-4" /> Add Blog Post
        </Button>
      </div>

      {/* Main Blog List */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <Loader2 className="size-8 animate-spin text-zinc-500" />
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Loading Resources...</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 border border-zinc-900 bg-zinc-950/20 rounded-2xl">
          <BookOpen className="size-10 mx-auto text-zinc-600 mb-3" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">No blogs found</h3>
          <p className="text-xs text-zinc-500 mt-1">Create your first post by clicking "Add Blog Post" above.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <CardHeader className="pb-3 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-450 px-2.5 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditModal(blog)}
                      className="size-8 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
                      title="Edit"
                    >
                      <Edit3 className="size-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(blog.id)}
                      className="size-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-base font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors mt-1">
                  {blog.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-xs text-zinc-450 leading-relaxed font-medium">
                  {blog.excerpt}
                </p>
                <div className="border-t border-zinc-900/60 pt-4 flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {blog.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> {blog.readTime}</span>
                  <span className="flex items-center gap-1.5"><User className="size-3.5" /> {blog.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Slide-out Panel / Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-xl h-full bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-white/5 blur-[45px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
              <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <BookOpen className="size-5" /> {editingId ? "Edit Blog Post" : "Create Blog Post"}
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="size-8 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between overflow-y-auto pr-1 space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Post Title</label>
                  <Input 
                    placeholder="e.g. How to structure system design answers..." 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white text-xs h-11 focus:border-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Category</label>
                    <Input 
                      placeholder="e.g. System Design" 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-zinc-900/60 border-zinc-800 text-white text-xs h-11 focus:border-white/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Read Time</label>
                    <Input 
                      placeholder="e.g. 5 min read" 
                      value={readTime} 
                      onChange={(e) => setReadTime(e.target.value)}
                      className="bg-zinc-900/60 border-zinc-800 text-white text-xs h-11 focus:border-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Author Name</label>
                    <Input 
                      placeholder="e.g. Sarah Jenkins" 
                      value={author} 
                      onChange={(e) => setAuthor(e.target.value)}
                      className="bg-zinc-900/60 border-zinc-800 text-white text-xs h-11 focus:border-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Excerpt / Brief Summary</label>
                  <Textarea 
                    placeholder="Provide a short description that shows in lists..." 
                    value={excerpt} 
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white text-xs min-h-[70px] max-h-[100px] resize-none focus:border-white/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Main Content</label>
                  <Textarea 
                    placeholder="Enter full markdown or text content here..." 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-zinc-900/60 border-zinc-800 text-white text-xs min-h-[180px] max-h-[220px] resize-none focus:border-white/20"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={actionLoading}
                className="w-full h-11 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-lg border border-white cursor-pointer flex justify-center items-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                {editingId ? "Save Post Changes" : "Publish Blog Post"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
