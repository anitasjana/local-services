
import { useState } from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";

export default function ProviderDashboard() {
  const [requests, setRequests] = useState([
    { id: 1, service: "Fan installation", customer: "Customer name", time: "Tomorrow 10:00 AM", payment: "Cash" },
    { id: 2, service: "Wiring repair", customer: "Customer name", time: "Friday 2:00 PM", payment: "Online" },
  ]);

  const [accepted, setAccepted] = useState(3);
  const [declined, setDeclined] = useState([]);

  const updateRequest = (id, action) => {
    if (action === "accept") setAccepted((n) => n + 1);
    if (action === "decline") setDeclined((prev) => [...prev, id]);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="dash-page">
      <header className="dash-navbar">
        <Link to="/" className="dash-logo"><span /> Nearlink</Link>
        <nav>
          <Link to="/customer-dashboard">Customer</Link>
          <Link to="/provider-dashboard">Provider</Link>
          <Link to="/admin">Admin</Link>
          <span className="avatar" />
          <Link className="outline-btn" to="/login">Log out</Link>
        </nav>
      </header>

      <main className="dash-layout">
        <aside className="dash-sidebar">
          {["Booking requests", "Accepted jobs", "Earnings", "Reviews", "Edit profile"].map((item, i) => (
            <a href="#" key={item} className={i === 0 ? "active" : ""}>{item}</a>
          ))}
        </aside>

        <section className="dash-content">
          <div className="provider-heading">
            <h2>Provider dashboard</h2>
            <span className="status-pill">Verification: Approved</span>
          </div>

          <div className="stat-grid">
            <div className="stat-card"><span>New requests</span><h2>{requests.length}</h2></div>
            <div className="stat-card"><span>Accepted</span><h2>{accepted}</h2></div>
            <div className="stat-card"><span>Completed</span><h2>120</h2></div>
          </div>

          <div className="dash-card earnings-card">
            <span>Earnings</span>
            <h2>₹[X]</h2>
          </div>

          <div className="dash-card">
            <div className="progress-heading"><strong>Profile completeness</strong><span>80%</span></div>
            <div className="progress-track"><div /></div>
          </div>

          <div className="dash-card">
            <h3>New booking requests</h3>
            {requests.length === 0 && <p className="empty-state">No new booking requests.</p>}
            {requests.map((r) => (
              <div className="request-row" key={r.id}>
                <div>
                  <strong>{r.service}</strong>
                  <p>{r.customer} · {r.time} · {r.payment}</p>
                </div>
                <div className="action-row">
                  <button className="primary-btn" onClick={() => updateRequest(r.id, "accept")}>Accept</button>
                  <button className="outline-btn" onClick={() => updateRequest(r.id, "decline")}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
