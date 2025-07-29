import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '@/lib/supabaseClient';
import { ChatBackground } from '@/components/chat';

// A minimal type for just the data this page needs
interface ChatOnlyPersona {
  name: string;
  bgUrl: string;
}

export default function ChatOnlyPage() {
  const { personaName } = useParams<{ personaName: string }>();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<ChatOnlyPersona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersona = async () => {
      if (!personaName) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('personas')
        .select('name, bgUrl:bg_url')
        .ilike('name', personaName)
        .single();

      if (error) {
        console.error('Error fetching persona:', error);
      } else {
        setPersona(data);
      }
      setLoading(false);
    };

    fetchPersona();
  }, [personaName]);


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'white',
        textAlign: 'center',
        p: 3,
      }}
    >
      {persona.bgUrl && <ChatBackground image={persona.bgUrl} />}

      <IconButton
        aria-label="Back"
        onClick={() => navigate('/')}
        sx={{ position: 'absolute', left: 8, top: 8, color: 'grey.300' }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h4" gutterBottom sx={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
        Ready to chat?
      </Typography>
      <Typography sx={{ mb: 4, textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
        Click the button below to start a conversation with {persona.name}.
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

