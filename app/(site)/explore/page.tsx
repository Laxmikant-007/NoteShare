import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/app/utils/prisma";
import { NoteCard } from "@/app/components/notes/NoteCard";
import { NoteCardMinimal } from "@/app/components/notes/NoteCardMinimal";

// Optional: basic pagination limits
const ITEMS_PER_PAGE = 5;

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; tag?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  await searchParams;

  const page = parseInt((await searchParams).page || "1", 10);
  const search = (await searchParams).search || "";
  const tag = (await searchParams).tag || "";

  const skip = (page - 1) * ITEMS_PER_PAGE;

  // Build query filters
  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }

  if (tag) {
    whereClause.tags = {
      contains: tag,
    };
  }

  const notes = await prisma.note.findMany({
    where: whereClause,
    include: {
      likes: {
        where: { userId: session.user.id },
        select: { id: true },
      },
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
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
    orderBy: { createdAt: "desc" },
    skip,
    take: ITEMS_PER_PAGE + 1, // Take one extra to detect “has more”
  });

  const hasNext = notes.length > ITEMS_PER_PAGE;
  const items = hasNext ? notes.slice(0, ITEMS_PER_PAGE) : notes;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search + Tag Filter */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Discover Notes
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search in notes
              </label>
              <form className="flex gap-2">
                <input
                  type="text"
                  id="search"
                  name="search"
                  defaultValue={search}
                  placeholder="Search titles or content..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Search
                </button>
              </form>
            </div>
            <div>
              <label
                htmlFor="tag"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by tag
              </label>
              <form className="flex gap-2">
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  defaultValue={tag}
                  placeholder="Enter a tag..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Filter
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Notes list */}
        <div className="space-y-6">
          {items.length > 0 ? (
            items.map((note) => (
              <div key={note.id}>
                <NoteCardMinimal note={note} />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium mb-2">No notes found</p>
              <p>Try a different search or remove filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {items.length > 0 && (
          <div className="flex justify-between mt-8">
            {page > 1 && (
              <form className="flex-1">
                <button
                  type="submit"
                  name="page"
                  value={page - 1}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  ← Previous
                </button>
              </form>
            )}
            {(page === 1 || hasNext) && (
              <form className="flex-1 text-right">
                <button
                  type="submit"
                  name="page"
                  value={page + 1}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Next →
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
