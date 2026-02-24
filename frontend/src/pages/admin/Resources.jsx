import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getResources, createResource, deleteResource } from "../../api/api";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", capacity: "" });
  const [error, setError] = useState("");

  const loadResources = async () => {
    try {
      const res = await getResources();
      setResources(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load resources");
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.type) {
      setError("Name and Type are required");
      return;
    }

    try {
      await createResource({
        name: form.name.trim(),
        type: form.type,
        capacity: form.capacity ? Number(form.capacity) : null,
        status: "AVAILABLE",
      });
      setForm({ name: "", type: "", capacity: "" });
      loadResources();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add resource");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await deleteResource(id);
      loadResources();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
        <h2 style={{ marginBottom: "24px" }}>Manage Resources</h2>

        {/* Add Form */}
        <div style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          marginBottom: "32px",
        }}>
          <h3>Add Resource</h3>
          {error && <p style={{ color: "#ef4444" }}>{error}</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "16px" }}>
            <input
              placeholder="Name (e.g. Lab 101)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px" }}
            />
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px" }}
            >
              <option value="">Select Type</option>
              <option value="LAB">Lab</option>
              <option value="CLASSROOM">Classroom</option>
              <option value="HALL">Hall</option>
            </select>
            <input
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={e => setForm({ ...form, capacity: e.target.value })}
              style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px" }}
            />
          </div>

          <button
            onClick={handleCreate}
            style={{
              marginTop: "20px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Add Resource
          </button>
        </div>

        {/* Resources Table */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}>
          <h3 style={{ padding: "16px", margin: 0, borderBottom: "1px solid #e5e7eb" }}>
            All Resources
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "14px 16px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "14px 16px", textAlign: "left" }}>Type</th>
                <th style={{ padding: "14px 16px", textAlign: "left" }}>Capacity</th>
                <th style={{ padding: "14px 16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "14px 16px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "14px 16px" }}>{r.name || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>{r.type || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>{r.capacity || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      background: r.status === "AVAILABLE" ? "#d1fae5" : "#fee2e2",
                      color: r.status === "AVAILABLE" ? "#059669" : "#dc2626",
                    }}>
                      {r.status || "UNKNOWN"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <button
                      onClick={() => handleDelete(r.id)}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}