import { useState } from "react";
import { login } from "../api/api";

export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: ""
  });

  const handleLogin = async () => {

    /* ✅ FRONTEND VALIDATION 🔥 */
    if (!form.email || !form.password || !form.role) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const res = await login(form);

      console.log("SUCCESS:", res.data);

      const user = res.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role;

      if (role === "STUDENT") window.location.href = "/user";
      if (role === "STAFF") window.location.href = "/staff";
      if (role === "ADMIN") window.location.href = "/admin";

    } catch (err) {

      console.log("FULL ERROR:", err);
      console.log("SERVER ERROR:", err.response?.data);

      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login">
      <div className="card">
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={form.email}   /* ✅ CONTROLLED */
          onChange={e =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}   /* ✅ CONTROLLED */
          onChange={e =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          value={form.role}   /* ✅ CONTROLLED */
          onChange={e =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="">Select Role</option>
          <option value="STUDENT">Student</option>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button onClick={handleLogin}>Login</button>

        <p className="auth-switch">
          Don't have an account?
          <span onClick={() => window.location.href="/signup"}>
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}
