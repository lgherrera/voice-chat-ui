import React from 'react';
import { Box, Typography } from '@mui/material';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({ text, isUser }) => (
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
  )
);
MessageBubble.displayName = 'MessageBubble';
