"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/app/(actions)/profile";

export function FollowButton({
  targetUserId,
  isFollowing,
}: {
  targetUserId: string;
  isFollowing: boolean;
}) {
  const [following, setFollowing] = useState(isFollowing);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      setFollowing(!following);
      try {
        await toggleFollow(targetUserId);
      } catch {
        setFollowing(following);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        following
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      } disabled:opacity-60`}
    >
      {pending ? "Updating..." : following ? "Following" : "Follow"}
    </button>
  );
}
