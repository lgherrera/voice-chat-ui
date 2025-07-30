// src/components/chat/ChatBackground.tsx
import React from 'react';
import { Box } from '@mui/material';

interface ChatBackgroundProps {
  image: string;
}

export default function ChatBackground({ image }: ChatBackgroundProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // 👇 Add the opacity property here. Adjust the value as needed.
        opacity: 1,
      }}
    />
  );
}
