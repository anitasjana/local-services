
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Dashboard.css";
import api from "../services/api";

export default function ProviderDashboard() {
  const navigate = useNavigate();

  // Logged-in provider information
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("nearlink_user") || "{}");
    } catch {
      return {};
    }
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  // Fetch provider bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        const data = response.data.bookings || response.data;

        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load booking requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Pending bookings
  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === "pending"),
    [bookings]
  );

  // Accepted bookings
  const acceptedBookings = useMemo(
    () => bookings.filter((b) => b.status === "accepted"),
    [bookings]
  );

  // Completed bookings
  const completedBookings = useMemo(
    () => bookings.filter((b) => b.status === "completed"),
    [bookings]
  );

  // Total completed booking value
  const earnings = completedBookings.reduce(
    (total, booking) => total + (Number(booking.price) || 0),
    0
  );

  // Update booking status
  const updateBookingStatus = async (bookingId, status) => {
    setError("");
    setUpdatingId(bookingId);

    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, {
        status,
      });

      const updatedBooking = response.data.booking || response.data;

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, ...updatedBooking, status }
            : booking
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || `Unable to ${status} this booking.`
      );
    } finally {
      setUpdatingId("");
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("nearlink_token");
    sessionStorage.removeItem("nearlink_user");
    navigate("/login");
  };

  // Customer name
  const getCustomerName = (booking) =>
    booking.customer?.name ||
    booking.customer?.user?.name ||
    "Customer";

  // Service name
  const getServiceName = (booking) =>
    booking.service?.name ||
    booking.service?.title ||
    "Service";

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date not specified";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Payment method
  const getPaymentName = (method) =>
    ({ cash: "Cash", online: "Online", escrow: "Escrow" }[method] ||
      method ||
      "Not specified");

  return (
    <div className="dash-page">

      {/* Navbar */}
      <header className="dash-navbar">
        <Link to="/" className="dash-logo">
          <span></span>
          Nearlink
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/categories">Find services</Link>
          <Link to="/provider-dashboard">Provider</Link>

          {/* Provider profile image or initial */}
          {user.profileImage ? (
            <img
              src={`http://localhost:5000${user.profileImage}`}
              alt={user.name || "Provider"}
              className="avatar"
            />
          ) : (
            <span className="avatar">
              {user.name?.charAt(0).toUpperCase() || "P"}
            </span>
          )}

          <button className="outline-btn" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>

      <main className="dash-layout">

        {/* Sidebar */}
        <aside className="dash-sidebar">
          <a className="active" href="#requests">
            Booking requests
          </a>

          <a href="#accepted">Accepted jobs</a>
          <a href="#earnings">Earnings</a>
          <a href="#completed">Completed jobs</a>

          <Link to="/chat">Messages</Link>
          <Link to="/provider-profile">Edit profile</Link>
        </aside>

        {/* Main content */}
        <section className="dash-content">

          {/* Welcome */}
          <div className="customer-welcome">
            <div>
              <h1>Welcome back, {user.name || "Provider"}!</h1>
              <p>
                Manage your booking requests, jobs and earnings in one place.
              </p>
            </div>

            <div className="action-row">
              <Link to="/categories" className="outline-btn">
                Find services
              </Link>

              <Link to="/provider-profile" className="orange-btn">
                Edit profile
              </Link>
            </div>
          </div>

          <div className="provider-heading">
            <h2>Provider dashboard</h2>
            <span className="status-pill">Provider account</span>
          </div>

          {error && <p className="dashboard-error">{error}</p>}

          {/* Stats */}
          <div className="stat-grid">
            <div className="stat-card">
              <span>New requests</span>
              <h2>{pendingBookings.length}</h2>
            </div>

            <div className="stat-card">
              <span>Accepted</span>
              <h2>{acceptedBookings.length}</h2>
            </div>

            <div className="stat-card">
              <span>Completed</span>
              <h2>{completedBookings.length}</h2>
            </div>
          </div>

          {/* Earnings */}
          <div className="dash-card earnings-card" id="earnings">
            <span>Completed booking value</span>

            <h2>₹{earnings.toLocaleString("en-IN")}</h2>

            <p className="muted-text">
              Calculated from completed bookings; this is not a verified payout.
            </p>
          </div>

          {/* Pending requests */}
          <div className="dash-card" id="requests">
            <h3>New booking requests</h3>

            {loading && (
              <p className="empty-state">Loading requests...</p>
            )}

            {!loading && pendingBookings.length === 0 && (
              <p className="empty-state">No new booking requests.</p>
            )}

            {pendingBookings.map((booking) => (
              <div className="request-row" key={booking._id}>
                <div>
                  <strong>{getServiceName(booking)}</strong>

                  <p>
                    {getCustomerName(booking)} ·{" "}
                    {formatDate(booking.scheduledDate)}
                  </p>

                  <p>
                    {getPaymentName(booking.paymentMethod)} · ₹
                    {Number(booking.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="action-row">
                  <button
                    className="primary-btn"
                    disabled={updatingId === booking._id}
                    onClick={() =>
                      updateBookingStatus(booking._id, "accepted")
                    }
                  >
                    {updatingId === booking._id ? "Updating..." : "Accept"}
                  </button>

                  <button
                    className="outline-btn"
                    disabled={updatingId === booking._id}
                    onClick={() =>
                      updateBookingStatus(booking._id, "rejected")
                    }
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Accepted jobs */}
          <div className="dash-card" id="accepted">
            <h3>Accepted jobs</h3>

            {acceptedBookings.length === 0 && !loading && (
              <p className="empty-state">No accepted jobs.</p>
            )}

            {acceptedBookings.map((booking) => (
              <div className="request-row" key={booking._id}>
                <div>
                  <strong>{getServiceName(booking)}</strong>

                  <p>
                    {getCustomerName(booking)} ·{" "}
                    {formatDate(booking.scheduledDate)}
                  </p>

                  <span className="status-pill warning">
                    Accepted
                  </span>
                </div>

                <div className="action-row">
                  <button
                    className="primary-btn"
                    disabled={updatingId === booking._id}
                    onClick={() =>
                      updateBookingStatus(booking._id, "completed")
                    }
                  >
                    {updatingId === booking._id
                      ? "Updating..."
                      : "Mark completed"}
                  </button>

                  <button
                    className="outline-btn"
                    onClick={() =>
                      navigate(`/chat?booking=${booking._id}`)
                    }
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed jobs */}
          <div className="dash-card" id="completed">
            <h3>Completed jobs</h3>

            {completedBookings.length === 0 && !loading && (
              <p className="empty-state">No completed jobs yet.</p>
            )}

            {completedBookings.map((booking) => (
              <div className="request-row" key={booking._id}>
                <div>
                  <strong>{getServiceName(booking)}</strong>

                  <p>
                    {getCustomerName(booking)} ·{" "}
                    {formatDate(booking.scheduledDate)}
                  </p>
                </div>

                <span className="status-pill">Completed</span>
              </div>
            ))}
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="chat-footer">
        <strong>Nearlink · Trusted local services</strong>
        <span>About · Contact · Privacy Policy · Terms</span>
      </footer>
    </div>
  );
}
