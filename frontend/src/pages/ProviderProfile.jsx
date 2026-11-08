
import { Link, useParams } from "react-router-dom";
import "../App.css";

function ProviderProfile() {
  const { id } = useParams();

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
            <h1>Provider name <span className="nl-verified">Verified</span></h1>
            <p>Electrician · 8 years · Service area: Your city</p>
            <p>★ 4.8 (120 reviews) · Trust Score 92/100</p>
            <small>Provider ID: {id || "NL001"}</small>
          </div>
          <div className="nl-profile-actions">
            <Link to="/booking" className="nl-primary-btn">Book now</Link>
            <button className="nl-outline-btn">Report provider</button>
          </div>
        </section>

        <div className="nl-profile-layout">
          <div className="nl-profile-left">
            <section className="nl-white-card">
              <h2>Services</h2>
              <div className="nl-service-row">
                <span>Fan installation</span><span>1 hr</span><strong>₹299</strong>
              </div>
              <div className="nl-service-row">
                <span>Wiring repair</span><span>2 hrs</span><strong>₹499</strong>
              </div>
              <div className="nl-service-row">
                <span>Switchboard fix</span><span>1 hr</span><strong>₹399</strong>
              </div>
            </section>

            <section className="nl-white-card nl-reviews">
              <h2>Reviews</h2>
              <p>
                <span className="nl-verified">Verified Booking</span>
                {" "}★ 5 · Written review with quality, punctuality and communication ratings.
              </p>
            </section>
          </div>

          <aside className="nl-white-card nl-slot-card">
            <h2>Book a slot</h2>
            <label>Date</label>
            <input type="date" />
            <label>Time</label>
            <select>
              <option>10:00 AM</option>
              <option>12:00 PM</option>
              <option>2:00 PM</option>
              <option>4:00 PM</option>
            </select>
            <div className="nl-price-row">
              <span>Estimated price</span><strong>₹299</strong>
            </div>
            <Link to="/booking" className="nl-primary-btn nl-full-btn">
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
