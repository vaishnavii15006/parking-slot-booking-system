import React from 'react';
import { 
  Box, 
  Typography, 
  Link, 
  Grid, 
  Container,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  LinkedIn, 
  Email, 
  Phone, 
  LocationOn,
  DirectionsCar
} from '@mui/icons-material';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        mt: 'auto',
        py: 4
      }}
    >
      <Container maxWidth="lg">
      <Grid container spacing={4} justifyContent="space-evenly" sx={{textAlign:{xs:"center",md:"left"}}}>
  <Grid item xs={12} md={4}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
      Quick Links
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Link href="/slots" color="inherit" underline="hover">
        View Slots
      </Link>
      <Link href="/login" color="inherit" underline="hover">
        Login
      </Link>
      <Link href="/admin" color="inherit" underline="hover">
        Admin Panel
      </Link>
    </Box>
  </Grid>

  <Grid item xs={12} md={4}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
      Support
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Link href="#" color="inherit" underline="hover">
        Help Center
      </Link>
      <Link href="#" color="inherit" underline="hover">
        Contact Us
      </Link>
      <Link href="#" color="inherit" underline="hover">
        FAQ
      </Link>
    </Box>
  </Grid>

  <Grid item xs={12} md={4}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
      Contact Info
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Email sx={{ mr: 1, fontSize: 16 }} />
        <Typography variant="body2">support@parkeasy.com</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Phone sx={{ mr: 1, fontSize: 16 }} />
        <Typography variant="body2">+1 (555) 123-4567</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LocationOn sx={{ mr: 1, fontSize: 16 }} />
        <Typography variant="body2">123 Parking St, City</Typography>
      </Box>
    </Box>
  </Grid>
  </Grid>


  <Grid item xs={12}>
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <DirectionsCar sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ParkEasy
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ mb: 2, opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
        Your trusted partner for convenient and secure parking solutions. 
        Book your parking spot in advance and enjoy hassle-free parking.
      </Typography>
    </Box>
  </Grid>

  <Grid item xs={12}>
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
      <IconButton sx={{ color: 'white' }}>
        <Facebook />
      </IconButton>
      <IconButton sx={{ color: 'white' }}>
        <Twitter />
      </IconButton>
      <IconButton sx={{ color: 'white' }}>
        <LinkedIn />
      </IconButton>
    </Box>
  </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 ParkEasy. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              Terms & Conditions
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

