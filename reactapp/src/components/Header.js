import React, { useState, useEffect } from 'react';
import { 
 AppBar, 
 Toolbar, 
 Typography, 
 IconButton, 
 Button, 
 Box,
 Menu,
 MenuItem,
 Chip,
 Badge
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../utils/AuthContext';
import { Person, Notifications } from '@mui/icons-material';
import { getUnreadCount } from '../utils/api';
import NotificationsPanel from './NotificationsPanel';

export default function Header({ darkMode, setDarkMode }) {
 const navigate = useNavigate();
 const { user, logout } = useAuth();
 const [anchorEl, setAnchorEl] = useState(null);
 const [notificationsOpen, setNotificationsOpen] = useState(false);
 const [unreadCount, setUnreadCount] = useState(0);

 // Load unread notifications count
 useEffect(() => {
  const loadUnreadCount = async () => {
   if (user?.id) {
    try {
     const count = await getUnreadCount(user.id);
     setUnreadCount(count);
    } catch (error) {
     console.error('Failed to load unread count:', error);
    }
   }
  };
  loadUnreadCount();
 }, [user]);

 const handleThemeToggle = () => setDarkMode(!darkMode);

 const handleHomeClick = () => {
  navigate('/');
 };

 const handleMenuOpen = (event) => {
  setAnchorEl(event.currentTarget);
 };
const handleMenuClose = () => {
  setAnchorEl(null);
 };

 const handleLogout = () => {
  logout();
  navigate('/');
  handleMenuClose();
 };

 const handleAdminClick = () => {
  if (user?.role === 'ADMIN') {
   navigate('/admin');
  } else {
   navigate('/login', { state: { redirectTo: '/admin' } });
  }
 };
return (
  <>
   <AppBar
    position="static"
    sx={{
     background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
     boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}
   >
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconButton 
       color="inherit" 
       onClick={handleHomeClick}
       sx={{ 
        background: 'rgba(255,255,255,0.1)',
        '&:hover': { background: 'rgba(255,255,255,0.2)' }
       }}
      >
       <DirectionsCarIcon />
      </IconButton>
      <Typography
       variant="h5"
       sx={{ 
        cursor: 'pointer',
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
       }}
onClick={handleHomeClick}
      >
       ParkEasy
      </Typography>
     </Box>

     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button 
       color="inherit" 
       onClick={() => navigate('/explore')}
       sx={{ 
        background: 'rgba(255,255,255,0.1)',
        '&:hover': { background: 'rgba(255,255,255,0.2)' }
       }}
      >
       Explore
      </Button>

      <Button 
       color="inherit" 
       onClick={() => navigate('/slots')}
       sx={{ 
        background: 'rgba(255,255,255,0.1)',
        '&:hover': { background: 'rgba(255,255,255,0.2)' }
       }}
      >
       View Slots
      </Button>

 <Button 
       color="inherit" 
       onClick={() => navigate('/contact')}
       sx={{ 
        background: 'rgba(255,255,255,0.1)',
        '&:hover': { background: 'rgba(255,255,255,0.2)' }
       }}
      >
       Contact
      </Button>

      {user && (
       <>
        {/* Notifications */}
        <IconButton 
         onClick={() => setNotificationsOpen(true)}
         sx={{ 
          color: 'white',
          '&:hover': { 
           background: 'rgba(255,255,255,0.1)'
          }
         }}
        >
         <Badge badgeContent={unreadCount} color="error">
          <Notifications />
         </Badge>
        </IconButton>

 <Button 
         component={Link} 
         to="/profile"
         sx={{ 
          color: 'white', 
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': { 
           background: 'rgba(255,255,255,0.1)',
           transform: 'translateY(-2px)'
          }
         }}
        >
         <Person sx={{ mr: 1 }} />
         Profile
        </Button>

        {/* My Bookings (for regular users) */}
        {user.role === 'USER' && (
         <Button 
          color="inherit" 
          onClick={() => navigate('/mybookings')}
          startIcon={<BookOnlineIcon />}
          sx={{ 
           background: 'rgba(255,255,255,0.1)',
           '&:hover': { background: 'rgba(255,255,255,0.2)' }
          }}
         >
          My Bookings
         </Button>
 )}

        {/* Admin Panel (for admins) */}
        {user.role === 'ADMIN' && (
         <Button 
          color="inherit" 
          onClick={handleAdminClick}
          startIcon={<AdminPanelSettingsIcon />}
          sx={{ 
           background: 'rgba(255,255,255,0.1)',
           '&:hover': { background: 'rgba(255,255,255,0.2)' }
          }}
         >
          Admin Panel
         </Button>
        )}
       </>
      )}

      <IconButton 
       color="inherit" 
       onClick={handleThemeToggle}
       sx={{ 
        background: 'rgba(255,255,255,0.1)',
        '&:hover': { background: 'rgba(255,255,255,0.2)' }
       }}
      >
       {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
 {user ? (
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
         label={user.role === 'ADMIN' ? 'Admin' : 'User'}
         color="secondary"
         size="small"
         sx={{ fontWeight: 'bold' }}
        />
        <IconButton
         color="inherit"
         onClick={handleMenuOpen}
         sx={{ 
          background: 'rgba(255,255,255,0.1)',
          '&:hover': { background: 'rgba(255,255,255,0.2)' }
         }}
        >
         <AccountCircleIcon />
        </IconButton>
        <Menu
         anchorEl={anchorEl}
         open={Boolean(anchorEl)}
         onClose={handleMenuClose}
         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
         <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
       </Box>
      ) : (
<Button 
        color="inherit" 
        onClick={() => navigate('/login')}
        variant="outlined"
        sx={{ 
         borderColor: 'rgba(255,255,255,0.5)',
         '&:hover': { 
          borderColor: 'white',
          background: 'rgba(255,255,255,0.1)'
         }
        }}
       >
        Login
       </Button>
      )}
     </Box>
    </Toolbar>
   </AppBar>

   {/* Notifications Panel */}
   <NotificationsPanel 
    open={notificationsOpen} 
    onClose={() => setNotificationsOpen(false)} 
   />
  </>
 );
}
