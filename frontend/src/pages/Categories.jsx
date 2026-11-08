
import { Link } from "react-router-dom";

const categories = [
  { icon: "🔧", name: "Home Repair", providers: 120, rating: "4.9" },
  { icon: "🧹", name: "Cleaning", providers: 85, rating: "4.8" },
  { icon: "📚", name: "Tutoring", providers: 64, rating: "4.9" },
  { icon: "💇", name: "Beauty", providers: 95, rating: "4.7" },
  { icon: "🚚", name: "Moving", providers: 42, rating: "4.8" },
  { icon: "🔌", name: "Appliance Repair", providers: 73, rating: "4.9" },
];

function Categories() {
  return (
    <div className="categories-page">

      <nav className="categories-navbar">
        <Link to="/" className="categories-logo">
          ⌂ Fixr<span>Hub</span>
        </Link>

        <div>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
        </div>
      </nav>

      <section className="categories-hero">
        <p className="category-label">EXPLORE OUR SERVICES</p>
        <h1>Find the Right Service for Your Needs</h1>
        <p>
          Choose from our wide range of trusted local service
          professionals.
        </p>
      </section>

      <section className="categories-container">
        <div className="categories-heading">
          <div>
            <h2>Popular Categories</h2>
            <p>Explore services from verified professionals.</p>
          </div>
          <span>6 Categories</span>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.name}>
              <div className="category-icon">{category.icon}</div>

              <h3>{category.name}</h3>

              <p>{category.providers}+ Service Providers</p>

              <div className="category-bottom">
                <span>⭐ {category.rating}</span>
                <Link to="/providers">Explore ↗</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="categories-footer">
        © 2026 Local Service Trust Platform. All rights reserved.
      </footer>

    </div>
  );
}

export default Categories;
