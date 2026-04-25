export const metadata = {
  title: "About | NoteShare",
  description:
    "Learn more about NoteShare, a social notes platform for sharing ideas, notes, and learning together.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About NoteShare
          </h1>
          <p className="text-gray-700 text-lg leading-8 max-w-3xl">
            NoteShare is a social notes platform built for students, developers,
            and curious learners. Users can create notes, attach images or PDFs,
            explore public notes, comment, like, follow creators, and even play
            a small word game based on note content.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 rounded-2xl bg-indigo-50">
              <h2 className="font-semibold text-gray-900 mb-2">Share Notes</h2>
              <p className="text-sm text-gray-700">
                Publish ideas, study notes, and resources in one place.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-green-50">
              <h2 className="font-semibold text-gray-900 mb-2">
                Discover Content
              </h2>
              <p className="text-sm text-gray-700">
                Search, filter, and explore notes from the community.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-purple-50">
              <h2 className="font-semibold text-gray-900 mb-2">Interact</h2>
              <p className="text-sm text-gray-700">
                Like, comment, follow, and engage with authors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
