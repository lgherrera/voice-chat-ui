import React, { useEffect, useRef, useState } from 'react';
import {
  Slide,
  Paper,
  Box,
  IconButton,
  Typography,
  TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
  transcripts: string[];
  onBack: () => void;
  onSend?: (text: string) => void;          // ← NEW
}

export const TranscriptPage: React.FC<Props> = ({
  transcripts,
  onBack,
  onSend,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const send = () => {
    if (!draft.trim()) return;
    onSend?.(draft);
    setDraft('');
  };

  return (
    <Slide direction="left" in>
      <Paper
        sx={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          maxWidth: 430,
          mx: 'auto',
          height: '100vh',
          bgcolor: 'black',
          color: 'white',
          boxShadow: { sm: 3 },
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* back arrow */}
        <IconButton
          onClick={onBack}
          sx={{ color: 'grey.300', mb: 1, alignSelf: 'flex-start' }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* scrollable transcript list */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
          {transcripts.map((line, i) => (
            <Typography key={i} sx={{ mb: 1 }}>
              {line}
            </Typography>
          ))}
          <div ref={bottomRef} />
        </Box>

        {/* text input bar */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Escribe tu mensaje…"
          />
          <IconButton onClick={send} aria-label="Send" sx={{ color: 'white' }}>
            ➤
          </IconButton>
        </Box>
      </Paper>
    </Slide>
  );
};


