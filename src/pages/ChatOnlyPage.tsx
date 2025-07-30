// src/pages/ChatOnlyPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// 👇 1. Import the PhoneIcon
import PhoneIcon from '@mui/icons-material/Phone';
import { supabase } from '@/lib/supabaseClient';
import { type Persona } from '@/constants/personas';
import { ChatBackground } from '@/components/chat';
import { MessageComposer } from '@/components/chat/MessageComposer';

export default function ChatOnlyPage() {
  const { personaName } = useParams<{ personaName:string }>();
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
  
  const handleSend = (text: string) => {
    console.log('Message sent:', text);
    // In a real app, you might handle this text differently
  };

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
        position: 'fixed',
        inset: 0,
        maxWidth: 430,
        mx: 'auto',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'common.white',
        textAlign: 'center',
        p: 3,
      }}
    >
      {persona?.bgUrl && <ChatBackground image={persona.bgUrl} />}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <IconButton
          aria-label="Back"
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', left: 8, top: 8, color: 'grey.300' }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* 👇 2. Add the green phone icon button here */}
        <IconButton
          aria-label="Start Call"
          component={Link}
          to={`/chat/${persona.name.toLowerCase()}`}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            bgcolor: 'success.main', // A semantic green color
            '&:hover': {
              bgcolor: 'success.dark',
            },
          }}
        >
          <PhoneIcon />
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

      <MessageComposer onSend={handleSend} />
    </Box>
  );
}