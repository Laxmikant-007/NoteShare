"use server";

import { prisma } from "@/app/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";

export async function createNotification({
  userId,
  actorId,
  noteId,
  type,
  message,
}: {
  userId: string;
  actorId?: string;
  noteId?: string;
  type: string;
  message: string;
}) {
  return prisma.notification.create({
    data: {
      userId,
      actorId,
      noteId,
      type,
      message,
    },
  });
}

export async function markNotificationRead(notificationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId: session.user.id,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/");
}
