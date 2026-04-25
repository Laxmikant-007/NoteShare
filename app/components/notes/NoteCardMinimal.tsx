import Link from "next/link";

type NoteCardMinimalProps = {
  note: {
    id: string;
    title: string;
    content: string;
    createdAt: Date | string;
    likesCount: number;
    commentsCount: number;
    mediaUrls?: string | null;
    author?: {
      id: string;
      name?: string | null;
      image?: string | null;
    };
  };
};

function getPreview(text: string) {
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

function hasPdf(mediaUrls?: string | null) {
  if (!mediaUrls) return false;
  try {
    const parsed = JSON.parse(mediaUrls);
    return Array.isArray(parsed) && parsed.some((u) => u.type == "pdf");
  } catch {
    return false;
  }
}

function hasImage(mediaUrls?: string | null) {
  if (!mediaUrls) return false;
  try {
    const parsed = JSON.parse(mediaUrls);

    return Array.isArray(parsed) && parsed.some((u) => u.type == "image");
  } catch {
    return false;
  }
}

export function NoteCardMinimal({ note }: NoteCardMinimalProps) {
  const pdf = hasPdf(note.mediaUrls);
  const image = hasImage(note.mediaUrls);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition">
      <div className="flex items-start gap-3 mb-4">
        <Link href={`/profile/${note.author?.id || ""}`} className="shrink-0">
          <img
            src={note.author?.image || "/default-avatar.svg"}
            alt={note.author?.name || "User"}
            className="w-10 h-10 rounded-full object-cover "
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/profile/${note.author?.id || ""}`}
              className="font-semibold text-gray-900 hover:text-indigo-600 transition truncate"
            >
              {note.author?.name || "Anonymous"}
            </Link>
            <span className="text-xs text-gray-500 shrink-0">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-bold text-gray-900">{note.title}</h3>
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-6 line-clamp-3">
        {getPreview(note.content)}
      </p>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        {pdf && (
          <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-600 border border-red-100">
            PDF attached
          </span>
        )}
        {image && (
          <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-100">
            Image attached
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>❤️ {note.likesCount}</span>
          <span>💬 {note.commentsCount}</span>
        </div>

        <Link
          href={`/note/${note.id}`}
          className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}
