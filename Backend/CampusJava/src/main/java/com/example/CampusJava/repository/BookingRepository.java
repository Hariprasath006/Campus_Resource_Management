package com.example.CampusJava.repository;

import com.example.CampusJava.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.*;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    boolean existsByResourceIdAndBookingDateAndTimeSlot(
            UUID resourceId,
            LocalDate bookingDate,
            String timeSlot
    );

    List<Booking> findByUserId(UUID userId);   // 🔥 REQUIRED
}

