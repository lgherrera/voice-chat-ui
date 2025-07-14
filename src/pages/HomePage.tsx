// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// ✅ Corrected import path:
import { ProfileCard } from '@/components/ProfileCard';
import { PERSONAS, type Persona } from '@/constants/personas';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    // TODO: wire up your subscription flow here
  };

  const cards = Object.values(PERSONAS).map((p: Persona) => ({
    imageUrl: p.imageUrl,
    headline: `${p.name}, ${p.age}`,
    bio: p.bio,
    onClick: () => navigate(`/chat/${p.id}`),
  }));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 430,
        mx: 'auto',
        minHeight: '100vh',
        bgcolor: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          charlare
        </Typography>

        <Button
          variant="contained"
          sx={{ borderRadius: '32px', px: 3, py: 1 }}
          onClick={handleSubscribe}
        >
          SUSCRÍBETE
        </Button>

        <IconButton sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'grey.800' }} />

      {/* Scrollable persona cards */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          pb: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {cards.map((c) => (
          <ProfileCard
            key={c.headline}
            imageUrl={c.imageUrl}
            headline={c.headline}
            bio={c.bio}
            onClick={c.onClick}
          />
        ))}
      </Box>
    </Box>
  );
}






