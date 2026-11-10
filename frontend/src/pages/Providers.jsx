import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function Providers() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialCategory);
  const [category, setCategory] = useState(initialCategory);
  const [available, setAvailable] = useState(false);
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("price");
  const [area, setArea] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);

        const params = {};
        if (category) params.service = category;
        if (area) params.location = area;

        const response = await api.get("/providers", { params });

        setProviders(response.data.providers || response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load providers.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [category, area]);

  const getProviderName = (provider) =>
    provider.user?.name || provider.name || "Provider";

  const getServiceName = (provider) =>
    provider.service?.name || provider.service?.title || "";

  const filteredProviders = providers
    .filter((provider) => {
      const name = getProviderName(provider).toLowerCase();
      const service = getServiceName(provider).toLowerCase();
      const searchText = search.toLowerCase();

      return name.includes(searchText) || service.includes(searchText);
    })
    .filter((provider) => !available || provider.isAvailable)
    .filter((provider) => {
      const amount = Number(provider.price || 0);

      if (price === "under500") return amount < 500;
      if (price === "500to1000") return amount >= 500 && amount <= 1000;
      if (price === "above1000") return amount > 1000;

      return true;
    })
    .sort((a, b) => {
      if (sort === "price") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      return 0;
    });

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
          {category && <span>{category} ×</span>}
          {available && <span>Available today ×</span>}
        </div>

        <div className="provider-layout">
          <aside className="filter-panel">
            <h3>Filters</h3>

            <label>
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              Available today
            </label>

            <h3>Category</h3>
            <input
              type="text"
              placeholder="Enter service name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

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
              <option value="">All locations</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Howrah">Howrah</option>
              <option value="Salt Lake">Salt Lake</option>
            </select>
          </aside>

          <section className="provider-results">
            <div className="results-heading">
              <h2>{filteredProviders.length} providers found</h2>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="price">Sort: Lowest price</option>
              </select>
            </div>

            {loading && <p>Loading providers...</p>}
            {error && <p className="no-providers">{error}</p>}

            {!loading && !error && (
              <div className="provider-grid">
                {filteredProviders.map((provider) => (
                  <article className="provider-card" key={provider._id}>
                    <div className="provider-placeholder">
                      {getServiceName(provider) || "Service Provider"}
                    </div>

                    <h3>{getProviderName(provider)}</h3>

                    <p>
                      {getServiceName(provider)} ·{" "}
                      <span>
                        {provider.isAvailable ? "Available" : "Currently unavailable"}
                      </span>
                    </p>

                    <p>{provider.location || "Location not specified"}</p>

                    <div className="provider-card-bottom">
                      <strong>From ₹{provider.price || 0}</strong>
                      <Link
                        to={`/provider/${provider._id}`}
                        className="service-primary"
                      >
                        View details
                      </Link>
                    </div>
                  </article>
                ))}

                {filteredProviders.length === 0 && (
                  <p className="no-providers">
                    No providers found. Try another search or filter.
                  </p>
                )}
              </div>
            )}
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