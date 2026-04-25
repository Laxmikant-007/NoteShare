import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/utils/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NoteCard } from "@/app/components/notes/NoteCard";
import { CommentSection } from "@/app/components/notes/CommentSection";

// Dynamic route for note details
export default async function NotePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const id = (await params).id;

  // Fetch note with author and comments
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      author: true,
      likes: {
        where: { userId: session.user.id },
        select: { id: true },
      },
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!note) {
    redirect("/explore");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Note Card */}
        <NoteCard note={note} showAuthor={true} />

        {/* Comment Section */}
        <div className="mt-12">
          <CommentSection
            noteId={note.id}
            initialComments={note.comments}
            currentUser={session.user}
          />
        </div>
      </main>
    </div>
  );
}
