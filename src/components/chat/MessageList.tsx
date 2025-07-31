// src/components/chat/MessageList.tsx
import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { MessageBubble } from './MessageBubble';
// 👇 1. Import the Message type (assuming it's exported from your components/chat/index.ts)
import { type Message } from '.';

// 👇 2. Update the props interface
interface MessageListProps {
  messages: Message[];
  isAssistantTyping?: boolean;
}

// This helper function is no longer needed
// const isUser = (l: string) => l.startsWith('user:');

export const MessageList: React.FC<MessageListProps> = ({ messages, isAssistantTyping }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAssistantTyping]); // Also trigger scroll when typing starts

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        // pb: '88px', // This padding can be removed if the parent container has it
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {/* 👇 3. Update the mapping logic to use message objects */}
      {messages.map((message, i) => (
        <MessageBubble
          key={i}
          text={message.content}
          isUser={message.role === 'user'}
        />
      ))}
      
      {/* 👇 4. Add a "typing" bubble when the assistant is responding */}
      {isAssistantTyping && <MessageBubble isUser={false} isTyping />}

      <div ref={bottomRef} />
    </Box>
  );
};
