// src/components/chat/TranscriptPage.tsx
import React from 'react';
import { PERSONAS } from '../../constants/personas';          // ← relative path
import { ChatPageShell } from './ChatPageShell';
import { ChatBackground } from './ChatBackground';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';

export interface TranscriptPageProps {
  transcripts: string[];
  onBack: () => void;
  onSend?: (text: string) => void;
  onCall?: () => void;
  personaId?: keyof typeof PERSONAS; // 'maya' | 'luna' | 'felix' | …
}

export const TranscriptPage: React.FC<TranscriptPageProps> = ({
  transcripts,
  onBack,
  onSend,
  onCall,
  personaId = 'maya',
}) => {
  const { name, background } = PERSONAS[personaId];

  return (
    <ChatPageShell>
      <ChatBackground imageUrl={background} />
      <ChatHeader
        persona={name}
        status="online"
        onBack={onBack}
        onCall={onCall}
      />
      <MessageList messages={transcripts} />
      <MessageComposer onSend={(text) => onSend?.(text)} />
    </ChatPageShell>
  );
};






























