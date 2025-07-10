import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useVapi } from './hooks/useVapi';
import { ChatBackground } from './components/chat';
import { MessageList } from './components/chat';      // ← NEW
import { ChatFooter } from './components/ChatFooter';
import { TranscriptPage } from './components/chat';

/* ───────────────────  ENV  ─────────────────── */
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

  /* ───────── Banner logic ───────── */
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

  /* ───────── Start call ───────── */
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
    } catch {}
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
        width: '100%',
        maxWidth: 430,
        mx: 'auto',
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: 'common.white',
      }}
    >
      <ChatBackground imageUrl="/maya-bg.jpg" />

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
              animation: connected
                ? 'none'
                : 'blink 1s step-start infinite',
              '@keyframes blink': { '50%': { opacity: 0 } },
              mb: 1,
            }}
          >
            {connected ? 'Connected' : 'Calling…'}
          </Typography>
        )}

        {/* Scrollable message list */}
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <MessageList messages={transcripts} />
        </Box>

        {/* Footer */}
        <ChatFooter
          onHistory={() => setPage('history')}
          onStart={handleStart}
          onStop={stop}
        />
      </Box>
    </Box>
  );
}































