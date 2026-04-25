"use client";

import { useEffect, useState } from "react";
import { LikeButton } from "./LikeButton";
import type { Note } from "@prisma/client";
import Link from "next/link";
import { PdfPreview } from "@/app/components/notes/PdfPreview";
import { WordleModal } from "@/app/components/games/WordleModal";
import { getWordleAnswerFromNote } from "@/app/components/games/wordleAnswer";

interface NoteCardProps {
  note: Note & {
    author?: {
      id: string;
      name?: string | null;
      image?: string | null;
    };
    likes?: { id: string }[];
    comments?: {
      id: string;
      content: string;
      createdAt: Date;
      author: {
        id: string;
        name?: string | null;
        image?: string | null;
      };
    }[];
  };
  showAuthor?: boolean;
  compact?: boolean;
}

export function NoteCard({ note, showAuthor = true }: NoteCardProps) {
  const mediaItems:
    | {
        url: string;
        type: "image" | "pdf";
      }[]
    | null = note.mediaUrls ? JSON.parse(note.mediaUrls) : [];

  const [gameOpen, setGameOpen] = useState(false);
  const [gameWord, setGameWord] = useState("");

  useEffect(() => {
    async function loadGameWord() {
      setGameWord(
        await getWordleAnswerFromNote({
          title: note.title,
          content: note.content,
          tags: note.tags,
          mediaUrls: note.mediaUrls,
        }),
      );
    }

    loadGameWord();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      {showAuthor && note.author && (
        <div className="flex items-center gap-3 mb-4">
          <img
            src={note.author.image || "/default-avatar.svg"}
            alt={note.author.name || "User"}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <span className="font-semibold text-gray-900">
              <Link href={`/profile/${note.author.id}`}>
                {note.author.name || "Anonymous"}
              </Link>
            </span>
            <p className="text-sm text-gray-500">
              {new Date(note.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
      )}

      <Link href={`/note/${note.id}`}>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{note.title}</h3>
      </Link>
      <p className="text-gray-700 leading-relaxed">{note.content}</p>

      {/* Media */}
      {mediaItems && mediaItems.length > 0 && (
        <div className="mt-4  gap-4">
          {mediaItems.map((item, i) => (
            <div key={i}>
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={`Media ${i + 1}`}
                  className="w-full rounded-lg max-h-64 object-cover"
                />
              ) : (
                <PdfPreview url={item.url} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {note.tags && (
        <div className="flex flex-wrap gap-2 mt-4">
          {JSON.parse(note.tags as string).map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* wordle */}
      <button
        onClick={() => setGameOpen((val) => !val)}
        className="mt-4 px-4 py-2 bg-purple-200 text-white rounded-lg hover:bg-purple-300 transition"
      >
        🎮
      </button>

      {gameOpen && (
        <WordleModal answer={gameWord} onClose={() => setGameOpen(false)} />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6 text-gray-600">
          <LikeButton
            noteId={note.id}
            initialLiked={(note.likes?.length || 0) > 0}
            initialCount={note.likesCount}
          />
          <button
            onClick={() => {
              const commentInput = document.getElementById("comment-input");
              commentInput?.focus();
            }}
            className="flex items-center gap-1 hover:scale-105 transition"
          >
            💬 {note.comments?.length || 0}
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {note.comments?.length || 0} comments
        </span>
      </div>
    </div>
  );
}
