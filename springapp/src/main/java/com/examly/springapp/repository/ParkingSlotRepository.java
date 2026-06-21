package com.examly.springapp.repository;

import com.examly.springapp.model.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    @Query("select p from ParkingSlot p where p.slotNumber = :sno")
    List<ParkingSlot> findBySlotNumber(@Param("sno") String slotNumber);

    List<ParkingSlot> findByIsAvailableTrue();
}