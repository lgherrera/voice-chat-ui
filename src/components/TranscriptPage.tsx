import React, { useEffect, useRef, useState } from 'react';
import {
  Slide,
  Box,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  transcripts: string[];             // e.g. ["user: hi", "assistant: hello"]
  onBack: () => void;
  onSend?: (text: string) => void;   // called when user presses Enter / send
}

/* Persona + background (swap when profile changes) */
const persona    = 'Maya';
const background = '/maya-bg.jpg';   // file lives in /public

/* helper */
const isUser = (line: string) => line.startsWith('user:');

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
      {/* Root wrapper (phone card) */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          maxWidth: 430,
          mx: 'auto',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
        }}
      >
        {/* blurred background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(6px)',          // ← 6 px blur
            zIndex: -2,
          }}
        />
        {/* dark overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.35)',
            zIndex: -1,
          }}
        />

        {/* ───────── Header ───────── */}
        <Box
          sx={{
            position: 'relative',
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* back arrow (anchored left) */}
          <IconButton
            onClick={onBack}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              width: 36,
              height: 36,
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* centered persona name + status */}
          <Typography variant="h5" fontWeight={600}>
            {persona}
          </Typography>
          <Typography variant="caption" sx={{ color: 'springgreen' }}>
            Online
          </Typography>
        </Box>

        {/* ───────── Chat scroll area ───────── */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            px: 2,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {transcripts.map((line, idx) => {
            const user = isUser(line);
            const text = line.replace(/^(user|assistant):\s*/, '');

            return (
              <Box
                key={idx}
                sx={{
                  maxWidth: '80%',
                  alignSelf: user ? 'flex-end' : 'flex-start',
                  bgcolor: user
                    ? 'rgba(255,255,255,0.2)'      // user bubble
                    : 'rgba(255,230,221,0.9)',     // assistant bubble
                  color: user ? 'white' : 'black',
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  borderBottomRightRadius: user ? 0 : 2,
                  borderBottomLeftRadius: user ? 2 : 0,
                  backdropFilter: 'blur(2px)',
                }}
              >
                <Typography variant="body2">{text}</Typography>
              </Box>
            );
          })}
          <div ref={bottomRef} />
        </Box>

        {/* ───────── Composer bar ───────── */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            p: 1.5,
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(0,0,0,0.4)',
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
            onClick={send}
            sx={{
              bgcolor: 'black',        // ← black button
              color: 'white',
              '&:hover': { bgcolor: '#333' },
              width: 48,
              height: 48,
            }}
            aria-label="Send"
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Slide>
  );
};




