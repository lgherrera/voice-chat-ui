import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { keyframes } from '@mui/system';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PhoneIcon from '@mui/icons-material/Phone';

const pulse = keyframes`
  0%, 100% {
    transform: scale(0.95);
    opacity: .7;
    border-color: #34d399;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
    border-color: #10b981;
  }
`;

// Rings reduced by 20% (was 100,80,60 → now 80,64,48)
const VoiceWave: React.FC = React.memo(() => (
  <Box
    role="presentation"
    sx={{
      position: 'relative',
      width: { xs: 256, md: 320 },
      height: { xs: 256, md: 320 },
    }}
  >
    {[80, 64, 48].map((size, i) => (
      <Box
        key={size}
        sx={{
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: `${size}%`,
          height: `${size}%`,
          borderRadius: '50%',
          border: 2,
          borderColor: 'success.light',
          animation: `${pulse} 1.8s ${i * 0.2}s infinite ease-in-out`,
        }}
      />
    ))}
  </Box>
));

export default function App() {
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
      <Typography
        variant="h4"
        component="h1"
        sx={{ mt: { xs: 8, md: 12 }, fontWeight: 300 }}
      >
        Let’s Have a Chat
      </Typography>

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <VoiceWave />

        {/* Keyboard option */}
        <IconButton
          aria-label="Type instead"
          sx={{
            mt: 6,
            flexDirection: 'column',
            color: 'grey.500',
            '&:hover': { color: 'common.white' },
          }}
        >
          <KeyboardIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
          <Typography variant="body1">Use Keyboard</Typography>
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
          <IconButton aria-label="Chat history" sx={{ color: 'grey.500', '&:hover': { color: 'common.white' } }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 48, md: 64 } }} />
          </IconButton>

          <IconButton aria-label="Start call">
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
              <PhoneIcon sx={{ fontSize: { xs: 28, md: 36 }, color: 'primary.main' }} />
            </Box>
          </IconButton>

          <IconButton aria-label="End call">
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
    </Box>
  );
}

