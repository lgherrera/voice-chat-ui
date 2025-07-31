// src/components/chat/ChatFooter.tsx
import React from 'react';
import { Box, IconButton } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhoneIcon from '@mui/icons-material/Phone';

interface ChatFooterProps {
  // 👇 Renamed from onHistory to onVideoCall
  onVideoCall: () => void;
  onStart: () => void;
  onStop: () => void;
}

export const ChatFooter: React.FC<ChatFooterProps> = ({
  // 👇 Update destructured prop name
  onVideoCall,
  onStart,
  onStop,
}) => (
  <Box sx={{ width: '100%', py: 2 }}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <IconButton
        aria-label="Video call"
        // 👇 Update onClick handler
        onClick={onVideoCall}
        sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}
      >
        <VideocamIcon sx={{ fontSize: { xs: 48, md: 64 } }} />
      </IconButton>

      <IconButton aria-label="Start call" onClick={onStart}>
        <Box
          sx={{
            width: { xs: 48, md: 64 },
            height: { xs: 48, md: 64 },
            borderRadius: '50%',
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PhoneIcon
            sx={{ fontSize: { xs: 28, md: 36 }, color: 'common.white' }}
          />
        </Box>
      </IconButton>

      <IconButton aria-label="End call" onClick={onStop}>
        <Box
          sx={{
            width: { xs: 48, md: 64 },
            height: { xs: 48, md: 64 },
            borderRadius: '50%',
            bgcolor: 'error.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PhoneIcon
            sx={{
              transform: 'rotate(135deg)',
              fontSize: { xs: 28, md: 36 },
              color: 'common.white',
            }}
          />
        </Box>
      </IconButton>
    </Box>
  </Box>
);


