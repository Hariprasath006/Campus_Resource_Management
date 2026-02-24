// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ── User / Student ───────────────────────────────────────
import StudentDashboard   from "./pages/user/StudentDashboard";
import StudentResources   from "./pages/user/StudentResources";
import StudentBookings    from "./pages/user/StudentBookings";

// ── Staff ────────────────────────────────────────────────
import StaffDashboard     from "./pages/staff/StaffDashboard";
import StaffResources     from "./pages/staff/StaffResources";
import StaffBookings      from "./pages/staff/StaffBookings";

// ── Admin ────────────────────────────────────────────────
import AdminDashboard     from "./pages/admin/Dashboard";          // ← note: no "Admin" in filename
import AdminUsers         from "./pages/admin/Users";
import AdminResources     from "./pages/admin/Resources";
import AdminBookings      from "./pages/admin/AdminBookings";     // ← has "Admin" prefix

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student */}
        <Route path="/user"            element={<StudentDashboard />} />
        <Route path="/user/resources"  element={<StudentResources />} />
        <Route path="/user/bookings"   element={<StudentBookings />} />

        {/* Staff */}
        <Route path="/staff"           element={<StaffDashboard />} />
        <Route path="/staff/resources" element={<StaffResources />} />
        <Route path="/staff/bookings"  element={<StaffBookings />} />

        {/* Admin */}
        <Route path="/admin"           element={<AdminDashboard />} />
        <Route path="/admin/users"     element={<AdminUsers />} />
        <Route path="/admin/resources" element={<AdminResources />} />
        <Route path="/admin/bookings"  element={<AdminBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;