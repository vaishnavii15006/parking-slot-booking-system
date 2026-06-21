import React, { useEffect, useState } from 'react';
import './UserBookings.css';
import { getUserBookings, cancelBooking } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import { 
  DirectionsCar, 
  Schedule, 
  AttachMoney,
  Cancel,
  CheckCircle,
  AccessTime,
  LocalParking
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';

export default function UserBookings() {
  const auth = useAuth();
  const userId = auth?.user?.id;
const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    if (!userId) {
      setError('User ID not available');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Loading bookings for user:', userId);
      const data = await getUserBookings(userId);
      console.log('Bookings data received:', data);
      setBookings(data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
    } catch (e) {
      console.error('Error loading bookings:', e);
      setError('Failed to load bookings. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [userId]);

  const handleCancel = async (id) => {
    setLoading(true);
    try {
      await cancelBooking(id);
      await loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'Completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle />;
      case 'Cancelled':
        return <Cancel />;
      case 'Completed':
        return <AccessTime />;
      default:
        return <AccessTime />;
    }
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              My Bookings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your parking reservations
            </Typography>
          </Box>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <Grid item xs={12} sm={6} md={4} key={booking.id}>
                <Card 
                  data-testid={`booking-item-${booking.id}`} 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalParking sx={{ fontSize: 30, color: 'primary.main', mr: 1 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Slot {booking.parkingSlot?.slotNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.parkingSlot?.slotType}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        icon={getStatusIcon(booking.status)}
                        sx={{ fontWeight: 'bold' }}
                        data-testid={`ub-status-${booking.id}`}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Vehicle Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {booking.vehicleNumber}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                        Start Time
                      </Typography>
                      <Typography variant="body1">
                        {formatDateTime(booking.startTime)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                        End Time
                      </Typography>
                      <Typography variant="body1">
                        {formatDateTime(booking.endTime)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Cost
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        <AttachMoney sx={{ fontSize: 20, mr: 0.5 }} />
                        {booking.totalCost}
                      </Typography>
                    </Box>
<Button
  variant="contained"
  color="primary"
  fullWidth
  onClick={() => {
    console.log("Booking passed to payment:", booking);
    console.log("Total cost being sent:", booking.totalCost || booking.amount);

    navigate("/payment", { 
      state: { 
        booking, 
        totalCost: booking.totalCost || booking.amount // fallback if named differently
      } 
    });
  }}
  startIcon={<AttachMoney />}
  sx={{ mt: 1, borderRadius: 2, py: 1 }}
>
  Proceed to Payment
</Button>


                    {booking.status === 'Confirmed' && (
                      <Button
                        data-testid={`cancel-btn-${booking.id}`}
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleCancel(booking.id)}
                        startIcon={<Cancel />}
                        sx={{ 
                          mt: 'auto',
                          borderRadius: 2,
                          py: 1
                        }}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            !loading && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <DirectionsCar sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Bookings Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You haven't made any parking bookings yet
                  </Typography>
                </Box>
              </Grid>
            )
          )}
        </Grid>
      </Paper>
    </Container>
  );
}