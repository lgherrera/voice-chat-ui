import React, { useState } from 'react';
import {
  Slide,
  Paper,
  Box,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  onClose: () => void;
  onSend?: (text: string) => void;   // ← NEW
}

export const TextChat: React.FC<Props> = ({ open, onClose, onSend }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setLines(l => [...l, `Me: ${draft}`]);
    onSend?.(draft);           // 🔗 forward to Vapi
    setDraft('');
  };

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        sx={{
          position: 'fixed',
          inset: 0,
          width: { xs: '100%', sm: 430 },
          maxWidth: 430,
          mx: 'auto',
          height: 300,
          bgcolor: 'grey.900',
          color: 'white',
          p: 2,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
          {lines.map((l, i) => (
            <Typography key={i} sx={{ mb: 0.5 }}>
              {l}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <IconButton onClick={send} aria-label="Send">
            ➤
          </IconButton>
          <IconButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>
    </Slide>
  );
};


