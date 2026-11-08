import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [role, setRole] = useState("customer");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Login UI ready for ${role}. Backend will be connected later.`);
  };

  return (
    <div className="auth-page">
      <section className="auth-left">
        <Link to="/" className="auth-logo">
          <span></span> Nearlink
        </Link>

        <div className="auth-welcome">
          <h1>Welcome back. Your trusted local pros are waiting.</h1>
          <p>Log in to manage bookings, reviews and payments.</p>
        </div>

        <div className="auth-trust">
          Verified providers · Real reviews · Secure payment
        </div>
      </section>

      <section className="auth-right">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Log in</h2>

          <div className="role-options">
            <button
              type="button"
              className={role === "customer" ? "active customer" : ""}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>

            <button
              type="button"
              className={role === "provider" ? "active provider" : ""}
              onClick={() => setRole("provider")}
            >
              Provider
            </button>
          </div>

          <label>Email or phone</label>
          <input
            type="text"
            placeholder="Enter your email or phone"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
          />

          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>

          <button type="submit" className="auth-primary">
            Log in as {role}
          </button>

          <p className="auth-bottom">
            New here? <Link to="/signup">Create an account</Link>
            {" · "}
            <Link to="/login">Admin login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;