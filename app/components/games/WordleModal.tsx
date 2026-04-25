"use client";

import { useEffect, useState } from "react";
import { WordleGame } from "./WordleGame";

export function WordleModal({
  answer,
  onClose,
}: {
  answer: string;
  onClose?: () => void;
}) {
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <div
        className={`pointer-events-auto w-full max-w-md bg-white shadow-2xl rounded-2xl border overflow-hidden transition-all duration-200 ${
          minimized ? "h-14" : "h-auto"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div className="font-semibold text-gray-800">Word Game</div>
          <div className="flex gap-2">
            <button
              onClick={() => setMinimized((v) => !v)}
              className="px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
            >
              {minimized ? "Restore" : "Minimize"}
            </button>
            <button
              onClick={() => onClose?.()}
              className="px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200"
            >
              Close
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="p-4">
            <WordleGame answer={answer} />
          </div>
        )}
      </div>
    </div>
  );
}
