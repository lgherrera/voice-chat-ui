import React from 'react';
import { Box, Typography } from '@mui/material';

interface ProfileCardProps {
  imageUrl: string;
  headline: string;
  bio: string;
  onClick?: () => void;           // optional link / CTA
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  imageUrl,
  headline,
  bio,
  onClick,
}) => (
  <Box
    sx={{ cursor: onClick ? 'pointer' : 'default' }}
    onClick={onClick}
  >
    <Box
      component="img"
      src={imageUrl}
      alt={headline}
      sx={{
        width: '100%',
        height: 'auto',
        borderRadius: 2,
        display: 'block',
      }}
    />
    <Typography variant="h5" sx={{ mt: 2 }}>
      {headline}
    </Typography>
    <Typography variant="body2" color="grey.500">
      {bio}
    </Typography>
  </Box>
);
