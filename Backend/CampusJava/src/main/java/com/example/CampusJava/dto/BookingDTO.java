package com.example.CampusJava.dto;

import com.example.CampusJava.model.Booking;
import java.time.LocalDate;
import java.util.UUID;

public class BookingDTO {

    private UUID id;
    private UUID userId;
    private String userName;
    private UUID resourceId;
    private String resourceName;
    private LocalDate bookingDate;
    private String timeSlot;
    private String status;

    public BookingDTO() {}

    public BookingDTO(Booking booking) {
        this.id = booking.getId();
        this.userId = booking.getUserId();
        this.resourceId = booking.getResourceId();
        this.bookingDate = booking.getBookingDate();
        this.timeSlot = booking.getTimeSlot();
        this.status = booking.getStatus();
        // userName & resourceName populated later in controller
    }

    // Getters & Setters (unchanged, just kept for completeness)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public UUID getResourceId() { return resourceId; }
    public void setResourceId(UUID resourceId) { this.resourceId = resourceId; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Optional: useful for debugging
    @Override
    public String toString() {
        return "BookingDTO{" +
                "id=" + id +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                ", resourceId=" + resourceId +
                ", resourceName='" + resourceName + '\'' +
                ", bookingDate=" + bookingDate +
                ", timeSlot='" + timeSlot + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}