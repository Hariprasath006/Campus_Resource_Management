package com.example.CampusJava.controller;

import com.example.CampusJava.dto.BookingDTO;
import com.example.CampusJava.model.Booking;
import com.example.CampusJava.repository.BookingRepository;
import com.example.CampusJava.repository.ResourceRepository;
import com.example.CampusJava.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final ResourceRepository resourceRepo;

    public BookingController(BookingRepository bookingRepo,
                             UserRepository userRepo,
                             ResourceRepository resourceRepo) {
        this.bookingRepo = bookingRepo;
        this.userRepo = userRepo;
        this.resourceRepo = resourceRepo;
    }

    @GetMapping
    public List<BookingDTO> getAllBookings() {
        return bookingRepo.findAll().stream()
                .map(booking -> {
                    BookingDTO dto = new BookingDTO(booking);

                    // Safe population of names
                    userRepo.findById(booking.getUserId())
                            .ifPresentOrElse(
                                    user -> dto.setUserName(user.getName()),
                                    () -> dto.setUserName("Unknown User")
                            );

                    resourceRepo.findById(booking.getResourceId())
                            .ifPresentOrElse(
                                    resource -> dto.setResourceName(resource.getName()),
                                    () -> dto.setResourceName("Unknown Resource")
                            );

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    public List<BookingDTO> getByUser(@PathVariable UUID userId) {
        return bookingRepo.findByUserId(userId).stream()
                .map(booking -> {
                    BookingDTO dto = new BookingDTO(booking);

                    userRepo.findById(booking.getUserId())
                            .ifPresentOrElse(
                                    user -> dto.setUserName(user.getName()),
                                    () -> dto.setUserName("Unknown User")
                            );

                    resourceRepo.findById(booking.getResourceId())
                            .ifPresentOrElse(
                                    resource -> dto.setResourceName(resource.getName()),
                                    () -> dto.setResourceName("Unknown Resource")
                            );

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        if (booking.getUserId() == null || booking.getResourceId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User ID and Resource ID are required"));
        }

        boolean conflict = bookingRepo.existsByResourceIdAndBookingDateAndTimeSlot(
                booking.getResourceId(),
                booking.getBookingDate(),
                booking.getTimeSlot()
        );

        if (conflict) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Resource already booked ❌"));
        }

        Booking saved = bookingRepo.save(booking);

        // Return DTO instead of raw entity (consistent)
        BookingDTO dto = new BookingDTO(saved);
        userRepo.findById(saved.getUserId()).ifPresent(u -> dto.setUserName(u.getName()));
        resourceRepo.findById(saved.getResourceId()).ifPresent(r -> dto.setResourceName(r.getName()));

        return ResponseEntity.ok(Map.of(
                "message", "Booking Successful ✅",
                "booking", dto
        ));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request
    ) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        String newStatus = request.get("status");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
        }

        String normalized = newStatus.trim().toUpperCase();
        // Optional: validate allowed statuses
        if (!Set.of("PENDING", "APPROVED", "REJECTED", "CANCELLATION_REQUESTED", "CANCELLED").contains(normalized)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status value"));
        }

        booking.setStatus(normalized);
        Booking updated = bookingRepo.save(booking);

        // Return DTO for consistency
        BookingDTO dto = new BookingDTO(updated);
        userRepo.findById(updated.getUserId()).ifPresent(u -> dto.setUserName(u.getName()));
        resourceRepo.findById(updated.getResourceId()).ifPresent(r -> dto.setResourceName(r.getName()));

        return ResponseEntity.ok(Map.of(
                "message", "Status Updated ✅",
                "booking", dto
        ));
    }
}