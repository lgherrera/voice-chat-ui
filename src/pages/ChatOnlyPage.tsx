// src/pages/ChatOnlyPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import { supabase } from '@/lib/supabaseClient';
import { type Persona } from '@/constants/personas';
import { ChatBackground, MessageComposer, MessageList, type Message } from '@/components/chat';

// 👇 This function now accepts and returns a chatId
const callVapiChatApi = async (
  message: string,
  persona: Persona | null,
  chatId: string | null
): Promise<{ reply: string; chatId: string }> => {
  if (!persona?.assistantId) {
    throw new Error("Assistant ID not configured.");
  }

  const response = await fetch('/api/vapi-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message,
      assistantId: persona.assistantId,
      previousChatId: chatId, // Pass the previous chat ID
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Server error.');
  }

  return response.json();
};

export default function ChatOnlyPage() {
  const { personaName } = useParams<{ personaName: string }>();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  
  // 👇 Add state to store the current chat ID
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    // ... fetchPersona logic remains the same ...
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
        setMessages([{ role: 'assistant', content: `Hi! I'm ${data.name}. What's on your mind?` }]);
      }
      setLoading(false);
    };

    fetchPersona();
  }, [personaName]);

  const handleSend = async (text: string) => {
    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsAssistantTyping(true);

    try {
      // 👇 Pass the currentChatId to the API call
      const { reply, chatId } = await callVapiChatApi(text, persona, currentChatId);
      
      const assistantMessage: Message = { role: 'assistant', content: reply };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // 👇 Update the chatId for the next message
      setCurrentChatId(chatId);

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I couldn't connect." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAssistantTyping(false);
    }
  };

  // ... (loading/error returns and the rest of the JSX remain the same)
  if (loading) { return ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box> );}
  if (!persona) { return ( <Box sx={{ p: 4, textAlign: 'center' }}><Typography variant="h6">Persona not found</Typography><Button component={Link} to="/">Go Home</Button></Box> );}

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
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.3)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%', p: 1, textAlign: 'center', color: 'common.white' }}>
        <IconButton aria-label="Back" component={Link} to="/" sx={{ position: 'absolute', left: 20, top: 20, color: 'grey.300', zIndex: 10 }} >
          <ArrowBackIcon />
        </IconButton>
        <IconButton aria-label="Start Call" component={Link} to={`/chat/${persona.name.toLowerCase()}`} sx={{ position: 'absolute', right: 20, top: 20, color: 'success.main', zIndex: 10 }} >
          <PhoneIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 300, mt: 1, textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }} >
          {persona.name}, {persona.age}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, width: '100%', zIndex: 1, overflowY: 'auto', px: 2, pb: '88px' }}>
        <MessageList messages={messages} isAssistantTyping={isAssistantTyping} />
      </Box>
      <MessageComposer onSend={handleSend} />
    </Box>
  );
}