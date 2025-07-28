import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '@/lib/supabaseClient';
import { type Persona } from '@/constants/personas';

export default function ChatOnlyPage() {
  const { personaName } = useParams<{ personaName: string }>();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersona = async () => {
      if (!personaName) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('personas')
        .select('id, name, age, bio, bgUrl:bg_url, imageUrl:image_url, assistantId:vapi_assistant_id')
        .ilike('name', personaName) // Use case-insensitive search on the name
        .single();

      if (error) {
        console.error('Error fetching persona in ChatOnlyPage:', error);
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
        position: 'relative', // Needed for absolute positioning of the icon
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f0f2f5',
        p: 3,
      }}
    >
      <IconButton
        aria-label="Back"
        onClick={() => navigate('/')}
        sx={{ position: 'absolute', left: 8, top: 8, color: 'grey.700' }}
      >
        <ArrowBackIcon />
      </IconButton>

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

