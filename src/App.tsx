import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PhoneIcon from '@mui/icons-material/Phone';

import { useVapi } from './hooks/useVapi';
import { AvatarPlaceholder } from './components/AvatarPlaceholder';
import { TextChat } from './components/TextChat';

/* NOTE ──────────────────────────────────────────
   TranscriptPage (and all its slice components)
   now live in src/components/chat/ and are re-exported
   via a barrel file, so you can import from that folder
   rather than a single file path.
───────────────────────────────────────────────── */
import { TranscriptPage } from './components/chat';

/* ───────────────────  ENV  ─────────────────── */
const apiKey      = import.meta.env.VITE_VAPI_PUBLIC_KEY as string;
const assistantId =
  import.meta.env.VITE_VAPI_ASSISTANT_ID ??
  '5f788679-dd94-4cc5-901f-24daf04d1f48';

interface Props {
  onBack: () => void;   // supplied by Root (main.tsx)
}

export default function App({ onBack }: Props) {
  const {
    start,
    stop,
    sendText,           // helper for typed chat
    transcripts,
  } = useVapi(apiKey, assistantId);

  const [chatOpen, setChatOpen]   = useState(false);
  const [page, setPage]           = useState<'home' | 'history'>('home');

  /* ───────── Transcript History page ───────── */
  if (page === 'history') {
    return (
      <TranscriptPage
        transcripts={transcripts}
        personaId="maya"           // 'maya' | 'luna' | 'felix' …
        onBack={() => setPage('home')}
        onSend={sendText}
        onCall={start}             // optional: call button starts Vapi
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
      {/* Back arrow to Landing */}
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

      {/* Central avatar */}
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

        {/* keyboard drawer trigger */}
        <IconButton
          sx={{
            mt: 6,
            flexDirection: 'column',
            color: 'grey.500',
            '&:hover': { color: 'common.white' },
          }}
          onClick={() => setChatOpen(true)}
          aria-label="Use keyboard input"
        >
          <KeyboardIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
          <Typography variant="body1">Use&nbsp;Keyboard</Typography>
        </IconButton>
      </Box>

      {/* Footer navigation */}
      <Box sx={{ width: '100%', py: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {/* history icon */}
          <IconButton
            aria-label="Chat history"
            onClick={() => setPage('history')}
            sx={{ color: 'grey.500', '&:hover': { color: 'common.white' } }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 48, md: 64 } }} />
          </IconButton>

          {/* start call */}
          <IconButton aria-label="Start call" onClick={start}>
            <Box
              sx={{
                width: { xs: 48, md: 64 },
                height: { xs: 48, md: 64 },
                borderRadius: '50%',
                border: 3,
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PhoneIcon
                sx={{ fontSize: { xs: 28, md: 36 }, color: 'primary.main' }}
              />
            </Box>
          </IconButton>

          {/* end call */}
          <IconButton aria-label="End call" onClick={stop}>
            <Box
              sx={{
                width: { xs: 48, md: 64 },
                height: { xs: 48, md: 64 },
                borderRadius: '50%',
                border: 3,
                borderColor: 'error.main',
                color: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PhoneIcon
                sx={{
                  transform: 'rotate(135deg)',
                  fontSize: { xs: 28, md: 36 },
                }}
              />
            </Box>
          </IconButton>
        </Box>
      </Box>

      {/* Keyboard drawer */}
      <TextChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onSend={sendText}
      />
    </Box>
  );
}













