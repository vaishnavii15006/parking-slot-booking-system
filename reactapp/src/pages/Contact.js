import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        py: 10,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          zIndex: 1
        }} />
        
      
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900, 
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                letterSpacing: '-0.02em',
                background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Get In Touch
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.95, 
                mb: 4, 
                maxWidth: 700, 
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}
            >
              We're here to help! Reach out to us with any questions, feedback, or support needs. 
              Our team is ready to assist you 24/7.
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4, 
            flexWrap: 'wrap',
            mb: 4
          }}>
            {[
              { icon: '⚡', text: '24h Response' },
              { icon: '🎯', text: 'Expert Support' },
              { icon: '💬', text: 'Multiple Channels' }
            ].map((item, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  px: 3,
                  py: 1.5,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
              
                <Typography sx={{ fontSize: '1.2rem' }}>{item.icon}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>

         
        </Container>
      </Box>

      

      <Box sx={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 6,
        px: 2,
        bgcolor: '#f8f9fa'
      }}>
        <Container maxWidth="sm" sx={{ width: '100%' }}>
          <Paper sx={{ p: 4, borderRadius: 3 }} elevation={4}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Us
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                We'd love to hear from you. Send us a message and we'll respond soon.
              </Typography>
            </Box>
            
            {sent && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thanks! We'll get back to you shortly.
              </Alert>
            )}
            
            <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                label="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                fullWidth
              />
              <TextField 
                label="Email" 
                value={email} 
                type="email" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                fullWidth
              />
              <TextField 
                label="Message" 
                value={message} 
                multiline 
                rows={4} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
                fullWidth
              />
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                sx={{ alignSelf: 'center', px: 4 }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
