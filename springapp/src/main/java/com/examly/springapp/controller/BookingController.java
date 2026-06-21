package com.examly.springapp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Booking;
import com.examly.springapp.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {
  "https://8081-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "https://8080-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "http://localhost:8081",
  "http://localhost:3000"
})

public class BookingController {
    @Autowired
    private BookingService service;

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(service.getAllBookings());
    }

    @PostMapping
    public ResponseEntity<Object> createBooking(@RequestBody Booking booking) {
        try {
            return new ResponseEntity(service.createBooking(booking), HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Object> getBookingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getBookingById(id));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Object> cancelBookingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.cancelBookingById(id));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteBookingById(@PathVariable Long id) {
        try {
            service.deleteBookingById(id);
            Map<String, String> mp = new HashMap<>();
            mp.put("Message", "Booking deleted successfully");
            return ResponseEntity.accepted().body(mp);
        } catch (ResourceNotFoundException e) {
            Map<String, String> mp = new HashMap<>();
            mp.put("Message", e.getMessage());
            return ResponseEntity.badRequest().body(mp);
        }
    }
    @PutMapping("/{id}/status")
public ResponseEntity<Object> updateStatus(@PathVariable Long id, @RequestParam String status) {
    try {
        return ResponseEntity.ok(service.updateStatus(id, status));
    } catch (Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}



    @PutMapping("/{id}")
    public ResponseEntity<Object> updateBooking(@PathVariable Long id, @RequestBody Booking bookingDetails) {
        try {
            return ResponseEntity.ok(service.updateBooking(id, bookingDetails));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Extend booking duration
     */
    @PutMapping("/{id}/extend")
    public ResponseEntity<Object> extendBooking(@PathVariable Long id, @RequestParam int additionalHours) {
        try {
            return ResponseEntity.ok(service.extendBooking(id, additionalHours));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get bookings by user ID (alias for existing endpoint)
     */
    @GetMapping("/user/{userId}/bookings")
    public ResponseEntity<Object> getBookingsByUserId(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(service.getBookingsByUserId(userId));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

