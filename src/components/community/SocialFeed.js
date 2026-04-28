"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  HelpCircle,
  Send,
  Image as ImageIcon,
  Reply,
  Loader2,
  X,
  Code,
  Smile,
  Calendar,
  Hash,
  ShieldCheck,
  MessageSquareIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher-client";
import { useSession } from "next-auth/react";
import { UploadButton } from "@/lib/uploadthing";
import Swal from "sweetalert2";

const CommentItem = ({ comment, postId, onReply }) => {
  return (
    <div className="group/comment mb-4 last:mb-0">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0 flex items-center justify-center font-black text-xs text-primary-blue overflow-hidden">
          {comment.user.image ? <img src={comment.user.image} alt="" /> : comment.user.name[0]}
        </div>
        <div className="flex-1">
          <div className={cn(
            "bg-slate-50 rounded-2xl p-3 px-4 inline-block max-w-full",
            comment.user.role === "admin" && "bg-blue-50 border border-blue-100 ring-2 ring-blue-500/5"
          )}>
            <div className="flex items-center gap-2 mb-0.5">
              <h5 className="font-bold text-dark-blue text-xs">{comment.user.name}</h5>
              {comment.user.role === "admin" && (
                <span className="text-[8px] font-black bg-primary-blue text-white px-1.5 py-0.5 rounded uppercase tracking-widest">Admin</span>
              )}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 ml-2">
            <button
              onClick={() => onReply(comment)}
              className="text-[10px] font-bold text-slate-400 hover:text-primary-blue transition-colors flex items-center gap-1"
            >
              <Reply size={10} /> Balas
            </button>
            <span className="text-[10px] text-slate-300" suppressHydrationWarning>
              {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-4 border-l-2 border-slate-100 pl-4 space-y-3">
              {comment.replies.map(reply => (
                <div key={reply.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0 flex items-center justify-center font-bold text-[10px] text-primary-blue overflow-hidden">
                    {reply.user.image ? <img src={reply.user.image} alt="" /> : reply.user.name[0]}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 px-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h5 className="font-bold text-dark-blue text-[10px]">{reply.user.name}</h5>
                      {reply.user.role === "admin" && (
                        <span className="text-[7px] font-black bg-primary-blue text-white px-1 py-0.5 rounded uppercase tracking-tighter">Admin</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700">{reply.content}</p>
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

const PostCard = ({ post, currentUserId, userRole, onDeletePost, session }) => {
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiked, setIsLiked] = useState(post.likes?.some(l => l.user_id === currentUserId));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const canDelete = currentUserId === post.user_id || userRole === "admin";

  const handleDeletePost = async () => {
    const result = await Swal.fire({
      title: "Hapus Postingan?",
      text: "Postingan yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/posts/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id })
      });
      if (res.ok) {
        onDeletePost(post.id);
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Postinganmu berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menghapus postingan."
      });
    }
  };

  useEffect(() => {
    const channel = pusherClient.subscribe(`post-${post.id}`);

    // 1. Ekstrak fungsi ke dalam variabel
    const handleLikeUpdate = (data) => {
      setLikesCount(data.likes_count);
      if (data.user_id === currentUserId) setIsLiked(data.action === "like");
    };

    const handleNewComment = (data) => {
      // TANPA pencegahan, langsung masukkan ke state aslinya
      if (data.parent_id) {
        setComments(prev => prev.map(c => c.id === data.parent_id ? { ...c, replies: [...(c.replies || []), data] } : c));
      } else {
        setComments(prev => [...prev, data]);
      }
    };

    // 2. Bind fungsi tersebut
    channel.bind("like-update", handleLikeUpdate);
    channel.bind("new-comment", handleNewComment);

    return () => {
      // 3. ROOT CAUSE FIX: Unbind secara eksplisit fungsi yang tadi dipasang!
      channel.unbind("like-update", handleLikeUpdate);
      channel.unbind("new-comment", handleNewComment);
      pusherClient.unsubscribe(`post-${post.id}`);
    }
  }, [post.id, currentUserId]);

  const handleLike = async () => {
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
        body: JSON.stringify({ post_id: post.id, content: commentText, parent_id: replyTo?.id })
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
      className={cn(
        "bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all mb-6 relative overflow-hidden",
        post.type === "question" && "border-orange-200",
        post.user.role === "admin" && "border-primary-blue/30 ring-2 ring-primary-blue/5 bg-gradient-to-br from-white to-blue-50/30"
      )}
    >
      {post.user.role === "admin" && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary-blue text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-bl-2xl shadow-lg">
            Official Admin
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center font-bold text-primary-blue text-lg">
              {post.user.image ? <img src={post.user.image} alt="" className="w-full h-full object-cover" /> : post.user.name[0]}
            </div>
            <div>
              <h4 className="font-bold text-dark-blue flex items-center gap-2 text-sm">
                {post.user.name}
                {post.user.role === "admin" && (
                  <span className="w-4 h-4 bg-primary-blue text-white rounded-full flex items-center justify-center shrink-0" title="Admin Terverifikasi">
                    <ShieldCheck size={10} strokeWidth={3} />
                  </span>
                )}
                {post.category && (
                  <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded bg-blue-50 text-primary-blue flex items-center gap-1 ml-1">
                    <Hash size={10} /> {post.category.name}
                  </span>
                )}
                {post.type === 'question' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-600">Pertanyaan</span>
                )}
              </h4>
              <p className="text-xs text-slate-400" suppressHydrationWarning>
                {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full text-slate-400 hover:bg-slate-50 transition-all">
              <MoreHorizontal size={18} />
            </button>
            {showMenu && canDelete && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-10 py-1">
                <button onClick={handleDeletePost} className="w-full text-left px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50">Hapus Postingan</button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
            {post.content}
          </p>
          {post.image_url && (
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-100 relative group/img">
              <img src={post.image_url} alt="" className="w-full h-auto max-h-[400px] object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1">
            <button onClick={handleLike} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all", isLiked ? "text-red-500 bg-red-50" : "text-slate-500 hover:bg-slate-50")}>
              <Heart size={18} className={cn(isLiked && "fill-current animate-bounce")} />
              {likesCount}
            </button>
            <button onClick={() => setShowComments(!showComments)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all", showComments ? "text-primary-blue bg-blue-50" : "text-slate-500 hover:bg-slate-50")}>
              <MessageSquareIcon size={18} />
              {comments.length}
            </button>
          </div>
          <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 transition-all">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-slate-50/50 border-t border-slate-100 rounded-b-2xl">
            <div className="p-6">
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.length === 0 ? (
                  <p className="text-center text-sm font-medium text-slate-400 italic">Belum ada diskusi.</p>
                ) : (
                  comments.map(comment => <CommentItem key={comment.id} comment={comment} postId={post.id} onReply={setReplyTo} />)
                )}
              </div>

              <form onSubmit={handleComment} className="relative">
                {replyTo && (
                  <div className="absolute bottom-full left-0 mb-2 bg-blue-50 border border-blue-100 rounded-lg p-2 flex items-center gap-2 text-[10px] font-bold text-primary-blue">
                    <span>Balas ke {replyTo.user.name}</span>
                    <button onClick={() => setReplyTo(null)} className="hover:text-red-500"><X size={12} /></button>
                  </div>
                )}
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shrink-0 flex items-center justify-center font-bold text-xs text-primary-blue overflow-hidden shadow-sm">
                    {session?.user?.image ? <img src={session.user.image} alt="Me" /> : (session?.user?.name ? session.user.name[0] : "U")}
                  </div>
                  <div className="relative flex-1">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={replyTo ? "Tulis balasan..." : "Tambahkan pemikiranmu..."}
                      className="w-full pl-4 pr-12 py-2.5 bg-white rounded-xl border border-slate-200 focus:border-primary-blue focus:ring-0 text-sm transition-all shadow-sm"
                    />
                    <button type="submit" disabled={!commentText.trim() || isSubmitting} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary-blue text-white rounded-lg disabled:opacity-50 transition-all">
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
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

export default function SocialFeed({ categoryId, searchQuery = "" }) {
  const { data: session } = useSession();
  const textareaRef = React.useRef(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("progress");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [selectedCategoryState, setSelectedCategoryState] = useState(categoryId);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newPost]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategoryState(categoryId);
  }, [categoryId]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewPost(value);

    // Detect # mention
    const lastWord = value.split(" ").pop();
    if (lastWord.startsWith("#")) {
      setMentionQuery(lastWord.slice(1));
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const selectCategory = (cat) => {
    const words = newPost.split(" ");
    words.pop(); // remove the #query
    const updatedContent = [...words, `#${cat.name} `].join(" ");
    setNewPost(updatedContent);
    setSelectedCategoryState(cat.id);
    setShowMentions(false);
  };

  const filteredMentions = categories.filter(cat =>
    cat.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const url = categoryId ? `/api/posts?categoryId=${categoryId}` : "/api/posts";
        const res = await fetch(url);
        if (res.ok) setPosts(await res.json());
      } catch (err) {
        console.error("Gagal memuat feed");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();

    const channel = pusherClient.subscribe("community-feed");

    // 1. Ekstrak fungsi
    const handleNewPost = (data) => {
      // TANPA pencegahan, langsung letakkan di awal array
      setPosts((prev) => [data, ...prev]);
    };

    // 2. Bind fungsi
    channel.bind("new-post", handleNewPost);

    return () => {
      // 3. ROOT CAUSE FIX: Unbind saat cleanup
      channel.unbind("new-post", handleNewPost);
      pusherClient.unsubscribe("community-feed");
    };
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPost.trim() || isSubmitting) return;

    setIsSubmitting(true); // Mulai loading

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost, type: postType, categoryId: selectedCategoryState, imageUrl: imageUrl || null })
      });
      if (res.ok) {
        setNewPost("");
        setImageUrl("");
        setShowImageInput(false);
        setPostType("progress");
        setSelectedCategoryState(categoryId); // reset to current filter
      }
    } catch (err) {
      console.error("Gagal posting");
    } finally {
      setIsSubmitting(false); // Selesai loading, tombol bisa diklik lagi
    }
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 px-6">
      {/* Create Post Input Container (Diperbarui sesuai referensi desain) */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 font-bold text-slate-500 overflow-hidden">
              {session?.user?.image ? <img src={session.user.image} alt="User" /> : (session?.user?.name ? session.user.name[0] : "U")}
            </div>
            <div className="flex-1 space-y-3">
              <textarea
                ref={textareaRef}
                value={newPost}
                onChange={handleInputChange}
                placeholder="Apa yang sedang kamu pelajari? Gunakan # untuk tag bidang..."
                className="w-full bg-transparent border-none focus:outline-none text-slate-700 placeholder-slate-400 pt-2 text-sm resize-none overflow-hidden"
              />

              {/* Mention List UI */}
              <AnimatePresence>
                {showMentions && filteredMentions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-50 bg-white border border-slate-100 rounded-2xl shadow-xl w-64 mt-2 max-h-60 overflow-y-auto custom-scrollbar p-2"
                  >
                    <div className="px-3 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pilih Bidang</p>
                    </div>
                    {filteredMentions.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => selectCategory(cat)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-colors">
                          <Hash size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-600 group-hover:text-primary-blue">{cat.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bagian UploadThing asli Anda yang dipertahankan */}
              <AnimatePresence>
                {imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative overflow-hidden"
                  >
                    <div className="mt-2 relative rounded-xl overflow-hidden h-32 border border-slate-200">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500">
                        <X size={12} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="flex items-center gap-1 text-slate-400">
                  {/* Action Toggles */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        // UploadThing renders an <input type="file"> inside its button — click it directly
                        document.querySelector('input[type="file"]')?.click();
                      }}
                      className={`p-2 rounded-full transition-colors ${imageUrl ? 'bg-blue-50 text-primary-blue' : 'hover:bg-slate-50 hover:text-slate-600'}`}
                    >
                      <ImageIcon size={18} />
                    </button>

                    {/* UploadButton hidden but still mounted so its input exists in the DOM */}
                    <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => { if (res && res[0]) setImageUrl(res[0].url); }}
                        onUploadError={(error) => {
                          Swal.fire({ icon: "error", title: "Upload Gagal", text: error.message });
                        }}
                      />
                    </div>
                  </div><button type="button" onClick={() => setPostType(prev => prev === "question" ? "progress" : "question")} className={`p-2 rounded-full transition-colors ${postType === 'question' ? 'bg-orange-50 text-orange-500' : 'hover:bg-slate-50 hover:text-slate-600'}`}>
                    <HelpCircle size={18} />
                  </button>

                </div>
                <button
                  type="submit"
                  // Disable tombol jika input kosong ATAU sedang proses submit
                  disabled={!newPost.trim() || isSubmitting}
                  className="px-4 py-1.5 bg-primary-blue text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2 min-w-[80px] justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" /> // Animasi muter saat loading
                  ) : (
                    <>
                      Share <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Feed List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-primary-blue animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Memuat feed...</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={session?.user?.id}
              userRole={session?.user?.role}
              session={session}
              onDeletePost={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
            />
          ))
        )}
      </div>
    </div>
  );
}