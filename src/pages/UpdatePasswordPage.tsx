// src/pages/UpdatePasswordPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Redirect to sign-in page after a short delay
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    }
    setLoading(false);
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
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Update Your Password
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          inputProps={{
            style: { color: 'white' },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Password updated successfully! Redirecting to sign in...
        </Alert>
      )}
    </Box>
  );
}