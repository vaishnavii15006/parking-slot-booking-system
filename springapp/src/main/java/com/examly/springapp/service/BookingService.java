package com.examly.springapp.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.examly.springapp.exception.BookingValidationException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.exception.SlotNotAvailableException;
import com.examly.springapp.model.Booking;
import com.examly.springapp.model.ParkingSlot;
import com.examly.springapp.model.Notification;
import com.examly.springapp.repository.BookingRepository;
import com.examly.springapp.repository.ParkingSlotRepository;
import com.examly.springapp.repository.NotificationRepository;

@Service
public class BookingService {
    @Autowired
    private BookingRepository repo;
    @Autowired
    private ParkingSlotRepository repo1;
    
    // NEW: Add notification repository
    @Autowired
    private NotificationRepository notificationRepository;
    
    // YOUR EXISTING METHODS STAY EXACTLY THE SAME
    public Booking createBooking(Booking bookingRequest) throws Exception {
        if(bookingRequest.getParkingSlot()==null)throw new ResourceNotFoundException("Parking Slot Not Found");

        Long slotid = bookingRequest.getParkingSlot().getId();
        if(slotid==null)throw new ResourceNotFoundException("Parking Slot Id Not Found");

        ParkingSlot slot = repo1.findById(slotid).orElseThrow(() -> new SlotNotAvailableException());

        Booking booking = new Booking();
        booking.setUserId(bookingRequest.getUserId());
        System.out.println(bookingRequest.getUserId());
        booking.setParkingSlot(slot);
        booking.setVehicleNumber(bookingRequest.getVehicleNumber());
        booking.setStartTime(bookingRequest.getStartTime());
        booking.setEndTime(bookingRequest.getEndTime());

        long minutes = Duration.between(booking.getStartTime(), booking.getEndTime()).toMinutes();

        if(Boolean.FALSE.equals(slot.getIsAvailable()))throw new BookingValidationException();
        if(bookingRequest.getVehicleNumber().isEmpty())throw new BookingValidationException("Enter Valid Vehicle Number");
        if(minutes<=0)throw new BookingValidationException("Start time should be before End time");

               booking.setTotalCost((minutes/60)*slot.getHourlyRate());
        booking.setStatus("Confirmed");

        slot.setIsAvailable(false);
        repo1.save(slot);
        
        // NEW: Create notification for booking confirmation
        try {
            Notification notification = new Notification(
                booking.getUserId(),
                "Booking Confirmed",
                "Your parking booking for slot " + slot.getSlotNumber() + " has been confirmed.",
                "BOOKING"
            );
            notificationRepository.save(notification);
        } catch (Exception e) {
            // Don't fail booking if notification fails
            System.out.println("Failed to create notification: " + e.getMessage());
        }
        
        return repo.save(booking);
    }

    public List<Booking> getAllBookings() {
        return repo.findAll();
    }

    public List<Booking> getBookingById(Long id) throws ResourceNotFoundException {
        List<Booking> res = repo.findByUserId(id);
        if (res.isEmpty())
            throw new ResourceNotFoundException("User Id not found");
        return res;
    }

    public Booking cancelBookingById(Long id) throws ResourceNotFoundException {
        Booking b = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Id not found"));
        if ("Cancelled".equalsIgnoreCase(b.getStatus()))
            throw new ResourceNotFoundException("Booking already cancelled");

        b.setStatus("Cancelled");
        ParkingSlot slot = b.getParkingSlot();
        slot.setIsAvailable(true);
        repo1.save(slot);
        
        // NEW: Create notification for cancellation
        try {
            Notification notification = new Notification(
                b.getUserId(),
                "Booking Cancelled",
                "Your parking booking has been cancelled successfully.",
                "BOOKING"
            );
            notificationRepository.save(notification);
        } catch (Exception e) {
            System.out.println("Failed to create notification: " + e.getMessage());
        }
        
        return repo.save(b);
    }


    
    
    public void deleteBookingById(Long id) throws ResourceNotFoundException {
        Booking b = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Id not found"));
        ParkingSlot slot = b.getParkingSlot();
        if (slot != null && Boolean.FALSE.equals(slot.getIsAvailable())) {
            slot.setIsAvailable(true);
            repo1.save(slot);
        }
        b.setParkingSlot(null);
        repo.save(b);
        repo.deleteById(id);
    }
    
    public Booking updateStatus(Long id, String status) throws ResourceNotFoundException {
        Booking b = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Id not found"));
        b.setStatus(status);
        // free the slot if cancelled/completed; hold if confirmed
        ParkingSlot slot = b.getParkingSlot();
        if (slot != null) {
            if ("Cancelled".equalsIgnoreCase(status) || "Completed".equalsIgnoreCase(status)) {
                slot.setIsAvailable(true);
                repo1.save(slot);
            } else if ("Confirmed".equalsIgnoreCase(status)) {
                slot.setIsAvailable(false);
                repo1.save(slot);
            }
        }
        return repo.save(b);
    }

    // ===== NEW METHODS ADDED BELOW =====
    
    /**
     * Update booking details (start time, end time, vehicle number)
          * @throws BookingValidationException 
          */
         public Booking updateBooking(Long id, Booking bookingDetails) throws ResourceNotFoundException, BookingValidationException {
        Booking booking = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        // Update booking details
        booking.setStartTime(bookingDetails.getStartTime());
        booking.setEndTime(bookingDetails.getEndTime());
        booking.setVehicleNumber(bookingDetails.getVehicleNumber());
        
        // Recalculate cost
        ParkingSlot slot = booking.getParkingSlot();
        if (slot != null) {
            long minutes = Duration.between(booking.getStartTime(), booking.getEndTime()).toMinutes();
            if (minutes <= 0) {
                throw new BookingValidationException("Start time should be before End time");
            }
            booking.setTotalCost((minutes/60.0) * slot.getHourlyRate());
        }
       
        
        // Create notification
        try {
            Notification notification = new Notification(
                booking.getUserId(),
                "Booking Updated",
                "Your parking booking has been updated successfully.",
                "BOOKING"
            );
            notificationRepository.save(notification);
        } catch (Exception e) {
            System.out.println("Failed to create notification: " + e.getMessage());
        }
        
        return repo.save(booking);
    }

    
    public Booking extendBooking(Long id, int additionalHours) throws ResourceNotFoundException {
        Booking booking = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        // Extend end time
        LocalDateTime newEndTime = booking.getEndTime().plusHours(additionalHours);
        booking.setEndTime(newEndTime);
        
        // Recalculate cost
        ParkingSlot slot = booking.getParkingSlot();
        if (slot != null) {
            long minutes = Duration.between(booking.getStartTime(), booking.getEndTime()).toMinutes();
            booking.setTotalCost((minutes/60.0) * slot.getHourlyRate());
        }
        
        // Create notification
        try {
            Notification notification = new Notification(
                booking.getUserId(),
                "Booking Extended",
                "Your parking booking has been extended by " + additionalHours + " hours.",
                "BOOKING"
            );
            notificationRepository.save(notification);
        } catch (Exception e) {
            System.out.println("Failed to create notification: " + e.getMessage());
        }
        
        return repo.save(booking);
    }

    /**
     * Get bookings by user ID (alias for existing method)
     */
    public List<Booking> getBookingsByUserId(Long userId) throws ResourceNotFoundException {
        return getBookingById(userId);
    }
}