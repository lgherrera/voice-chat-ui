// src/components/chat/MessageBubble.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface MessageBubbleProps {
  text?: string;
  isUser: boolean;
  isTyping?: boolean;
}

const bouncingDot = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  bgcolor: 'grey.700',
  animation: 'bounce 1.4s infinite ease-in-out both',
};

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({ text, isUser, isTyping }) => {
    if (isTyping) {
      return (
        <Box
          sx={{
            alignSelf: 'flex-start',
            // 👇 Typing indicator bubble is now also green
            bgcolor: 'rgba(204, 255, 204, 0.4)',
            px: 1.5,
            py: 2,
            borderRadius: 2,
            borderBottomLeftRadius: 0,
            display: 'flex',
            gap: 0.75,
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

    return (
      <Box
        sx={{
          maxWidth: '80%',
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          // 👇 The background color for the assistant's bubble is now green
          bgcolor: isUser
            ? 'rgba(255,255,255,0.2)'
            : 'rgba(204, 255, 204, 0.4)',
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
