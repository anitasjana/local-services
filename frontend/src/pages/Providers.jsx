import { useState } from "react";
import { Link } from "react-router-dom";

const providerData = [
  { id: 1, name: "Rahul Sharma", category: "Electrician", rating: 4.9, reviews: 180, price: 299 },
  { id: 2, name: "Amit Das", category: "Electrician", rating: 4.8, reviews: 142, price: 349 },
  { id: 3, name: "Sourav Roy", category: "Electrician", rating: 4.6, reviews: 75, price: 249 },
  { id: 4, name: "Priya Singh", category: "Cleaner", rating: 4.5, reviews: 60, price: 199 },
  { id: 5, name: "Rakesh Kumar", category: "Plumber", rating: 4.5, reviews: 52, price: 299 },
  { id: 6, name: "Anil Das", category: "Electrician", rating: 4.4, reviews: 40, price: 249 },
];

function Providers() {
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category") || "Electrician";

  const [search, setSearch] = useState(
    initialCategory.toLowerCase() === "electrician"
      ? "electrician near me"
      : initialCategory.toLowerCase()
  );
  const [category, setCategory] = useState(initialCategory);
  const [verified, setVerified] = useState(true);
  const [available, setAvailable] = useState(false);
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("rating");
  const [area, setArea] = useState("");

  const filteredProviders = providerData
    .filter((provider) =>
      provider.category.toLowerCase().includes(category.toLowerCase())
    )
    .filter((provider) => {
      if (price === "under500") return provider.price < 500;
      if (price === "500to1000") return provider.price >= 500 && provider.price <= 1000;
      if (price === "above1000") return provider.price > 1000;
      return true;
    })
    .filter((provider) =>
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.category.toLowerCase().includes(search.toLowerCase()) ||
      search.toLowerCase().includes(provider.category.toLowerCase())
    )
    .sort((a, b) =>
      sort === "price" ? a.price - b.price : b.rating - a.rating
    );

  return (
    <div className="service-page">
      <header className="service-nav">
        <Link to="/" className="service-logo"><span />Nearlink</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/categories">Find services</Link>
          <Link to="/signup">Become a provider</Link>
          <Link to="/login" className="nav-login">Log in</Link>
          <Link to="/signup" className="nav-signup">Sign up</Link>
        </nav>
      </header>

      <main className="service-container">
        <p className="service-breadcrumb">
          <Link to="/">Home</Link> › All services
        </p>

        <form
          className="provider-search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service or provider"
          />
          <button type="submit" className="service-primary">Search</button>
        </form>

        <div className="active-filters">
          Active filters:
          <span>{category} ×</span>
          {verified && <span>Verified only ×</span>}
        </div>

        <div className="provider-layout">
          <aside className="filter-panel">
            <h3>Filters</h3>

            <label>
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
              />
              Verified only
            </label>

            <label>
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              Available today
            </label>

            <h3>Category</h3>
            {["Electrician", "Plumber", "Cleaner", "Tutor"].map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="category"
                  checked={category === item}
                  onChange={() => setCategory(item)}
                />
                {item}
              </label>
            ))}

            <h3>Price</h3>
            {[
              ["all", "All prices"],
              ["under500", "Under ₹500"],
              ["500to1000", "₹500 – ₹1,000"],
              ["above1000", "Above ₹1,000"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="price"
                  checked={price === value}
                  onChange={() => setPrice(value)}
                />
                {label}
              </label>
            ))}

            <label className="area-label">Location</label>
            <select value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">Select area</option>
              <option>Kolkata</option>
              <option>Howrah</option>
              <option>Salt Lake</option>
            </select>
          </aside>

          <section className="provider-results">
            <div className="results-heading">
              <h2>{filteredProviders.length} providers found</h2>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="rating">Sort: Highest rating</option>
                <option value="price">Sort: Lowest price</option>
              </select>
            </div>

            <div className="provider-grid">
              {filteredProviders.map((provider) => (
                <article className="provider-card" key={provider.id}>
                  <div className="provider-placeholder">
                    {provider.category}
                  </div>
                  <h3>{provider.name}</h3>
                  <p>★ {provider.rating} ({provider.reviews} reviews) · <span>Verified</span></p>
                  <div className="provider-card-bottom">
                    <strong>From ₹{provider.price}</strong>
                    <Link to={`/provider/${provider.id}`} className="service-primary">
                      View details
                    </Link>
                  </div>
                </article>
              ))}
              {filteredProviders.length === 0 && (
                <p className="no-providers">No providers found. Try another search.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="service-footer">
        <strong>Nearlink · Trusted local services</strong>
        <span>About · Contact · Privacy Policy · Terms</span>
      </footer>
    </div>
  );
}

export default Providers;