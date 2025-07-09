import React from 'react';
import { Slide, Box } from '@mui/material';

interface ChatPageShellProps {
  children: React.ReactNode;
}

export const ChatPageShell: React.FC<ChatPageShellProps> = ({ children }) => (
  <Slide direction="left" in mountOnEnter unmountOnExit appear={false} timeout={0}>
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        maxWidth: 430,
        mx: 'auto',
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
      }}
    >
      {children}
    </Box>
  </Slide>
);
