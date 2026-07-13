/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  MessageSquare, 
  ThumbsUp, 
  PlusCircle, 
  ChevronRight, 
  Calendar, 
  User2,
  X,
  Send
} from "lucide-react";
import { COMMUNITY_POSTS } from "../data";
import { CommunityPost, Reply } from "../types";
import { useAuth } from "../contexts";
import { PageRenderer } from "./blocks";
import type { PageBlock } from "./blocks";

export default function ComunidadSection() {
  const { userName } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  
  // New reply state
  const [replyContent, setReplyContent] = useState("");
  
  // New post state
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<CommunityPost["category"]>("General");
  const [newPostContent, setNewPostContent] = useState("");

  const categories = ["Todos", "General", "Suelos", "Biofertilizantes", "Riego", "Plagas", "Casos de Éxito"];

  const filteredPosts = posts.filter((post) => {
    return selectedCategory === "Todos" || post.category === selectedCategory;
  });

  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prevPosts => 
      prevPosts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
    );
    // If the selected post is open, update it as well
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleAddReply = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const newReply: Reply = {
      id: `rep-${Date.now()}`,
      author: userName || "Estudiante de Agricultura Antigua",
      content: replyContent,
      date: "Hace un momento"
    };

    setPosts(prevPosts => 
      prevPosts.map(p => {
        if (p.id === postId) {
          const updatedReplies = [...p.replies, newReply];
          return { ...p, replies: updatedReplies };
        }
        return p;
      })
    );

    // Sync selected post
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, replies: [...prev.replies, newReply] } : null);
    }

    setReplyContent("");
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: newPostTitle,
      category: newPostCategory,
      author: userName || "Estudiante de Agricultura Antigua",
      content: newPostContent,
      date: "Hace un momento",
      likes: 0,
      replies: []
    };

    setPosts(prev => [newPost, ...prev]);
    
    // Reset form states
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostCategory("General");
    setShowNewPostForm(false);
  };

  return (
    <div className="space-y-8 py-4" id="comunidad-section">
      {/* Header */}
      <PageRenderer blocks={[{
        type: 'hero',
        id: 'comunidad-hero',
        props: {
          badge: 'Espacio de Intercambio',
          title: 'Foro & Comunidad de Saberes',
          subtitle: 'Conectamos a agricultores de diferentes regiones para compartir sus experiencias de campo, resolver dudas técnicas de forma conjunta y documentar casos de éxito reales en agricultura biológica.',
          backgroundImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=100&w=2400',
        },
      }]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Col: Filters and Create Post button */}
        <div className="lg:col-span-1 space-y-4">
          <button
            onClick={() => setShowNewPostForm(true)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-stone-50 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            id="create-post-btn"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>Hacer una Pregunta</span>
          </button>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
            <h4 className="text-xs font-mono uppercase text-stone-500 font-semibold tracking-wide">Categorías de Discusión</h4>
            <div className="flex flex-col space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Posts List or Active post Detail */}
        <div className="lg:col-span-3 space-y-4">
          {selectedPost ? (
            /* Selected Post Detailed view */
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6" id="comunidad-post-detail">
              <button
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
                id="back-to-forum-btn"
              >
                <X className="h-4 w-4" />
                <span>Volver al Foro</span>
              </button>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                    {selectedPost.category}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {selectedPost.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-950 leading-snug">
                    {selectedPost.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <User2 className="h-3.5 w-3.5 text-stone-400" />
                    <span>Iniciado por: <strong>{selectedPost.author}</strong></span>
                  </div>
                </div>

                <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-sans bg-white p-5 rounded-xl border border-stone-100">
                  {selectedPost.content}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-stone-400">
                  <button 
                    onClick={(e) => handleLikePost(selectedPost.id, e)}
                    className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4 text-stone-400" />
                    <span>{selectedPost.likes} Me Gusta</span>
                  </button>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-stone-400" />
                    <span>{selectedPost.replies.length} Respuestas</span>
                  </span>
                </div>
              </div>

              {/* Replies Section */}
              <div className="space-y-4 pt-6 border-t border-stone-200">
                <h4 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-tight">Comentarios e Intercambio Técnico</h4>
                
                {selectedPost.replies.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPost.replies.map((reply) => (
                      <div key={reply.id} className="p-4 bg-white border border-stone-100 rounded-2xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-stone-800 font-serif">{reply.author}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{reply.date}</span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed font-sans">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">No hay respuestas todavía. ¡Sé el primero en compartir tu experiencia agrícola!</p>
                )}

                {/* Reply Form */}
                <form onSubmit={(e) => handleAddReply(selectedPost.id, e)} className="flex gap-2 pt-2" id="reply-form">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Escribe tu consejo o respuesta técnica para este compañero..."
                    className="flex-grow rounded-xl bg-stone-100 hover:bg-stone-200/50 focus:bg-stone-50 border border-stone-200 focus:border-emerald-500 text-xs px-4 py-3 outline-none transition-all"
                    id="reply-input"
                  />
                  <button
                    type="submit"
                    disabled={!replyContent.trim()}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-stone-50 px-4 py-3 flex items-center justify-center transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* General list view of posts */
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="p-5 bg-stone-50 border border-stone-200 hover:border-emerald-300 rounded-2xl cursor-pointer transition-all hover:shadow-md flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {post.date}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-mono">Por: {post.author}</p>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100/80 flex items-center justify-between text-xs font-mono text-stone-400">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => handleLikePost(post.id, e)}
                        className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
                      >
                        <ThumbsUp className="h-3.5 w-3.5 text-stone-400" />
                        <span>{post.likes}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-stone-400" />
                        <span>{post.replies.length}</span>
                      </span>
                    </div>
                    
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform font-sans">
                      <span>Ver discusión</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Post Dialog Modal */}
      {showNewPostForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-stone-50 border border-stone-200 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Formular Pregunta / Compartir Saber</h3>
              <button 
                onClick={() => setShowNewPostForm(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4" id="create-post-form">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wide">Título de la Pregunta o Caso</label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Ej. ¿Cómo calibrar la humedad del Bokashi para clima templado?"
                  className="w-full rounded-xl bg-stone-100 hover:bg-stone-200/50 focus:bg-stone-50 border border-stone-200 focus:border-emerald-500 text-xs px-4 py-3 outline-none transition-all"
                  id="new-post-title"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wide">Categoría del Tema</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value as CommunityPost["category"])}
                  className="w-full rounded-xl bg-stone-100 focus:bg-stone-50 border border-stone-200 focus:border-emerald-500 text-xs px-4 py-3 outline-none transition-all"
                  id="new-post-category"
                >
                  <option value="General">General</option>
                  <option value="Suelos">Suelos</option>
                  <option value="Biofertilizantes">Biofertilizantes</option>
                  <option value="Riego">Riego</option>
                  <option value="Plagas">Plagas</option>
                  <option value="Casos de Éxito">Casos de Éxito</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wide">Describe detalladamente tu consulta o experiencia</label>
                <textarea
                  required
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Por favor, explica detalladamente. Si estás reportando un problema, indica la región, el cultivo afectado y si has realizado pruebas previas."
                  className="w-full rounded-xl bg-stone-100 hover:bg-stone-200/50 focus:bg-stone-50 border border-stone-200 focus:border-emerald-500 text-xs px-4 py-3 outline-none transition-all"
                  id="new-post-content"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors hover:bg-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-stone-50 text-xs font-semibold rounded-xl transition-colors hover:bg-emerald-700"
                >
                  Publicar en el Foro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
