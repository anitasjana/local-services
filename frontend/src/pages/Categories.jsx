import { Link } from "react-router-dom";

const categories = [
  "Home repair",
  "Cleaning",
  "Tutoring",
  "Beauty",
  "Moving",
  "Appliance repair",
  "Plumbing",
  "Electrical",
];

function Categories() {
  return (
    <div className="service-page">
      <header className="service-nav">
        <Link to="/" className="service-logo"><span />Nearlink</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/providers">Find services</Link>
          <Link to="/signup">Become a provider</Link>
          <Link to="/login" className="nav-login">Log in</Link>
          <Link to="/signup" className="nav-signup">Sign up</Link>
        </nav>
      </header>

      <main className="service-container">
        <p className="service-breadcrumb">
          <Link to="/">Home</Link> › All categories
        </p>

        <h1 className="service-heading">All service categories</h1>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={`/providers?category=${encodeURIComponent(category)}`}
              className="category-card"
              key={category}
            >
              <div className="category-image">{category}</div>
              <h3>{category}</h3>
              <p>[X] providers · ★ [X] average</p>
            </Link>
          ))}
        </div>
      </main>

      <ServiceFooter />
    </div>
  );
}

function ServiceFooter() {
  return (
    <footer className="service-footer">
      <strong>Nearlink · Trusted local services</strong>
      <span>About · Contact · Privacy Policy · Terms</span>
    </footer>
  );
}

export default Categories;