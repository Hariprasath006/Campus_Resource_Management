// pages/admin/Bookings.jsx — full action control + correct View button

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getBookings, updateBookingStatus } from "../../api/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    try {
      const res = await getBookings();
      console.log("Admin bookings data:", res.data); // Debug: check real fields
      setBookings(res.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const changeStatus = async (id, newStatus) => {
    if (!window.confirm(`Change status to ${newStatus}?`)) return;
    try {
      await updateBookingStatus(id, newStatus);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const shorten = (id) => id ? id.slice(0, 8) + "..." : "?";

  if (loading) return <Layout><div style={{textAlign: "center", padding: "80px"}}>Loading bookings...</div></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "24px" }}>
        <h2 style={{ marginBottom: "24px" }}>All Bookings (Admin Control)</h2>

        {error && <p style={{ color: "#ef4444", marginBottom: "16px" }}>{error}</p>}

        {bookings.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>No bookings found</p>
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
                <th style={{ padding: "14px 16px" }}>User</th>
                <th style={{ padding: "14px 16px" }}>Resource</th>
                <th style={{ padding: "14px 16px" }}>Date</th>
                <th style={{ padding: "14px 16px" }}>Slot</th>
                <th style={{ padding: "14px 16px" }}>Status</th>
                <th style={{ padding: "14px 16px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "14px 16px" }}>
                    {b.userName || b.user?.name || (b.userEmail ? b.userEmail.split('@')[0] : `User #${shorten(b.userId)}`)}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {b.resourceName || b.resource?.name || `Resource #${shorten(b.resourceId)}`}
                  </td>
                  <td style={{ padding: "14px 16px" }}>{b.bookingDate || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>{b.timeSlot || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      backgroundColor:
                        b.status === "APPROVED" ? "#d1fae5" :
                        b.status === "REJECTED" ? "#fee2e2" :
                        b.status === "PENDING" ? "#fef3c7" :
                        b.status === "CANCELLATION_REQUESTED" ? "#dbeafe" : "#e5e7eb",
                      color:
                        b.status === "APPROVED" ? "#059669" :
                        b.status === "REJECTED" ? "#dc2626" :
                        b.status === "PENDING" ? "#b45309" :
                        b.status === "CANCELLATION_REQUESTED" ? "#2563eb" : "#4b5563",
                    }}>
                      {b.status || "UNKNOWN"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                      {b.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => changeStatus(b.id, "APPROVED")}
                            style={{ background: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => changeStatus(b.id, "REJECTED")}
                            style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {b.status === "APPROVED" && (
                        <button
                          onClick={() => changeStatus(b.id, "REJECTED")}
                          style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
                        >
                          Force Reject
                        </button>
                      )}

                      {b.status === "REJECTED" && (
                        <button
                          onClick={() => changeStatus(b.id, "APPROVED")}
                          style={{ background: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
                        >
                          Undo Reject
                        </button>
                      )}

                      {b.status === "CANCELLATION_REQUESTED" && (
                        <>
                          <button
                            onClick={() => changeStatus(b.id, "CANCELLED")}
                            style={{ background: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px" }}
                          >
                            Approve Cancel
                          </button>
                          <button
                            onClick={() => changeStatus(b.id, "APPROVED")}
                            style={{ background: "#f59e0b", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px" }}
                          >
                            Reject Cancel
                          </button>
                        </>
                      )}

                      {/* View button - now uses correct fields */}
                      <button
                        style={{
                          background: "#6b7280",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const userDisplay = b.userName || b.user?.name || (b.userEmail ? b.userEmail.split('@')[0] : "Unknown User");
                          const resourceDisplay = b.resourceName || b.resource?.name || (b.resourceId ? `Resource #${shorten(b.resourceId)}` : "Unknown Resource");

                          alert(
                            `Booking ID: ${b.id}\n` +
                            `User: ${userDisplay}\n` +
                            `Resource: ${resourceDisplay}\n` +
                            `Date: ${b.bookingDate || "—"}\n` +
                            `Slot: ${b.timeSlot || "—"}\n` +
                            `Status: ${b.status || "UNKNOWN"}`
                          );
                        }}
                      >
                        View
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