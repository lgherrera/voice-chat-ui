import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => (
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
    {/* ───────── Header ───────── */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        runway
      </Typography>

      <Button
        variant="contained"
        sx={{ borderRadius: '32px', px: 3, py: 1 }}
        onClick={onStart}
      >
        Get&nbsp;Started
      </Button>

      <IconButton sx={{ color: 'white' }}>
        <MenuIcon />
      </IconButton>
    </Box>

    <Divider sx={{ borderColor: 'grey.800' }} />

    {/* ───────── Content cards ───────── */}
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
      {/* Card 1 — links to voice app */}
      <Box sx={{ cursor: 'pointer' }} onClick={onStart}>
        <Box
          component="img"
          src="/img1.jpg"                /* put your image in /public */
          alt="Gen-4"
          sx={{
            width: '100%',
            height: 'auto',             /* natural height */
            borderRadius: 2,
            display: 'block',
          }}
        />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Introducing Gen-4
        </Typography>
        <Typography variant="body2" color="grey.500">
          Research&nbsp;/&nbsp;March&nbsp;31,&nbsp;2025
        </Typography>
      </Box>

      {/* Card 2 — static placeholder */}
      <Box>
        <Box
          component="img"
          src="/img2.jpg"                /* put your image in /public */
          alt="Act-One"
          sx={{
            width: '100%',
            height: 'auto',
            borderRadius: 2,
            display: 'block',
          }}
        />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Introducing Act-One
        </Typography>
        <Typography variant="body2" color="grey.500">
          Research&nbsp;/&nbsp;October&nbsp;22,&nbsp;2024
        </Typography>
      </Box>
    </Box>
  </Box>
);


