
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AddService.css";

function AddService() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Service name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post("/services", {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
      });

      setSuccess(
        response.data.message || "Service added successfully."
      );

      setFormData({
        name: "",
        description: "",
        icon: "",
      });

      // Save successful hole Admin Dashboard-e fire jabe
      setTimeout(() => {
        navigate("/categories");
        }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to add service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-service-page">
      <div className="add-service-container">
        <div className="add-service-header">
          <div>
            <p className="add-service-breadcrumb">
              <Link to="/admin">Admin Dashboard</Link> / Add Service
            </p>

            <h1>Add New Service</h1>
            <p>
              Add a new service category to the Nearlink platform.
            </p>
          </div>

          <Link to="/admin" className="add-service-back">
            Back to Dashboard
          </Link>
        </div>

        <form
          className="add-service-form"
          onSubmit={handleSubmit}
        >
          <div className="add-service-field">
            <label htmlFor="serviceName">Service name *</label>

            <input
              id="serviceName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Example: Home Cleaning"
              required
            />
          </div>

          <div className="add-service-field">
            <label htmlFor="serviceDescription">
              Description
            </label>

            <textarea
              id="serviceDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this service includes..."
              rows="4"
            />
          </div>

          <div className="add-service-field">
            <label htmlFor="serviceIcon">Icon or Emoji</label>

            <input
              id="serviceIcon"
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Example: 🧹"
            />

            <small>
              You can enter an emoji, such as 🧹, 🏠 or 🔧.
            </small>
          </div>

          {error && (
            <p className="add-service-error">{error}</p>
          )}

          {success && (
            <p className="add-service-success">{success}</p>
          )}

          <div className="add-service-actions">
            <Link to="/admin" className="add-service-cancel">
              Cancel
            </Link>

            <button type="submit" disabled={loading}>
              {loading ? "Adding Service..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddService;
