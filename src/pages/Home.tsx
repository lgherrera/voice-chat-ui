// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { PERSONAS, type Persona } from '@/constants/personas';

export default function HomePage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Select a Persona
      </Typography>
      <Grid container spacing={2}>
        {Object.values(PERSONAS).map((p: Persona) => (
          <Grid item key={p.id} xs={6} sm={4}>
            <Card
              component={Link}
              to={`/chat/${p.id}`}
              sx={{ textDecoration: 'none' }}
            >
              <CardMedia
                component="img"
                height="140"
                image={p.imageUrl}
                alt={p.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {`${p.name}, ${p.age}`}  {/* Name and age */}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.bio}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}