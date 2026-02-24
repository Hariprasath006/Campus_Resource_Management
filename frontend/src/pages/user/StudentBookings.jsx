import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getBookings, updateBookingStatus } from "../../api/api";
import { getUser } from "../../utils/auth";

export default function StudentBookings() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "STUDENT") navigate("/");
  }, [user, navigate]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const res = await getBookings();
      const myBookings = (res.data || []).filter(b => b.userId === user.id);
      setBookings(myBookings);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const requestCancel = async (id) => {
    if (!window.confirm("Request cancellation? This will notify admin.")) return;
    try {
      await updateBookingStatus(id, "CANCELLATION_REQUESTED");
      loadBookings();
      alert("Cancellation request sent!");
    } catch (err) {
      alert("Failed to request cancellation");
    }
  };

  const formatStatus = (status) => {
    const map = {
      PENDING: "Pending Approval",
      APPROVED: "Approved",
      REJECTED: "Rejected",
      CANCELLATION_REQUESTED: "Cancellation Requested",
      CANCELLED: "Cancelled"
    };
    return map[status] || status;
  };

  if (loading) {
    return <Layout><div style={{textAlign:"center", padding:"80px"}}>Loading your bookings...</div></Layout>;
  }

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <h2 style={{ marginBottom: "24px" }}>My Bookings 📚</h2>

        {bookings.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "60px 0" }}>
            You have no bookings yet
          </p>
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
                  <td style={{ padding: "14px 16px", fontWeight: 500 }}>
                    {b.resource?.name || b.resourceName || `Resource #${b.resourceId?.slice(0,8) || "?"}`}
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
                      {formatStatus(b.status)}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    {b.status === "APPROVED" && (
                      <button
                        onClick={() => requestCancel(b.id)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Request Cancel
                      </button>
                    )}
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