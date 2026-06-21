import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, Button } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LockIcon from '@mui/icons-material/Lock';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToSlots = () => {
    if (!user) navigate('/login', { state: { redirectTo: '/slots' } });
    else navigate('/slots');
  };
  const goToMyBookings = () => {
    if (!user) navigate('/login', { state: { redirectTo: '/mybookings' } });
    else navigate('/mybookings');
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc' }}>
      <Box
  sx={{
    py: { xs: 10, md: 14 },
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    textAlign: 'center'
  }}
>
       
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              letterSpacing: 0.3
            }}
          >
            Parking Slot Booking System
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              opacity: 0.95,
              maxWidth: 680,
              mx: 'auto',
              mb: 4
            }}
          >
            Find, book, and manage your parking space with ease
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              onClick={goToSlots}
              variant="contained"
              sx={{
                px: 3,
                bgcolor: 'white',
                color: '#2c3e50',
                fontWeight: 700,
                '&:hover': { bgcolor: '#f3f4f6' }
              }}
            >
              View Available Slots
            </Button>
            <Button
              onClick={goToMyBookings}
              variant="outlined"
              sx={{
                px: 3,
                borderColor: 'white',
                color: 'white',
                fontWeight: 700,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', borderColor: 'white' }
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 800, color: '#1f2937', mb: 6 }}
        >
          Why Choose ParkEasy?
        </Typography>

        

        <Grid container spacing={3}>
          {[
            {
              icon: <LocalOfferIcon sx={{ color: '#f59e0b' }} />,
              title: 'Best Prices',
              desc: 'Competitive rates with no hidden fees'
            },
            {
              icon: <FlashOnIcon sx={{ color: '#fb7185' }} />,
              title: 'Book in Seconds',
              desc: 'Quick and easy booking process'
            },
            {
              icon: <LockIcon sx={{ color: '#10b981' }} />,
              title: 'Secure & Reliable',
              desc: 'Your vehicle is safe with us'
            },
            {
              icon: <RemoveRedEyeIcon sx={{ color: '#8b5cf6' }} />,
              title: 'Live Availability',
              desc: 'Real-time slot availability updates'
            },
            {
              icon: <SupportAgentIcon sx={{ color: '#f59e0b' }} />,
              title: '24/7 Support',
              desc: 'Round-the-clock customer assistance'
            },
            {
              icon: <CalendarMonthIcon sx={{ color: '#3b82f6' }} />,
              title: 'Flexible Booking',
              desc: 'Hourly, daily, or monthly options'
            }
          ].map((f, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'white',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  transition: 'all .25s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                }}
              >
                <Box sx={{ width: 48, height: 48, display: 'grid', placeItems: 'center', bgcolor: '#f1f5f9', borderRadius: 2 }}>
                  {f.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', mt: 1 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {f.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}