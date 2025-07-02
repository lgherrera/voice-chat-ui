import React, { useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
  transcripts: string[];
  onBack: () => void;
}

export const TranscriptPage: React.FC<Props> = ({ transcripts, onBack }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  /* autoscroll to the latest line */
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [
    transcripts,
  ]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      {/* back button */}
      <IconButton onClick={onBack} sx={{ color: 'grey.300', mb: 1 }}>
        <ArrowBackIcon />
      </IconButton>

      {/* scrollable list */}
      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {transcripts.map((line, i) => (
          <Typography key={i} sx={{ mb: 1 }}>
            {line}
          </Typography>
        ))}
        {/* dummy div for autoscroll */}
        <div ref={bottomRef} />
      </Box>
    </Box>
  );
};
