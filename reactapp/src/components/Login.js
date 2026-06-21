import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography,
  ToggleButtonGroup, 
  ToggleButton, 
  Box,
  Container,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Login as LoginIcon, 
  PersonAdd,
  DirectionsCar
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, register, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login({ username, password });
      } else {
        result = await register({ username, password });
      }

      if (!result.success) {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (location.state?.redirectTo) {
        navigate(location.state.redirectTo, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/slots', { replace: true });
      }
    }
  }, [user, location.state, navigate]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: '80vh',
        justifyContent: 'center'
      }}>
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            width: '100%', 
            maxWidth: 450,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 2 
            }}>
              <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ParkEasy
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mode === 'login' 
                ? 'Sign in to manage your parking bookings' 
                : 'Join us for convenient parking solutions'
              }
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, newMode) => newMode && setMode(newMode)}
              size="large"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  borderRadius: 2
                }
              }}
            >
              <ToggleButton value="login" startIcon={<LoginIcon />}>
                Login
              </ToggleButton>
              <ToggleButton value="register" startIcon={<PersonAdd />}>
                Register
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <Button 
                variant="text" 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                {mode === 'login' ? 'Sign up here' : 'Sign in here'}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

