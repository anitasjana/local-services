
import { useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const [verification, setVerification] = useState("Pending");
  const [reviewStatus, setReviewStatus] = useState("Open");

  const menuItems = [
    "Overview",
    "Provider verification",
    "Bookings",
    "Review moderation",
    "Disputes",
    "Categories",
  ];

  const stats = [
    { title: "Customers", value: "[X]" },
    { title: "Providers", value: "[X]" },
    { title: "Bookings", value: "[X]" },
    { title: "Pending verifications", value: "[X]" },
    { title: "Reports", value: "[X]" },
    { title: "Revenue", value: "₹[X]" },
  ];

  return (
    <div className="admin-page">

      {/* HEADER */}

      <header className="admin-header">

        <Link to="/" className="admin-logo">
          <span></span>
          Nearlink
        </Link>

        <nav className="admin-top-nav">
          <Link to="/customer">Customer</Link>
          <Link to="/provider">Provider</Link>
          <Link to="/admin">Admin</Link>

          <div className="admin-avatar"></div>

          <Link to="/login" className="admin-logout">
            Log out
          </Link>
        </nav>

      </header>


      {/* MAIN DASHBOARD */}

      <main className="admin-main">

        {/* SIDEBAR */}

        <aside className="admin-sidebar">

          <nav className="admin-side-menu">

            {menuItems.map((item) => (
              <button
                key={item}
                className={
                  activeTab === item ? "active" : ""
                }
                onClick={() => setActiveTab(item)}
              >
                {item}
              </button>
            ))}

          </nav>

        </aside>


        {/* DASHBOARD CONTENT */}

        <section className="admin-content">

          <h1>Admin overview</h1>


          {/* STATISTICS CARDS */}

          <div className="admin-stats-grid">

            {stats.map((item) => (
              <div className="admin-stat-card" key={item.title}>

                <span>{item.title}</span>

                <h2>{item.value}</h2>

              </div>
            ))}

          </div>


          {/* PROVIDER VERIFICATION */}

          <section className="admin-white-card verification-card">

            <h2>Pending provider verification</h2>

            <div className="admin-table">

              <div className="admin-table-header verification-grid">
                <strong>Provider</strong>
                <strong>Category</strong>
                <strong>Documents</strong>
                <strong></strong>
              </div>

              <div className="admin-table-row verification-grid">

                <span>Provider name</span>

                <span>Electrician</span>

                <span>Aadhaar, license</span>

                <div className="admin-actions">

                  {verification === "Pending" ? (
                    <>
                      <button
                        className="admin-approve"
                        onClick={() => setVerification("Approved")}
                      >
                        Approve
                      </button>

                      <button
                        className="admin-outline"
                        onClick={() => setVerification("Rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="admin-action-result">
                      {verification}
                    </span>
                  )}

                </div>

              </div>

            </div>

          </section>


          {/* REPORTED REVIEWS AND DISPUTES */}

          <section className="admin-white-card reports-card">

            <h2>Reported reviews and disputes</h2>

            <div className="admin-table">

              <div className="admin-table-header reports-grid">
                <strong>Item</strong>
                <strong>Reported by</strong>
                <strong>Status</strong>
                <strong></strong>
              </div>

              <div className="admin-table-row reports-grid">

                <span>Review RV-0042</span>

                <span>Provider</span>

                <span>
                  <span className={`admin-status ${
                    reviewStatus === "Open" ? "open" : "closed"
                  }`}>
                    {reviewStatus}
                  </span>
                </span>

                <div className="admin-actions">

                  <button
                    className="admin-outline"
                    onClick={() => setReviewStatus("Removed")}
                  >
                    Remove
                  </button>

                  <button
                    className="admin-outline"
                    onClick={() => setReviewStatus("Refunded")}
                  >
                    Refund
                  </button>

                </div>

              </div>

            </div>

          </section>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
