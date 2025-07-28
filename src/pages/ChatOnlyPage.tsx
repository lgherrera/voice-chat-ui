import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { supabase } from '@/lib/supabaseClient';
import { type Persona } from '@/constants/personas';

export default function ChatOnlyPage() {
  const { personaName } = useParams<{ personaName: string }>();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersona = async () => {
      if (!personaName) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('personas')
        .select('id, name, age, bio, bgUrl:bg_url, imageUrl:image_url, assistantId:vapi_assistant_id, supportsVoice:supports_voice')
        .ilike('name', personaName) // Use case-insensitive search on the name
        .single();

      if (error) {
        console.error('Error fetching persona:', error);
        setPersona(null);
      } else {
        setPersona(data);
      }
      setLoading(false);
    };

    fetchPersona();
  }, [personaName]);

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

      <Button
        variant="contained"
        size="large"
        component={Link}
        to={`/chat/${persona.name.toLowerCase()}`}
        endIcon={<ArrowForwardIcon />}
      >
        Chat with {persona.name}
      </Button>
    </Box>
  );
}

