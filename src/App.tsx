import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useVapi } from './hooks/useVapi';
import { AvatarPlaceholder } from './components/AvatarPlaceholder';
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
  const {
    start,
    stop,
    sendText,
    transcripts,
    status,             // ← new
  } = useVapi(apiKey, assistantId);

  const [page, setPage] = useState<'home' | 'history'>('home');

  /* Mobile-safe call starter */
  const handleStart = () => {
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const Ctx =
          (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();
        if (ctx.state === 'suspended') ctx.resume();
        ctx.close();
      }
    } catch {/* ignore */}
    requestAnimationFrame(() => start());
  };

  /* ───────── Transcript History page ───────── */
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

  /* ───────────── Main voice page ───────────── */
  return (
    <Box
      sx={{
        bgcolor: 'black',
        color: 'common.white',
        minHeight: '100vh',
        width: '100%',
        maxWidth: 430,
        mx: 'auto',
        boxShadow: { sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        fontFamily: 'sans-serif',
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
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 300 }}>
        Let’s&nbsp;Have&nbsp;a&nbsp;Chat
      </Typography>

      {/* Central avatar + status */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AvatarPlaceholder />

        {/* Calling indicator */}
        {status === 'calling' && (
          <Typography sx={{ mt: 2, color: 'grey.400' }}>
            Calling…
          </Typography>
        )}
      </Box>

      {/* Footer */}
      <ChatFooter
        onHistory={() => setPage('history')}
        onStart={handleStart}
        onStop={stop}
      />
    </Box>
  );
}





















