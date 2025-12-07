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

  // 1. Fetch Persona Details
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

  // 2. Initialize Vapi Hook
  const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY as string;
  const { start, stop, transcripts, status } = useVapi(
    apiKey,
    persona?.assistantId ?? ''
  );

  const [dialing, setDialing] = useState(false);
  const [connected, setConnected] = useState(false);

  // 3. Handle Status Changes (Dialing vs Connected)
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

  // 4. NEW: Handle Start Call with Session Creation
  const handleStart = async () => {
    setDialing(true);

    try {
      // A. Get the current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !persona) {
        console.error("Missing user or persona info. Cannot start session.");
        setDialing(false);
        return;
      }

      // B. Call your Vercel backend to create the 'chats' row
      const response = await fetch('/api/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          personaId: persona.id,
          vapiAssistantId: persona.assistantId
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to start session');
      }

      // C. Retrieve the new Chat ID
      const { chatId } = await response.json();
      console.log("✅ Session created with Chat ID:", chatId);

      // D. Start Vapi, passing the chatId in metadata so n8n receives it
      requestAnimationFrame(() => {
        start({
          metadata: {
            chatId: chatId 
          }
        });
      });

    } catch (error) {
      console.error("❌ Error starting call:", error);
      setDialing(false); // Reset UI on failure
    }
  };

  // 5. Format transcripts for the UI
  const formattedMessages: Message[] = transcripts.map((line) => {
    const isUser = line.startsWith('user:');
    const content = line.replace(/^(user|assistant):\s*/, '');
    return {
      role: isUser ? 'user' : 'assistant',
      content,
    };
  });

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
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
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
        overflow: 'hidden',
        color: 'common.white',
      }}
    >
      {persona?.bgUrl && <ChatBackground image={persona.bgUrl} />}

      {/* Overlay & Header */}
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

      {/* Message List */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          flexGrow: 1,
          overflowY: 'auto',
          px: 2,
        }}
      >
        <MessageList messages={formattedMessages} />
      </Box>
      
      {/* Footer Controls */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <ChatFooter 
          onVideoCall={() => { console.log('Video call clicked') }} 
          onStart={handleStart} 
          onStop={stop} 
        />
      </Box>
    </Box>
  );
}







