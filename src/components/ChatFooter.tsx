import React from 'react';
import { Box, IconButton } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PhoneIcon from '@mui/icons-material/Phone';

interface ChatFooterProps {
  onHistory: () => void;
  onStart: () => void;
  onStop: () => void;
}

export const ChatFooter: React.FC<ChatFooterProps> = ({
  onHistory,
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
      {/* history icon */}
      <IconButton
        aria-label="Chat history"
        onClick={onHistory}
        sx={{ color: 'grey.500', '&:hover': { color: 'common.white' } }}
      >
        <ChatBubbleOutlineIcon sx={{ fontSize: { xs: 48, md: 64 } }} />
      </IconButton>

      {/* start call – white icon on green circle */}
      <IconButton aria-label="Start call" onClick={onStart}>
        <Box
          sx={{
            width: { xs: 48, md: 64 },
            height: { xs: 48, md: 64 },
            borderRadius: '50%',
            bgcolor: 'success.main',             // ← solid green circle
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PhoneIcon
            sx={{ fontSize: { xs: 28, md: 36 }, color: 'common.white' }} // ← white icon
          />
        </Box>
      </IconButton>

      {/* end call */}
      <IconButton aria-label="End call" onClick={onStop}>
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
);

