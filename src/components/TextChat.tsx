import React, { useState } from 'react';
import { Slide, Paper, Box, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const TextChat: React.FC<{ open: boolean; onClose: () => void }> =
  ({ open, onClose }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [draft, setDraft] = useState('');

    const send = () => {
      if (!draft.trim()) return;
      setLines(l => [...l, `Me: ${draft}`]);
      setDraft('');
      //  ← here you could also POST to a text-chat endpoint
    };

    return (
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 300,
            bgcolor: 'grey.900',
            color: 'common.white',
            p: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
            {lines.map((l, idx) => (
              <Box key={idx} sx={{ mb: 0.5 }}>{l}</Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <IconButton onClick={send} aria-label="Send">➤</IconButton>
            <IconButton onClick={onClose} aria-label="Close"><CloseIcon /></IconButton>
          </Box>
        </Paper>
      </Slide>
    );
};
