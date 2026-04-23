"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Trophy, 
  Info, 
  HelpCircle,
  Plus,
  Send,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher-client";

const PostCard = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'achievement': return <Trophy className="text-orange-500" />;
      case 'question': return <HelpCircle className="text-primary-blue" />;
      case 'info': return <Info className="text-green-500" />;
      default: return <MessageSquare className="text-slate-400" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] border border-light-blue p-6 shadow-sm hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-50 flex items-center justify-center font-black text-primary-blue">
             {post.user.image ? <img src={post.user.image} alt={post.user.name} /> : post.user.name[0]}
          </div>
          <div>
            <h4 className="font-black text-dark-blue flex items-center gap-2">
              {post.user.name}
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-full text-slate-400 uppercase tracking-widest">{post.type}</span>
            </h4>
            <p className="text-xs font-medium text-slate-400">{new Date(post.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>
        <button className="text-slate-300 hover:text-dark-blue transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-dark-blue/80 font-medium leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        {post.image_url && (
          <div className="mt-4 rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
             <img src={post.image_url} alt="Post content" className="w-full h-auto max-h-96 object-cover" />
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "flex items-center gap-2 font-bold text-sm transition-colors",
              isLiked ? "text-red-500" : "text-slate-400 hover:text-red-500"
            )}
          >
            <Heart size={20} className={cn(isLiked && "fill-current")} />
            {post.likes_count + (isLiked ? 1 : 0)}
          </button>
          <button className="flex items-center gap-2 font-bold text-slate-400 text-sm hover:text-primary-blue transition-colors">
            <MessageSquare size={20} />
            {post.comments?.length || 0}
          </button>
        </div>
        <button className="text-slate-400 hover:text-primary-blue transition-colors">
          <Share2 size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Fetch
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (res.ok) setPosts(data);
      } catch (err) {
        console.error("Gagal memuat feed");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();

    // 2. Pusher Real-time
    const channel = pusherClient.subscribe("community-feed");
    channel.bind("new-post", (data) => {
      setPosts((prev) => {
        // Prevent duplicates
        if (prev.find(p => p.id === data.id)) return prev;
        return [data, ...prev];
      });
    });

    return () => {
      pusherClient.unsubscribe("community-feed");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost, type: "question" })
      });
      if (res.ok) setNewPost("");
    } catch (err) {
      console.error("Gagal posting");
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Post Input */}
      <div className="bg-white rounded-[32px] border border-light-blue p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 items-start">
             <div className="w-12 h-12 rounded-2xl bg-primary-blue/10 flex items-center justify-center shrink-0">
                <Plus size={24} className="text-primary-blue" />
             </div>
             <textarea 
               value={newPost}
               onChange={(e) => setNewPost(e.target.value)}
               placeholder="Apa yang ingin kamu bagikan hari ini?"
               className="w-full p-2 bg-transparent text-dark-blue font-medium placeholder:text-slate-300 border-none focus:ring-0 resize-none min-h-[60px]"
             />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
             <div className="flex gap-2">
                <button type="button" className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                   <ImageIcon size={20} />
                </button>
                <button type="button" className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                   <HelpCircle size={20} />
                </button>
             </div>
             <button 
               type="submit"
               disabled={!newPost.trim()}
               className="px-6 py-2.5 bg-primary-blue text-white rounded-2xl font-black text-sm hover:bg-accent-blue transition-all disabled:opacity-50 flex items-center gap-2"
             >
               Kirim <Send size={16} />
             </button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-20">
             <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="font-bold text-slate-400">Memuat info terkini...</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
