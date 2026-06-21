import React from 'react';
import { 
 Container, 
 Box, 
 Typography, 
 Grid, 
 Paper, 
 Button, 
 Card,
 CardContent,
 CardMedia,
 Chip,
 Stack,
 Divider
} from '@mui/material';
import { 
 LocationOn, 
 AccessTime, 
 Security, 
 Payment, 
 Support,
 DirectionsCar,
 CheckCircle,
 Star,
 TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Explore() {
 const navigate = useNavigate();

 const features = [
  {
   icon: <LocationOn sx={{ fontSize: 40, color: '#1976d2' }} />,
   title: 'Strategic Locations',
   desc: 'Premium parking spots in prime locations across the city, close to major attractions and business districts.'
  },
  {
   icon: <AccessTime sx={{ fontSize: 40, color: '#388e3c' }} />,
   title: '24/7 Availability',
   desc: 'Round-the-clock access to parking facilities with real-time availability updates and instant booking.'
  },
  {
   icon: <Security sx={{ fontSize: 40, color: '#f57c00' }} />,
   title: 'Secure & Monitored',
   desc: 'Advanced security systems with CCTV surveillance and secure access controls for your peace of mind.'
  },
  {
   icon: <Payment sx={{ fontSize: 40, color: '#7b1fa2' }} />,
   title: 'Flexible Payment',
   desc: 'Multiple payment options including credit cards, digital wallets, and corporate billing solutions.'
  },
  {
   icon: <Support sx={{ fontSize: 40, color: '#d32f2f' }} />,
   title: 'Customer Support',
   desc: 'Dedicated customer service team available 24/7 to assist with bookings, cancellations, and inquiries.'
  },
  {
   icon: <DirectionsCar sx={{ fontSize: 40, color: '#455a64' }} />,
   title: 'Vehicle Types',
   desc: 'Accommodates all vehicle types from compact cars to SUVs and motorcycles with specialized spaces.'
  }
 ];


 const locations = [
  {
   name: 'Downtown Business District',
   address: '123 Main Street, Downtown',
   slots: 45,
   rate: '$3.50/hour',
   features: ['Covered', 'Security', 'EV Charging'],
   image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop'
  },
  {
   name: 'Shopping Mall Complex',
   address: '456 Commerce Ave, Midtown',
   slots: 120,
   rate: '$2.75/hour',
   features: ['Indoor', 'Valet', 'Wheelchair Access'],
   image: 'https://images.unsplash.com/photo-1555529902-1c05a6d66d17?w=400&h=250&fit=crop'
  },
  {
   name: 'Airport Terminal',
   address: '789 Airport Blvd, Terminal 2',
   slots: 200,
   rate: '$4.00/hour',
   features: ['Long-term', 'Shuttle Service', 'Baggage Cart'],
   image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop'
  }
 ];

 const stats = [
  { label: 'Available Slots', value: '365+', icon: <CheckCircle sx={{ color: '#4caf50' }} /> },
  { label: 'Happy Customers', value: '10K+', icon: <Star sx={{ color: '#ff9800' }} /> },
  { label: 'Monthly Bookings', value: '2.5K+', icon: <TrendingUp sx={{ color: '#2196f3' }} /> }
 ];

 return (
  <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
   <Box sx={{ 
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    py: 8,
    textAlign: 'center'
   }}>
    <Container maxWidth="lg">
     <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
      Explore Premium Parking
     </Typography>
     <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
      Discover convenient, secure, and affordable parking solutions across the city
     </Typography>
     <Button 
      variant="contained" 
      size="large" 
      onClick={() => navigate('/slots')}
      sx={{ 
       bgcolor: 'white', 
       color: '#2c3e50', 
       px: 4,
       '&:hover': { bgcolor: '#f5f5f5' }
      }}
     >
      View Available Slots
     </Button>
    </Container>
   </Box>

  

   <Container maxWidth="lg" sx={{ py: 6 }}>
    <Grid 
  container 
  spacing={4} 
  justifyContent="center" 
  alignItems="stretch"
>
  {features.map((feature, index) => (
    <Grid 
      item 
      xs={12} sm={6} md={4} 
      key={index}
      display="flex"
      justifyContent="center"
    >
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          height: '100%', 
          width: '100%', 
          maxWidth: 350,  
          borderRadius: 3,
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-4px)' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexDirection: 'column', textAlign: 'center' }}>
          <Box>{feature.icon}</Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
              {feature.title}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {feature.desc}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  ))}
</Grid>

  
    <Box sx={{ textAlign: 'center', mt: 6 }}>
     <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1f2937' }}>
      Ready to Find Your Perfect Parking Spot?
     </Typography>
     <Button 
      variant="contained" 
      size="large" 
      onClick={() => navigate('/slots')}
      sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
     >
      Start Booking Now
     </Button>
    </Box>
   </Container>
  </Box>
 );
}

