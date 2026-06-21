import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SlotList from '../components/SlotList';
import * as api from '../utils/api';

jest.mock('../utils/api');

describe('SlotList', () => {
  const mockSlots = [
    { id: 1, slotNumber: 'A1', slotType: 'Regular', hourlyRate: 5, isAvailable: true },
    { id: 2, slotNumber: 'B2', slotType: 'VIP', hourlyRate: 10, isAvailable: true },
    { id: 3, slotNumber: 'C3', slotType: 'Handicapped', hourlyRate: 8, isAvailable: true },
  ];

  beforeEach(() => {
    api.getAvailableSlots.mockResolvedValue([...mockSlots]);
  });

  it('renders available parking slots and filter', async () => {
    render(<SlotList onSelect={jest.fn()} selectedSlot={null} />);
    expect(screen.getByText(/Available Parking Slots/i)).toBeInTheDocument();
    await screen.findByTestId('slot-item-A1');
    expect(screen.getByTestId('slot-item-B2')).toBeInTheDocument();
    expect(screen.getByTestId('slot-item-C3')).toBeInTheDocument();

    // Filter by type
    fireEvent.change(screen.getByTestId('type-filter'), { target: { value: 'VIP' } });
    expect(screen.queryByTestId('slot-item-A1')).not.toBeInTheDocument();
    expect(screen.getByTestId('slot-item-B2')).toBeInTheDocument();
    expect(screen.queryByTestId('slot-item-C3')).not.toBeInTheDocument();
  });

  it('calls onSelect when Book is clicked', async () => {
    const onSelect = jest.fn();
    render(<SlotList onSelect={onSelect} selectedSlot={null} />);
    await screen.findByTestId('book-btn-A1');
    fireEvent.click(screen.getByTestId('book-btn-A1'));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({slotNumber: 'A1'}));
  });

  it('shows error message on API error', async () => {
    api.getAvailableSlots.mockRejectedValueOnce('fail');
    render(<SlotList onSelect={jest.fn()} selectedSlot={null} />);
    await screen.findByText('Failed to load slots.');
  });
});
