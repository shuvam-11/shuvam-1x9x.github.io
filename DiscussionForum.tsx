import React, { useState } from 'react';
import { ForumPost, User } from '../types';
import { api } from '../services/api';
import { MessageSquare, ThumbsUp, Send, Plus, Tag, User as UserIcon, ShieldCheck, Sparkles, X } from 'lucide-react';

interface DiscussionForumProps {
  posts: ForumPost[];
  user: User;
  onRefresh: () => void;
}

export const DiscussionForum: React.FC<DiscussionForumProps> = ({ posts, user, onRefresh }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('Placement Prep');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const tags = ['All', 'Placement Prep', 'System Design', 'DSA', 'Interview Prep', 'General'];

  const filteredPosts = posts.filter((p) => {
    if (selectedTag === 'All') return true;
    return p.tags?.includes(selectedTag);
  });

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await api.createForumPost(title, content, [tagInput]);
      setTitle('');
      setContent('');
      setIsCreating(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    try {
      await api.addForumComment(postId, text.trim());
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await api.likeForumPost(postId);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" /> Student Discussion & Placement Community
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ask placement queries, share interview experiences, discuss coding solutions, and learn together.
          </p>
        </div>

        <button
          id="btn-ask-forum-question"
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Ask Question / Start Discussion
        </button>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTag === t
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* New Post Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">New Community Discussion Post</h3>
              <button onClick={() => setIsCreating(false)} className="p-1 rounded-full hover:bg-white/10">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title / Question</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Best resources for system design interviews?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Topic Tag</label>
                <select
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="Placement Prep">Placement Prep</option>
                  <option value="System Design">System Design</option>
                  <option value="DSA">DSA</option>
                  <option value="Interview Prep">Interview Prep</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Explanation</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide context or specific topics you'd like guidance on..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Publish Post</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forum Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isLiked = post.likedBy?.includes(user.id);

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{post.authorName}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          post.authorRole === 'admin'
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        }`}
                      >
                        {post.authorRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {post.tags?.map((tg, idx) => (
                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md">
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{post.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{post.content}</p>
              </div>

              {/* Like / Reply Action Controls */}
              <div className="flex items-center gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 font-bold transition-colors ${
                    isLiked ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-blue-600 text-blue-600' : ''}`} />
                  <span>{post.likes} Upvotes</span>
                </button>

                <span className="text-slate-400 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> {post.comments.length} Comments
                </span>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-2 pt-2 text-xs">
                  {post.comments.map((cmt) => (
                    <div key={cmt.id} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{cmt.authorName}</span>
                        <span className="text-[10px] text-slate-400">{cmt.createdAt}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-normal">{cmt.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  placeholder="Write a community reply..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="px-3.5 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Reply
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
