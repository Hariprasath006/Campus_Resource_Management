import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getBookings } from "../../api/api";
import { getUser } from "../../utils/auth";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "STUDENT") navigate("/");
  }, [user, navigate]);

  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const loadStats = async () => {
    try {
      const res = await getBookings();
      const my = (res.data || []).filter(b => b.userId === user.id);

      setStats({
        total: my.length,
        pending: my.filter(b => b.status === "PENDING").length,
        approved: my.filter(b => b.status === "APPROVED").length,
        rejected: my.filter(b => b.status === "REJECTED").length,
      });
    } catch (err) {
      console.log("Failed to load stats");
    }
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <Layout>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
        <div className="card">
          <h2>Student Dashboard 🎓</h2>
          <p>Welcome back, <b>{user?.name}</b></p>
        </div>

        <div className="grid">
          <div className="card stat">
            <h3>Total Bookings</h3>
            <p>{stats.total}</p>
          </div>
          <div className="card stat orange">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
          <div className="card stat green">
            <h3>Approved</h3>
            <p>{stats.approved}</p>
          </div>
          <div className="card stat red">
            <h3>Rejected</h3>
            <p>{stats.rejected}</p>
          </div>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button className="primary-btn" onClick={() => navigate("/user/resources")}>
              Book a Resource
            </button>
            <button className="primary-btn" onClick={() => navigate("/user/bookings")}>
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}