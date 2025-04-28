"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [diaryText, setDiaryText] = useState("");

  useEffect(() => {
    fetch("/dairy.txt")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load dairy.txt");
        }
        return res.text();
      })
      .then((text) => setDiaryText(text))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">My Dairy</h1>
      <pre className="bg-white p-4 rounded shadow whitespace-pre-wrap">
        {diaryText || "Loading..."}
      </pre>
    </div>
  );
}
