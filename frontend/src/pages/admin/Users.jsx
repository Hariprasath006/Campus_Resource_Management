// pages/admin/Users.jsx

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    if (!form.name?.trim() || !form.email?.trim() || !form.password?.trim()) {
      setError("Name, email and password are required");
      return;
    }

    try {
      await createUser({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone?.trim() || null,
        role: form.role || "STUDENT",
      });
      alert("User created successfully");
      setForm({});
      setError("");
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      alert("User deleted");
      loadUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const startEdit = (user) => {
    setEditingUser({ ...user });
    setError("");
  };

  const handleUpdate = async () => {
    try {
      await updateUser(editingUser.id, editingUser);
      alert("User updated");
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      setError("Update failed");
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ marginBottom: "24px" }}>Manage Users</h2>

        {/* Create Form */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginBottom: "32px",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>Add New User</h3>

          {error && <div style={{ color: "#ef4444", marginBottom: "16px" }}>{error}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <input
              placeholder="Name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
            <input
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
            <input
              placeholder="Phone"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password || ""}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
            <select
              value={form.role || "STUDENT"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            >
              <option value="STUDENT">Student</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
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
              fontWeight: 500,
            }}
          >
            Create User
          </button>
        </div>

        {/* Users Table */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <h3 style={{ padding: "16px", margin: 0, borderBottom: "1px solid #e5e7eb" }}>
            All Users
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                <th style={{ padding: "14px 16px", fontWeight: 600 }}>Name</th>
                <th style={{ padding: "14px 16px", fontWeight: 600 }}>Email</th>
                <th style={{ padding: "14px 16px", fontWeight: 600 }}>Role</th>
                <th style={{ padding: "14px 16px", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <td style={{ padding: "14px 16px" }}>{u.name || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>{u.email || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "999px",
                        fontSize: "0.875rem",
                        background:
                          u.role === "ADMIN" ? "#dbeafe" :
                          u.role === "STAFF" ? "#fef3c7" : "#d1fae5",
                        color:
                          u.role === "ADMIN" ? "#2563eb" :
                          u.role === "STAFF" ? "#b45309" : "#059669",
                      }}
                    >
                      {u.role || "STUDENT"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button
                      onClick={() => startEdit(u)}
                      style={{
                        background: "#f59e0b",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        marginRight: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
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

        {/* Edit Form */}
        {editingUser && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "white",
                padding: "32px",
                borderRadius: "12px",
                width: "500px",
                maxWidth: "90%",
              }}
            >
              <h3 style={{ marginBottom: "24px" }}>Edit User</h3>

              <div style={{ display: "grid", gap: "16px" }}>
                <input
                  placeholder="Name"
                  value={editingUser.name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
                <input
                  placeholder="Email"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
                <input
                  placeholder="Phone"
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
                <select
                  value={editingUser.role || "STUDENT"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                >
                  <option value="STUDENT">Student</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <select
                  value={editingUser.status || "ACTIVE"}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setEditingUser(null)}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}