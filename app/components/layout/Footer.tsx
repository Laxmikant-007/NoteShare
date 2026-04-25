import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold text-gray-900">NoteShare</p>
            <p className="text-sm text-gray-500 mt-1">
              Share notes, discover ideas, and learn together.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <Link href="/explore" className="hover:text-indigo-600 transition">
              Explore
            </Link>
            <Link href="/about" className="hover:text-indigo-600 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-indigo-600 transition">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-indigo-600 transition">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-xs text-gray-500">
          © 2026 NoteShare. Built with Next.js and Prisma.
        </div>
      </div>
    </footer>
  );
}
