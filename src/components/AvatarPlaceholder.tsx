import React from 'react';
import { Box, Avatar } from '@mui/material';

/**
 * Displays a circular avatar exactly the same size
 * as the original VoiceWave rings (256 / 320 px).
 *
 * To swap the image, just replace /avatar.jpg with
 * any file you place in /public.
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
      src="/avatar.jpg"      /* ← path inside /public */
      alt="User avatar"
      sx={{
        width:  '100%',
        height: '100%',
      }}
    />
  </Box>
);

