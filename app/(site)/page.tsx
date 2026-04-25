import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Share Notes. Learn Together.{" "}
            <span className="text-indigo-600">Grow Faster.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            NoteShare is where students and developers share notes, discover
            insights, and build streaks to stay consistent.
          </p>
          {session ? (
            <div className="flex gap-4 justify-center">
              <Link
                href="/explore"
                className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg"
              >
                Go to Explore
              </Link>
              <Link
                href="/note/new"
                className="px-8 py-3 bg-white text-indigo-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transition shadow border border-indigo-200"
              >
                Create Note
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="#features"
                className="px-8 py-3 bg-white text-indigo-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transition shadow border border-indigo-200"
              >
                Learn More
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div id="features" className="mt-24 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📤"
            title="Share Notes"
            description="Post notes with text, images, and files. Organize by tags and topics."
          />
          <FeatureCard
            icon="🔥"
            title="Build Streaks"
            description="Stay consistent with daily engagement. Earn badges and rewards."
          />
          <FeatureCard
            icon="👥"
            title="Learn Together"
            description="Follow peers, comment, like, and discover notes tailored to you."
          />
        </div>

        {/* Welcome Back Message for Logged-In Users */}
        {session && (
          <div className="mt-16 bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user?.name || "Friend"}! 👋
            </h2>
            <p className="text-gray-600">
              Ready to share something new or explore what others have posted?
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
