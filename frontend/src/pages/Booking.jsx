
import { Link } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function Booking() {
  const [service, setService] = useState("Fan installation");
  const [payment, setPayment] = useState("Cash");

  const prices = {
    "Fan installation": 299,
    "Wiring repair": 499,
    "Switchboard fix": 399,
  };

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

      <main className="nl-booking-main">
        <div className="nl-booking-steps">
          <span>1 Service</span>
          <span>2 Date and time</span>
          <span>3 Address</span>
          <span className="active">4 Payment</span>
        </div>

        <div className="nl-booking-layout">
          <section className="nl-white-card nl-booking-form">
            <h1>Book your service</h1>

            <label>Service</label>
            <select value={service} onChange={(e) => setService(e.target.value)}>
              <option>Fan installation</option>
              <option>Wiring repair</option>
              <option>Switchboard fix</option>
            </select>

            <div className="nl-form-row">
              <div>
                <label>Date</label>
                <input type="date" />
              </div>
              <div>
                <label>Time</label>
                <select>
                  <option>10:00 AM</option>
                  <option>12:00 PM</option>
                  <option>2:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
            </div>

            <label>Address</label>
            <input type="text" placeholder="House, street, area" />

            <label>Describe the problem</label>
            <textarea rows="4"></textarea>

            <h3>Payment method</h3>
            <div className="nl-payment-options">
              {["Cash", "Online", "Escrow (held until job done)"].map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="payment"
                    value={item}
                    checked={payment === item}
                    onChange={() => setPayment(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </section>

          <aside className="nl-white-card nl-booking-summary">
            <h2>Summary</h2>
            <div><span>Provider</span><strong>Provider name</strong></div>
            <div><span>Estimated price</span><strong>₹{prices[service]}</strong></div>
            <button className="nl-primary-btn nl-full-btn">
              Confirm booking
            </button>
            <Link to="/provider/1" className="nl-outline-btn nl-full-btn">
              Back
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
