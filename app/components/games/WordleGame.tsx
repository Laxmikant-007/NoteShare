"use client";

import { useMemo, useState } from "react";

type Status = "correct" | "present" | "absent" | "empty";

function normalizeWord(word: string) {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

function getFeedback(guess: string, answer: string) {
  const result: Status[] = Array(5).fill("absent");
  const guessArr = guess.split("");
  const answerArr = answer.split("");

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct";
      answerArr[i] = "";
      guessArr[i] = "";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (!guessArr[i]) continue;
    const idx = answerArr.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i] = "present";
      answerArr[idx] = "";
    }
  }

  return result;
}

export function WordleGame({ answer }: { answer: string }) {
  const target = useMemo(() => {
    const clean = normalizeWord(answer);
    return clean.length >= 5 ? clean.slice(0, 5) : "notez";
  }, [answer]);

  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);

  const submitGuess = () => {
    const guess = normalizeWord(current);

    if (guess.length !== 5) {
      setMessage("Enter a 5-letter word.");
      return;
    }

    if (guesses.includes(guess)) {
      setMessage("You already tried this word.");
      return;
    }

    const nextGuesses = [...guesses, guess];
    setGuesses(nextGuesses);
    setCurrent("");
    setMessage("");

    if (guess === target) {
      setFinished(true);
      setMessage("Correct! You won.");
      return;
    }

    if (nextGuesses.length >= 6) {
      setFinished(true);
      setMessage(`Game over. Answer: ${target.toUpperCase()}`);
    }
  };

  const grid = Array.from({ length: 6 }, (_, row) => {
    const guess = guesses[row] || "";
    const feedback = guess
      ? getFeedback(guess, target)
      : Array(5).fill("empty");
    return { guess, feedback };
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-rows-6 gap-2">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }, (_, colIndex) => {
              const letter = row.guess[colIndex] || "";
              const status = row.feedback[colIndex];

              const cls =
                status === "correct"
                  ? "bg-green-500 text-white border-green-500"
                  : status === "present"
                    ? "bg-yellow-500 text-white border-yellow-500"
                    : status === "absent"
                      ? "bg-gray-500 text-white border-gray-500"
                      : "bg-white border-gray-300";

              return (
                <div
                  key={colIndex}
                  className={`h-12 w-12 rounded-md border flex items-center justify-center font-bold uppercase ${cls}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          maxLength={5}
          disabled={finished}
          className="flex-1 px-4 py-2 border rounded-lg uppercase tracking-widest"
          placeholder="Guess"
        />
        <button
          onClick={submitGuess}
          disabled={finished}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Guess
        </button>
      </div>

      {message && <p className="text-sm text-gray-600">{message}</p>}
      <p className="text-xs text-gray-500">
        Guess the word related to this note in 6 tries.
      </p>
    </div>
  );
}
