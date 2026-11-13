
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "../App.css";
import api from "../services/api";

function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const providerId = searchParams.get("provider");

  const [provider, setProvider] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [payment, setPayment] = useState("cash");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch provider details
  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) {
        setError("Provider ID is missing. Please select a provider first.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/providers/${providerId}`);
        setProvider(response.data.provider || response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load provider.");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  // Create booking
  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    // Read login information from this tab's session
    let user = null;
    const token = sessionStorage.getItem("nearlink_token");

    try {
      user = JSON.parse(
        sessionStorage.getItem("nearlink_user") || "null"
      );
    } catch {
      user = null;
    }

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      setError("Please log in with a customer account to create a booking.");
      return;
    }

    if (!provider || !date || !address.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const scheduledDate = new Date(
        `${date}T${time}:00`
      ).toISOString();

      const response = await api.post("/bookings", {
        provider: provider._id,
        scheduledDate,
        address: address.trim(),
        description: description.trim(),
        paymentMethod: payment,
      });

      alert(response.data.message || "Booking created successfully!");

      navigate("/customer-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Booking failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading booking details...</p>;
  }

  if (error && !provider) {
    return (
      <div className="nl-subpage">
        <p>{error}</p>
        <Link to="/providers">Back to providers</Link>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="nl-subpage">
        <p>Provider details could not be loaded.</p>
        <Link to="/providers">Back to providers</Link>
      </div>
    );
  }

  return (
    <div className="nl-subpage">
      <header className="nl-subnav">
        <Link to="/" className="nl-logo">
          <span className="nl-logo-icon"></span>
          Nearlink
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/categories">Find services</Link>
          <Link to="/signup">Become a provider</Link>
          <Link to="/login" className="nl-login">Log in</Link>
          <Link to="/signup" className="nl-signup">Sign up</Link>
        </nav>
      </header>

      <main className="nl-booking-main">
        <div className="nl-booking-steps">
          <span>1 Service</span>
          <span>2 Date and time</span>
          <span>3 Address</span>
          <span className="active">4 Payment</span>
        </div>

        <div className="nl-booking-layout">
          <form
            className="nl-white-card nl-booking-form"
            onSubmit={handleBooking}
          >
            <h1>Book your service</h1>

            <label>Service</label>
            <input
              type="text"
              value={
                provider.service?.name ||
                provider.service?.title ||
                "Local service"
              }
              readOnly
            />

            <div className="nl-form-row">
              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Time</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>

            <label>Address</label>
            <input
              type="text"
              placeholder="House, street, area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <label>Describe the problem</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the service you need..."
            />

            <h3>Payment method</h3>

            <div className="nl-payment-options">
              {[
                ["cash", "Cash"],
                ["online", "Online"],
                ["escrow", "Escrow (held until job done)"],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={payment === value}
                    onChange={() => setPayment(value)}
                  />
                  {label}
                </label>
              ))}
            </div>

            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="nl-primary-btn nl-full-btn"
              disabled={submitting}
            >
              {submitting ? "Creating booking..." : "Confirm booking"}
            </button>
          </form>

          <aside className="nl-white-card nl-booking-summary">
            <h2>Summary</h2>

            <div>
              <span>Provider</span>
              <strong>
                {provider.user?.name || provider.name || "Provider"}
              </strong>
            </div>

            <div>
              <span>Service</span>
              <strong>
                {provider.service?.name ||
                  provider.service?.title ||
                  "Service"}
              </strong>
            </div>

            <div>
              <span>Estimated price</span>
              <strong>₹{provider.price || 0}</strong>
            </div>

            <Link
              to={`/provider/${provider._id}`}
              className="nl-outline-btn nl-full-btn"
            >
              Back to provider
            </Link>
          </aside>
        </div>
      </main>

      <footer className="nl-subfooter">
        <strong>Nearlink · Trusted local services</strong>
        <span>About · Contact · Privacy Policy · Terms</span>
      </footer>
    </div>
  );
}

export default Booking;
