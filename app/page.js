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
      <div className="flex items-center justify-center min-h-screen">
        <button onClick={() => signIn("google")} className="p-4 bg-blue-500 text-white rounded">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Diary</h1>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
        {diaryText || "Loading..."}
      </pre>
      <button onClick={() => signOut()} className="mt-4 p-2 bg-red-500 text-white rounded">
        Sign out
      </button>
    </div>
  );
}
