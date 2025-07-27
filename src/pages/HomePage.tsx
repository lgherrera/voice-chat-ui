// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { supabase } from '@/lib/supabaseClient';
import { ProfileCard } from '@/components/ProfileCard';

type Persona = {
  id: string;
  name: string;
  age: number;
  imageUrl: string;
  bio: string | null;
};

export default function HomePage() {
  const navigate = useNavigate();

  const [personas, setPersonas] = React.useState<Persona[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    const fetchPersonas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('personas')
        .select('id, name, age, bio, imageUrl:image_url');

      if (error) {
        console.error('Error fetching personas:', error);
      } else if (data) {
        setPersonas(data as Persona[]);
      }
      setLoading(false);
    };

    fetchPersonas();
  }, []); // Runs once on page load

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    handleMenuCode();
    navigate('/signin', { replace: true });
  };

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
      {/* ───── Header ───── */}
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
          onClick={() => {}}
        >
          UPGRADE
        </Button>

        <IconButton sx={{ color: 'white' }} onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </Menu>
      </Box>

      <Divider sx={{ borderColor: 'grey.800' }} />

      {/* ───── Scrollable cards ───── */}
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          personas.map((p: Persona) => (
            <ProfileCard
              key={p.id}
              imageUrl={p.imageUrl}
              headline={`${p.name}, ${p.age}`}
              bio={p.bio ?? ''} // 👈 THIS IS THE FIX
              onClick={() => navigate(`/chat/${p.id}`)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}










