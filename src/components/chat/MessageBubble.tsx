// src/components/chat/MessageBubble.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

// 👇 1. Update props to make 'text' optional and add 'isTyping'
interface MessageBubbleProps {
  text?: string;
  isUser: boolean;
  isTyping?: boolean;
}

// Bouncing dots animation for the typing indicator
const bouncingDot = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  bgcolor: 'grey.700',
  animation: 'bounce 1.4s infinite ease-in-out both',
};

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({ text, isUser, isTyping }) => {
    // 👇 2. Add a special case to render the typing indicator
    if (isTyping) {
      return (
        <Box
          sx={{
            alignSelf: 'flex-start',
            bgcolor: 'rgba(255,230,221,0.9)',
            px: 1.5,
            py: 2, // A bit more vertical padding
            borderRadius: 2,
            borderBottomLeftRadius: 0,
            display: 'flex',
            gap: 0.75,
            // Keyframes for the bounce animation
            '@keyframes bounce': {
              '0%, 80%, 100%': { transform: 'scale(0)' },
              '40%': { transform: 'scale(1.0)' },
            },
          }}
        >
          <Box sx={{ ...bouncingDot, animationDelay: '-0.32s' }} />
          <Box sx={{ ...bouncingDot, animationDelay: '-0.16s' }} />
          <Box sx={bouncingDot} />
        </Box>
      );
    }

    // This is the original return for regular text messages
    return (
      <Box
        sx={{
          maxWidth: '80%',
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          bgcolor: isUser
            ? 'rgba(255,255,255,0.2)'
            : 'rgba(255,230,221,0.9)',
          color: isUser ? 'white' : 'black',
          px: 1.5,
          py: 1,
          borderRadius: 2,
          borderBottomRightRadius: isUser ? 0 : 2,
          borderBottomLeftRadius: isUser ? 2 : 0,
          backdropFilter: 'blur(2px)',
        }}
      >
        <Typography variant="body2">{text}</Typography>
      </Box>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';
