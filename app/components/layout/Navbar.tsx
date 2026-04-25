import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/app/utils/prisma";
import { NotificationsDropdown } from "./NotificationsDropdown";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  const notifications = session
    ? await prisma.notification.findMany({
        where: { userId: session.user.id },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : [];

  return (
    <nav className="bg-white/90 backdrop-blur border-b border-gray-300 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          📝 NoteShare
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/explore"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Explore
              </Link>
              <Link
                href={`/profile/${session.user.id}`}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Profile
              </Link>
              <Link
                href="/note/new"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                New Note
              </Link>
              <NotificationsDropdown notifications={notifications} />
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
