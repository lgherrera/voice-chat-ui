import React, { useEffect, useRef } from 'react';
import {
  Slide,
  Paper,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
  transcripts: string[];
  onBack: () => void;
}

export const TranscriptPage: React.FC<Props> = ({
  transcripts,
  onBack,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  return (
    <Slide direction="left" in>
      <Paper
        sx={{
          position: 'fixed',
          inset: 0,

          /* phone card */
          width: '100%',
          maxWidth: 430,
          mx: 'auto',
          boxShadow: { sm: 3 },

          height: '100vh',
          bgcolor: 'black',
          color: 'white',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* back arrow */}
        <IconButton
          onClick={onBack}
          sx={{ color: 'grey.300', mb: 1, alignSelf: 'flex-start' }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* scrollable transcript list */}
        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
          {transcripts.map((line, i) => (
            <Typography key={i} sx={{ mb: 1 }}>
              {line}
            </Typography>
          ))}
          <div ref={bottomRef} />
        </Box>
      </Paper>
    </Slide>
  );
};


