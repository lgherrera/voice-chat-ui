import React from 'react';
import { Avatar, Box } from '@mui/material';

/**
 * A circular avatar that occupies the same footprint
 * as the old VoiceWave (256 / 320 px).
 */
export const AvatarPlaceholder: React.FC = () => (
  <Box
    sx={{
      width:  { xs: 256, md: 320 },
      height: { xs: 256, md: 320 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Avatar
      sx={{
        width:  '100%',
        height: '100%',
        bgcolor: 'grey.800',        /* dark placeholder colour   */
        fontSize: { xs: 64, md: 80 },
      }}
    >
      {/* Initials or icon can go here if you like */}
    </Avatar>
  </Box>
);
