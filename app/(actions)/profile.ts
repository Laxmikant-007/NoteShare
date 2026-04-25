"use server";

import { prisma } from "@/app/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export async function toggleFollow(targetUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const followerId = session.user.id;

  if (followerId === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUserId,
        },
      },
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId,
        followingId: targetUserId,
      },
    });

    await createNotification({
      userId: targetUserId,
      actorId: followerId,
      type: "FOLLOW",
      message: `${session.user.name} started following you`,
    });
  }

  revalidatePath(`/profile/${targetUserId}`);
  revalidatePath("/explore");
}
