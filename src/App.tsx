// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage    from '@/pages/HomePage';
import ChatPage    from '@/pages/ChatPage';
import SignIn      from '@/pages/SignIn';
import ProtectedRoute from '@/components/ProtectedRoute'; // logged-in required
import AuthRoute      from '@/components/AuthRoute';      // logged-out required

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// 🎨  Optional MUI palette ― tweak or remove as you like
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          {/* ----- PUBLIC for guests only (redirects if already signed in) ----- */}
          <Route element={<AuthRoute />}>
            <Route path="/signin" element={<SignIn />} />
          </Route>

          {/* ----- PRIVATE (requires session) ----- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat/:personaId" element={<ChatPage />} />
          </Route>

          {/* ----- FALLBACK ----- */}
          <Route path="*" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

