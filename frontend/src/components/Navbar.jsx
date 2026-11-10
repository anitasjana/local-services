
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="nl-navbar">
      <Link to="/" className="nl-logo">
        <span className="nl-logo-icon"></span>
        Nearlink
      </Link>

      <nav className="nl-nav-links">
        <Link to="/">Home</Link>
        <Link to="/categories">Find services</Link>
        <Link to="/signup">Become a provider</Link>
      </nav>

      <div className="nl-nav-actions">
        <Link to="/login" className="nl-login">
          Log in
        </Link>

        <Link to="/signup" className="nl-signup">
          Signup
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
