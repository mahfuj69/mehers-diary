'use client';

import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

const allowedEmails = [
  'mahguj@gmail.com',
  'mahfuuuj@gmail.com',
  'samiaislamsua16@gmail.com',
];

export default function Home() {
  const [userEmail, setUserEmail] = useState(null);
  const [diaryContent, setDiaryContent] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const email = decoded.email;

    if (allowedEmails.includes(email)) {
      setUserEmail(email);
      setIsAuthorized(true);
    } else {
      setUserEmail(null);
      setIsAuthorized(false);
      alert('You are not authorized to view the diary.');
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetch('/diary.txt')
        .then((res) => res.text())
        .then((text) => {
          // Split entries by the date header format: ##### DATE: YYYY-MM-DD ##########
          const entries = text.split(/(?=^##### DATE: \d{4}-\d{2}-\d{2} ##########)/gm);

          // Check the result of the split
          console.log('Entries split:', entries);

          // Reverse the entries while preserving the formatting
          const reversed = entries
            .map((e) => e.trimEnd()) // Trim extra spaces or newlines
            .reverse() // Reverse the entries
            .join('\n\n'); // Join them back with double newlines between entries

          setDiaryContent(reversed);
        })
        .catch((err) => {
          console.error('Failed to load diary:', err);
          setDiaryContent('Failed to load diary content.');
        });
    }
  }, [isAuthorized]);

  return (
    <GoogleOAuthProvider clientId="195839471495-akcgks1mbgf2utk9300f3ki94c7elkn6.apps.googleusercontent.com">
      <main style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
        {!isAuthorized ? (
          <>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Login to view the diary</h1>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => alert('Login failed')}
              auto_select
              useOneTap
            />
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Welcome, {userEmail}</h2>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                overflowWrap: 'break-word',
                maxHeight: '400px', // Add scrolling if the content is long
                overflowY: 'auto',
              }}
            >
              {diaryContent}
            </pre>
          </>
        )}
      </main>
    </GoogleOAuthProvider>
  );
}
