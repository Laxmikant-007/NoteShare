"use client";

import { useState } from "react";

export function PdfPreview({ url }: { url: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        {open ? "Hide PDF Preview" : "Preview PDF 📄"}
      </button>

      {open && (
        <div className="mt-4 border rounded-xl overflow-hidden bg-gray-50">
          <div className="h-[700px] w-full">
            <iframe
              src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              title="PDF preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
