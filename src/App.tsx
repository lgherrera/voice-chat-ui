import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useVapi } from './hooks/useVapi';
import { ChatBackground, MessageList } from './components/chat'; // barrel exports
import { ChatFooter } from './components/ChatFooter';
import { TranscriptPage } from './components/chat';

/* ─── Env vars ─── */
const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY as string;
const assistantId =
  import.meta.env.VITE_VAPI_ASSISTANT_ID ??
  '5f788679-dd94-4cc5-901f-24daf04d1f48';

interface Props {
  onBack: () => void; // supplied by main.tsx
}

export default function App({ onBack }: Props) {
  const { start, stop, sendText, transcripts, status } = useVapi(
    apiKey,
    assistantId,
  );

  const [page, setPage] = useState<'home' | 'history'>('home');
  const [dialing, setDialing] = useState(false);
  const [connected, setConnected] = useState(false);

  /* Flip banner to “Connected” 2 s after status === "calling" */
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

  /* One-tap call starter (mobile-safe) */
  const handleStart = () => {
    setDialing(true);

    try {
      if ('AudioContext' in window) {
        const Ctx =
          (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();
        if (ctx.state === 'suspended') ctx.resume();
        ctx.close();
      }
    } catch {
      /* ignore */
    }

    requestAnimationFrame(() => start());
  };

  /* ───────── History page ───────── */
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

  /* ───────── Main voice page ───────── */
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
        color: 'common.white',
        overflow: 'hidden',
      }}
    >
      {/* Background layers */}
      <ChatBackground imageUrl="/maya-bg.jpg" />

      {/* Scrollable content (header + banner + messages) */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Back arrow */}
        <IconButton
          onClick={onBack}
          sx={{ color: 'grey.300', alignSelf: 'flex-start', mb: 1 }}
          aria-label="Back to landing"
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Header */}
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 300 }}>
          Maya,&nbsp;24
        </Typography>

        {/* Calling / Connected banner */}
        {dialing && (
          <Typography
            sx={{
              fontSize: '20px',
              color: 'grey.300',
              textAlign: 'center',
              mb: 1,
              animation: connected ? 'none' : 'blink 1s step-start infinite',
              '@keyframes blink': { '50%': { opacity: 0 } },
            }}
          >
            {connected ? 'Connected' : 'Calling…'}
          </Typography>
        )}

        {/* Message scroll area */}
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <MessageList messages={transcripts} />
        </Box>
      </Box>

      {/* Fixed footer (never scrolls) */}
      <ChatFooter
        onHistory={() => setPage('history')}
        onStart={handleStart}
        onStop={stop}
      />
    </Box>
  );
}
































