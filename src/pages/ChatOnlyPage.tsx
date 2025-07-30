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
        // 👇 Centering properties are removed from the main container
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

      {/* 👇 1. HEADER AREA: A dedicated container for the icons at the top */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          p: 1, // Adds some space around the icons
        }}
      >
        <IconButton
          aria-label="Back"
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', left: 8, top: 8, color: 'grey.300' }}
        >
          <ArrowBackIcon />
        </IconButton>

        <IconButton
          aria-label="Start Call"
          component={Link}
          to={`/chat/${persona.name.toLowerCase()}`}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            bgcolor: 'success.main',
            '&:hover': {
              bgcolor: 'success.dark',
            },
          }}
        >
          <PhoneIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      {/* 👇 2. MAIN CONTENT AREA: This section takes up the remaining space */}
      <Box
        sx={{
          flexGrow: 1, // Ensures this area expands
          width: '100%',
          zIndex: 1,
          // You can add content here later if needed
        }}
      />
      
      {/* 👇 3. MESSAGE COMPOSER: Stays pinned to the bottom */}
      <MessageComposer onSend={handleSend} />
    </Box>
  );
}