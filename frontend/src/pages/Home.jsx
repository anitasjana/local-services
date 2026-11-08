
import React from "react";
import "../App.css";

const services = [
  {
    icon: "⚙️",
    title: "Reliable & Fast",
    description: "Quick response and dependable home services whenever you need them.",
  },
  {
    icon: "👨‍🔧",
    title: "Expert Professionals",
    description: "Skilled and verified professionals for every home service.",
  },
  {
    icon: "💰",
    title: "Transparent Pricing",
    description: "Clear pricing with no hidden charges or unexpected costs.",
  },
];

function App() {
  return (
    <div className="page-wrapper">
      <div className="website">

        {/* Navbar */}
        <header className="navbar">
          <a href="#" className="logo">
            <span className="logo-icon">⌂</span>
            <span>Fixr<span className="logo-blue">Hub</span></span>
          </a>

          <nav className="nav-links">
            <a href="#" className="active">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About Us</a>
            <a href="#services">Book a Service</a>
            <a href="#faq">FAQ</a>
            <a href="#blog">Blog</a>
            <a href="#contact">Contact Us</a>
          </nav>

          <div className="nav-right">
            <a href="#services" className="search-link">
              <span>⌕</span> Search
            </a>
            <a href="#services" className="quote-btn">Get a Quote</a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">

          <div className="hero-background-shape shape-one"></div>
          <div className="hero-background-shape shape-two"></div>
          <div className="hero-background-shape shape-three"></div>

          <div className="hero-container">

            {/* Left Content */}
            <div className="hero-content">
              <h1>
                Reliable Home
                <br />
                Services at Your
                <br />
                <span className="script-text">Doorstep</span>
              </h1>

              <p className="hero-description">
                We provide professional, reliable, and efficient home
                services tailored to meet all your needs. Whether it's
                plumbing, electrical repairs, cleaning, or handyman
                services, our team of experts is ready to help.
              </p>

              <div className="hero-buttons">
                <a href="#services" className="primary-btn">
                  Book a Service Now
                </a>

                <a href="#services" className="round-btn">
                  ↗
                </a>
              </div>

              <div className="stats">
                <div className="stat-item">
                  <h2>150+</h2>
                  <p>Team Members</p>
                  <small>By Our Service</small>
                </div>

                <div className="stat-item">
                  <h2>2,300+</h2>
                  <p>Project Completed</p>
                  <small>By Our Service</small>
                </div>

                <div className="stat-item">
                  <h2>24+</h2>
                  <p>Years Experience</p>
                  <small>By Our Service</small>
                </div>
              </div>
            </div>

            {/* Right Image Collage */}
            <div className="hero-visual">

              <div className="customer-info">
                <div className="customer-avatars">
                  <img src="https://i.pravatar.cc/80?img=47" alt="Customer"/>
                  <img src="https://i.pravatar.cc/80?img=12" alt="Customer"/>
                  <img src="https://i.pravatar.cc/80?img=13" alt="Customer"/>
                  <img src="https://i.pravatar.cc/80?img=11" alt="Customer"/>
                  <img src="https://i.pravatar.cc/80?img=44" alt="Customer"/>
                </div>
                <div className="customer-count">
                  <strong>20k</strong>
                  <span>Total Customer</span>
                </div>
              </div>

              <div className="service-image image-cleaner">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=85"
                  alt="Professional cleaning service"
                />
              </div>

              <div className="service-image image-electrician">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=85"
                  alt="Professional electrician"
                />
              </div>

              <div className="service-image image-home">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=85"
                  alt="Home maintenance service"
                />
              </div>

              <div className="satisfaction-card">
                <div className="satisfaction-icon">✹</div>
                <div>
                  <h2>100%</h2>
                  <p>Satisfaction Guarantee</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-section" id="about">
          <div className="why-heading">
            <div>
              <h2>Why Choose FixrHub</h2>
              <p>
                Whether you're dealing with a leaky faucet or a major
                pipe repair, our experienced professionals are ready
                to handle it all. Our plumbing experts are here to help.
              </p>
            </div>

            <a href="#services" className="why-book-btn">
              Book a Service Now <span>↗</span>
            </a>
          </div>

          <div className="feature-grid">
            {services.map((service, index) => (
              <div className="feature-card" key={index}>
                <span className="feature-icon">{service.icon}</span>

                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>

                <span className="feature-arrow">↗</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer" id="contact">
          <a href="#" className="logo">
            <span className="logo-icon">⌂</span>
            Fixr<span className="logo-blue">Hub</span>
          </a>
          <p>Trusted professionals, reliable services, better homes.</p>
          <span>© 2026 FixrHub. All rights reserved.</span>
        </footer>

      </div>
    </div>
  );
}

export default App;
