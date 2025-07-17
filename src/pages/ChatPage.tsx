// src/pages/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';   // 👈 swap imports

import { PERSONAS, type Persona } from '@/constants/personas';
import { useVapi } from '@/hooks/useVapi';
import { MessageList, ChatFooter } from '@/components/chat';

/* ─── Component ───────────────────────────────────────── */
export default function ChatPage() {
  /* 🔄 instead of useLoaderData() */
  const { personaId } = useParams<{ personaId: string }>();
  const persona: Persona | undefined = personaId
    ? PERSONAS[personaId as keyof typeof PERSONAS]
    : undefined;

  const navigate = useNavigate();

  /* 👉 handle unknown ID gracefully */
  if (!persona) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Persona not found</Typography>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  /* ─── Original logic unchanged ─── */
  const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY as string;
  const { start, stop, transcripts, status } = useVapi(
    apiKey,
    persona.assistantId
  );

  const [dialing, setDialing] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (status === 'calling') {
      timer = setTimeout(() => setConnected(true), 2000);
    } else if (status === 'ended') {
      setDialing(false);
      setConnected(false);
    }
    return () => clearTimeout(timer);
  }, [status]);

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

        // inline background image
        backgroundImage: `url(${persona.bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{ position: 'absolute', left: 8, top: 8, color: 'grey.300' }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" sx={{ fontWeight: 300, mt: 1 }}>
          {persona.name}, {persona.age}
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

      {/* Messages */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          flexGrow: 1,
          overflowY: 'auto',
          px: 2,
        }}
      >
        <MessageList messages={transcripts} />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <ChatFooter onHistory={() => {}} onStart={handleStart} onStop={stop} />
      </Box>
    </Box>
  );
}







