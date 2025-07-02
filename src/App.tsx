import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PhoneIcon from '@mui/icons-material/Phone';

import { useVapi } from './hooks/useVapi';
import { VoiceWave } from './components/VoiceWave';
import { TextChat } from './components/TextChat';
import { TranscriptPage } from './components/TranscriptPage';

/* env secrets (set in Vercel) */
const apiKey      = import.meta.env.VITE_VAPI_PUBLIC_KEY as string;
const assistantId =
  import.meta.env.VITE_VAPI_ASSISTANT_ID ??
  '5f788679-dd94-4cc5-901f-24daf04d1f48';

export default function App() {
  /* Vapi hook */
  const { start, stop, amp, transcripts } = useVapi(apiKey, assistantId);

  /* UI state */
  const [chatOpen, setChatOpen] = useState(false);
  const [page, setPage] = useState<'home' | 'history'>('home');

  /* -------- transcript history page -------- */
  if (page === 'history') {
    return (
      <TranscriptPage
        transcripts={transcripts}
        onBack={() => setPage('home')}
      />
    );
  }

  /* -------- main (home) page -------- */
  return (
    <Box
      sx={{
        bgcolor: 'black',
        color: 'common.white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Header */}
      <Typography variant="h4" sx={{ mt: { xs: 8, md: 12 }, fontWeight: 300 }}>
        Let’s&nbsp;Have&nbsp;a&nbsp;Chat
      </Typography>

      {/* Main section */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <VoiceWave amp={amp} />

        {/* keyboard fallback */}
        <IconButton
          sx={{
            mt: 6,
            flexDirection: 'column',
            color: 'grey.500',
            '&:hover': { color: 'common.white' },
          }}
          onClick={() => setChatOpen(true)}
        >
          <KeyboardIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
          <Typography variant="body1">Use&nbsp;Keyboard</Typography>
        </IconButton>
      </Box>

      {/* Footer nav */}
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
                sx={{ transform: 'rotate(135deg)', fontSize: { xs: 28, md: 36 } }}
              />
            </Box>
          </IconButton>
        </Box>
      </Box>

      {/* keyboard drawer */}
      <TextChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </Box>
  );
}





