import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';

export interface ChatHeaderProps {
  persona: string;
  status?: 'online' | 'offline';
  onBack: () => void;
  onCall?: () => void;
}

const zHeader = 1200;

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  persona,
  status = 'online',
  onBack,
  onCall,
}) => (
  <Box
    sx={{
      position: 'relative',
      p: 1.5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: zHeader,
    }}
  >
    {/* Back */}
    <IconButton
      aria-label="Back"
      onClick={onBack}
      sx={{
        position: 'absolute',
        left: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        bgcolor: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        color: 'white',
        width: 42,
        height: 42,
        zIndex: zHeader + 1,
        '& .MuiSvgIcon-root': { fontSize: 28 },
      }}
    >
      <ArrowBackIcon />
    </IconButton>

    {/* Call */}
    <IconButton
      aria-label="Call"
      onClick={onCall}
      sx={{
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        bgcolor: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        color: 'white',
        width: 42,
        height: 42,
        zIndex: zHeader + 1,
        '& .MuiSvgIcon-root': { fontSize: 28 },
      }}
    >
      <PhoneIcon />
    </IconButton>

    <Typography variant="h5" fontWeight={600}>
      {persona}
    </Typography>
    <Typography variant="caption" sx={{ color: 'springgreen' }}>
      {status === 'online' ? 'Online' : 'Offline'}
    </Typography>
  </Box>
);
