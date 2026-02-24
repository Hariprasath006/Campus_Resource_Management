import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getBookings } from "../../api/api";
import { getUser } from "../../utils/auth";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "STAFF") navigate("/");
  }, [user, navigate]);

  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const loadStats = async () => {
    try {
      const res = await getBookings();
      const all = res.data || [];

      setStats({
        total: all.length,
        pending: all.filter(b => b.status === "PENDING").length,
        approved: all.filter(b => b.status === "APPROVED").length,
        rejected: all.filter(b => b.status === "REJECTED").length,
      });
    } catch (err) {
      console.log("Failed to load stats");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
        <div className="card">
          <h2>Staff Dashboard 👨‍🏫</h2>
          <p>Welcome, <b>{user?.name}</b></p>
        </div>

        <div className="grid">
          <div className="card stat"><h3>Total Requests</h3><p>{stats.total}</p></div>
          <div className="card stat orange"><h3>Pending Approvals</h3><p>{stats.pending}</p></div>
          <div className="card stat green"><h3>Approved</h3><p>{stats.approved}</p></div>
          <div className="card stat red"><h3>Rejected</h3><p>{stats.rejected}</p></div>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button onClick={() => navigate("/staff/bookings")}>Review Student Requests</button>
            <button onClick={() => navigate("/staff/resources")}>View Resources</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}