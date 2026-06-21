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
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.exception.SlotNotAvailableException;
import com.examly.springapp.model.ParkingSlot;
import com.examly.springapp.service.ParkingSlotService;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = {
  "https://8081-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "https://8080-fdcbfdacddfcfbfabaabafaeccbaaffec.premiumproject.examly.io",
  "http://localhost:8081",
  "http://localhost:3000"
})

public class ParkingSlotController {

    @Autowired
    private ParkingSlotService parkingSlotService;

    @GetMapping
    public ResponseEntity<List<ParkingSlot>> getAllSlots() {
        return ResponseEntity.ok(parkingSlotService.getAllSlots());
    }

    @GetMapping("/available")
    public ResponseEntity<List<ParkingSlot>> getAvailableSlots() {
        return ResponseEntity.ok(parkingSlotService.getAvailableSlots());
    }

    @PostMapping
    public ResponseEntity<Object> createSlot(@RequestBody ParkingSlot parkingSlot) {
        try {
            return new ResponseEntity(parkingSlotService.create(parkingSlot), HttpStatus.CREATED);
        } catch (SlotNotAvailableException e) {
            Map<String, String> errormap = new HashMap<>();
            errormap.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errormap);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateSlotById(@PathVariable Long id, @RequestBody ParkingSlot parkingSlot) {
        try {
            return ResponseEntity.ok(parkingSlotService.updateSlot(id, parkingSlot));
        } catch (Exception e) {
            Map<String, String> errormap = new HashMap<>();
            errormap.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errormap);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteSlotById(@PathVariable Long id) {
        try {
            Map<String, String> errormap = new HashMap<>();
            parkingSlotService.deleteSlotById(id);
            errormap.put("message", "slot with id " + id + " deleted");
            return ResponseEntity.ok().body(errormap);
        } catch (Exception e) {
            Map<String, String> errormap = new HashMap<>();
            errormap.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errormap);
        }
    }
}
