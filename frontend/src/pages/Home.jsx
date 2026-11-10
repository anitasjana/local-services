import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";

const categories = [
  { name: "Plumber", count: "120+ providers", icon: "🔧" },
  { name: "Electrician", count: "95+ providers", icon: "⚡" },
  { name: "Cleaner", count: "150+ providers", icon: "🧹" },
  { name: "Tutor", count: "80+ providers", icon: "📚" },
  { name: "Mechanic", count: "65+ providers", icon: "🛠️" },
  { name: "Painter", count: "70+ providers", icon: "🎨" },
];

const providers = [
  {
    name: "Rahul Sharma",
    service: "Electrician",
    rating: "4.9",
    reviews: "120",
    price: "299",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Amit Das",
    service: "Plumber",
    rating: "4.8",
    reviews: "86",
    price: "249",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Priya Singh",
    service: "Cleaning",
    rating: "4.9",
    reviews: "210",
    price: "499",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=85",
  },
];

const steps = [
  {
    number: "1",
    title: "Search",
    description: "Pick a service and your area.",
  },
  {
    number: "2",
    title: "Book",
    description: "Choose a slot and describe the problem.",
  },
  {
    number: "3",
    title: "Complete",
    description: "Provider finishes, you confirm.",
  },
  {
    number: "4",
    title: "Review",
    description: "Rate with a Verified Booking tag.",
  },
];

function App() {
  return (
    <div className="nearlink-page">
      {/* NAVBAR */}
      <header className="nl-navbar">
        <Navbar/>
      </header>

      {/* HERO */}
      <main>
        <section className="nl-hero" id="home">
          <div className="nl-hero-inner">
            <div className="nl-hero-content">
              <span className="nl-verified-label">
                Verified providers only
              </span>

              <h1>
                Reliable local services
                <br />
                you can <span>trust</span>
              </h1>

              <p className="nl-hero-description">
                Find verified plumbers, electricians, cleaners and tutors
                near you. Book in minutes and review only after the job is done.
              </p>

              <form
                className="nl-search-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("providers")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <input
                  type="text"
                  placeholder="What do you need?"
                  aria-label="Service needed"
                />
                <input
                  type="text"
                  placeholder="Your area"
                  aria-label="Your area"
                />
                <button type="submit">Search</button>
              </form>

              <div className="nl-stats">
                <div>
                  <h2>500+</h2>
                  <p>Verified providers</p>
                </div>
                <div>
                  <h2>2,300+</h2>
                  <p>Jobs completed</p>
                </div>
                <div>
                  <h2>4.9</h2>
                  <p>Average rating</p>
                </div>
              </div>
            </div>

            <div className="nl-hero-grid">
              <div className="nl-hero-image">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=85"
                  alt="Electrician working"
                />
                <span>Electrician</span>
              </div>

              <div className="nl-hero-image">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=85"
                  alt="Professional cleaning"
                />
                <span>Cleaning</span>
              </div>

              <div className="nl-hero-image">
                <img
                  src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=85"
                  alt="Plumbing service"
                />
                <span>Plumbing</span>
              </div>

              <div className="nl-hero-trust">
                <h2>100%</h2>
                <p>Verified before listing</p>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="nl-section nl-categories" id="categories">
          <div className="nl-section-heading">
            <h2>Popular categories</h2>
            <a href="#categories" className="nl-outline-btn">
              All categories
            </a>
          </div>

          <div className="nl-category-grid">
            {categories.map((category) => (
              <a
                href="#providers"
                className="nl-category-card"
                key={category.name}
              >
                <span className="nl-category-icon">{category.icon}</span>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.count} · ★ 4.8</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FEATURED PROVIDERS */}
        <section className="nl-section nl-providers" id="providers">
          <div className="nl-section-heading">
            <h2>Featured verified providers</h2>
          </div>

          <div className="nl-provider-grid">
            {providers.map((provider) => (
              <article className="nl-provider-card" key={provider.name}>
                <div className="nl-provider-image">
                  <img src={provider.image} alt={provider.service} />
                  <span>{provider.service}</span>
                </div>

                <h3>{provider.name}</h3>

                <div className="nl-provider-rating">
                  ★ {provider.rating} ({provider.reviews} reviews)
                  <span>Verified</span>
                </div>

                <div className="nl-provider-bottom">
                  <strong>From ₹{provider.price}</strong>
                  <a href="#providers">View details</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="nl-section nl-how">
          <h2>How it works</h2>

          <div className="nl-steps-grid">
            {steps.map((step) => (
              <div className="nl-step-card" key={step.number}>
                <span className="nl-step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="nl-trust-section">
          <div>
            <h3>Verified profiles</h3>
            <p>ID and business proof checked.</p>
          </div>
          <div>
            <h3>Real reviews</h3>
            <p>Only completed bookings can review.</p>
          </div>
          <div>
            <h3>Secure payment</h3>
            <p>Cash, online or escrow.</p>
          </div>
        </section>

        {/* PROVIDER CTA */}
        <section className="nl-provider-cta" id="provider-cta">
          <div>
            <h2>Offer your skills</h2>
            <p>Join as a provider and grow your local business.</p>
          </div>
          <Link to="/signup" className="nl-signup"> Become a provider</Link>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="nl-footer" id="contact">
        <strong>Nearlink · Trusted local services</strong>
        <div>
          <a href="#about">About</a>
          <span>·</span>
          <a href="#contact">Contact</a>
          <span>·</span>
          <a href="#privacy">Privacy Policy</a>
          <span>·</span>
          <a href="#terms">Terms</a>
        </div>
      </footer>
    </div>
  );
}

export default App;