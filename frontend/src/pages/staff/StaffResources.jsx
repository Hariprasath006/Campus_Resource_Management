// pages/staff/StaffResources.jsx — Review & approve/reject pending student bookings

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getBookings, updateBookingStatus } from "../../api/api";
import { getUser } from "../../utils/auth";

export default function StaffResources() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "STAFF") navigate("/");
  }, [user, navigate]);

  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPendingBookings = async () => {
    try {
      const res = await getBookings();
      // Only show PENDING bookings (student requests)
      const pending = res.data.filter(b => b.status === "PENDING");
      setPendingBookings(pending || []);
      setError(null);
    } catch (err) {
      setError("Failed to load pending student requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingBookings();
  }, []);

  const handleAction = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) return;

    try {
      await updateBookingStatus(bookingId, newStatus);
      loadPendingBookings(); // refresh list
      alert(`Booking ${newStatus.toLowerCase()} successfully!`);
    } catch (err) {
      alert("Failed to update booking status");
      console.error(err);
    }
  };

  const shortenId = (id) => id ? id.slice(0, 8) + "..." : "?";

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "80px", color: "#64748b" }}>
          Loading pending student requests...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "24px" }}>
        <h2 style={{ marginBottom: "24px" }}>Pending Student Booking Requests 📋</h2>

        {error && <p style={{ color: "#ef4444", marginBottom: "16px" }}>{error}</p>}

        {pendingBookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            No pending booking requests to review
          </div>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "14px 16px" }}>Student</th>
                <th style={{ padding: "14px 16px" }}>Resource</th>
                <th style={{ padding: "14px 16px" }}>Date</th>
                <th style={{ padding: "14px 16px" }}>Slot</th>
                <th style={{ padding: "14px 16px" }}>Status</th>
                <th style={{ padding: "14px 16px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.map(b => (
                <tr key={b.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "14px 16px" }}>
                    {b.userName || b.user?.name || `Student #${shortenId(b.userId)}`}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {b.resourceName || b.resource?.name || `Resource #${shortenId(b.resourceId)}`}
                  </td>
                  <td style={{ padding: "14px 16px" }}>{b.bookingDate || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>{b.timeSlot || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      backgroundColor: "#fef3c7",
                      color: "#b45309",
                    }}>
                      Pending
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <button
                        onClick={() => handleAction(b.id, "APPROVED")}
                        style={{
                          background: "#10b981",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(b.id, "REJECTED")}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
