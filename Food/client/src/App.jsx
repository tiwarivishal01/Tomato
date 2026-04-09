import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './Pages/Home';
import Auth from './Pages/Auth';
import { supabase } from './Supabase';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-emerald-500 font-bold tracking-widest uppercase">Initializing...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" replace />} />
        <Route path="/" element={session ? <Home /> : <Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
