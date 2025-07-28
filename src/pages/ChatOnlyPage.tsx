import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { PERSONAS } from '@/constants/personas';

export default function ChatOnlyPage() {
  // 1. Get the persona name from the URL, e.g., "maya"
  const { personaName } = useParams<{ personaName: string }>();

  // Find the corresponding persona object to get the full name
  const persona = personaName ? PERSONAS[personaName as keyof typeof PERSONAS] : undefined;

  // Capitalize the first letter for the display name
  const displayName = persona ? persona.name : 'this person';

  if (!persona) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Persona not found</Typography>
        <Button component={Link} to="/">Go Home</Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f0f2f5',
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Ready to chat?
      </Typography>
      <Typography sx={{ mb: 4 }}>
        Click the button below to start a conversation with {displayName}.
      </Typography>

      {/* 2. Create a dynamic link to the chat page, e.g., /chat/maya */}
      <Button
        variant="contained"
        size="large"
        component={Link}
        to={`/chat/${personaName}`}
        endIcon={<ArrowForwardIcon />}
      >
        Chat with {displayName}
      </Button>
    </Box>
  );
}

