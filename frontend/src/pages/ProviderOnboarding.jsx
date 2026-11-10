
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ProviderOnboarding.css";

function ProviderOnboarding() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("nearlink_user") || "{}"
  );

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    service: "",
    experience: "",
    location: "",
    price: "",
    bio: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        const data = response.data.services || response.data;
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load services."
        );
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.service) {
      setError("Please select your service category.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/providers/profile", {
        ...form,
        experience: Number(form.experience),
        price: Number(form.price),
      });

      // Remove the temporary signup session.
      // Provider must log in again after admin approval.
      localStorage.removeItem("nearlink_token");
      localStorage.removeItem("nearlink_user");

      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to submit your application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nearlink_token");
    localStorage.removeItem("nearlink_user");
    navigate("/login");
  };

  if (submitted) {
    return (
      <div className="onboarding-page">
        <header className="onboarding-nav">
          <Link to="/" className="onboarding-logo">
            <span /> Nearlink
          </Link>
        </header>

        <main className="onboarding-success">
          <div className="success-icon">✓</div>
          <span className="onboarding-eyebrow">Application submitted</span>
          <h1>Your profile is under review</h1>
          <p>
            Thank you for applying to become a Nearlink service provider.
            Our admin team will review your details. You can log in after
            your application is approved.
          </p>
          <span className="pending-label">Pending verification</span>
          <button
            className="onboarding-primary"
            onClick={() => navigate("/login")}
          >
            Go to login
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <header className="onboarding-nav">
        <Link to="/" className="onboarding-logo">
          <span /> Nearlink
        </Link>

        <button className="onboarding-logout" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <main className="onboarding-container">
        <div className="onboarding-heading">
          <span className="onboarding-eyebrow">Provider registration</span>
          <h1>Become a Nearlink provider</h1>
          <p>
            Complete your service profile. Our team will verify your
            application before you can receive bookings.
          </p>
        </div>

        <div className="onboarding-progress">
          <span className="progress-step active">1. Personal</span>
          <span className="progress-step active">2. Service</span>
          <span className="progress-step active">3. Experience</span>
          <span className="progress-step">4. Submit</span>
        </div>

        <div className="onboarding-layout">
          <form className="onboarding-form" onSubmit={handleSubmit}>
            <section className="onboarding-card">
              <div className="onboarding-section-title">
                <span>01</span>
                <div>
                  <h2>Personal details</h2>
                  <p>Your signup information</p>
                </div>
              </div>

              <div className="onboarding-fields two-columns">
                <label>
                  Full name
                  <input value={savedUser.name || ""} readOnly />
                </label>

                <label>
                  Phone
                  <input value={savedUser.phone || ""} readOnly />
                </label>

                <label className="full-field">
                  Email address
                  <input value={savedUser.email || ""} readOnly />
                </label>
              </div>
            </section>

            <section className="onboarding-card">
              <div className="onboarding-section-title">
                <span>02</span>
                <div>
                  <h2>Service category</h2>
                  <p>Choose the service you want to provide</p>
                </div>
              </div>

              <label>
                Select service
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  disabled={loadingServices}
                >
                  <option value="">
                    {loadingServices ? "Loading services..." : "Choose a service"}
                  </option>

                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>
            </section>

            <section className="onboarding-card">
              <div className="onboarding-section-title">
                <span>03</span>
                <div>
                  <h2>Service area</h2>
                  <p>Where can customers book your service?</p>
                </div>
              </div>

              <label>
                Main city / service location
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Kolkata, Salt Lake"
                  required
                />
              </label>
            </section>

            <section className="onboarding-card">
              <div className="onboarding-section-title">
                <span>04</span>
                <div>
                  <h2>Experience and introduction</h2>
                  <p>Help customers understand your work</p>
                </div>
              </div>

              <label>
                Years of experience
                <input
                  type="number"
                  name="experience"
                  min="0"
                  max="60"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  required
                />
              </label>

              <label>
                About your service
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Describe your skills, experience and the work you provide..."
                  rows="5"
                  maxLength="500"
                />
                <small>{form.bio.length}/500 characters</small>
              </label>
            </section>

            <section className="onboarding-card">
              <div className="onboarding-section-title">
                <span>05</span>
                <div>
                  <h2>Pricing</h2>
                  <p>Set your starting service price</p>
                </div>
              </div>

              <label>
                Starting price (₹)
                <input
                  type="number"
                  name="price"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                />
              </label>
              <p className="onboarding-hint">
                You can discuss the final price with the customer before
                confirming a job.
              </p>
            </section>

            {error && <p className="onboarding-error">{error}</p>}

            <section className="onboarding-submit-card">
              <h2>Submit for verification</h2>
              <p>
                Please check your information before submitting.
                Your profile will remain private until it is approved.
              </p>

              <button
                type="submit"
                className="onboarding-primary"
                disabled={submitting || loadingServices}
              >
                {submitting ? "Submitting..." : "Submit for verification"}
              </button>
            </section>
          </form>

          <aside className="onboarding-sidebar">
            <div className="onboarding-side-card">
              <h3>Application progress</h3>
              <div className="onboarding-progress-track">
                <span />
              </div>
              <p>Complete your profile and submit it for review.</p>
            </div>

            <div className="onboarding-side-card">
              <h3>What happens next?</h3>
              <ol>
                <li>You submit your service profile.</li>
                <li>Our admin team reviews your application.</li>
                <li>You receive approval or rejection.</li>
                <li>After approval, you can log in and receive bookings.</li>
              </ol>
            </div>

            <div className="onboarding-help-card">
              <strong>Need help?</strong>
              <p>Make sure your service and contact details are correct.</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="onboarding-footer">
        <strong>Nearlink · Trusted local services</strong>
        <span>About · Contact · Privacy Policy · Terms</span>
      </footer>
    </div>
  );
}

export default ProviderOnboarding;
