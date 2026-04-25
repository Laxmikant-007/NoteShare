export const metadata = {
  title: "Contact | NoteShare",
  description: "Get in touch with the NoteShare team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-gray-700 leading-7 mb-6">
              Have feedback, a bug report, or a collaboration idea? Reach out
              and we’ll get back to you.
            </p>

            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Email:</span>{" "}
                support@noteshare.app
              </p>
              <p>
                <span className="font-semibold text-gray-900">Location:</span>{" "}
                Delhi, India
              </p>
              <p>
                <span className="font-semibold text-gray-900">Hours:</span>{" "}
                Mon–Fri, 9 AM to 6 PM
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Send a Message
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                rows={5}
                placeholder="Your message"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
