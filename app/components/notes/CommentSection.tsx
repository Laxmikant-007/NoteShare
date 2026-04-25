"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addComment } from "@/app/(actions)/notes";
import type { Comment, User } from "@prisma/client";

interface CommentSectionProps {
  noteId: string;
  initialComments: Comment[] &
    {
      author: User & {
        id: string;
        name?: string | null;
        image?: string | null;
      };
    }[];
  currentUser: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
}

export function CommentSection({
  noteId,
  initialComments,
  currentUser,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Array<Comment>>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("noteId", noteId);
    formData.append("content", content);

    const result = await addComment(formData);

    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    // Optimistic update
    const newComment = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      author: currentUser,
    };

    setComments([...comments, newComment]);
    setContent("");
    setSubmitting(false);

    // Revalidate the page (server-side)
    router.refresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <img
            src={currentUser.image || "/default-avatar.svg"}
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              id="comment-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {content.length}/500 characters
              </span>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 rounded-lg hover:bg-gray-50 transition"
            >
              <img
                src={comment.author.image || "/default-avatar.svg"}
                alt={comment.author.name || "User"}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {comment.author.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
