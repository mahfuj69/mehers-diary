'use client';
import { useSession, signIn, signOut } from "next-auth/react";
export default function Home() {
const { data: session } = useSession();
if (!session) {
return ( <div className="min-h-screen flex items-center justify-center"> <button onClick={() => signIn("google")} className="px-4 py-2 bg-blue-500 text-white rounded" > Login with Google </button> </div> ); 
}
return (
<div className="min-h-screen p-6"> <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name}</h1> <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded" > Logout </button> {/* Your diary UI goes here */} </div> 
);
}