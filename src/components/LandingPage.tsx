import React from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ProfileCard } from './ProfileCard';

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  /* Card data */
  const cards = [
    {
      imageUrl: '/img1.jpg',
      headline: 'Maya, 24',
      bio: 'Amo los animales, amo mi trabajo, soy tranquila, me gusta leer y ver series en Netflix.',
      onClick: onStart,
    },
    {
      imageUrl: '/img2.jpg',
      headline: 'Valentina, 23',
      bio: 'Fanática de los deportes, la vida al aire libre, la buena alimentación, y las amistades duraderas.',
    },
    /* NEW – Fernanda */
    {
      imageUrl: '/img3.jpg',
      headline: 'Fernanda, 27',
      bio: 'Amo la noche, la fiesta y los novios.',
    },
  ];

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
          onClick={onStart}
        >
          SUSCRÍBETE
        </Button>

        <IconButton sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'grey.800' }} />

      {/* Scrollable cards */}
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
};






