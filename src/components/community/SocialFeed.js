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
  Image as ImageIcon,
  Reply,
  Loader2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher-client";
import { useSession } from "next-auth/react";

const CommentItem = ({ comment, postId, onReply }) => {
  return (
    <div className="group/comment mb-4 last:mb-0">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center font-black text-xs text-primary-blue overflow-hidden">
           {comment.user.image ? <img src={comment.user.image} alt="" /> : comment.user.name[0]}
        </div>
        <div className="flex-1">
          <div className="bg-slate-50 rounded-2xl p-3 px-4 inline-block max-w-full">
            <h5 className="font-black text-dark-blue text-xs mb-0.5">{comment.user.name}</h5>
            <p className="text-sm text-dark-blue/80 font-medium leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 ml-2">
             <button 
               onClick={() => onReply(comment)}
               className="text-[10px] font-black text-slate-400 hover:text-primary-blue transition-colors flex items-center gap-1"
             >
               <Reply size={10} /> Balas
             </button>
             <span className="text-[10px] text-slate-300 font-medium">
               {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-4 border-l-2 border-slate-100 pl-4 space-y-3">
               {comment.replies.map(reply => (
                 <div key={reply.id} className="flex gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center font-black text-[10px] text-primary-blue overflow-hidden">
                       {reply.user.image ? <img src={reply.user.image} alt="" /> : reply.user.name[0]}
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2 px-3">
                       <h5 className="font-black text-dark-blue text-[10px] mb-0.5">{reply.user.name}</h5>
                       <p className="text-xs text-dark-blue/80 font-medium">{reply.content}</p>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, currentUserId }) => {
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiked, setIsLiked] = useState(post.likes?.some(l => l.user_id === currentUserId));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Listen to real-time likes and comments for THIS post
    const channel = pusherClient.subscribe(`post-${post.id}`);
    
    channel.bind("like-update", (data) => {
      setLikesCount(data.likes_count);
      if (data.user_id === currentUserId) {
         setIsLiked(data.action === "like");
      }
    });

    channel.bind("new-comment", (data) => {
      if (data.parent_id) {
         // It's a reply
         setComments(prev => prev.map(c => {
           if (c.id === data.parent_id) {
             return { ...c, replies: [...(c.replies || []), data] };
           }
           return c;
         }));
      } else {
         // It's a top-level comment
         setComments(prev => [...prev, data]);
      }
    });

    return () => {
      pusherClient.unsubscribe(`post-${post.id}`);
    };
  }, [post.id, currentUserId]);

  const handleLike = async () => {
    // Optimistic UI
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id })
      });
    } catch (err) {
      console.error("Gagal like");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          post_id: post.id, 
          content: commentText,
          parent_id: replyTo?.id 
        })
      });
      if (res.ok) {
        setCommentText("");
        setReplyTo(null);
      }
    } catch (err) {
      console.error("Gagal komentar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] border border-light-blue shadow-sm hover:shadow-xl hover:border-primary-blue/20 transition-all overflow-hidden mb-8"
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50 flex items-center justify-center font-black text-primary-blue shadow-inner text-xl">
               {post.user.image ? <img src={post.user.image} alt="" className="w-full h-full object-cover" /> : post.user.name[0]}
            </div>
            <div>
              <h4 className="font-black text-dark-blue flex items-center gap-2 text-lg">
                {post.user.name}
                <span className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                  post.type === 'achievement' ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-400"
                )}>
                  {post.type}
                </span>
              </h4>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-tighter">
                {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-200 hover:text-dark-blue hover:bg-slate-50 transition-all">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className="text-dark-blue/80 font-medium leading-relaxed whitespace-pre-wrap text-lg">
            {post.content}
          </p>
          {post.image_url && (
            <div className="mt-6 rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-2xl relative group/img">
               <img src={post.image_url} alt="" className="w-full h-auto max-h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm transition-all active:scale-90",
                isLiked 
                  ? "bg-red-50 text-red-500 shadow-lg shadow-red-500/10" 
                  : "bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500"
              )}
            >
              <Heart size={20} className={cn(isLiked && "fill-current animate-bounce")} />
              {likesCount}
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm transition-all",
                showComments ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20" : "bg-slate-50 text-slate-400 hover:bg-light-blue hover:text-primary-blue"
              )}
            >
              <MessageSquare size={20} />
              {comments.length}
            </button>
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary-blue hover:text-white transition-all shadow-sm">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-50 border-t border-slate-100"
          >
            <div className="p-8">
               <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {comments.length === 0 ? (
                    <div className="text-center py-6">
                       <p className="text-sm font-bold text-slate-300 italic">Belum ada diskusi. Jadi yang pertama memulai!</p>
                    </div>
                  ) : (
                    comments.map(comment => (
                      <CommentItem 
                        key={comment.id} 
                        comment={comment} 
                        postId={post.id} 
                        onReply={setReplyTo} 
                      />
                    ))
                  )}
               </div>

               {/* Comment Input */}
               <form onSubmit={handleComment} className="relative">
                  {replyTo && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-primary-blue/5 border border-primary-blue/10 rounded-xl p-2 flex items-center justify-between text-[10px] font-bold text-primary-blue animate-in slide-in-from-bottom-2">
                       <span>Membalas ke {replyTo.user.name}</span>
                       <button onClick={() => setReplyTo(null)} className="hover:text-red-500"><X size={12} /></button>
                    </div>
                  )}
                  <div className="flex gap-3 items-center">
                     <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 shrink-0 flex items-center justify-center font-black text-xs text-primary-blue overflow-hidden shadow-sm">
                        {/* Current User Image */}
                        Me
                     </div>
                     <div className="relative flex-1">
                        <input 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder={replyTo ? "Tulis balasan..." : "Tambahkan pemikiranmu..."}
                          className="w-full pl-6 pr-14 py-4 bg-white rounded-2xl border-2 border-slate-100 focus:border-primary-blue focus:ring-0 text-sm font-medium transition-all shadow-sm"
                        />
                        <button 
                          type="submit"
                          disabled={!commentText.trim() || isSubmitting}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-primary-blue text-white rounded-xl disabled:opacity-30 transition-all shadow-md active:scale-90"
                        >
                          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={18} />}
                        </button>
                     </div>
                  </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function SocialFeed({ categoryId }) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const url = categoryId ? `/api/posts?categoryId=${categoryId}` : "/api/posts";
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) setPosts(data);
      } catch (err) {
        console.error("Gagal memuat feed");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();

    const channel = pusherClient.subscribe("community-feed");
    channel.bind("new-post", (data) => {
      setPosts((prev) => {
        if (prev.find(p => p.id === data.id)) return prev;
        return [data, ...prev];
      });
    });

    return () => {
      pusherClient.unsubscribe("community-feed");
    };
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: newPost, 
          type: "question", 
          categoryId,
          imageUrl: imageUrl || null
        })
      });
      if (res.ok) {
        setNewPost("");
        setImageUrl("");
        setShowImageInput(false);
      }
    } catch (err) {
      console.error("Gagal posting");
    }
  };

  return (
    <div className="space-y-10">
      {/* Create Post Input */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] border-2 border-primary-blue/5 p-8 shadow-2xl shadow-primary-blue/5"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex gap-6 items-start">
             <div className="w-14 h-14 rounded-2xl bg-primary-blue text-white flex items-center justify-center shrink-0 shadow-xl shadow-primary-blue/30 font-black text-xl">
                {session?.user?.name ? session.user.name[0] : <Plus size={28} />}
             </div>
             <div className="flex-1 space-y-4">
                <textarea 
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Apa pencapaian atau pertanyaanmu hari ini?"
                  className="w-full p-2 bg-transparent text-dark-blue font-bold text-xl placeholder:text-slate-200 border-none focus:ring-0 resize-none min-h-[100px]"
                />
                
                <AnimatePresence>
                   {showImageInput && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       className="relative"
                     >
                        <input 
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Masukkan URL Gambar (jpg, png, gif)..."
                          className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-sm font-medium focus:border-primary-blue transition-all"
                        />
                        {imageUrl && (
                          <div className="mt-4 relative rounded-2xl overflow-hidden h-32 border-2 border-slate-100">
                             <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                             <button 
                               type="button"
                               onClick={() => setImageUrl("")}
                               className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                             >
                               <X size={14} />
                             </button>
                          </div>
                        )}
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
             <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowImageInput(!showImageInput)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all",
                    showImageInput ? "bg-primary-blue/10 text-primary-blue" : "text-slate-400 hover:bg-slate-50 hover:text-dark-blue"
                  )}
                >
                   <ImageIcon size={20} />
                   <span>Gambar</span>
                </button>
                <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 font-bold text-sm hover:bg-slate-50 hover:text-dark-blue transition-all">
                   <HelpCircle size={20} />
                   <span>Tanya</span>
                </button>
             </div>
             <button 
               type="submit"
               disabled={!newPost.trim()}
               className="px-10 py-4 bg-primary-blue text-white rounded-[20px] font-black text-sm hover:bg-accent-blue transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-primary-blue/30 active:scale-95"
             >
               Bagikan <Send size={18} />
             </button>
          </div>
        </form>
      </motion.div>

      {/* Feed List */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="text-center py-24">
             <Loader2 className="w-12 h-12 text-primary-blue animate-spin mx-auto mb-4" />
             <p className="font-black text-slate-400 tracking-widest uppercase text-xs">Menyusun informasi untukmu...</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={session?.user?.id} />
          ))
        )}
      </div>
    </div>
  );
}
