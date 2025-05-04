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
        .then((text) => setDiaryContent(text))
        .catch((err) => {
          console.error('Failed to load diary:', err);
          setDiaryContent('Failed to load diary content.');
        });
    }
  }, [isAuthorized]);

  return (
    <GoogleOAuthProvider clientId="195839471495-akcgks1mbgf2utk9300f3ki94c7elkn6.apps.googleusercontent.com">
      <>
        <style>
          {`
            :root {
              --background: #ffffff;
              --foreground: #171717;
              --box-bg: #f5f5f5;
            }
            @media (prefers-color-scheme: dark) {
              :root {
                --background: #0a0a0a;
                --foreground: #ededed;
                --box-bg: #1a1a1a;
              }
            }
            body {
              margin: 0;
              padding: 0;
              background-color: var(--background);
              color: var(--foreground);
              font-family: sans-serif;
            }
          `}
        </style>

        <main
          style={{
            padding: '1rem',
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            fontFamily: 'sans-serif',
            minHeight: '100vh',
          }}
        >
          {!isAuthorized ? (
            <>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                Login to view the diary
              </h1>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => alert('Login failed')}
              />
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                Welcome, {userEmail}
              </h2>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  backgroundColor: 'var(--box-bg)',
                  padding: '1rem',
                  borderRadius: '8px',
                  overflowX: 'auto',
                }}
              >
                {diaryContent}
              </pre>
            </>
          )}
        </main>
      </>
    </GoogleOAuthProvider>
  );
}
