import React from "react";
import { Link } from "react-router-dom";

const menuItems = [
  "Overview",
  "Provider verification",
  "Bookings",
  "Reviews and disputes",
  "Revenue",
  "Categories",
  "Daily checklist",
];

function Sidebar({ activeTab, setActiveTab, setError, logout }) {
  return (
    <aside className="admin-sidebar">
      <Link to="/" className="admin-brand">
        <span className="brand-square"></span>
        Nearlink Admin
      </Link>

      <p className="admin-menu-label">MENU</p>

      <nav className="admin-menu">
        {menuItems.map((item) => (
          <button
            key={item}
            className={activeTab === item ? "active" : ""}
            onClick={() => {
              setActiveTab(item);

              const sectionId = item
                .toLowerCase()
                .replaceAll(" ", "-");

              if (item === "Overview") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                document
                  .getElementById(sectionId)
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      <p className="admin-menu-label support-label">SUPPORT</p>

      <nav className="admin-menu">
        <button onClick={() => setError("Messaging module is not connected yet.")}>
          Messages
        </button>
        <Link to="/customer" className="admin-menu-link">
          Customer view
        </Link>
        <Link to="/provider" className="admin-menu-link">
          Provider view
        </Link>
        <button onClick={logout}>Logout</button>
      </nav>
    </aside>
  );
}

export default Sidebar;
