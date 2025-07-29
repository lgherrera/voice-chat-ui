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
  const [backgroundUrl, setBackgroundUrl] = useState('');

  useEffect(() => {
    const fetchPersona = async () => {
      console.log('DEBUG: Starting to fetch persona data...');
      if (!personaName) {
        console.error('DEBUG: No personaName in URL. Stopping.');
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('personas')
        .select('name, bgUrl:bg_url')
        .ilike('name', personaName)
        .single();

      if (error) {
        console.error('DEBUG: Error fetching from "personas" table:', error);
      } else if (data) {
        console.log('DEBUG: Successfully fetched persona data:', data);
        setPersona(data);
      } else {
        console.error('DEBUG: No data or error returned from persona fetch.');
      }
      setLoading(false);
    };

    fetchPersona();
  }, [personaName]);

  useEffect(() => {
    console.log('DEBUG: Checking if we should fetch storage URL. Persona object:', persona);
    if (persona?.bgUrl) {
      console.log(`DEBUG: Persona has bgUrl: "${persona.bgUrl}". Attempting to get public URL from bucket "bg-images".`);
      const { data } = supabase.storage
        .from('bg-images')
        .getPublicUrl(persona.bgUrl);
      
      console.log('DEBUG: Supabase storage response:', data);
      if (data?.publicUrl) {
        console.log('DEBUG: Successfully got public URL:', data.publicUrl);
        setBackgroundUrl(data.publicUrl);
      } else {
        console.error('DEBUG: Failed to get public URL from storage response.');
      }
    }
  }, [persona]);

  console.log(`DEBUG: Rendering component. Current backgroundUrl state: "${backgroundUrl}"`);

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
      {backgroundUrl ? <ChatBackground image={backgroundUrl} /> : <p>DEBUG: No backgroundUrl, not rendering ChatBackground.</p>}

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

