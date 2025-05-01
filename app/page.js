'use client'

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
      <main className="p-4 max-w-md mx-auto font-sans">
        {!isAuthorized ? (
          <>
            <h1 className="text-2xl mb-4">Login to view the diary</h1>
            <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert('Login failed')} />
          </>
        ) : (
          <>
            <h2 className="text-xl mb-2">Welcome, {userEmail}</h2>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{diaryContent}</pre>
          </>
        )}
      </main>
    </GoogleOAuthProvider>
  );
}
