import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← add this
import { createUser } from "../api/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "STUDENT", // default value
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    
    // Basic client-side validation
    if (!form.name.trim()) return setError("Name is required");
    if (!form.email.trim()) return setError("Email is required");
    if (!form.email.includes("@")) return setError("Invalid email format");
    if (!form.password.trim()) return setError("Password is required");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");

    setIsLoading(true);

    try {
      await createUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        password: form.password,
        role: form.role,
      });

      alert("✅ Account Created Successfully!");
      navigate("/"); // better than window.location.href
    } catch (err) {
      const msg = err.response?.data?.message 
        || err.response?.data?.error 
        || "Signup failed. Please try again.";
      setError(msg);
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <h2>Sign Up</h2>

        {error && (
          <div style={{ color: "#ef4444", marginBottom: "16px", fontWeight: 500 }}>
            {error}
          </div>
        )}

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="STUDENT">Student</option>
          <option value="STAFF">Staff</option>
          {/* <option value="ADMIN">Admin</option> ← usually not self-register */}
        </select>

        <button
          onClick={handleSignup}
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Creating..." : "Create Account"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}