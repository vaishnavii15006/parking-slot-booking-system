
package com.examly.springapp.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String slotNumber;
    private String slotType;
    private Boolean isAvailable;
    private Double hourlyRate;
     @OneToMany(mappedBy = "parkingSlot", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
         @JsonIgnore  // Prevent infinite recursion when returning JSON
        private List<Booking> bookings;
     public ParkingSlot(Long id, String slotNumber, String slotType, Boolean isAvailable, Double hourlyRate) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.slotType = slotType;
        this.isAvailable = isAvailable;
        this.hourlyRate = hourlyRate;
     }

}
