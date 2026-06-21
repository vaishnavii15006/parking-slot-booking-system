package com.examly.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.exception.SlotNotAvailableException;
import com.examly.springapp.model.ParkingSlot;
import com.examly.springapp.model.Notification;
import com.examly.springapp.repository.ParkingSlotRepository;
import com.examly.springapp.repository.NotificationRepository;
import com.examly.springapp.repository.UserRepository;

@Service
public class ParkingSlotService {

    @Autowired
    private ParkingSlotRepository repo;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;

    public ParkingSlot create(ParkingSlot slot) throws SlotNotAvailableException {
        List<ParkingSlot> list = repo.findBySlotNumber(slot.getSlotNumber());
        if (!list.isEmpty()) {
            throw new SlotNotAvailableException();
        }
        
        ParkingSlot savedSlot = repo.save(slot);
        
        // Create notification for all users about new slot
        try {
            List<com.examly.springapp.model.User> allUsers = userRepository.findAll();
            for (com.examly.springapp.model.User user : allUsers) {
                Notification notification = new Notification(
                    user.getId(),
                    "New Parking Slot Available",
                    "A new parking slot " + slot.getSlotNumber() + " (" + slot.getSlotType() + ") is now available at $" + slot.getHourlyRate() + "/hour.",
                    "SYSTEM"
                );
                notificationRepository.save(notification);
            }
        } catch (Exception e) {
            System.out.println("Failed to create notifications for new slot: " + e.getMessage());
        }
        
        return savedSlot;
    }

    public List<ParkingSlot> getAvailableSlots() {
        return repo.findByIsAvailableTrue();
    }

    public List<ParkingSlot> getAllSlots() {
        return repo.findAll();
    }

    public ParkingSlot updateSlot(Long id, ParkingSlot parkingSlot) throws ResourceNotFoundException {
        return repo.findById(id).map(slot -> {
            boolean rateChanged = !slot.getHourlyRate().equals(parkingSlot.getHourlyRate());
            double oldRate = slot.getHourlyRate();
            
            slot.setIsAvailable(parkingSlot.getIsAvailable());
            slot.setHourlyRate(parkingSlot.getHourlyRate());
            ParkingSlot updatedSlot = repo.save(slot);
            
            // Create notification for all users about price change
            if (rateChanged) {
                try {
                    List<com.examly.springapp.model.User> allUsers = userRepository.findAll();
                    for (com.examly.springapp.model.User user : allUsers) {
                        Notification notification = new Notification(
                            user.getId(),
                            "Parking Slot Price Updated",
                            "Parking slot " + slot.getSlotNumber() + " price has been updated from $" + oldRate + " to $" + parkingSlot.getHourlyRate() + " per hour.",
                            "SYSTEM"
                        );
                        notificationRepository.save(notification);
                    }
                } catch (Exception e) {
                    System.out.println("Failed to create notifications for price update: " + e.getMessage());
                }
            }
            
            return updatedSlot;
        }).orElseThrow(() -> new ResourceNotFoundException("Id not found"));
    }

    public void deleteSlotById(Long id) throws ResourceNotFoundException {
        ParkingSlot slot = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("ID not found"));
        repo.deleteById(id);
    }
}
