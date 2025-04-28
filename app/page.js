"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [diaryText, setDiaryText] = useState("");

  useEffect(() => {
    if (session) {
      fetch("/diary.txt")
        .then((response) => response.text())
        .then((text) => setDiaryText(text))
        .catch((error) => console.error("Failed to load diary:", error));
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <button
          onClick={() => signIn("google")}
          className="p-4 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 mt-6 text-center">📖 My Diary</h1>
      
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-gray-700">{diaryText || "Loading..."}</pre>
      </div>

      <button
        onClick={() => signOut()}
        className="mt-6 p-3 bg-red-500 text-white rounded-lg text-lg hover:bg-red-600 transition"
      >
        Sign out
      </button>
    </div>
  );
}
