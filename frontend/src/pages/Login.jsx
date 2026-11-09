
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isAdminLogin = searchParams.get("role") === "admin";

  const [role, setRole] = useState(
    isAdminLogin ? "admin" : "customer"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid login response from server");
      }

      const expectedRole = isAdminLogin ? "admin" : role;

      if (user.role !== expectedRole) {
        setError(`This account is not registered as ${expectedRole}.`);
        return;
      }

      localStorage.setItem("nearlink_token", token);
      localStorage.setItem("nearlink_user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
          <h2>{isAdminLogin ? "Admin Login" : "Log in"}</h2>

          {!isAdminLogin && (
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
          )}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-primary"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : isAdminLogin
                ? "Admin Login"
                : `Log in as ${role}`}
          </button>

          {!isAdminLogin && (
            <p className="auth-bottom">
              New here? <Link to="/signup">Create an account</Link>
              {" · "}
              <Link to="/login?role=admin">Admin login</Link>
            </p>
          )}

          {isAdminLogin && (
            <p className="auth-bottom">
              <Link to="/login">Back to user login</Link>
            </p>
          )}
        </form>
      </section>
    </div>
  );
}

export default Login;
