import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPayment, updatePaymentStatus } from '../utils/api';
import {
 Container, Card, CardContent, Typography, Button, Box, Grid,
 TextField,Divider, FormControl, InputLabel, Select, MenuItem, Chip,
 Stepper, Step, StepLabel, Alert, CircularProgress
} from '@mui/material';
import {
 CreditCard, AccountBalance, PhoneAndroid, Payment,
 CheckCircle, ArrowBack, Security
} from '@mui/icons-material';

export default function PaymentPage() {
 const location = useLocation();
 const navigate = useNavigate();
 const { booking, totalCost } = location.state || {};
 
 const [activeStep, setActiveStep] = useState(0);
 const [paymentMethod, setPaymentMethod] = useState('');
 const [paymentDetails, setPaymentDetails] = useState({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  upiId: '',
  phoneNumber: ''
 });
 const [loading, setLoading] = useState(false);
 const [paymentStatus, setPaymentStatus] = useState('');

 const steps = ['Select Payment Method', 'Enter Details', 'Confirm Payment'];

 const handleNext = () => {
setActiveStep((prevActiveStep) => prevActiveStep + 1);
 };

 const handleBack = () => {
  setActiveStep((prevActiveStep) => prevActiveStep - 1);
 };

 const handlePayment = async () => {
  setLoading(true);
  try {
   // Create payment record
   const payment = await createPayment({
    bookingId: booking.id,
    userId: booking.userId,
    amount: totalCost,
    paymentMethod: paymentMethod,
    status: 'PENDING'
   });

   // Simulate payment processing
   setTimeout(async () => {
    try {
     // Update payment status (simulate successful payment)
     await updatePaymentStatus(payment.id, 'COMPLETED', `TXN${Date.now()}`);
     setPaymentStatus('success');
     setLoading(false);
    } catch (error) {
     console.error('Payment failed:', error);
     setPaymentStatus('failed');
     setLoading(false);
    }
   }, 3000);
} catch (error) {
   console.error('Payment creation failed:', error);
   setPaymentStatus('failed');
   setLoading(false);
  }
 };

const renderStepContent = (step) => {
  switch (step) {
   case 0:
    return (
     <Box sx={{ p: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
       Choose Payment Method
      </Typography>
      <Grid container spacing={3}>
       <Grid item xs={12} md={4}>
        <Card 
         sx={{ 
          p: 3, 
          cursor: 'pointer',
          border: paymentMethod === 'CREDIT_CARD' ? '2px solid #1976d2' : '1px solid #e0e0e0',
          '&:hover': { border: '2px solid #1976d2' }
         }}
         onClick={() => setPaymentMethod('CREDIT_CARD')}
        >
         <Box sx={{ textAlign: 'center' }}>
          <CreditCard sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
           Credit Card
          </Typography>
         </Box>
        </Card>
       </Grid>
       <Grid item xs={12} md={4}>
        <Card 
         sx={{ 
          p: 3, 
          cursor: 'pointer',
          border: paymentMethod === 'DEBIT_CARD' ? '2px solid #1976d2' : '1px solid #e0e0e0',
          '&:hover': { border: '2px solid #1976d2' }
         }}
 onClick={() => setPaymentMethod('DEBIT_CARD')}
        >
         <Box sx={{ textAlign: 'center' }}>
          <AccountBalance sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
           Debit Card
          </Typography>
         </Box>
        </Card>
       </Grid>
       <Grid item xs={12} md={4}>
        <Card 
         sx={{ 
          p: 3, 
          cursor: 'pointer',
          border: paymentMethod === 'UPI' ? '2px solid #1976d2' : '1px solid #e0e0e0',
          '&:hover': { border: '2px solid #1976d2' }
         }}
         onClick={() => setPaymentMethod('UPI')}
        >
         <Box sx={{ textAlign: 'center' }}>
          <PhoneAndroid sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
           UPI
          </Typography>
         </Box>
        </Card>
       </Grid>
      </Grid>
     </Box>
    );
case 1:
    return (
     <Box sx={{ p: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
       Enter Payment Details
      </Typography>
      {paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD' ? (
       <Grid container spacing={3}>
        <Grid item xs={12}>
         <TextField
          label="Card Number"
          value={paymentDetails.cardNumber}
          onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
          fullWidth
          placeholder="1234 5678 9012 3456"
         />
        </Grid>
        <Grid item xs={6}>
         <TextField
          label="Expiry Date"
          value={paymentDetails.expiryDate}
          onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
          fullWidth
          placeholder="MM/YY"
         />
        </Grid>
        <Grid item xs={6}>
         <TextField
          label="CVV"
          value={paymentDetails.cvv}
          onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
          fullWidth
          placeholder="123"
         />
</Grid>
        <Grid item xs={12}>
         <TextField
          label="Cardholder Name"
          value={paymentDetails.cardholderName}
          onChange={(e) => setPaymentDetails({ ...paymentDetails, cardholderName: e.target.value })}
          fullWidth
         />
        </Grid>
       </Grid>
      ) : (
       <Grid container spacing={3}>
        <Grid item xs={12}>
         <TextField
          label="UPI ID"
          value={paymentDetails.upiId}
          onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
          fullWidth
          placeholder="yourname@paytm"
         />
        </Grid>
        <Grid item xs={12}>
         <TextField
          label="Phone Number"
          value={paymentDetails.phoneNumber}
          onChange={(e) => setPaymentDetails({ ...paymentDetails, phoneNumber: e.target.value })}
          fullWidth
          placeholder="+91 9876543210"
         />
        </Grid>
       </Grid>
      )}
     </Box>
    );
case 2:
    return (
     <Box sx={{ p: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
       Confirm Payment
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
       <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Booking Summary
       </Typography>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Slot:</Typography>
        <Typography>{booking?.parkingSlot?.slotNumber}</Typography>
       </Box>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Duration:</Typography>
        <Typography>{booking?.startTime} - {booking?.endTime}</Typography>
       </Box>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Vehicle:</Typography>
        <Typography>{booking?.vehicleNumber}</Typography>
       </Box>
       <Divider sx={{ my: 2 }} />
       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Amount:</Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
         ${totalCost}
        </Typography>
       </Box>
      </Card>
{paymentStatus === 'success' && (
       <Alert severity="success" sx={{ mb: 3 }}>
        <CheckCircle sx={{ mr: 1 }} />
        Payment successful! Your booking has been confirmed.
       </Alert>
      )}
      
      {paymentStatus === 'failed' && (
       <Alert severity="error" sx={{ mb: 3 }}>
        <Alert sx={{ mr: 1 }} />
        Payment failed. Please try again.
       </Alert>
      )}
     </Box>
    );

   default:
    return null;
  }
 };

 if (!booking) {
  return (
   <Container maxWidth="md" sx={{ py: 8 }}>
    <Alert severity="error">
     No booking information found. Please go back and try again.
    </Alert>
    <Button 
     startIcon={<ArrowBack />} 
     onClick={() => navigate('/')}
     sx={{ mt: 2 }}
    >
     Go Back
    </Button>
</Container>
  );
 }
return (
  <Container maxWidth="md" sx={{ py: 8 }}>
   <Box sx={{ mb: 4 }}>
    <Button 
     startIcon={<ArrowBack />} 
     onClick={() => navigate(-1)}
     sx={{ mb: 2 }}
    >
     Back
    </Button>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
     Payment
    </Typography>
    <Typography variant="body1" color="text.secondary">
     Complete your parking booking payment
    </Typography>
   </Box>

   <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
    <Stepper activeStep={activeStep} sx={{ p: 3, background: '#f8fafc' }}>
     {steps.map((label) => (
      <Step key={label}>
       <StepLabel>{label}</StepLabel>
      </Step>
     ))}
    </Stepper>

    <CardContent>
     {renderStepContent(activeStep)}
    </CardContent>
<Box sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
       disabled={activeStep === 0}
       onClick={handleBack}
       sx={{ mr: 1 }}
      >
       Back
      </Button>
      <Box sx={{ flex: '1 1 auto' }} />
      {activeStep === steps.length - 1 ? (
       <Button
        variant="contained"
        onClick={handlePayment}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
        sx={{ 
         background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
         '&:hover': { 
          background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
         }
        }}
       >
        {loading ? 'Processing...' : 'Pay Now'}
       </Button>
 ) : (
       <Button
        variant="contained"
        onClick={handleNext}
        disabled={!paymentMethod}
        sx={{ 
         background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
         '&:hover': { 
          background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
         }
        }}
       >
        Next
       </Button>
      )}
     </Box>
    </Box>
   </Card>
  </Container>
 );
}
