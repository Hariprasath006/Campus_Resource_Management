import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getBookings, updateBookingStatus } from "../../api/api";
import { getUser } from "../../utils/auth";

export default function StaffBookings() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "STAFF") navigate("/");
  }, [user, navigate]);

  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data || []);
    } catch (err) {
      alert("Failed to load bookings");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      loadBookings();
    } catch (err) {
      alert("Failed to update booking");
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <h2>Review Student Requests 📋</h2>

        <div className="grid">
          {bookings.map(b => (
            <div key={b.id} className="card">
              <p><strong>Student:</strong> {b.userName}</p>
              <p><strong>Resource:</strong> {b.resourceName}</p>
              <p><strong>Date:</strong> {b.bookingDate}</p>
              <p><strong>Slot:</strong> {b.timeSlot}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`badge ${b.status === "APPROVED" ? "green" :
                  b.status === "REJECTED" ? "red" : "orange"}`}>
                  {b.status}
                </span>
              </p>

              {b.status === "PENDING" && (
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button onClick={() => handleAction(b.id, "APPROVED")}>
                    Approve
                  </button>
                  <button onClick={() => handleAction(b.id, "REJECTED")}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
