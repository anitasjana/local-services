import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../App.css";
import api from "../services/api";

function ProviderProfile() {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await api.get(`/providers/${id}`);
        setProvider(response.data.provider || response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load provider.");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (loading) return <p>Loading provider profile...</p>;
  if (error) return <p>{error}</p>;
  if (!provider) return <p>Provider not found.</p>;

  const providerName = provider.user?.name || provider.name || "Provider";
  const serviceName =
    provider.service?.name || provider.service?.title || "Local service";

  return (
    <div className="nl-subpage">
      <header className="nl-subnav">
        <Link to="/" className="nl-logo">
          <span className="nl-logo-icon"></span> Nearlink
        </Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/categories">Find services</Link>
          <Link to="/signup">Become a provider</Link>
          <Link to="/login" className="nl-login">Log in</Link>
          <Link to="/signup" className="nl-signup">Sign up</Link>
        </nav>
      </header>

      <main className="nl-profile-main">
        <p className="nl-breadcrumb">
          <Link to="/">Home</Link> › Services › Provider
        </p>

        <section className="nl-profile-banner">
          <div className="nl-avatar"></div>

          <div className="nl-profile-info">
            <h1>{providerName}</h1>
            <p>
              {serviceName} · {provider.experience || 0} years experience
            </p>
            <p>Service area: {provider.location || "Not specified"}</p>
            <p>
              {provider.isAvailable ? "Available" : "Currently unavailable"}
            </p>
            <small>Provider ID: {provider._id}</small>
          </div>

          <div className="nl-profile-actions">
            <Link
              to={`/booking?provider=${provider._id}`}
              className="nl-primary-btn"
            >
              Book now
            </Link>
            <button className="nl-outline-btn" type="button">
              Report provider
            </button>
          </div>
        </section>

        <div className="nl-profile-layout">
          <div className="nl-profile-left">
            <section className="nl-white-card">
              <h2>About Provider</h2>
              <p>{provider.bio || "No description available."}</p>
            </section>

            <section className="nl-white-card">
              <h2>Services</h2>
              <div className="nl-service-row">
                <span>{serviceName}</span>
                <strong>₹{provider.price || 0}</strong>
              </div>
            </section>

            <section className="nl-white-card nl-reviews">
              <h2>Reviews</h2>
              <p>Reviews will be available here once the review feature is connected.</p>
            </section>
          </div>

          <aside className="nl-white-card nl-slot-card">
            <h2>Book a slot</h2>
            <p>Estimated price</p>

            <div className="nl-price-row">
              <span>Starting price</span>
              <strong>₹{provider.price || 0}</strong>
            </div>

            <Link
              to={`/booking?provider=${provider._id}`}
              className="nl-primary-btn nl-full-btn"
            >
              Continue to booking
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

export default ProviderProfile;