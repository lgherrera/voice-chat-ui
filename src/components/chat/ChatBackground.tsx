import React from 'react';
import { Box } from '@mui/material';

interface ChatBackgroundProps {
  imageUrl: string;
  opacity?: number;
}

export const ChatBackground: React.FC<ChatBackgroundProps> = ({
  imageUrl,
  opacity = 0.8,
}) => (
  <>
    <Box
      sx={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity,
        zIndex: -2,
      }}
    />
    <Box
      sx={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.30)',
        zIndex: -1,
      }}
    />
  </>
);
