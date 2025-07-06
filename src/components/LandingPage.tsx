import React from 'react';
import { Box, Button, Typography } from '@mui/material';

/**
 * A simple full-screen landing page.
 * Click “Start Chat” to reveal the main voice-assistant UI.
 */
export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: 430,
      mx: 'auto',
      minHeight: '100vh',
      bgcolor: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      gap: 4,
      textAlign: 'center',
    }}
  >
    <Typography variant="h4" fontWeight={500}>
      Welcome to Voice&nbsp;Chat
    </Typography>

    <Typography variant="body1">
      Talk to our empathic assistant.<br />
      Tap “Start” to begin.
    </Typography>

    <Button variant="contained" size="large" onClick={onStart}>
      Start&nbsp;Chat
    </Button>
  </Box>
);

