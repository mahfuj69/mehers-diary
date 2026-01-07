'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [diaryContent, setDiaryContent] = useState('');

  useEffect(() => {
    fetch('/diary.txt')
      .then((res) => res.text())
      .then((text) => {
        const entries = text.split(
          /(?=^##### DATE: \d{4}-\d{2}-\d{2} ##########)/gm
        );

        const reversed = entries
          .map((e) => e.trimEnd())
          .reverse()
          .join('\n\n');

        setDiaryContent(reversed);
      })
      .catch((err) => {
        console.error('Failed to load diary:', err);
        setDiaryContent('Failed to load diary content.');
      });
  }, []);

  return (
    <main
      style={{
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '1.4rem',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        My Diary
      </h1>

      {/* Scrollable diary box */}
      <div
        style={{
          maxHeight: '75vh',
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '10px',
          border: '1px solid #ccc',
        }}
      >
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: '1.6',
          }}
        >
          {diaryContent}
        </pre>
      </div>
    </main>
  );
}
