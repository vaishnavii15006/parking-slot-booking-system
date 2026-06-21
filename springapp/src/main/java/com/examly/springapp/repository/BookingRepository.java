package com.examly.springapp.repository;

import com.examly.springapp.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("select b from Booking b where b.userId=:uid")
    List<Booking> findByUserId(@Param("uid") Long id);
}
