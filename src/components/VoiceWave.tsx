import React from 'react';
import { Box } from '@mui/material';

interface Props {
  amp: number; // 0-1 amplitude from hook
}

const sizes = [0.8, 0.64, 0.48]; // 80 %, 64 %, 48 %

export const VoiceWave: React.FC<Props> = React.memo(({ amp }) => (
  <Box
    role="presentation"
    sx={{
      position: 'relative',
      width: { xs: 256, md: 320 },
      height: { xs: 256, md: 320 },
    }}
  >
    {sizes.map((pct) => (
      <Box
        key={pct}
        sx={{
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: `${pct * 100}%`,
          height: `${pct * 100}%`,
          borderRadius: '50%',
          border: 2,
          borderColor: 'success.light',
          transform: `scale(${0.95 + amp * 0.2})`,
          transition: 'transform 90ms linear',
          opacity: 0.7 + amp * 0.3,
        }}
      />
    ))}
  </Box>
));

