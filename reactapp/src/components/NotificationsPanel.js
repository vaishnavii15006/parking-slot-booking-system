import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { 
 getNotificationsByUserId, 
 markAsRead, 
 markAllAsRead, 
 deleteNotification,
 getUnreadCount 
} from '../utils/api';
import {
 Box,  Typography, Button, IconButton, Chip,
 List, ListItem,  Divider,
 Dialog, DialogTitle, DialogContent, DialogActions, Badge
} from '@mui/material';
import {
 Notifications, NotificationsActive, MarkEmailRead, Delete,
 CheckCircle, AccessTime, Info, Warning,
} from '@mui/icons-material';

export default function NotificationsPanel({ open, onClose }) {
 const { user } = useAuth();
 const [notifications, setNotifications] = useState([]);
 const [unreadCount, setUnreadCount] = useState(0);
 const [loading, setLoading] = useState(false);

 const loadNotifications = async () => {
  if (!user?.id) return;
  setLoading(true);
  try {
   const [notificationsData, unreadCountData] = await Promise.all([
    getNotificationsByUserId(user.id),
    getUnreadCount(user.id)
   ]);
setNotifications(notificationsData || []);
   setUnreadCount(unreadCountData || 0);
  } catch (error) {
   console.error('Failed to load notifications:', error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  if (open) {
   loadNotifications();
  }
 }, [open, user]);

 const handleMarkAsRead = async (notificationId) => {
  try {
   await markAsRead(notificationId);
   await loadNotifications();
  } catch (error) {
   console.error('Failed to mark as read:', error);
  }
 };

 const handleMarkAllAsRead = async () => {
  try {
   await markAllAsRead(user.id);
   await loadNotifications();
  } catch (error) {
   console.error('Failed to mark all as read:', error);
  }
 };
 const handleDelete = async (notificationId) => {
  try {
   await deleteNotification(notificationId);
   await loadNotifications();
  } catch (error) {
   console.error('Failed to delete notification:', error);
  }
 };
const getNotificationIcon = (type) => {
  switch (type) {
   case 'BOOKING': return <CheckCircle color="success" />;
   case 'PAYMENT': return <Info color="info" />;
   case 'SYSTEM': return <Warning color="warning" />;
   case 'REMINDER': return <AccessTime color="primary" />;
   default: return <Info color="info" />;
  }
 };
const getNotificationColor = (type) => {
  switch (type) {
   case 'BOOKING': return 'success';
   case 'PAYMENT': return 'info';
   case 'SYSTEM': return 'warning';
   case 'REMINDER': return 'primary';
   default: return 'default';
  }
 };

 return (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
   <DialogTitle sx={{ 
    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: 2
   }}>
    <Notifications sx={{ fontSize: 28 }} />
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
     Notifications
    </Typography>
    {unreadCount > 0 && (
        <Badge badgeContent={unreadCount} color="error">
      <NotificationsActive />
     </Badge>
    )}
   </DialogTitle>
   
   <DialogContent sx={{ p: 0 }}>
    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
     <Button 
      variant="outlined" 
      startIcon={<MarkEmailRead />}
      onClick={handleMarkAllAsRead}
      disabled={unreadCount === 0}
      size="small"
     >
      Mark All as Read
     </Button>
    </Box>
<List sx={{ maxHeight: 400, overflow: 'auto' }}>
     {notifications.map((notification, index) => (
      <React.Fragment key={notification.id}>
       <ListItem 
        sx={{ 
         backgroundColor: notification.isRead ? 'transparent' : '#f5f5f5',
         '&:hover': { backgroundColor: '#e3f2fd' }
        }}
       >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
         {getNotificationIcon(notification.type)}
         <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
           {notification.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
           {notification.message}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>

           <Chip 
            label={notification.type} 
            size="small" 
            color={getNotificationColor(notification.type)}
           />
           <Typography variant="caption" color="text.secondary">
            {new Date(notification.createdAt).toLocaleString()}
           </Typography>
          </Box>
         </Box>
 <Box sx={{ display: 'flex', gap: 1 }}>
          {!notification.isRead && (
           <IconButton 
            size="small" 
            onClick={() => handleMarkAsRead(notification.id)}
            color="primary"
           >
            <MarkEmailRead />
           </IconButton>
          )}
          <IconButton 
           size="small" 
           onClick={() => handleDelete(notification.id)}
           color="error"
          >
           <Delete />
          </IconButton>
         </Box>
        </Box>
       </ListItem>
       {index < notifications.length - 1 && <Divider />}
      </React.Fragment>
     ))}
    </List>
 {notifications.length === 0 && (
     <Box sx={{ p: 4, textAlign: 'center' }}>
      <Notifications sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
       No notifications yet
      </Typography>
      <Typography variant="body2" color="text.secondary">
       You'll see booking updates and system notifications here
      </Typography>
     </Box>
    )}
   </DialogContent>
   
   <DialogActions sx={{ p: 2 }}>
    <Button onClick={onClose} variant="contained">
     Close
    </Button>
   </DialogActions>
  </Dialog>
 );
}
