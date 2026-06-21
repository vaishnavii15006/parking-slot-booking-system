import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingForm from '../components/BookingForm';
import * as api from '../utils/api';

jest.mock('../utils/api');

describe('BookingForm', () => {
  const slot = { id: 1, slotNumber: 'A1', hourlyRate: 5 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('form validation and cost calc', async () => {
    render(<BookingForm slot={slot} onBooked={jest.fn()} />);
    // vehicle empty
    fireEvent.change(screen.getByTestId('vehicle-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('start-time-input'), { target: { value: '2099-12-20T10:00' } });
    fireEvent.change(screen.getByTestId('end-time-input'), { target: { value: '2099-12-20T12:00' } });
    fireEvent.click(screen.getByTestId('book-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('form-error')).toHaveTextContent(/Vehicle number/i);
    });
    // end before start
    fireEvent.change(screen.getByTestId('vehicle-input'), { target: { value: 'ABC123' } });
    fireEvent.change(screen.getByTestId('start-time-input'), { target: { value: '2099-12-21T11:00' } });
    fireEvent.change(screen.getByTestId('end-time-input'), { target: { value: '2099-12-21T10:00' } });
    fireEvent.click(screen.getByTestId('book-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('form-error')).toHaveTextContent(/before end time/);
    });
    // start in past
    fireEvent.change(screen.getByTestId('start-time-input'), { target: { value: '2000-01-01T00:00' } });
    fireEvent.change(screen.getByTestId('end-time-input'), { target: { value: '2099-12-21T10:10' } });
    fireEvent.click(screen.getByTestId('book-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('form-error')).toHaveTextContent(/in the past/);
    });
  });

  it('shows and calculates cost', async () => {
    render(<BookingForm slot={{ id: 1, slotNumber: 'A1', hourlyRate: 7 }} onBooked={jest.fn()} />);
    fireEvent.change(screen.getByTestId('vehicle-input'), { target: { value: 'ABC111' } });
    fireEvent.change(screen.getByTestId('start-time-input'), { target: { value: '2099-12-20T10:00' } });
    fireEvent.change(screen.getByTestId('end-time-input'), { target: { value: '2099-12-20T14:30' } });
    expect(screen.getByTestId('cost')).toHaveTextContent('$28.00'); // 4.5 hrs rounds up to 5 * $7
  });

  it('calls API and onBooked on success', async () => {
    api.createBooking.mockResolvedValue({ id: 10 });
    const onBooked = jest.fn();
    render(<BookingForm slot={slot} onBooked={onBooked} />);
    fireEvent.change(screen.getByTestId('vehicle-input'), { target: { value: 'ABC123' } });
    fireEvent.change(screen.getByTestId('start-time-input'), { target: { value: '2099-12-20T10:00' } });
    fireEvent.change(screen.getByTestId('end-time-input'), { target: { value: '2099-12-20T12:00' } });
    fireEvent.click(screen.getByTestId('book-btn'));
    await waitFor(() => expect(api.createBooking).toHaveBeenCalled());
    await waitFor(() => expect(onBooked).toHaveBeenCalled());
  });

  it('shows API error on booking fail', async () => {
    api.createBooking.mockRejectedValue({ response: { data: { message: 'Failed to book!' } } });
    render(<BookingForm slot={slot} onBooked={jest.fn()} />);
    fireEvent.change(screen.getByTestId('vehicle-input'), { target: { value: 'ABC123' } });
    fireEvent.change(screen.getByTestId('start-time-input'), { target: { value: '2099-12-20T10:00' } });
    fireEvent.change(screen.getByTestId('end-time-input'), { target: { value: '2099-12-20T12:00' } });
    fireEvent.click(screen.getByTestId('book-btn'));
    await waitFor(() => expect(screen.getByTestId('form-error')).toHaveTextContent('Failed to book!'));
  });
});
