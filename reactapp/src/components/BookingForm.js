import React, { useState, useEffect } from 'react';
import './BookingForm.css';
import { createBooking, getVehiclesByUserId } from '../utils/api';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Container,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
   Chip,
 FormControl,
 InputLabel,
 Select,
 MenuItem,
 FormControlLabel,
 Switch

} from '@mui/material';
import { 
  DirectionsCar, 
  Schedule, 
  AttachMoney,
  CheckCircle,Add
} from '@mui/icons-material';
import { useInRouterContext, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

export default function BookingForm({ slot, onBooked }) {
  const { user } = useAuth();
  const location = useLocation();

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [cost, setCost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 const [vehicles, setVehicles] = useState([]);
 const [useCustomVehicle, setUseCustomVehicle] = useState(false);
 const [customVehicleNumber, setCustomVehicleNumber] = useState('');
 const [selectedVehicleId,setSelectedVehicleId] = useState('');

  const router = useInRouterContext();
  const realSlot = location?.state?.slot || slot;
 // Load user's vehicles
 useEffect(() => {
  const loadVehicles = async () => {
   if (user?.id) {
    try {
     const userVehicles = await getVehiclesByUserId(user.id);
     setVehicles(userVehicles || []);
     // If user has vehicles, set useCustomVehicle to false to show dropdown
     if (userVehicles && userVehicles.length > 0) {
      setUseCustomVehicle(false);
     } else {
      setUseCustomVehicle(true);
     }
    } catch (err) {
     console.error('Failed to load vehicles:', err);
     setUseCustomVehicle(true);
    }
   }
  };
  loadVehicles();
 }, [user?.id]);


  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const now = new Date();
      if (start < now) return setCost(null);

      const hours = Math.floor((end - start) / 3600000);
      if (hours > 0) {
        setCost((hours * realSlot.hourlyRate).toFixed(2));
      } else {
        setCost(null);
      }
    }
  }, [startTime, endTime, realSlot.hourlyRate]);

  const handleVehicleChange = (event) => {
  const selectedId = event.target.value;
  setSelectedVehicleId(selectedId);
  
  if (selectedId === 'custom') {
   setUseCustomVehicle(true);
   setVehicleNumber('');
  } else {
   setUseCustomVehicle(false);
   const selectedVehicle = vehicles.find(v => v.id === selectedId);
   setVehicleNumber(selectedVehicle?.vehicleNumber || '');
  }
 };

 const handleCustomVehicleChange = (event) => {
  setCustomVehicleNumber(event.target.value);
  setVehicleNumber(event.target.value);
 };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

  let finalVehicleNumber = '';
  if (useCustomVehicle) {
   finalVehicleNumber = customVehicleNumber;
  } else if (selectedVehicleId && selectedVehicleId !== 'custom') {
   const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
   finalVehicleNumber = selectedVehicle?.vehicleNumber || '';
  } else {
   finalVehicleNumber = vehicleNumber;
  }

  if (!finalVehicleNumber.trim()) return setError('Vehicle number is required');

    if (start < now) return setError('Start time cannot be in the past');
    if (end <= start) return setError('End time must be after start time');

    setLoading(true);
    try {
      await createBooking({
        userId: user?.id || 1,
        parkingSlot: realSlot,
        vehicleNumber:finalVehicleNumber.trim(),
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
      });
      setLoading(false);
      onBooked();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    }
  };

  const getSlotIcon = (slotType) => {
    switch (slotType) {
      case 'VIP':
        return '⭐';
      case 'Handicapped':
        return '♿';
      default:
        return '🚗';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 3
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <DirectionsCar sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Book Your Parking Slot
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete your booking details below
          </Typography>
        </Box>

        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {getSlotIcon(realSlot.slotType)} Slot {realSlot.slotNumber}
                </Typography>
                <Chip 
                  label={realSlot.slotType} 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${realSlot.hourlyRate}/hour
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Hourly Rate
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: 600, margin: '0 auto' }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Vehicle Selection */}
      {vehicles.length > 0 && !useCustomVehicle ? (
       <FormControl fullWidth>
        <InputLabel>Select Vehicle</InputLabel>
        <Select
         value={selectedVehicleId}
         onChange={handleVehicleChange}
         label="Select Vehicle"
         inputProps={{ 'data-testid': 'vehicle-select' }}
         sx={{ 
          '& .MuiOutlinedInput-root': { borderRadius: 2 }
         }}
         startAdornment={<DirectionsCar sx={{ mr: 1, color: 'text.secondary' }} />}
        >
         {vehicles.map((vehicle) => (
          <MenuItem key={vehicle.id} value={vehicle.id}>
           <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <DirectionsCar sx={{ mr: 1, color: 'text.secondary' }} />
            <Box>
             <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {vehicle.vehicleNumber}
             </Typography>
             <Typography variant="caption" color="text.secondary">
              {vehicle.vehicleType} • {vehicle.vehicleModel || 'No model'} • {vehicle.vehicleColor || 'No color'}
             </Typography>
            </Box>
           </Box>
          </MenuItem>
         ))}
         <MenuItem value="custom">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
           <Add sx={{ mr: 1, color: 'text.secondary' }} />
           <Typography>Enter custom vehicle number</Typography>
          </Box>
         </MenuItem>
        </Select>
       </FormControl>
      ) : (
       <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
         <FormControlLabel
          control={
           <Switch
            checked={useCustomVehicle}
            onChange={(e) => {
             setUseCustomVehicle(e.target.checked);
             if (!e.target.checked && vehicles.length > 0) {
              setVehicleNumber('');
              setCustomVehicleNumber('');
             }
            }}
            color="primary"
           />
          }
          label="Use custom vehicle number"
         />
        </Box>
        


        <TextField
         label="Vehicle Number"
         variant="outlined"
         value={useCustomVehicle ? customVehicleNumber : vehicleNumber}
         onChange={useCustomVehicle ? handleCustomVehicleChange : (e) => setVehicleNumber(e.target.value)}
         inputProps={{ 'data-testid': 'vehicle-input' }}
         required
         fullWidth
         sx={{ 
          '& .MuiOutlinedInput-root': { borderRadius: 2 }
         }}
         InputProps={{
          startAdornment: <DirectionsCar sx={{ mr: 1, color: 'text.secondary' }} />
         }}
        />
       </Box>
      )}
{selectedVehicleId && selectedVehicleId !== 'custom' && !useCustomVehicle && (
       <TextField
        label="Selected Vehicle Number"
        variant="outlined"
        value={vehicleNumber}
        InputProps={{
         readOnly: true,
         startAdornment: <DirectionsCar sx={{ mr: 1, color: 'text.secondary' }} />
        }}
        fullWidth
        sx={{ 
         '& .MuiOutlinedInput-root': { borderRadius: 2 },
         '& .MuiInputBase-input': { color: 'primary.main', fontWeight: 'bold' }
        }}
       />
      )}
      {vehicles.length === 0 && (
       <Alert severity="info" sx={{ borderRadius: 2 }}>
        <Typography variant="body2">
         No vehicles registered in your profile. You can add vehicles in your profile or enter a custom vehicle number above.
        </Typography>
       </Alert>
      )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Start Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                inputProps={{ 'data-testid': 'start-time-input' }}
                required
                sx={{ 
                  flex: 1, 
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
                InputProps={{
                  startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <TextField
                label="End Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                inputProps={{ 'data-testid': 'end-time-input' }}
                required
                sx={{ 
                  flex: 1, 
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
                InputProps={{
                  startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>

            {cost && (
              <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AttachMoney sx={{ fontSize: 40, mr: 1 }} />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }} data-testid="cost">
                        ${cost}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Cost
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Divider sx={{ my: 2 }} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <Button
                data-testid="book-btn"
                type="submit"
                variant="contained"
                size="large"
                fullWidth
  disabled={
         !startTime || 
         !endTime || 
         !cost || 
         (!useCustomVehicle && !selectedVehicleId) ||
         (useCustomVehicle && !customVehicleNumber.trim())
        }
                sx={{ 
                  py: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.12)',
                    color: 'rgba(0,0,0,0.26)'
                  }
                }}
                startIcon={<CheckCircle />}
              >
                Confirm Booking
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}