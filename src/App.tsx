import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useVapi } from './hooks/useVapi';
import { ChatBackground, MessageList, ChatFooter } from './components/chat'; // barrel exports

/* ─── Environment keys ─── */
const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY as string;
const assistantId =
  import.meta.env.VITE_VAPI_ASSISTANT_ID ??
  '5f788679-dd94-4cc5-901f-24daf04d1f48';

interface Props {
  onBack: () => void;
}

export default function App({ onBack }: Props) {
  const { start, stop, transcripts, status } = useVapi(apiKey, assistantId);

  const [dialing, setDialing] = useState(false);
  const [connected, setConnected] = useState(false);

  /* Flip from “Calling…” to “Connected” two seconds after dialing */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (status === 'calling') {
      timer = setTimeout(() => setConnected(true), 2000);
    } else if (status === 'ended') {
      setDialing(false);
      setConnected(false);
    }
    return () => clearTimeout(timer);
  }, [status]);

  /* Start call helper (mobile-safe) */
  const handleStart = () => {
    setDialing(true);
    requestAnimationFrame(() => start());
  };

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
      {/* Background image + dark overlay */}
      <ChatBackground imageUrl="/maya-bg.jpg" />

      {/* ─── Header (pinned) ─── */}
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
        {/* Back arrow (floats on left) */}
        <IconButton
          onClick={onBack}
          aria-label="Back"
          sx={{ position: 'absolute', left: 8, top: 8, color: 'grey.300' }}
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
              animation: connected ? 'none' : 'blink 1s step-start infinite',
              '@keyframes blink': { '50%': { opacity: 0 } },
            }}
          >
            {connected ? 'Connected' : 'Calling…'}
          </Typography>
        )}
      </Box>

      {/* ─── Scrollable messages ─── */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, zIndex: 10 }}>
        <MessageList messages={transcripts} />
      </Box>

      {/* ─── Footer (pinned) ─── */}
      <ChatFooter
        onHistory={() => {/* history disabled */}}
        onStart={handleStart}
        onStop={stop}
      />
    </Box>
  );
}




































