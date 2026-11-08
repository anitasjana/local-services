
import { useState } from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([
    { id: "BK-0001", service: "Fan installation", status: "In progress", payment: "Cash" },
    { id: "BK-0000", service: "Deep cleaning", status: "Completed", payment: "Paid" },
  ]);

  const completeJob = (id) => {
    setBookings((prev) =>
      prev.map((b) => b.id === id ? { ...b, status: "Completed" } : b)
    );
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
          {["My bookings", "Find services", "Saved providers", "Payment history", "My reviews", "Report / support"].map((item, i) => (
            <Link key={item} className={i === 0 ? "active" : ""} to={i === 1 ? "/categories" : "#"}>
              {item}
            </Link>
          ))}
        </aside>

        <section className="dash-content">
          <div className="success-banner">
            <strong>Booking confirmed.</strong> Your provider will accept shortly.
          </div>

          <div className="stat-grid">
            <div className="stat-card"><span>Active</span><h2>{bookings.filter(b => b.status !== "Completed").length}</h2></div>
            <div className="stat-card"><span>Completed</span><h2>{bookings.filter(b => b.status === "Completed").length + 7}</h2></div>
            <div className="stat-card"><span>Saved</span><h2>3</h2></div>
          </div>

          <div className="dash-card featured-booking">
            <h3>Booking BK-0001</h3>
            <div className="status-flow">
              {["Requested", "Accepted", "In progress", "Completed", "Reviewed"].map((s) => (
                <span key={s} className={`status-pill ${s === "In progress" ? "warning" : ""}`}>{s}</span>
              ))}
            </div>
            <div className="action-row">
              <Link className="primary-btn" to="/chat">Chat with provider</Link>
              <button className="outline-btn">Reschedule</button>
              <button className="orange-btn" onClick={() => completeJob("BK-0001")}>Mark job complete</button>
            </div>
          </div>

          <div className="dash-card">
            <h3>All bookings</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Service</th><th>Status</th><th>Payment</th><th></th></tr></thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td><td>{b.service}</td>
                      <td><span className={`status-pill ${b.status === "In progress" ? "warning" : ""}`}>{b.status}</span></td>
                      <td>{b.payment}</td>
                      <td>{b.status === "Completed" && <button className="outline-btn">Write review</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
