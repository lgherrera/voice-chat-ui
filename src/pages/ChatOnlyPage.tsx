// src/pages/ChatOnlyPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          p: 1,
        }}
      >
        <IconButton
          aria-label="Back"
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            left: 20,
            top: 20,
            color: 'grey.300'
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <IconButton
          aria-label="Start Call"
          component={Link}
          to={`/chat/${persona.name.toLowerCase()}`}
          sx={{
            position: 'absolute',
            right: 20,
            top: 20,
            // 👇 Background color is removed and icon color is set to green
            color: 'success.main',
          }}
        >
          <PhoneIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          zIndex: 1,
        }}
      />
      
      <MessageComposer onSend={handleSend} />
    </Box>
  );
}