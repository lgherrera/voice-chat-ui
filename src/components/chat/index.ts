// src/components/chat/index.ts
// src/components/chat/index.ts

// 👇 1. Define and export the shared Message type
export interface Message {
    role: 'user' | 'assistant';
    content: string;
  }
  
  // 👇 2. Export all the components from this directory
  export { default as ChatBackground } from './ChatBackground';
  export { ChatFooter } from './ChatFooter';
  export { MessageBubble } from './MessageBubble';
  export { MessageComposer } from './MessageComposer';
  export { MessageList } from './MessageList';



