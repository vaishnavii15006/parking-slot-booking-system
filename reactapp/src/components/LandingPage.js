import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [role, setRole] = useState('user');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (role === 'user') {
      if (userId === 'user' && password === 'user') {
        navigate('/slots', { state: { userId: 1 } });
      } else {
        setError('Invalid user credentials');
      }
    } else {
      if (userId === 'admin' && password === 'admin') {
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    }
  };




  return (
    <Box sx={{
      minHeight: '80vh',
      backgroundImage: 'url("https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=1350&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, backdropFilter: 'blur(4px)' }}>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>Welcome</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ToggleButtonGroup value={role} exclusive onChange={(e, v) => v && setRole(v)}>
              <ToggleButton value="user">User</ToggleButton>
              <ToggleButton value="admin">Admin</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'grid', gap: 2 }}>
            <TextField label={role === 'user' ? 'UserId' : 'LoginId'} value={userId} onChange={(e) => setUserId(e.target.value)} />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <Typography color="error">[Error - You need to specify the message]</Typography>}
            <Button type="submit" variant="contained">Login</Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

