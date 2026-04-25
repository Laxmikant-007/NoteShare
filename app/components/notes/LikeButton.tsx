"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toggleLike } from "@/app/(actions)/notes";
// import type { Note } from "@prisma/client";

interface LikeButtonProps {
  noteId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({
  noteId,
  initialLiked,
  initialCount,
}: LikeButtonProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const handleClick = async () => {
    if (!session) {
      return;
    }

    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    try {
      await toggleLike(noteId);
    } catch (error) {
      console.error("Like failed:", error);
      setLiked(liked);
      setCount(count);
    }
  };


  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 ${
        liked ? "text-red-500" : "text-gray-600"
      } hover:scale-105 transition`}
    >
      ❤️ {count}
    </button>
  );
}
