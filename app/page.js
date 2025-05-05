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
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetch('/diary.txt')
        .then((res) => res.text())
        .then((text) => {
          // Reverse entries by date headers and preserve formatting
          const reversed = text
            .split(/(?=^== \d{4}-\d{2}-\d{2} ==)/gm) // Keep the delimiter
            .map(e => e.trimEnd())
            .reverse()
            .join('\n\n');

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
