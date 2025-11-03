'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [diaryContent, setDiaryContent] = useState('');

  useEffect(() => {
    fetch('/diary.txt')
      .then((res) => res.text())
      .then((text) => {
        const entries = text.split(/(?=^##### DATE: \d{4}-\d{2}-\d{2} ##########)/gm);

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
        width: '100%',
        maxWidth: '100%',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>My Diary</h1>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          overflowWrap: 'break-word',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {diaryContent}
      </pre>
    </main>
  );
}

