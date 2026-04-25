import { PDFParse } from "pdf-parse";

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "below",
  "could",
  "every",
  "first",
  "found",
  "great",
  "house",
  "large",
  "learn",
  "notes",
  "other",
  "their",
  "there",
  "these",
  "thing",
  "think",
  "title",
  "today",
  "using",
  "where",
  "which",
  "while",
  "world",
  "would",
  "about",
  "above",
  "below",
  "under",
  "over",
  "into",
  "from",
  "your",
  "have",
  "with",
  "that",
  "this",
  "they",
  "them",
  "then",
  "when",
  "what",
  "were",
  "been",
  "will",
  "just",
  "like",
  "more",
  "some",
  "time",
  "does",
  "done",
  "make",
  "made",
  "many",
  "much",
  "such",
]);

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFiveLetterWords(text: string) {
  const normalized = normalizeText(text);
  return (normalized.match(/\b[a-z]{5}\b/g) || []).filter(
    (word) => !STOP_WORDS.has(word),
  );
}

function scoreWords(words: string[], sourceText: string) {
  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return sourceText.indexOf(a[0]) - sourceText.indexOf(b[0]);
    })
    .map(([word]) => word);
}

export async function extractPdfTextFromBuffer(url: string) {
  const parser = new PDFParse({ url });

  const data = await parser.getText();
  console.log("pdftext", data.text);
  return data.text || "";
}

export async function getWordleAnswerFromNote(note: {
  title: string;
  content: string;
  tags?: string | null;
  mediaUrls?: string | null;
}) {
  const parts: string[] = [];

  if (note.title) parts.push(note.title);
  if (note.content) parts.push(note.content);

  if (note.tags) {
    try {
      const parsed = JSON.parse(note.tags);
      if (Array.isArray(parsed)) parts.push(parsed.join(" "));
    } catch {
      parts.push(note.tags);
    }
  }

  const sourceText = parts.join(" ");
  let candidateWords = extractFiveLetterWords(sourceText);

  // If you store PDFs in mediaUrls, try to extract text from them too.
  // This function expects PDF URLs to be readable by your app/server.
  // If you don't want remote fetching here, call the PDF helper separately in your server page.
  if (candidateWords.length === 0 && note.mediaUrls) {
    try {
      const media = JSON.parse(note.mediaUrls);
      if (Array.isArray(media)) {
        const pdfUrl = media.find(
          (url) => typeof url === "string" && /\.pdf(\?|$)/i.test(url),
        );
        console.log("url", pdfUrl);
        if (pdfUrl) {
          const pdfText = await extractPdfTextFromBuffer(pdfUrl);
          candidateWords = extractFiveLetterWords(pdfText);
        }
      }
    } catch {
      // ignore parsing/fetch errors and fall through
    }
  }

  const scored = scoreWords(candidateWords, sourceText);

  if (scored.length > 0) return scored[0];

  // fallback words
  const fallbacks = [
    "notes",
    "study",
    "react",
    "prism",
    "share",
    "write",
    "learn",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
