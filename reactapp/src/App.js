import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SlotList from './components/SlotList';
import BookingForm from './components/BookingForm';
import AdminPanel from './components/AdminPanel';
import UserBookings from './components/UserBookings';
import Login from './components/Login';
import PopupMessage from './components/PopupMessage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './utils/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './utils/AuthContext';
import { Box } from '@mui/material';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Explore from './pages/Explore';
import Profile from './pages/Profile'; // NEW
import Payment from './pages/Payment';


function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: '', severity: 'info' });
  const { user } = useAuth();
  const navigate = useNavigate();

  const showPopup = (message, severity = 'info') => {
    setPopup({ open: true, message, severity });
  };

  const handleBookingAttempt = (slot) => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/booking', slot } });
    } else if (user.role === 'user') {
      navigate('/booking', { state: { slot } });
    } else {
      navigate('/admin');
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light'
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: darkMode 
            ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/slots" element={<SlotList onSelect={handleBookingAttempt} />} />
            <Route 
              path="/booking" 
              element={
                user?.role === 'user' ? 
                  <BookingForm 
                    onBooked={() => { 
                      showPopup('Booking successful!', 'success'); 
                      navigate('/mybookings'); 
                    }} 
                  /> : 
                  <Navigate to="/login" />
              } 
            />
<Route
  path="/admin"
  element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" state={{ redirectTo: '/admin' }} />}
/>
            <Route 
              path="/mybookings" 
              element={
                user?.role === 'user' ? 
                  <UserBookings /> : 
                  <Navigate to="/login" />
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} /> {/* NEW */}
       <Route path="/payment" element={<Payment />} /> 

          </Routes>
        </Box>
        <Footer />
        <PopupMessage
          open={popup.open}
          message={popup.message}
          severity={popup.severity}
          onClose={() => setPopup({ ...popup, open: false })}
        />
      </Box>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
