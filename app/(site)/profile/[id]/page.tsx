import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/app/utils/prisma";
import { ProfileHeader } from "@/app/components/profile/ProfileHeader";
import { NoteCard } from "@/app/components/notes/NoteCard";
import { FollowButton } from "@/app/components/profile/FollowButton";

type PageProps = {
  params: { id: string };
};

export default async function ProfilePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const profileUser = await prisma.user.findUnique({
    where: { id: (await params).id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      interests: true,
      createdAt: true,
      _count: {
        select: {
          notes: true,
          following: true,
          followedBy: true,
        },
      },
    },
  });

  if (!profileUser) {
    notFound();
  }

  const notes = await prisma.note.findMany({
    where: { authorId: (await params).id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const isOwnProfile = session.user.id === profileUser.id;

  const existingFollow = isOwnProfile
    ? null
    : await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: profileUser.id,
          },
        },
      });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile}
          followButton={
            !isOwnProfile ? (
              <FollowButton
                targetUserId={profileUser.id}
                isFollowing={!!existingFollow}
              />
            ) : null
          }
        />

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Notes by {profileUser.name || "User"}
          </h2>

          {notes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
              No notes yet.
            </div>
          ) : (
            <div className="space-y-6">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} showAuthor={false} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
