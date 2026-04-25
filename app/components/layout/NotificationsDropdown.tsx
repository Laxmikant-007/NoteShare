"use client";

import { useState } from "react";
import { markNotificationRead } from "@/app/(actions)/notifications";

type Notification = {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actor?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  noteId?: string | null;
};

export function NotificationsDropdown({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50 max-h-96 overflow-auto">
          <div className="p-3 border-b font-semibold">Notifications</div>

          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              No notifications yet.
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-sm ${n.read ? "bg-white" : "bg-indigo-50"}`}
                  onClick={async () => {
                    if (!n.read) {
                      await markNotificationRead(n.id);
                    }
                  }}
                >
                  <div className="font-medium text-gray-900">{n.message}</div>
                  <div className="text-gray-500 text-xs">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
