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
          width: { xs: '100%', sm: 430 },
          maxWidth: 430,
          mx: 'auto',
          height: '100vh',
          bgcolor: 'black',
          color: 'white',
          boxShadow: { sm: 3 },
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

        {/* scrollable list */}
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

