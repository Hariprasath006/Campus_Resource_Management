// pages/staff/StaffResources.jsx — centered modal popup (same as StudentResources)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getResources, createBooking } from "../../api/api";
import { getUser } from "../../utils/auth";

export default function StaffResources() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "STAFF") navigate("/");
  }, [user, navigate]);

  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const loadResources = async () => {
    try {
      const res = await getResources();
      setResources(res.data || []);
    } catch (err) {
      alert("Failed to load resources");
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const openBookingModal = (resource) => {
    if (resource.status !== "AVAILABLE") {
      alert("Resource not available");
      return;
    }

    setSelectedResource(resource);
    setBookingDate("");
    setTimeSlot("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResource(null);
    setBookingDate("");
    setTimeSlot("");
  };

  const handleBook = async () => {
    if (!bookingDate || !timeSlot) {
      alert("Please select date and time slot");
      return;
    }

    try {
      await createBooking({
        userId: user.id,
        resourceId: selectedResource.id,
        bookingDate,
        timeSlot
      });

      alert("✅ Booking Created Successfully!");
      closeModal();
      loadResources(); // refresh list
    } catch (err) {
      alert("❌ Slot already booked or error occurred");
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <h2 style={{ marginBottom: "24px" }}>Available Resources 🏫</h2>

        <div className="grid">
          {resources.map(r => (
            <div key={r.id} className="card">
              <h3>{r.name}</h3>
              <p><strong>Type:</strong> {r.type}</p>
              <p><strong>Capacity:</strong> {r.capacity}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`badge ${r.status === "AVAILABLE" ? "green" : "red"}`}>
                  {r.status}
                </span>
              </p>
              <button
                disabled={r.status !== "AVAILABLE"}
                onClick={() => openBookingModal(r)}
                style={{ width: "100%", marginTop: "12px" }}
              >
                {r.status === "AVAILABLE" ? "Book This Resource" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Modal Popup */}
      {showModal && selectedResource && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              width: "480px",
              maxWidth: "90%",
              padding: "32px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
              Book {selectedResource.name}
            </h3>

            <p style={{ color: "#64748b", marginBottom: "24px", textAlign: "center" }}>
              Type: {selectedResource.type} • Capacity: {selectedResource.capacity}
            </p>

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Select Date
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
              style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Select Time Slot
            </label>
            <input
              placeholder="e.g. 10:00-11:00"
              value={timeSlot}
              onChange={e => setTimeSlot(e.target.value)}
              style={{ width: "100%", padding: "12px", marginBottom: "32px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />

            <div style={{ display: "flex", gap: "16px" }}>
              <button
                onClick={closeModal}
                style={{
                  flex: 1,
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleBook}
                style={{
                  flex: 1,
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
