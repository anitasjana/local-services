
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all active service categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/services");

        setCategories(
          response.data.services || response.data
        );

      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load categories."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories while typing
  const filteredCategories = categories.filter((category) => {
    const searchTerm = search.trim().toLowerCase();

    const categoryName = category.name || "";
    const description = category.description || "";

    return `${categoryName} ${description}`
      .toLowerCase()
      .includes(searchTerm);
  });

  return (
    <div className="service-page">

      <header className="service-nav">
        <Link to="/" className="service-logo">
          <span />
          Nearlink
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/providers">Find services</Link>
          <Link to="/signup">Become a provider</Link>
          <Link to="/login" className="nav-login">
            Log in
          </Link>
          <Link to="/signup" className="nav-signup">
            Sign up
          </Link>
        </nav>
      </header>

      <main className="service-container">

        <p className="service-breadcrumb">
          <Link to="/">Home</Link> › All categories
        </p>

        <h1 className="service-heading">
          All service categories
        </h1>

        <p>Find the right service for your needs.</p>

        {/* Category Search */}
        <form
          className="category-search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Search services (e.g. Cleaning, Plumbing)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">
            Search
          </button>
        </form>

        {loading && (
          <p>Loading categories...</p>
        )}

        {error && (
          <p className="no-providers">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="category-grid">

            {filteredCategories.map((category) => (
              <Link
                to={`/providers?category=${encodeURIComponent(
                  category.slug || category.name
                )}`}
                className="category-card"
                key={category._id}
              >
                <div className="category-image">
                  {category.icon || category.name}
                </div>

                <h3>{category.name}</h3>

                <p>
                  {category.description ||
                    "Explore available providers"}
                </p>
              </Link>
            ))}

            {filteredCategories.length === 0 && (
              <p>No matching categories found.</p>
            )}

          </div>
        )}

      </main>

      <ServiceFooter />

    </div>
  );
}

function ServiceFooter() {
  return (
    <footer className="service-footer">
      <strong>
        Nearlink · Trusted local services
      </strong>

      <span>
        About · Contact · Privacy Policy · Terms
      </span>
    </footer>
  );
}

export default Categories;
