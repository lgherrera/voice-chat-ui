// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import ChatOnlyPage from '@/pages/ChatOnlyPage'; // 👈 Import the new page
import SignIn from '@/pages/SignIn';
import UpdatePasswordPage from '@/pages/UpdatePasswordPage'; // 👈 1. IMPORT THE NEW PAGE
import ProtectedRoute from '@/components/ProtectedRoute'; // logged-in required
import AuthRoute from '@/components/AuthRoute'; // logged-out required

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// 🎨 Optional MUI palette ― tweak or remove as you like
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
});

// This new component will contain our listener logic
// It needs to be a separate component so it can use the 'useNavigate' hook
const AppRoutes = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/update-password');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Routes>
      {/* ----- PUBLIC for guests only (redirects if already signed in) ----- */}
      <Route element={<AuthRoute />}>
        <Route path="/signin" element={<SignIn />} />
      </Route>

      {/* ----- PUBLIC FOR ALL ----- */}
      {/* 👇 2. ADD THE ROUTE FOR THE UPDATE PASSWORD PAGE */}
      <Route path="/update-password" element={<UpdatePasswordPage />} />

      {/* ----- PRIVATE (requires session) ----- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat/:personaName" element={<ChatPage />} />
        <Route path="/text/:personaName" element={<ChatOnlyPage />} /> {/* 👈 Add the new route */}
      </Route>

      {/* ----- FALLBACK ----- */}
      <Route path="*" element={<SignIn />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* 👇 3. USE THE NEW AppRoutes COMPONENT */}
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

