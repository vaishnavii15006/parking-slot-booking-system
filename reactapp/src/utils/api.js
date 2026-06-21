import axios from "axios";
import { API_BASE_URL } from './constants';

const api = axios.create({
 baseURL: API_BASE_URL,
 headers: {
  'Content-Type': 'application/json',
 },
});

// Add request interceptor for authentication
api.interceptors.request.use(
 (config) => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  if (username && password) {
   const token = btoa(`${username}:${password}`);
   config.headers.Authorization = `Basic ${token}`;
  }
  return config;
 },
 (error) => {
  return Promise.reject(error);
 }
);

export const registerUser = async (user) => { 
try {
  const res = await axios.post(`${API_BASE_URL}/users`, user);
  return res.data;
} catch (err) {
  throw err;
}
         };

export const loginUser = async (username, password) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users`, {
      params: { username, password }
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
export const getAllUsers = async () => (await api.get(`/users/all`)).data;
export const deleteUser = async (id) => (await api.delete(`/users/${id}`)).data;
export const updateUserRole = async (id, role) => (await api.put(`/users/${id}/role`, null, { params: { role } })).data;

export const updateBookingStatus = async (id, status) =>
  (await api.put(`/bookings/${id}/status`, null, { params: { status } })).data;

export const getAvailableSlots = async () => {
  try {
    const res = await api.get(`/slots/available`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getAllSlots = async () => {
  try {
    const res = await api.get(`/slots`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const createSlot = async (slot) => {
  try {
    const res = await api.post(`/slots`, slot);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateSlot = async (id, slot) => {
  try {
    const res = await api.put(`/slots/${id}`, slot);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteSlot = async (id) => {
  try {
    const res = await api.delete(`/slots/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};


export const createBooking = async (booking) => {
  try {
    const res = await api.post(`/bookings`, booking);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const res = await api.get(`/bookings/user/${userId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getAllBookings = async () => {
  try {
    const res = await api.get(`/bookings`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const res = await api.put(`/bookings/${bookingId}/cancel`);
    return res.data;
  } catch (err) {
    throw err;
  }
};
export const updateBooking = async (id, booking) => {
 try {
  const res = await api.put(`/bookings/${id}`, booking);
  return res.data;
 } catch (err) {
  throw err;
 }
};

export const extendBooking = async (id, additionalHours) => {
 try {
  const res = await api.put(`/bookings/${id}/extend`, null, { 
   params: { additionalHours } 
  });
  return res.data;
 } catch (err) {
  throw err;
 }
};

export const getBookingsByUserId = async (userId) => {
 try {
  const res = await api.get(`/bookings/user/${userId}/bookings`);
  return res.data;
 } catch (err) {
  throw err;}};
export const getVehiclesByUserId = async (userId) => {
 try {
  console.log('Fetching vehicles for user:', userId);
  const res = await api.get(`/vehicles/user/${userId}`);
  console.log('Vehicles response:', res.data);
  return res.data;
 } catch (err) {
  console.error('Error fetching vehicles:', err);
  if (err.response?.status === 404) {
   return []; // Return empty array if no vehicles found
  }
  throw err;
 }
};

export const addVehicle = async (vehicle) => {
 try {
  console.log('Adding vehicle:', vehicle);
  const res = await api.post('/vehicles', vehicle);
  console.log('Add vehicle response:', res.data);
  return res.data;
 } catch (err) {
  console.error('Error adding vehicle:', err);
  throw err;
 }
};
export const updateVehicle = async (id, vehicle) => {
 try {
  console.log('Updating vehicle:', id, vehicle);
  const res = await api.put(`/vehicles/${id}`, vehicle);
  console.log('Update vehicle response:', res.data);
  return res.data;
 } catch (err) {
  console.error('Error updating vehicle:', err);
  throw err;
 }
};

export const deleteVehicle = async (id) => {
 try {
  console.log('Deleting vehicle:', id);
  const res = await api.delete(`/vehicles/${id}`);
  console.log('Delete vehicle response:', res.data);
  return res.data;
 } catch (err) {
  console.error('Error deleting vehicle:', err);
  throw err;
 }
};
export const getVehicleById = async (id) => {
 try {
  const res = await api.get(`/vehicles/${id}`);
  return res.data;
 } catch (err) {
  console.error('Error fetching vehicle:', err);
  throw err;
 }
};
export const getNotificationsByUserId = async (userId) => {
 try {
  console.log('Fetching notifications for user:', userId);
  const res = await api.get(`/notifications/user/${userId}`);
  console.log('Notifications response:', res.data);
  return res.data;
 } catch (err) {
  console.error('Error fetching notifications:', err);
  if (err.response?.status === 404) {
   return []; // Return empty array if no notifications found
  }
  throw err;
 }
};

export const getUnreadNotificationsByUserId = async (userId) => {
 try {
  const res = await api.get(`/notifications/user/${userId}/unread`);
  return res.data;
 } catch (err) {
  console.error('Error fetching unread notifications:', err);
  if (err.response?.status === 404) {
   return [];
  }
  throw err;
 }
};
export const getUnreadCount = async (userId) => {
 try {
  console.log('Fetching unread count for user:', userId);
  const res = await api.get(`/notifications/user/${userId}/unread-count`);
  console.log('Unread count response:', res.data);
  return res.data;
 } catch (err) {
  console.error('Error fetching unread count:', err);
  return 0; // Return 0 if error
 }
};

export const createNotification = async (notification) => {
 try {
  const res = await api.post('/notifications', notification);
  return res.data;
 } catch (err) {
  console.error('Error creating notification:', err);
  throw err;
 }
};

export const markAsRead = async (id) => {
 try {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
 } catch (err) {
  console.error('Error marking notification as read:', err);
  throw err;
 }
};
export const markAllAsRead = async (userId) => {
 try {
  const res = await api.put(`/notifications/user/${userId}/read-all`);
  return res.data;
 } catch (err) {
  console.error('Error marking all notifications as read:', err);
  throw err;
 }
};

export const deleteNotification = async (id) => {
 try {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
 } catch (err) {
  console.error('Error deleting notification:', err);
  throw err;
 }
};

// Payment Functions
export const createPayment = async (payment) => {
 try {
  const res = await api.post('/payments', payment);
  return res.data;
 } catch (err) {
  console.error('Error creating payment:', err);
  throw err;
 }
};
export const updatePaymentStatus = async (id, status, transactionId) => {
 try {
  const res = await api.put(`/payments/${id}/status`, null, { 
   params: { status, transactionId } 
  });
  return res.data;
 } catch (err) {
  console.error('Error updating payment status:', err);
  throw err;
 }
};

export const getPaymentsByUserId = async (userId) => {
 try {
  const res = await api.get(`/payments/user/${userId}`);
  return res.data;
 } catch (err) {
  console.error('Error fetching payments:', err);
  throw err;
 }
};
export const getPaymentsByBookingId = async (bookingId) => {
 try {
  const res = await api.get(`/payments/booking/${bookingId}`);
  return res.data;
 } catch (err) {
  console.error('Error fetching booking payments:', err);
  throw err;
 }
};

export const getPaymentByTransactionId = async (transactionId) => {
 try {
  const res = await api.get(`/payments/transaction/${transactionId}`);
  return res.data;
 } catch (err) {
  console.error('Error fetching payment by transaction ID:', err);
  throw err;
 }
};
export const getTotalPaidByUser = async (userId) => {
 try {
  const res = await api.get(`/payments/user/${userId}/total`);
  return res.data;
 } catch (err) {
  console.error('Error fetching total paid:', err);
  return 0;
 }
};

export const refundPayment = async (id) => {
 try {
  const res = await api.put(`/payments/${id}/refund`);
  return res.data;
 } catch (err) {
  console.error('Error refunding payment:', err);
  throw err;
 }
};

// User Profile Functions
export const getCurrentUser = async () => {
 try {
  const res = await api.get('/users/me');
  return res.data;
 } catch (err) {
  console.error('Error fetching current user:', err);
  throw err;
 }
};
export const updateUserProfile = async (id, userData) => {
 try {
  const res = await api.put(`/users/${id}`, userData);
  return res.data;
 } catch (err) {
  console.error('Error updating user profile:', err);
  throw err;
 }
};

// // Booking Management Functions
// export const updateBooking = async (id, booking) => {
//  try {
//   const res = await api.put(`/api/bookings/${id}`, booking);
//   return res.data;
//  } catch (err) {
//   console.error('Error updating booking:', err);
//   throw err;
//  }
// };
// export const extendBooking = async (id, additionalHours) => {
//  try {
//   const res = await api.put(`/api/bookings/${id}/extend`, null, { 
//    params: { additionalHours } 
//   });
//   return res.data;
//  } catch (err) {
//   console.error('Error extending booking:', err);
//   throw err;
//  }
// };
export const changePassword = async (id, currentPassword, newPassword) => {
 try {
 const res = await api.put(`/users/${id}/password`, {
  currentPassword,
  newPassword
 });
 return res.data;
 } catch (err) {
 console.error('Error changing password:', err);
 throw err;
 }
};

// export const getBookingsByUserId = async (userId) => {
//  try {
//   const res = await api.get(`/api/bookings/user/${userId}/bookings`);
//   return res.data;
//  } catch (err) {
//   console.error('Error fetching user bookings:', err);
//   throw err;
//  }
// };
export default api;

