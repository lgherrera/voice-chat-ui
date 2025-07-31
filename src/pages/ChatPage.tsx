// src/pages/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { type Persona } from '@/constants/personas';
import { useVapi } from '@/hooks/useVapi';
// 👇 Assuming 'Message' type is exported from the barrel file
import { MessageList, ChatFooter, ChatBackground, type Message } from '@/components/chat';

export default function ChatPage() {
  const { personaName } = useParams<{ personaName: string }>();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersona = async () => {
      // ... (this useEffect remains the same)
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

  const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY as string;
  const { start, stop, transcripts, status } = useVapi(
    apiKey,
    persona?.assistantId ?? ''
  );

  // ... (existing state and useEffect for dialing/connected status remain the same)
  const [dialing, setDialing] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (status === 'calling') {
      timer = setTimeout(() => setConnected(true), 2000);
    } else if (status === 'ended') {
      setDialing(false);
      setConnected(false);
    }
    return () => clearTimeout(timer);
  }, [status]);


  const handleStart = () => {
    setDialing(true);
    requestAnimationFrame(() => start());
  };

  // 👇 1. Format the transcripts array before rendering
  const formattedMessages: Message[] = transcripts.map((line) => {
    const isUser = line.startsWith('user:');
    const content = line.replace(/^(user|assistant):\s*/, '');
    return {
      role: isUser ? 'user' : 'assistant',
      content,
    };
  });

  if (loading) {
    // ... (loading return remains the same)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!persona) {
    // ... (persona not found return remains the same)
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Persona not found</Typography>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        // ... (main Box sx prop remains the same)
        position: 'fixed',
        inset: 0,
        maxWidth: 430,
        mx: 'auto',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: 'common.white',
      }}
    >
      {persona?.bgUrl && <ChatBackground image={persona.bgUrl} />}

      {/* ... (overlay and header Box remain the same) */}
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.3)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'relative', zIndex: 1, flexShrink: 0, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton aria-label="Back" onClick={() => navigate(-1)} sx={{ position: 'absolute', left: 8, top: 8, color: 'grey.300' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 300, mt: 1 }}>{persona.name}, {persona.age}</Typography>
        {dialing && (
          <Typography sx={{ mt: 1, fontSize: '20px', color: 'grey.300', animation: connected ? 'none' : 'blink 1s step-start infinite', '@keyframes blink': { '50%': { opacity: 0 } }}}>
            {connected ? 'Connected' : 'Calling…'}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          flexGrow: 1,
          overflowY: 'auto',
          px: 2,
        }}
      >
        {/* 👇 2. Pass the newly formatted array to the component */}
        <MessageList messages={formattedMessages} />
      </Box>
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {/* 👇 3. Update prop name from onHistory to onVideoCall */}
        <ChatFooter onVideoCall={() => { console.log('Video call clicked') }} onStart={handleStart} onStop={stop} />
      </Box>
    </Box>
  );
}







