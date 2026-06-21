import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { 
 getVehiclesByUserId, 
 addVehicle, 
 updateVehicle, 
 deleteVehicle,
 getUserBookings,
 cancelBooking,
 changePassword
} from '../utils/api';
import {
 Container, Grid, Card, CardContent, Typography, Button, Box,
 Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip, Stack,
 Paper, Tabs, Tab, Avatar, Alert, FormControl, InputLabel, Select, MenuItem,
 CircularProgress, Divider, Snackbar
} from '@mui/material';
import {
 Person, DirectionsCar, Add, Edit, Delete,
 AccountCircle, Email, Security, BookOnline, LocalParking,
 AccessTime, MonetizationOn, Lock, VpnKey, Shield, Cancel
} from '@mui/icons-material';

export default function Profile() {
 const { user } = useAuth();
 const [tab, setTab] = useState('profile');
 const [vehicles, setVehicles] = useState([]);
 const [bookings, setBookings] = useState([]);
 const [loading, setLoading] = useState(false);
 const [dialogOpen, setDialogOpen] = useState(false);
 const [editing, setEditing] = useState(null);
 const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
 const [form, setForm] = useState({
  vehicleNumber: '',
  vehicleType: 'Car',
  vehicleModel: '',
vehicleColor: ''
 });
 const [securityForm, setSecurityForm] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
 });

 const showSnackbar = (message, severity = 'info') => {
  setSnackbar({ open: true, message, severity });
 };

 const loadData = useCallback(async () => {
  if (!user?.id) {
   console.log('No user ID available');
   return;
  }
  
  setLoading(true);
  try {
   console.log('Loading data for user:', user.id);
   
   // Load vehicles and bookings in parallel
   const [vehiclesData, bookingsData] = await Promise.all([
    getVehiclesByUserId(user.id).catch(err => {
     console.error('Error loading vehicles:', err);
     showSnackbar('Failed to load vehicles', 'error');
     return [];
    }),
    getUserBookings(user.id).catch(err => {
     console.error('Error loading bookings:', err);
     showSnackbar('Failed to load bookings', 'error');
     return [];
})
   ]);
   
   console.log('Vehicles data:', vehiclesData);
   console.log('Bookings data:', bookingsData);
   
   setVehicles(vehiclesData || []);
   setBookings(bookingsData || []);
   
   showSnackbar('Data loaded successfully', 'success');
  } catch (error) {
   console.error('Failed to load data:', error);
   showSnackbar('Failed to load data', 'error');
  } finally {
   setLoading(false);
  }
 }, [user?.id]);

 useEffect(() => {
  loadData();
 }, [loadData]);

 const openAdd = () => {
  setEditing(null);
  setForm({ vehicleNumber: '', vehicleType: 'Car', vehicleModel: '', vehicleColor: '' });
  setDialogOpen(true);
 };

const openEdit = (vehicle) => {
  setEditing(vehicle);
  setForm({
   vehicleNumber: vehicle.vehicleNumber,
   vehicleType: vehicle.vehicleType,
   vehicleModel: vehicle.vehicleModel,
   vehicleColor: vehicle.vehicleColor
  });
  setDialogOpen(true);
 };

 const saveVehicle = async () => {
  if (!form.vehicleNumber.trim()) {
   showSnackbar('Please enter a vehicle number', 'error');
   return;
  }
  
  setLoading(true);
  try {
   const vehicleData = { 
    ...form, 
    userId: user.id,
    vehicleNumber: form.vehicleNumber.trim()
   };
   
   console.log('Saving vehicle:', vehicleData);
   
   if (editing) {
    await updateVehicle(editing.id, vehicleData);
    showSnackbar('Vehicle updated successfully!', 'success');
   } else {
    await addVehicle(vehicleData);
 showSnackbar('Vehicle added successfully!', 'success');
   }
   
   await loadData();
   setDialogOpen(false);
  } catch (error) {
   console.error('Failed to save vehicle:', error);
   const errorMessage = error.response?.data?.message || error.message || 'Failed to save vehicle';
   showSnackbar(errorMessage, 'error');
  } finally {
   setLoading(false);
  }
 };

 const removeVehicle = async (id) => {
  if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
  
  setLoading(true);
  try {
   console.log('Deleting vehicle:', id);
   await deleteVehicle(id);
   await loadData();
   showSnackbar('Vehicle deleted successfully!', 'success');
  } catch (error) {
   console.error('Failed to delete vehicle:', error);
   const errorMessage = error.response?.data?.message || error.message || 'Failed to delete vehicle';
   showSnackbar(errorMessage, 'error');
  } finally {
   setLoading(false);
  }
 };

 const handlePasswordChange = async () => {
  if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
   showSnackbar('Please fill in all password fields', 'error');
   return;
  }
  
  if (securityForm.newPassword !== securityForm.confirmPassword) {
   showSnackbar('New passwords do not match', 'error');
   return;
  }
  
  if (securityForm.newPassword.length < 6) {
   showSnackbar('New password must be at least 6 characters long', 'error');
   return;
  }
  
  setLoading(true);
  try {
   await changePassword(user.id, securityForm.currentPassword, securityForm.newPassword);
  showSnackbar('Password changed successfully!', 'success');

  } catch (error) {
   console.error('Failed to change password:', error);
  const errorMessage = error.response?.data?.message || 'Failed to change password. Please check your current password.';
  showSnackbar(errorMessage, 'error');

  } finally {
   setLoading(false);
  }
 };

 const handleCancelBooking = async (bookingId) => {
  if (!window.confirm('Are you sure you want to cancel this booking?')) return;
  
  setLoading(true);
  try {
   await cancelBooking(bookingId);
   await loadData();
   showSnackbar('Booking cancelled successfully!', 'success');
  } catch (error) {
   console.error('Failed to cancel booking:', error);
   const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel booking';
   showSnackbar(errorMessage, 'error');
  } finally {
   setLoading(false);
  }
 };
 const tabItems = [
  { label: 'Profile', icon: <Person />, value: 'profile' },
  { label: 'Vehicles', icon: <DirectionsCar />, value: 'vehicles' },
  { label: 'Bookings', icon: <BookOnline />, value: 'bookings' },
  { label: 'Security', icon: <Security />, value: 'security' }
 ];

 return (
  <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
   {/* Hero Section */}
   <Box sx={{ 
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    py: 8,
    textAlign: 'center'
   }}>
    <Container maxWidth="lg">
     <Avatar sx={{ 
      width: 120, 
      height: 120, 
      mx: 'auto', 
      mb: 3,
      fontSize: '3rem',
      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
     }}>
      <AccountCircle sx={{ fontSize: 80 }} />
     </Avatar>
     <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
      {user?.username || 'User Profile'}
     </Typography>
     <Typography variant="h6" sx={{ opacity: 0.9 }}>
      Manage your account settings and preferences
     </Typography>
    </Container>
 </Box>

   <Container maxWidth="lg" sx={{ py: 6 }}>
    <Paper sx={{ 
     mb: 4, 
     borderRadius: 3, 
     overflow: 'hidden',
     boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
     <Tabs 
      value={tab} 
      onChange={(e, newValue) => setTab(newValue)}
      variant="fullWidth"
      sx={{
       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
       '& .MuiTab-root': {
        minHeight: 72,
        fontSize: '1rem',
        fontWeight: 600,
        textTransform: 'none'
       }
      }}
     >
      {tabItems.map((tabItem) => (
       <Tab 
        key={tabItem.value}
        icon={tabItem.icon} 
        label={tabItem.label} 
        value={tabItem.value}
       />
      ))}
     </Tabs>
    </Paper>

    {loading && (
     <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
     </Box>
    )}

    {/* Profile Tab */}
    {tab === 'profile' && !loading && (
     <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
       <Card sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
         Personal Information
        </Typography>
        <Stack spacing={3}>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountCircle color="primary" />
          <Box>

 <Typography variant="body2" color="text.secondary">Username</Typography>
           <Typography variant="h6">{user?.username}</Typography>
          </Box>
         </Box>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Email color="primary" />
          <Box>
           <Typography variant="body2" color="text.secondary">Email</Typography>
           <Typography variant="h6">{user?.email || 'Not provided'}</Typography>
          </Box>
         </Box>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Security color="primary" />
          <Box>
           <Typography variant="body2" color="text.secondary">Role</Typography>
           <Chip 
            label={user?.role || 'USER'} 
            color={user?.role === 'ADMIN' ? 'warning' : 'primary'}
            sx={{ fontWeight: 600 }}
           />
          </Box>
         </Box>
        </Stack>
       </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
       <Card sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
         Account Statistics
        </Typography>
 <Stack spacing={3}>
         <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1976d2' }}>
           {vehicles.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
           Registered Vehicles
          </Typography>
         </Box>
         <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#4caf50' }}>
           {bookings.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
           Total Bookings
          </Typography>
         </Box>
        </Stack>
       </Card>
      </Grid>
     </Grid>
    )}

    {/* Vehicles Tab */}
    {tab === 'vehicles' && !loading && (
     <Card sx={{ p: 4, borderRadius: 4 }}>
      <Box sx={{ 
       display: 'flex', 
       justifyContent: 'space-between', 
       alignItems: 'center', 
       mb: 4 
      }}>
<Typography variant="h5" sx={{ fontWeight: 700 }}>
        My Vehicles ({vehicles.length})
       </Typography>
       <Button 
        variant="contained" 
        startIcon={<Add />}
        onClick={openAdd}
        sx={{ 
         background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
         '&:hover': { 
          background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
         }
        }}
       >
        Add Vehicle
       </Button>
      </Box>
      
      {vehicles.length === 0 ? (
       <Box sx={{ textAlign: 'center', py: 8 }}>
        <DirectionsCar sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
         No vehicles registered yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
         Add your first vehicle to make booking easier
        </Typography>
        <Button 
         variant="contained" 
         startIcon={<Add />}
         onClick={openAdd}
sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          '&:hover': { 
           background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
          }
         }}
        >
         Add Your First Vehicle
        </Button>
       </Box>
      ) : (
       <Grid container spacing={3}>
        {vehicles.map(vehicle => (
         <Grid item xs={12} md={6} key={vehicle.id}>
          <Card sx={{ 
           borderRadius: 4,
           transition: 'all 0.3s ease',
           '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
           }
          }}>
           <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
             display: 'flex', 
             justifyContent: 'space-between', 
             alignItems: 'center', 
             mb: 3 
            }}>
<Typography variant="h6" sx={{ fontWeight: 700 }}>
              {vehicle.vehicleNumber}
             </Typography>
             <Chip 
              label={vehicle.vehicleType} 
              color="primary"
              sx={{ fontWeight: 600 }}
             />
            </Box>
 <Stack spacing={2}>
             <Box>
              <Typography variant="body2" color="text.secondary">Model</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
               {vehicle.vehicleModel || 'Not specified'}
              </Typography>
             </Box>
             <Box>
              <Typography variant="body2" color="text.secondary">Color</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
               {vehicle.vehicleColor || 'Not specified'}
              </Typography>
             </Box>
            </Stack>
            
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
             <Button 
              variant="outlined" 
              startIcon={<Edit />}
              onClick={() => openEdit(vehicle)}
              size="small"
              fullWidth
             >
              Edit
             </Button>
             <Button 
              variant="contained" 
              color="error" 
              startIcon={<Delete />}
              onClick={() => removeVehicle(vehicle.id)}
              size="small"
              fullWidth
             >
 Delete
             </Button>
            </Stack>
           </CardContent>
          </Card>
         </Grid>
        ))}
       </Grid>
      )}
     </Card>
    )}

    {/* Bookings Tab */}
    {tab === 'bookings' && !loading && (
     <Card sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
       My Bookings ({bookings.length})
      </Typography>
      
      {bookings.length === 0 ? (
       <Box sx={{ textAlign: 'center', py: 8 }}>
        <BookOnline sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
         No bookings yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
         Start by booking a parking slot
        </Typography>
 <Button 
         variant="contained" 
         startIcon={<LocalParking />}
         onClick={() => window.location.href = '/slots'}
         sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          '&:hover': { 
           background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
          }
         }}
        >
         Book a Slot
        </Button>
       </Box>
 ) : (
       <Grid container spacing={3}>
        {bookings.map(booking => (
         <Grid item xs={12} md={6} key={booking.id}>
          <Card sx={{ 
           borderRadius: 4,
           transition: 'all 0.3s ease',
           '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
           }
          }}>
           <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
             display: 'flex', 
             justifyContent: 'space-between', 
             alignItems: 'center', 
             mb: 3 
            }}>
             <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Booking #{booking.id}
             </Typography>
             <Chip 
              label={booking.status} 
              color={booking.status === 'Confirmed' ? 'success' : booking.status === 'Cancelled' ? 'error' : 'default'}
              sx={{ fontWeight: 600 }}
             />
            </Box>
            
 <Stack spacing={2}>
             <Box>
              <Typography variant="body2" color="text.secondary">Slot</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
               {booking.parkingSlot?.slotNumber} ({booking.parkingSlot?.slotType})
              </Typography>
             </Box>
             <Box>
              <Typography variant="body2" color="text.secondary">Vehicle</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
               {booking.vehicleNumber}
              </Typography>
             </Box>
             <Box>
              <Typography variant="body2" color="text.secondary">Duration</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
               {booking.startTime?.replace('T',' ')} - {booking.endTime?.replace('T',' ')}
              </Typography>
             </Box>
             <Box>
              <Typography variant="body2" color="text.secondary">Total Cost</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
               ${booking.totalCost}
              </Typography>
             </Box>
            </Stack>
            
            {booking.status === 'Confirmed' && (
             <Button 
              variant="contained" 
              color="error" 
              startIcon={<Cancel />}
              onClick={() => handleCancelBooking(booking.id)}
              sx={{ 
               mt: 2,
               background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
               '&:hover': { 
                background: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)'
               }
              }}
             >
              Cancel Booking
             </Button>
            )}
           </CardContent>
          </Card>
         </Grid>
        ))}
 </Grid>
      )}
     </Card>
    )}

    {/* Security Tab */}
    {tab === 'security' && !loading && (
     <Card sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
       Security Settings
      </Typography>
      
      <Grid container spacing={4}>
       <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Lock sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
           Change Password
          </Typography>
         </Box>
         
         <Stack spacing={3}>
          <TextField
           label="Current Password"
           type="password"
           value={securityForm.currentPassword}
           onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
           fullWidth
           variant="outlined"
          />
<TextField
           label="New Password"
           type="password"
           value={securityForm.newPassword}
           onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
           fullWidth
           variant="outlined"
          />
          <TextField
           label="Confirm New Password"
           type="password"
           value={securityForm.confirmPassword}
           onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
           fullWidth
           variant="outlined"
          />
          <Button 
           variant="contained" 
           onClick={handlePasswordChange}
           disabled={loading}
           sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            '&:hover': { 
             background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
            }
           }}
          >
           Change Password
          </Button>
         </Stack>
        </Card>
       </Grid>
 <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Shield sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
           Account Security
          </Typography>
         </Box>
<Stack spacing={3}>
          <Box sx={{ p: 2, borderRadius: 2, background: '#f8fafc' }}>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Two-Factor Authentication
           </Typography>
           <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            Not Available
           </Typography>
           <Button variant="outlined" size="small" disabled>
            Enable 2FA
           </Button>
          </Box>
          
          <Box sx={{ p: 2, borderRadius: 2, background: '#f8fafc' }}>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Login History
           </Typography>
           <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            Not Available
           </Typography>
           <Button variant="outlined" size="small" disabled>
            View History
           </Button>
          </Box>
         </Stack>
        </Card>
       </Grid>
      </Grid>
     </Card>
    )}

 <Dialog 
     open={dialogOpen} 
     onClose={() => setDialogOpen(false)} 
     maxWidth="sm" 
     fullWidth
    >
     <DialogTitle sx={{ 
      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      color: 'white',
      fontWeight: 700
     }}>
      {editing ? 'Update Vehicle' : 'Add New Vehicle'}
     </DialogTitle>
     <DialogContent sx={{ p: 4 }}>
      <Stack spacing={3} sx={{ mt: 2 }}>
       <TextField 
        label="Vehicle Number *" 
        value={form.vehicleNumber} 
        onChange={e => setForm({ ...form, vehicleNumber: e.target.value })}
        fullWidth
        required
        placeholder="e.g., KA01AB1234"
        helperText="Enter your vehicle registration number"
       />
       <FormControl fullWidth>
        <InputLabel>Vehicle Type *</InputLabel>
        <Select 
         value={form.vehicleType} 
         onChange={e => setForm({ ...form, vehicleType: e.target.value })}
         label="Vehicle Type *"
        >
<MenuItem value="Car">Car</MenuItem>
         <MenuItem value="Bike">Bike</MenuItem>
         <MenuItem value="SUV">SUV</MenuItem>
         <MenuItem value="Truck">Truck</MenuItem>
         <MenuItem value="Van">Van</MenuItem>
        </Select>
       </FormControl>
       <TextField 
        label="Vehicle Model" 
        value={form.vehicleModel} 
        onChange={e => setForm({ ...form, vehicleModel: e.target.value })}
        fullWidth
        placeholder="e.g., Honda City, Yamaha R15"
       />
<TextField 
        label="Vehicle Color" 
        value={form.vehicleColor} 
        onChange={e => setForm({ ...form, vehicleColor: e.target.value })}
        fullWidth
        placeholder="e.g., White, Black, Red"
       />
      </Stack>
     </DialogContent>
     <DialogActions sx={{ p: 4, gap: 2 }}>
      <Button 
       onClick={() => setDialogOpen(false)} 
       variant="outlined"
       size="large"
      >
       Cancel
      </Button>
      <Button 
       onClick={saveVehicle} 
       variant="contained"
       size="large"
       disabled={loading || !form.vehicleNumber.trim()}
       sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        '&:hover': { 
         background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
        }
       }}
      >
       {loading ? 'Saving...' : (editing ? 'Update Vehicle' : 'Add Vehicle')}
      </Button>
     </DialogActions>
    </Dialog>
   </Container>
 <Snackbar
    open={snackbar.open}
    autoHideDuration={6000}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
   >
    <Alert 
     onClose={() => setSnackbar({ ...snackbar, open: false })} 
     severity={snackbar.severity}
     sx={{ width: '100%' }}
    >
     {snackbar.message}
    </Alert>
   </Snackbar>
  </Box>
 );
}
