type ProfileHeaderProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    bio: string | null;
    interests: string | null;
    createdAt: Date;
    _count: {
      notes: number;
      following: number;
      followedBy: number;
    };
  };
  isOwnProfile: boolean;
  followButton?: React.ReactNode;
};

export function ProfileHeader({
  user,
  isOwnProfile,
  followButton,
}: ProfileHeaderProps) {
  const interests = user.interests ? JSON.parse(user.interests) : [];

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.image || "/default-avatar.svg"}
            alt={user.name || "User"}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name || "Unnamed User"}
            </h1>
            <p className="text-gray-500">{user.email}</p>
            {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3">
          {followButton}
          {isOwnProfile && (
            <span className="text-sm text-indigo-600 font-medium">
              This is your profile
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
        <Stat label="Notes" value={user._count.notes} />
        <Stat label="Followers" value={user._count.followedBy} />
        <Stat label="Following" value={user._count.following} />
      </div>

      {interests.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">
            Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest: string) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm"
              >
                #{interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center bg-gray-50 rounded-xl py-4">
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
