import React, { useState } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageComposerProps {
  onSend: (text: string) => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSend }) => {
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <Box
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
        onKeyDown={(e) => e.key === 'Enter' && send()}
        sx={{
          input: { color: 'white' },
          bgcolor: 'rgba(255,255,255,0.15)',
          borderRadius: 2,
        }}
      />
      <IconButton
        aria-label="Send"
        onClick={send}
        sx={{
          bgcolor: 'black',
          color: 'white',
          '&:hover': { bgcolor: '#333' },
          width: 48,
          height: 48,
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};
