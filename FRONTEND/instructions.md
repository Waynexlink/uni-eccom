Consuming the UniAbuja Marketplace API (Next.js Edition)Yo! I know you're rocking Next.js, so I’ve simplified how to interact with the auth routes. The base URL for everything is http://localhost:8000/api/auth.1. Environment SetupFirst, toss the base URL into your .env.local so we don't have to hardcode it everywhere.BashNEXT_PUBLIC_API_URL=http://localhost:8000/api/auth 2. The Shared API ClientI recommend using Axios because interceptors make handling the JWT way easier. This helper will automatically attach your token to every request and kick the user to /login if the token expires.JavaScript// lib/axios.js
import axios from 'axios';

const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach token to every request
api.interceptors.request.use((config) => {
const token = localStorage.getItem('token');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

// Global error handling (e.g., redirect on 401)
api.interceptors.response.use(
(response) => response,
(error) => {
if (error.response?.status === 401) {
localStorage.removeItem('token');
window.location.href = '/login';
}
return Promise.reject(error);
}
);

export default api; 3. The Big Three EndpointsHere is exactly how to call the main routes.A. Sign Up / LoginBoth return a token and a user object. Store that token immediately.JavaScriptconst handleLogin = async (credentials) => {
try {
const { data } = await api.post('/login', credentials);
localStorage.setItem('token', data.token);
// Redirect to dashboard
} catch (err) {
console.error(err.response?.data?.message || "Login failed");
}
};
B. Get "Me" (Profile)Use this to check if a user is still logged in when the app loads. This is a protected route, so it needs the token (handled by our Axios instance above).JavaScriptconst fetchProfile = async () => {
const { data } = await api.get('/me');
return data.user;
};
C. LogoutJust hit the route and wipe the local storage.JavaScriptconst logout = async () => {
await api.get('/logout');
localStorage.removeItem('token');
window.location.href = '/login';
}; 4. Protecting Routes in Next.jsSince you're likely using the App Router, you can protect your pages by checking for the token in a useEffect or using a Wrapper component.Simple Protected Wrapper:JavaScript'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
const router = useRouter();

useEffect(() => {
const token = localStorage.getItem('token');
if (!token) {
router.push('/login');
}
}, [router]);

return <>{children}</>;
}
Quick Reference TableActionMethodRouteBodyRegisterPOST/signup{ name, email, password }LoginPOST/login{ email, password }Get UserGET/meNone (Requires Auth Header)LogoutGET/logoutNone (Requires Auth Header)Pro-Tip for UniAbuja Marketplace:The backend has CORS enabled for localhost:3000. If your Next.js dev server is running on a different port (like 3001), let me know so I can update the whitelist!Catch you later. Let me know if the endpoints give you any grief.
