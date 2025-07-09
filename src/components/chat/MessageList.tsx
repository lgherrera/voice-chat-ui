import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: string[];
}

const isUser = (l: string) => l.startsWith('user:');

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        px: 2,
        pb: '88px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {messages.map((line, i) => {
        const user = isUser(line);
        const text = line.replace(/^(user|assistant):\s*/, '');
        return <MessageBubble key={i} text={text} isUser={user} />;
      })}
      <div ref={bottomRef} />
    </Box>
  );
};
