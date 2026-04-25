import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NoteForm } from "@/app/components/notes/NoteForm";

export default async function NewNotePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Create New Note</h2>
          <p className="text-gray-600 mt-1">
            Share your knowledge with the community
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md">
          <NoteForm />
        </div>
      </main>
    </div>
  );
}
