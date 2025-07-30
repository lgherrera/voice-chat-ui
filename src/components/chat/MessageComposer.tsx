// src/components/chat/MessageComposer.tsx
import React, { useState } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageComposerProps {
  onSend: (text: string) => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSend }) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 'env(safe-area-inset-bottom)',
        p: 1.5,
        display: 'flex',
        gap: 1,
        bgcolor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        alignItems: 'center',
        zIndex: 1199,
      }}
    >
      <TextField
        fullWidth
        variant="filled"
        size="small"
        placeholder="Message"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        sx={{
          input: { color: 'white' },
          bgcolor: 'rgba(255,255,255,0.15)',
          borderRadius: 2,
        }}
      />
      <IconButton
        type="submit"
        aria-label="Send"
        disabled={!draft.trim()}
        sx={{
          bgcolor: 'black',
          color: 'white',
          '&:hover': { bgcolor: '#333' },
          '&.Mui-disabled': {
            bgcolor: 'rgba(0,0,0,0.3)',
            color: 'rgba(255,255,255,0.3)',
          },
          width: 48,
          height: 48,
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};
