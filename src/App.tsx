import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useVapi } from './hooks/useVapi';
import { ChatBackground, MessageList } from './components/chat';
import { ChatFooter } from './components/ChatFooter';
import { TranscriptPage } from './components/chat';

/* ─── ENV ─── */
const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY as string;
const assistantId =
  import.meta.env.VITE_VAPI_ASSISTANT_ID ??
  '5f788679-dd94-4cc5-901f-24daf04d1f48';

interface Props {
  onBack: () => void;
}

export default function App({ onBack }: Props) {
  const { start, stop, sendText, transcripts, status } = useVapi(
    apiKey,
    assistantId,
  );

  const [page, setPage] = useState<'home' | 'history'>('home');
  const [dialing, setDialing] = useState(false);
  const [connected, setConnected] = useState(false);

  /* Flip “Calling…” → “Connected” after 2 s */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (status === 'calling') {
      t = setTimeout(() => setConnected(true), 2000);
    } else if (status === 'ended') {
      setDialing(false);
      setConnected(false);
    }
    return () => clearTimeout(t);
  }, [status]);

  /* Mobile-safe call starter */
  const handleStart = () => {
    setDialing(true);
    requestAnimationFrame(() => start());
  };

  /* ─── History page ─── */
  if (page === 'history') {
    return (
      <TranscriptPage
        transcripts={transcripts}
        personaId="maya"
        onBack={() => setPage('home')}
        onSend={sendText}
        onCall={handleStart}
      />
    );
  }

  /* ─── Main voice page ─── */
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        maxWidth: 430,
        mx: 'auto',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: 'common.white',
      }}
    >
      <ChatBackground imageUrl="/maya-bg.jpg" />

      {/* HEADER (fixed height, centered text) */}
      <Box
        sx={{
          flexShrink: 0,
          p: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* back arrow pinned to left */}
        <IconButton
          onClick={onBack}
          aria-label="Back to landing"
          sx={{
            color: 'grey.300',
            position: 'absolute',
            left: 8,
            top: 8,
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" sx={{ fontWeight: 300, mt: 1 }}>
          Maya,&nbsp;24
        </Typography>

        {dialing && (
          <Typography
            sx={{
              mt: 1,
              fontSize: '20px',
              color: 'grey.300',
              animation: connected
                ? 'none'
                : 'blink 1s step-start infinite',
              '@keyframes blink': { '50%': { opacity: 0 } },
            }}
          >
            {connected ? 'Connected' : 'Calling…'}
          </Typography>
        )}
      </Box>

      {/* MESSAGE SCROLLER */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, zIndex: 10 }}>
        <MessageList messages={transcripts} />
      </Box>

      {/* FOOTER (pinned) */}
      <ChatFooter
        onHistory={() => setPage('history')}
        onStart={handleStart}
        onStop={stop}
      />
    </Box>
  );
}


































