import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Container, Grid, Card, CardContent, Typography, Button, Box, Dialog, DialogTitle, DialogContent,
//   TextField, DialogActions, Paper, ToggleButtonGroup, ToggleButton, Pagination, Chip, Stack
// } from '@mui/material';
import { OrbitProgress } from 'react-loading-indicators';
import {
  getAllSlots, getAllBookings, createSlot, updateSlot, deleteSlot,
  getAllUsers, deleteUser, updateUserRole, updateBookingStatus
} from '../utils/api';
import {
  Container, Grid, Card, CardContent, Typography, Button, Box,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip, Stack,Paper
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BarChartIcon from '@mui/icons-material/BarChart';
export default function AdminPanel() {
  const [tab, setTab] = useState('dashboard');
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // slot form
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ slotNumber: '', slotType: 'Regular', hourlyRate: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [s, b, u] = await Promise.all([getAllSlots(), getAllBookings(), getAllUsers()]);
      setSlots(s);
      setBookings(b);
      setUsers(u);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { load(); }, []);

  const metrics = useMemo(() => {
    const totalSlots = slots.length;
    const available = slots.filter(s => s.isAvailable).length;
    const booked = totalSlots - available;

    const totalBookings = bookings.length;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthlyBookings = bookings.filter(b => {
      const d = new Date(b.startTime);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    const revenue = bookings.reduce((sum, b) => sum + (Number(b.totalCost) || 0), 0);
    const revenueMonthly = monthlyBookings.reduce((sum, b) => sum + (Number(b.totalCost) || 0), 0);


    return { totalSlots, available, booked, totalBookings, revenue, revenueMonthly };
  }, [slots, bookings]);

  const openAdd = () => { setEditing(null); setForm({ slotNumber: '', slotType: 'Regular', hourlyRate: '' }); setDialogOpen(true); };
  const openEdit = (slot) => { setEditing(slot); setForm({ slotNumber: slot.slotNumber, slotType: slot.slotType, hourlyRate: slot.hourlyRate }); setDialogOpen(true); };
  const saveSlot = async () => {
    setLoading(true);
    try {
      if (editing) {
        await updateSlot(editing.id, { ...editing, slotNumber: form.slotNumber, slotType: form.slotType, hourlyRate: Number(form.hourlyRate) });
      } else {
        await createSlot({ slotNumber: form.slotNumber, slotType: form.slotType, hourlyRate: Number(form.hourlyRate), isAvailable: true });
      }
      await load(); setDialogOpen(false);
    } finally { setLoading(false); }
  };
  const removeSlot = async (id) => { if (!window.confirm('Delete this slot?')) return; setLoading(true); try { await deleteSlot(id); await load(); } finally { setLoading(false); } };
  const markUnavailable = async (slot) => { setLoading(true); try { await updateSlot(slot.id, { ...slot, isAvailable: false }); await load(); } finally { setLoading(false); } };

  const setBookingStatus = async (b, status) => {
    setLoading(true);
    try {
      await updateBookingStatus(b.id, status);
      await load();
    } finally { setLoading(false); }
  };
const Hero = () => (
  <Box
    sx={{
      py: { xs: 8, md: 12 },
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      color: 'white',
      textAlign: 'center',
    
    }}
  >
    <Container maxWidth="lg">
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
        Admin Dashboard
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ opacity: 0.9, maxWidth: 680, mx: 'auto', mb: 5 }}
      >
        Manage parking slots, bookings, and users — all in one powerful control panel.
      </Typography>

  
      <Grid container spacing={3} justifyContent="center">
        {[
          { icon: <InsightsIcon sx={{ color: '#facc15', fontSize: 32 }} />, title: 'Real-time Insights' },
          { icon: <EventAvailableIcon sx={{ color: '#38bdf8', fontSize: 32 }} />, title: 'Booking Management' },
          { icon: <ManageAccountsIcon sx={{ color: '#34d399', fontSize: 32 }} />, title: 'User Control' },
          { icon: <BarChartIcon sx={{ color: '#fb7185', fontSize: 32 }} />, title: 'Revenue Reports' }
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                transition: 'all .3s ease',
                '&:hover': { transform: 'translateY(-4px)', bgcolor: 'rgba(255,255,255,0.12)' }
              }}
            >
              <Box sx={{ mb: 1 }}>{item.icon}</Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {item.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);
 
  const promote = async (u) => { setLoading(true); try { await updateUserRole(u.id, 'admin'); await load(); } finally { setLoading(false); } };
  const demote = async (u) => { setLoading(true); try { await updateUserRole(u.id, 'user'); await load(); } finally { setLoading(false); } };
  const removeUser = async (u) => { if (!window.confirm('Delete user?')) return; setLoading(true); try { await deleteUser(u.id); await load(); } finally { setLoading(false); } };

  return (
    <>
    <Hero/>
    
    <Container sx={{ py: 4 }}>
      
      
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button variant={tab === 'dashboard' ? 'contained' : 'outlined'} onClick={() => setTab('dashboard')}>Dashboard</Button>
        <Button variant={tab === 'slots' ? 'contained' : 'outlined'} onClick={() => setTab('slots')}>Slots</Button>
        <Button variant={tab === 'bookings' ? 'contained' : 'outlined'} onClick={() => setTab('bookings')}>Bookings</Button>
        <Button variant={tab === 'users' ? 'contained' : 'outlined'} onClick={() => setTab('users')}>Users</Button>
        <Button variant={tab === 'reports' ? 'contained' : 'outlined'} onClick={() => setTab('reports')}>Reports</Button>
      </Box>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><OrbitProgress /></Box>}

      {tab === 'dashboard' && !loading && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}><Card><CardContent><Typography variant="h6">Total Slots</Typography><Typography variant="h4">{metrics.totalSlots}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} md={3}><Card><CardContent><Typography variant="h6">Available</Typography><Typography variant="h4">{metrics.available}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} md={3}><Card><CardContent><Typography variant="h6">Booked</Typography><Typography variant="h4">{metrics.booked}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} md={3}><Card><CardContent><Typography variant="h6">Revenue (Month)</Typography><Typography variant="h4">${metrics.revenueMonthly.toFixed(2)}</Typography></CardContent></Card></Grid>
        </Grid>
      )}


      


      {tab === 'slots' && !loading && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Parking Slots</Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={openAdd}>Add Slot</Button>
            </Stack>
          </Box>
          <Grid container spacing={2}>
            {slots.map(slot => (
              <Grid item xs={12} sm={6} md={4} key={slot.id}>
                <Card>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">#{slot.slotNumber}</Typography>
                      <Chip label={slot.isAvailable ? 'Available' : 'Unavailable'} color={slot.isAvailable ? 'success' : 'default'} />
                    </Stack>
                    <Typography>Type: {slot.slotType}</Typography>
                    <Typography>Rate: ${slot.hourlyRate}/hr</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button variant="outlined" onClick={() => openEdit(slot)}>Update</Button>
                      <Button variant="outlined" color="warning" onClick={() => markUnavailable(slot)} disabled={!slot.isAvailable}>Mark Unavailable</Button>
                      <Button variant="contained" color="error" onClick={() => removeSlot(slot.id)}>Delete</Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {tab === 'bookings' && !loading && (
        <Grid container spacing={2}>
          {bookings.map(b => (
            <Grid item xs={12} md={6} key={b.id}>
              <Card>
             
              
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Booking #{b.id}</Typography>
                    <Chip label={b.status} color={b.status === 'Confirmed' ? 'success' : b.status === 'Cancelled' ? 'error' : 'default'} />
                  </Stack>
                  <Typography>Slot: {b.parkingSlot?.slotNumber} ({b.parkingSlot?.slotType})</Typography>
                  <Typography>UserId: {b.userId}</Typography>
                  <Typography>Vehicle: {b.vehicleNumber}</Typography>
                  <Typography>Start: {b.startTime?.replace('T',' ')}</Typography>
                  <Typography>End: {b.endTime?.replace('T',' ')}</Typography>
                  <Typography>Total: ${b.totalCost}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button variant="outlined" onClick={() => setBookingStatus(b, 'Confirmed')}>Approve</Button>
                    <Button variant="outlined" color="warning" onClick={() => setBookingStatus(b, 'Completed')}>Complete</Button>
                    <Button variant="contained" color="error" onClick={() => setBookingStatus(b, 'Cancelled')}>Cancel</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tab === 'users' && !loading && (
        <Grid container spacing={2}>
          {users.map(u => (
            <Grid item xs={12} md={6} key={u.id}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{u.username}</Typography>
                    <Chip label={u.role} />
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {u.role !== 'admin'
                      ? <Button variant="outlined" onClick={() => promote(u)}>Promote to Admin</Button>
                      : <Button variant="outlined" color="warning" onClick={() => demote(u)}>Demote to User</Button>
                    }
                    <Button variant="contained" color="error" onClick={() => removeUser(u)}>Delete</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

 

  

      {tab === 'reports' && !loading && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><Card><CardContent><Typography variant="h6">Total Bookings</Typography><Typography variant="h4">{metrics.totalBookings}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} md={4}><Card><CardContent><Typography variant="h6">Revenue (All time)</Typography><Typography variant="h4">${metrics.revenue.toFixed(2)}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} md={4}><Card><CardContent><Typography variant="h6">Revenue (This Month)</Typography><Typography variant="h4">${metrics.revenueMonthly.toFixed(2)}</Typography></CardContent></Card></Grid>
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editing ? 'Update Slot' : 'Add Slot'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, width: 420 }}>
          <TextField label="Slot Number" value={form.slotNumber} onChange={e => setForm({ ...form, slotNumber: e.target.value })} />
          <TextField label="Slot Type" value={form.slotType} onChange={e => setForm({ ...form, slotType: e.target.value })} />
          <TextField label="Hourly Rate" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveSlot} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
}