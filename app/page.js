'use client';

import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

const allowedEmails = [
  'mahguj@gmail.com',
  'mahfuuuj@gmail.com',
  'samiaislamsua16@gmail.com'
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
      <main
        style={{
          padding: '1rem',
          maxWidth: '600px',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {!isAuthorized ? (
          <>
            <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>Login to view the diary</h1>
            <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert('Login failed')} />
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '20px', marginBottom: '0.5rem' }}>Welcome, {userEmail}</h2>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f0f0f0',
                padding: '1rem',
                borderRadius: '8px',
                overflowX: 'auto'
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
