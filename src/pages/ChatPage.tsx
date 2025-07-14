// src/pages/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router-dom';

import { PERSONAS, type Persona } from '@/constants/personas';
import { useVapi } from '@/hooks/useVapi';
import { MessageList, ChatFooter } from '@/components/chat';

/* ─── Route loader ────────────────────────────────────── */
export async function loader({ params }: LoaderFunctionArgs) {
  const personaId = params.personaId ?? '';
  const persona = PERSONAS[personaId];
  if (!persona) {
    throw new Response('Not Found', { status: 404 });
  }
  return persona;
}

/* ─── Component ───────────────────────────────────────── */
export default function ChatPage() {
  const persona = useLoaderData() as Persona;
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

  const navigate = useNavigate();

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

      {/* Header (zIndex:1) */}
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

      {/* Messages (zIndex:1) */}
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

      {/* Footer (zIndex:1) */}
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





