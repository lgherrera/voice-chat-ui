// src/pages/ChatOnlyPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import { supabase } from '@/lib/supabaseClient';
import { type Persona } from '@/constants/personas';
// 👇 1. Import your MessageList component and Message type
import { ChatBackground, MessageComposer, MessageList, type Message } from '@/components/chat';

// 👇 2. Placeholder for your actual Vapi API call
// You will replace this with your real implementation later.
const callVapiChatApi = async (message: string, persona: Persona | null): Promise<string> => {
  console.log(`Sending to Vapi: "${message}" for assistant ${persona?.assistantId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simulate a response from the assistant
  return `This is a simulated response to your message: "${message}"`;
};


export default function ChatOnlyPage() {
  const { personaName } = useParams<{ personaName:string }>();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  // 👇 3. Add state for messages and assistant thinking status
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

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
        // Add an initial greeting from the assistant
        setMessages([{ role: 'assistant', content: `Hi! I'm ${data.name}. What's on your mind?` }]);
      }
      setLoading(false);
    };

    fetchPersona();
  }, [personaName]);

  // 👇 4. Implement the handleSend function to call the API
  const handleSend = async (text: string) => {
    // Add the user's message to the list immediately
    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsAssistantTyping(true);

    // Call the Vapi API
    const assistantResponse = await callVapiChatApi(text, persona);

    // Add the assistant's response
    const assistantMessage: Message = { role: 'assistant', content: assistantResponse };
    setMessages(prev => [...prev, assistantMessage]);
    setIsAssistantTyping(false);
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
      {persona?.bgUrl && <ChatBackground image={persona.bgUrl} opacity={0.5} />}

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
          zIndex: 2,
          width: '100%',
          p: 1,
          textAlign: 'center',
          color: 'common.white',
        }}
      >
        <IconButton
          aria-label="Back"
          component={Link}
          to="/"
          sx={{ position: 'absolute', left: 20, top: 20, color: 'grey.300', zIndex: 10 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <IconButton
          aria-label="Start Call"
          component={Link}
          to={`/chat/${persona.name.toLowerCase()}`}
          sx={{ position: 'absolute', right: 20, top: 20, color: 'success.main', zIndex: 10 }}
        >
          <PhoneIcon sx={{ fontSize: 30 }} />
        </IconButton>
        
        <Typography
          variant="h4"
          sx={{ fontWeight: 300, mt: 1, textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
        >
          {persona.name}, {persona.age}
        </Typography>

      </Box>

      {/* 👇 5. Use the MessageList component in the main content area */}
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          zIndex: 1,
          overflowY: 'auto', // Make the message list scrollable
          px: 2,
        }}
      >
        <MessageList messages={messages} isAssistantTyping={isAssistantTyping} />
      </Box>
      
      <MessageComposer onSend={handleSend} />
    </Box>
  );
}