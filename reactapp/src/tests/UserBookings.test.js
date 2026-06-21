import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserBookings from '../components/UserBookings';
import * as api from '../utils/api';

jest.mock('../utils/api');

describe('UserBookings', () => {
  const bookings = [
    {
      id: 1,
      parkingSlot: { slotNumber: 'B2', slotType: 'VIP' },
      vehicleNumber: 'ABC123',
      startTime: '2099-12-20T10:00',
      endTime: '2099-12-20T14:00',
      totalCost: 40,
      status: 'Confirmed',
    },
    {
      id: 2,
      parkingSlot: { slotNumber: 'A1', slotType: 'Regular' },
      vehicleNumber: 'XYZ789',
      startTime: '2099-11-01T12:00',
      endTime: '2099-11-01T14:00',
      totalCost: 12,
      status: 'Cancelled',
    },
  ];
  beforeEach(() => {
    api.getUserBookings.mockResolvedValue([...bookings]);
    api.cancelBooking.mockResolvedValue({ ...bookings[0], status: 'Cancelled' });
  });

  it('renders bookings and sorted, shows cancel for Confirmed', async () => {
    render(<UserBookings userId={1} />);
    await screen.findByTestId('booking-item-1');
    expect(screen.getByTestId('booking-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('booking-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('ub-status-1')).toHaveTextContent('Confirmed');
    expect(screen.getByTestId('cancel-btn-1')).toBeInTheDocument();
    expect(screen.queryByTestId('cancel-btn-2')).toBeNull();
  });

  it('calls API and refreshes on cancel', async () => {
    render(<UserBookings userId={1} />);
    await screen.findByTestId('cancel-btn-1');
    fireEvent.click(screen.getByTestId('cancel-btn-1'));
    await waitFor(() => expect(api.cancelBooking).toHaveBeenCalledWith(1));
  });

  it('shows error on booking/cancel API error', async () => {
    api.getUserBookings.mockRejectedValueOnce('fail');
    render(<UserBookings userId={1} />);
    await screen.findByText('Failed to load bookings.');

    // the next call loads the bookings again (to bring back buttons and not show error)
    api.getUserBookings.mockResolvedValueOnce([...bookings]);
    api.cancelBooking.mockRejectedValueOnce({ response: { data: { message: 'No cancel!' } } });
    // need to re-render to reload with valid bookings
    render(<UserBookings userId={1} />);
    await screen.findByTestId('cancel-btn-1');
    fireEvent.click(screen.getByTestId('cancel-btn-1'));
    await screen.findByText('No cancel!');
  });
});
