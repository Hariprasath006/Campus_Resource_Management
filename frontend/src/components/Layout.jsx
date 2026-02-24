import Sidebar from "./Sidebar";
import { getUser, logout } from "../utils/auth";

export default function Layout({ children }) {
  const user = getUser();

  return (
    <div className="app">
      <Sidebar role={user?.role} />

      <div className="content">
        <div className="topbar">
          <div className="user-info">
            {user?.name} <span className="role-badge">{user?.role}</span>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
        {children}
      </div>
    </div>
  );
}