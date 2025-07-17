// src/pages/SignIn.tsx
import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa, Appearance } from '@supabase/auth-ui-shared';
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
    input: {
      color: '#fff',
    },
  },
};

export default function SignIn() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* 👇 The change is in this line 👇 */}
      <div style={{ maxWidth: 400, margin: '2rem auto' }}>
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
            imageUrl="https://images.unsplash.com/photo-1610484826917-0f101a6bf7f4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"
            headline="Meet Our Star Persona"
            bio="Powered by the latest in AI technology to provide seamless, empathetic conversations."
          />
        </Box>
      </div>
    </ThemeProvider>
  );
}




