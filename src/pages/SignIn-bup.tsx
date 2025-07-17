// src/pages/SignIn.tsx
import React from 'react';
import { Auth, Appearance } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';

// Import MUI components
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ProfileCard } from '@/components/ProfileCard';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const customAppearance: Appearance = {
  theme: ThemeSupa,
  style: {
    label: {
      display: 'block',
      width: '80%',
      margin: '0 auto 0.5rem auto',
    },
    input: {
      display: 'block',
      width: '80%',
      margin: '0 auto 1rem auto',
      color: '#fff',
    },
  },
};

export default function SignIn() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ maxWidth: 400, margin: '1rem auto' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid #333',
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            charlare
          </Typography>
        </Box>

        {/* Supabase Auth Form */}
        <Auth
          supabaseClient={supabase}
          appearance={customAppearance}
          providers={[]}
          magicLink
        />

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid #333', mt: 2 }}>
          <ProfileCard
            imageUrl="https://voice-chat-ui-gules.vercel.app/preview-fernanda.jpg"
            headline="Fernanda, 28"
            bio="A thoughtful and supportive guide who enjoys in-depth discussions on books and philosophy."
          />
        </Box>
      </div>
    </ThemeProvider>
  );
}