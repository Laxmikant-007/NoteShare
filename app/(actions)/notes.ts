"use server";

import { prisma } from "@/app/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export async function createNote(formData: FormData) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Extract data
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tagsInput = formData.get("tags") as string;
    const mediaUrlsJson = formData.get("mediaUrls") as string;

    // Validate
    if (!title || !content) {
      return { error: "Title and content are required" };
    }

    if (title.length > 100) {
      return { error: "Title must be less than 100 characters" };
    }

    // Parse tags and media URLs
    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const mediaUrls = mediaUrlsJson ? JSON.parse(mediaUrlsJson) : [];

    // Create note
    const note = await prisma.note.create({
      data: {
        title,
        content,
        tags: JSON.stringify(tags),
        mediaUrls: JSON.stringify(mediaUrls),
        authorId: session.user.id,
      },
    });

    // Update user's streak
    await updateStreak(session.user.id);

    // Revalidate explore page and redirect
    revalidatePath("/explore");
    // DO NOT redirect here
    return { success: true, noteId: note.id }; // send back id
  } catch (error) {
    console.error("Create note error:", error);
    return { error: "Failed to create note" };
  }
}

export async function updateStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = await prisma.streak.findUnique({
    where: { userId },
  });

  if (!streak) {
    await prisma.streak.create({
      data: { userId, count: 1, lastActive: today },
    });
    return;
  }

  const lastActive = new Date(streak.lastActive);
  lastActive.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return; // Already active today
  } else if (diffDays === 1) {
    await prisma.streak.update({
      where: { userId },
      data: { count: streak.count + 1, lastActive: today },
    });
  } else {
    await prisma.streak.update({
      where: { userId },
      data: { count: 1, lastActive: today }, // Reset streak
    });
  }
}

export async function addComment(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const noteId = formData.get("noteId") as string;
    const content = formData.get("content") as string;

    if (!content || content.trim().length === 0) {
      return { error: "Comment cannot be empty" };
    }

    if (content.trim().length > 500) {
      return { error: "Comment too long. Max 500 characters." };
    }

    await prisma.$transaction([
      prisma.comment.create({
        data: {
          content: content.trim(),
          noteId,
          authorId: session.user.id,
        },
      }),
      prisma.note.update({
        where: { id: noteId },
        data: { commentsCount: { increment: 1 } },
      }),
    ]);

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      select: { authorId: true },
    });

    if (note && note.authorId !== session.user.id) {
      await createNotification({
        userId: note.authorId,
        actorId: session.user.id,
        noteId,
        type: "COMMENT",
        message: "commented on your note",
      });
    }

    revalidatePath(`/note/${noteId}`);
  } catch (error) {
    console.error("Add comment error:", error);
    return { error: "Failed to add comment" };
  }
}

export async function toggleLike(noteId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_noteId: {
        userId,
        noteId,
      },
    },
  });

  if (existingLike) {
    await prisma.$transaction([
      prisma.like.delete({
        where: { userId_noteId: { userId, noteId } },
      }),
      prisma.note.update({
        where: { id: noteId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.like.create({
        data: { userId, noteId },
      }),
      prisma.note.update({
        where: { id: noteId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    // after like creation only
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      select: { authorId: true },
    });

    if (note && note.authorId !== userId) {
      await createNotification({
        userId: note.authorId,
        actorId: userId,
        noteId,
        type: "LIKE",
        message: `${session.user.name} liked your note`,
      });
    }
  }

  revalidatePath(`/note/${noteId}`);
  revalidatePath("/explore");
}
