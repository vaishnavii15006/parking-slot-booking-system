import React from 'react';
import './SlotDetails.css';
import BookingForm from './BookingForm';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function SlotDetails({ slot, onBooked, onBack }) {
  if (!slot) return null;
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6">Slot Details</Typography>
        <Typography><strong>Slot Number:</strong> {slot.slotNumber}</Typography>
        <Typography><strong>Type:</strong> {slot.slotType}</Typography>
        <Typography><strong>Rate:</strong> ${slot.hourlyRate} per hour</Typography>
        <BookingForm slot={slot} onBooked={onBooked} />
        <Button sx={{ mt: 2 }} onClick={onBack}>Back to Slots</Button>
      </CardContent>
    </Card>
  );
}

