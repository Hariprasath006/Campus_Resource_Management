import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getResources, createBooking } from "../../api/api";
import { getUser } from "../../utils/auth";

export default function StudentResources() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "STUDENT") navigate("/");
  }, [user, navigate]);

  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const loadResources = async () => {
    try {
      const res = await getResources();
      setResources(res.data || []);
    } catch (err) {
      console.error("Failed to load resources", err);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const openBookingModal = (resource) => {
    if (resource.status !== "AVAILABLE") {
      alert("This resource is currently unavailable.");
      return;
    }

    setSelectedResource(resource);
    setDate("");
    setSlot("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResource(null);
    setDate("");
    setSlot("");
  };

  const confirmBooking = async () => {
    if (!date || !slot) {
      alert("Please select a date and time slot.");
      return;
    }

    try {
      await createBooking({
        userId: user.id,
        resourceId: selectedResource.id,
        bookingDate: date,
        timeSlot: slot
      });

      alert("✅ Booking request sent successfully!");
      closeModal();
      loadResources(); // refresh availability
    } catch (err) {
      alert("❌ Booking failed – slot may already be taken or invalid.");
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <h2 style={{ marginBottom: "32px" }}>Available Resources 🏫</h2>

        <div className="grid">
          {resources.map(r => (
            <div key={r.id} className="card">
              <h3>{r.name}</h3>
              <p><strong>Type:</strong> {r.type}</p>
              <p><strong>Capacity:</strong> {r.capacity || "—"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`badge ${r.status?.toLowerCase() || "unknown"}`}>
                  {r.status || "Unknown"}
                </span>
              </p>

              <button
                className="primary-btn"
                disabled={r.status !== "AVAILABLE"}
                onClick={() => openBookingModal(r)}
                style={{ width: "100%", marginTop: "16px" }}
              >
                {r.status === "AVAILABLE" ? "Book Now" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Modal Popup - opens in the middle of the screen */}
      {showModal && selectedResource && (
        <div
          className="modal"
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
          onClick={closeModal} // close when clicking outside
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
            onClick={e => e.stopPropagation()} // prevent close when clicking inside
          >
            <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
              Book {selectedResource.name}
            </h3>

            <p style={{ color: "#64748b", marginBottom: "24px", textAlign: "center" }}>
              Type: {selectedResource.type} • Capacity: {selectedResource.capacity || "—"}
            </p>

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Select Time Slot
            </label>
            <input
              placeholder="e.g. 10:00 AM - 11:00 AM"
              value={slot}
              onChange={e => setSlot(e.target.value)}
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
                onClick={confirmBooking}
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