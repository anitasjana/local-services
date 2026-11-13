import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import AdminContent from "../components/AdminContent.jsx";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Overview");
  const [error, setError] = useState("");

  const storedUser = JSON.parse(
    localStorage.getItem("nearlink_user") || "{}"
  );

  const adminName = storedUser.name || "Admin";
  const adminEmail = storedUser.email || "Administrator";

  const logout = () => {
    sessionStorage.removeItem("nearlink_token");
    sessionStorage.removeItem("nearlink_user");

    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setError={setError}
          logout={logout}
        />
      </aside>

      <div className="admin-main-area">
        <Topbar
          adminName={adminName}
          adminEmail={adminEmail}
        />

        <AdminContent />
      </div>
    </div>
  );
}

export default AdminDashboard;