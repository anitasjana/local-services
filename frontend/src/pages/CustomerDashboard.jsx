
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Dashboard.css";
import api from "../services/api";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        const data = response.data.bookings || response.data;
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const activeBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        ["pending", "accepted"].includes(booking.status)
      ),
    [bookings]
  );

  const completedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "completed"),
    [bookings]
  );

  const visibleBookings = useMemo(() => {
    if (filter === "active") return activeBookings;
    if (filter === "completed") return completedBookings;
    return bookings;
  }, [bookings, filter, activeBookings, completedBookings]);

  const totalValue = bookings.reduce(
    (total, booking) => total + (Number(booking.price) || 0),
    0
  );

  const getProviderName = (booking) =>
    booking.provider?.user?.name ||
    booking.provider?.name ||
    "Provider";

  const getServiceName = (booking) =>
    booking.service?.name ||
    booking.service?.title ||
    "Service";

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Requested",
      accepted: "Accepted",
      rejected: "Rejected",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return labels[status] || status || "Unknown";
  };

  const getPaymentLabel = (method) => {
    const labels = {
      cash: "Cash",
      online: "Online",
      escrow: "Escrow",
    };

    return labels[method] || method || "Not specified";
  };

  const formatDate = (date) => {
    if (!date) return "Date not set";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("nearlink_token");
    localStorage.removeItem("nearlink_user");
    navigate("/login");
  };

  const openChat = (booking) => {
    navigate(`/chat?booking=${booking._id}`);
  };

  const openReview = (booking) => {
    navigate(`/write-review?booking=${booking._id}`);
  };

  return (
    <div className="dash-page">
      {/* Navbar */}
      <header className="dash-navbar">
        <Link to="/" className="dash-logo">
          <span></span>
          Nearlink
        </Link>

        <nav>
          <Link to="/customer-dashboard">Customer</Link>
          <Link to="/provider-dashboard">Provider</Link>
          <Link to="/login?role=admin">Admin</Link>
          <span className="avatar"></span>
          <button className="outline-btn" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>

      <main className="dash-layout">
        {/* Sidebar */}
        <aside className="dash-sidebar">
          <a className="active" href="#my-bookings">My bookings</a>
          <a href="#active-bookings">Active bookings</a>
          <a href="#completed-bookings">Completed bookings</a>
          <a href="#payment-history">Payment history</a>
          <a href="#my-reviews">My reviews</a>
          <a href="#saved-providers">Saved providers</a>
          <a href="#report-support">Report / support</a>
          <Link to="/chat">Messages</Link>
        </aside>

        {/* Main content */}
        <section className="dash-content">
          {/* Welcome */}
          <div className="customer-welcome">
            <div>
              <h1>Welcome back!</h1>
              <p>Manage your bookings, payments and reviews in one place.</p>
            </div>

            <div className="action-row">
              <Link to="/categories" className="outline-btn">
                Browse categories
              </Link>
              <Link to="/categories" className="orange-btn">
                Find services
              </Link>
            </div>
          </div>

          {error && <p className="dashboard-error">{error}</p>}

          {/* Stats */}
          <div className="stat-grid">
            <div className="stat-card">
              <span>Active bookings</span>
              <h2>{activeBookings.length}</h2>
            </div>

            <div className="stat-card">
              <span>Completed bookings</span>
              <h2>{completedBookings.length}</h2>
            </div>

            <div className="stat-card">
              <span>Total bookings</span>
              <h2>{bookings.length}</h2>
            </div>
          </div>

          <div className="dash-card">
            <span className="muted-text">Total booking value</span>
            <h2>₹{totalValue.toLocaleString("en-IN")}</h2>
            <p className="muted-text">
              This is the total value of your bookings, not confirmed payments.
            </p>
          </div>

          {/* All bookings */}
          <div className="dash-card" id="my-bookings">
            <div className="provider-heading">
              <h2>My bookings</h2>

              <div className="filter-buttons">
                <button
                  className={filter === "all" ? "selected" : ""}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={filter === "active" ? "selected" : ""}
                  onClick={() => setFilter("active")}
                >
                  Active
                </button>
                <button
                  className={filter === "completed" ? "selected" : ""}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
              </div>
            </div>

            {loading ? (
              <p className="empty-state">Loading bookings...</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Service</th>
                      <th>Provider</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking._id.slice(-6).toUpperCase()}</td>
                        <td>{getServiceName(booking)}</td>
                        <td>{getProviderName(booking)}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              ["pending", "accepted"].includes(booking.status)
                                ? "warning"
                                : ""
                            }`}
                          >
                            {getStatusLabel(booking.status)}
                          </span>
                        </td>
                        <td>{getPaymentLabel(booking.paymentMethod)}</td>
                        <td>
                          {booking.status === "completed" ? (
                            <button
                              className="outline-btn small-btn"
                              onClick={() => openReview(booking)}
                            >
                              Review
                            </button>
                          ) : (
                            <button
                              className="outline-btn small-btn"
                              onClick={() => openChat(booking)}
                            >
                              Chat
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {visibleBookings.length === 0 && (
                  <p className="empty-state">
                    No bookings found. <Link to="/categories">Find services</Link>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Active bookings */}
          <section id="active-bookings">
            <h2 className="section-heading">Active bookings</h2>

            {activeBookings.length === 0 && !loading ? (
              <div className="dash-card">
                <p className="empty-state">You have no active bookings.</p>
              </div>
            ) : (
              activeBookings.map((booking) => (
                <div className="dash-card featured-booking" key={booking._id}>
                  <div className="booking-title-row">
                    <div>
                      <strong>
                        #{booking._id.slice(-6).toUpperCase()} ·{" "}
                        {getServiceName(booking)}
                      </strong>
                      <p>
                        {formatDate(booking.scheduledDate)} ·{" "}
                        {getProviderName(booking)}
                      </p>
                    </div>

                    <span className="status-pill warning">
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="action-row">
                    <button
                      className="primary-btn"
                      onClick={() => openChat(booking)}
                    >
                      Chat with provider
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Completed bookings */}
          <div className="dash-card" id="completed-bookings">
            <h2>Completed bookings</h2>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Service</th>
                    <th>Provider</th>
                    <th>Payment method</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {completedBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking._id.slice(-6).toUpperCase()}</td>
                      <td>{getServiceName(booking)}</td>
                      <td>{getProviderName(booking)}</td>
                      <td>{getPaymentLabel(booking.paymentMethod)}</td>
                      <td>
                        <button
                          className="outline-btn small-btn"
                          onClick={() => openReview(booking)}
                        >
                          Write review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && completedBookings.length === 0 && (
                <p className="empty-state">No completed bookings yet.</p>
              )}
            </div>
          </div>

          {/* Payment history */}
          <div className="dash-card" id="payment-history">
            <h2>Payment history</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Booking</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Payment status</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        {booking.scheduledDate
                          ? new Date(booking.scheduledDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>{booking._id.slice(-6).toUpperCase()}</td>
                      <td>{getPaymentLabel(booking.paymentMethod)}</td>
                      <td>₹{Number(booking.price || 0).toLocaleString("en-IN")}</td>
                      <td>Mock payment</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && bookings.length === 0 && (
                <p className="empty-state">No payment records available.</p>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="dash-card" id="my-reviews">
            <div className="provider-heading">
              <h2>My reviews</h2>
              <Link to="/write-review" className="primary-btn">
                Write a review
              </Link>
            </div>
            <p className="empty-state">
              Your submitted reviews will appear here when the review API is connected.
            </p>
          </div>

          {/* Saved providers */}
          <div className="dash-card" id="saved-providers">
            <div className="provider-heading">
              <h2>Saved providers</h2>
              <Link to="/providers" className="outline-btn">
                Find providers
              </Link>
            </div>
            <p className="empty-state">
              You haven't saved any providers yet. Saved-provider functionality
              will be added with its backend API.
            </p>
          </div>

          {/* Support */}
          <div className="dash-card" id="report-support">
            <h2>Report / support</h2>
            <p className="empty-state">
              Support reporting will be available after the support API is added.
            </p>
            <Link to="/chat" className="outline-btn">
              Open messages
            </Link>
          </div>
        </section>
      </main>

      <footer className="chat-footer">
        <strong>Nearlink · Trusted local services</strong>
        <span>About · Contact · Privacy Policy · Terms</span>
      </footer>
    </div>
  );
}

export default CustomerDashboard;
