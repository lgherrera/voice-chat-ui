// src/components/chat/ChatBackground.tsx
import React from 'react';
import { Box } from '@mui/material';

// 👇 Add the optional 'opacity' prop
interface ChatBackgroundProps {
  image: string;
  opacity?: number;
}

export default function ChatBackground({ image, opacity = 1 }: ChatBackgroundProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // 👇 Use the opacity prop
        opacity: opacity,
      }}
    />
  );
}
