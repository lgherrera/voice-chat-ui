// src/components/chat/ChatBackground.tsx
import React from 'react';
import { Box } from '@mui/material';

// 👇 1. Define an interface for the component's props
interface ChatBackgroundProps {
  image: string;
}

// 👇 2. Use the interface and destructure the 'image' prop
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
      }}
    />
  );
}
