
import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [role, setRole] = useState("customer");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [accepted, setAccepted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!accepted) return;

    alert(`Signup UI ready for ${role}. Backend will be connected later.`);
  };

  return (
    <div className="auth-page">


      <section className="auth-left">

        <Link to="/" className="auth-logo">
          <span></span>
          Nearlink
        </Link>

        <div className="auth-welcome">
          <h1>
            Join the platform built on
            <br />
            trust.
          </h1>

          <p>
            Customers book verified help. Providers grow with real reviews.
          </p>
        </div>

        <div className="auth-trust">
          Free to join
        </div>

      </section>


      <section className="auth-right">

        <form
          className="auth-form signup-form"
          onSubmit={handleSignup}
        >

          <h2>Create your account</h2>


          <div className="role-options">

            <button
              type="button"
              className={
                role === "customer"
                  ? "active"
                  : ""
              }
              onClick={() => setRole("customer")}
            >
              <strong>I need a service</strong>
              <span>Customer</span>
            </button>

            <button
              type="button"
              className={
                role === "provider"
                  ? "active"
                  : ""
              }
              onClick={() => setRole("provider")}
            >
              <strong>I offer services</strong>
              <span>Provider</span>
            </button>

          </div>


          {/* FULL NAME */}

          <label>Full name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />


          <label>Phone</label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />


          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength="6"
            required
          />



          <label className="auth-terms">

            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              required
            />

            <span>
              I agree to the Terms and Privacy Policy
            </span>

          </label>


          <button
            type="submit"
            className="auth-primary"
          >
            Create account
          </button>


          <p className="auth-bottom">
            Already have an account?
            <Link to="/login"> Log in</Link>
          </p>

        </form>

      </section>

    </div>
  );
}

export default Signup;
