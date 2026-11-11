
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const checklistItems = [
  "Clear pending verifications",
  "Resolve reported issues",
  "Check refunds and escrow",
  "Review revenue",
];

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function AdminContent() {
  const [adminStats, setAdminStats] = useState({
    totalCustomers: 0,
    totalProviders: 0,
    totalProviderProfiles: 0,
    pendingProviders: 0,
    approvedProviders: 0,
    rejectedProviders: 0,
  });

  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
    rejectedBookings: 0,
    inProgressBookings: 0,
    bookingsByMonth: Array(12).fill(0),
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBookingStats, setLoadingBookingStats] = useState(true);

  const [pendingProviders, setPendingProviders] = useState([]);
  const [services, setServices] = useState([]);

  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkedTasks, setCheckedTasks] = useState([]);

  // Fetch pending provider applications
  const fetchPendingProviders = useCallback(async () => {
    try {
      setLoadingProviders(true);

      const response = await api.get("/providers/admin/pending");

      setPendingProviders(response.data.providers || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load pending provider applications."
      );
    } finally {
      setLoadingProviders(false);
    }
  }, []);

  // Fetch admin account statistics
  const fetchAdminStats = useCallback(async () => {
    try {
      setLoadingStats(true);

      const response = await api.get("/providers/admin/stats");

      setAdminStats(response.data.stats);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load dashboard statistics."
      );
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch booking statistics
  const fetchBookingStats = useCallback(async () => {
    try {
      setLoadingBookingStats(true);

      const response = await api.get("/bookings/admin/stats");

      setBookingStats(response.data.stats);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load booking statistics."
      );
    } finally {
      setLoadingBookingStats(false);
    }
  }, []);

  // Fetch service categories
  const fetchServices = useCallback(async () => {
    try {
      setLoadingServices(true);

      const response = await api.get("/services");

      const serviceList = Array.isArray(response.data)
        ? response.data
        : response.data.services || [];

      setServices(serviceList);
    } catch (err) {
      console.error("Services loading error:", err);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  // Load dashboard data
  useEffect(() => {
    fetchPendingProviders();
    fetchServices();
    fetchAdminStats();
    fetchBookingStats();
  }, [
    fetchPendingProviders,
    fetchServices,
    fetchAdminStats,
    fetchBookingStats,
  ]);

  // Approve or reject provider
  const handleApproval = async (providerId, status) => {
    let rejectionReason = "";

    if (status === "rejected") {
      rejectionReason = window.prompt(
        "Please enter the reason for rejecting this application:"
      );

      if (rejectionReason === null) return;

      if (!rejectionReason.trim()) {
        setError("A rejection reason is required.");
        return;
      }
    }

    try {
      setProcessingId(providerId);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/providers/admin/${providerId}/approval`,
        {
          status,
          ...(status === "rejected" && {
            rejectionReason: rejectionReason.trim(),
          }),
        }
      );

      setSuccess(
        response.data.message ||
        `Provider application ${status} successfully.`
      );

      await Promise.all([
        fetchPendingProviders(),
        fetchAdminStats(),
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update provider application."
      );
    } finally {
      setProcessingId("");
    }
  };

  // Daily checklist
  const toggleTask = (task) => {
    setCheckedTasks((previous) =>
      previous.includes(task)
        ? previous.filter((item) => item !== task)
        : [...previous, task]
    );
  };

  const activeServices = useMemo(
    () => services.filter((service) => service.isActive !== false),
    [services]
  );

  // Dynamic chart calculations
  const chartData = bookingStats.bookingsByMonth || Array(12).fill(0);

  const chartMax = Math.max(
    5,
    Math.ceil(Math.max(...chartData) / 5) * 5
  );

  const chartPoints = chartData.map((value, index) => ({
    x: (index / 11) * 700,
    y: 170 - (value / chartMax) * 150,
  }));

  const chartLinePath = chartPoints
    .map((point, index) =>
      `${index === 0 ? "M" : "L"}${point.x} ${point.y}`
    )
    .join(" ");

  const chartAreaPath = chartLinePath
    ? `${chartLinePath} L700 190 L0 190 Z`
    : "";

  const maxPointIndex = chartData.indexOf(Math.max(...chartData));

  // Booking status calculations
  const completed = bookingStats.completedBookings || 0;
  const inProgress = bookingStats.inProgressBookings || 0;
  const cancelled = bookingStats.cancelledBookings || 0;
  const rejected = bookingStats.rejectedBookings || 0;

  const statusTotal = completed + inProgress + cancelled + rejected;

  const completedPercent = statusTotal
    ? (completed / statusTotal) * 100
    : 0;

  const inProgressPercent = statusTotal
    ? (inProgress / statusTotal) * 100
    : 0;

  const cancelledPercent = statusTotal
    ? (cancelled / statusTotal) * 100
    : 0;

  const rejectedPercent = statusTotal
    ? (rejected / statusTotal) * 100
    : 0;

  const donutStyle = {
    background:
      statusTotal === 0
        ? "#e5eeee"
        : `conic-gradient(
            #087f7b 0% ${completedPercent}%,
            #f59e0b ${completedPercent}% ${completedPercent + inProgressPercent}%,
            #dc3f32 ${completedPercent + inProgressPercent}% ${completedPercent + inProgressPercent + cancelledPercent}%,
            #64748b ${completedPercent + inProgressPercent + cancelledPercent}% 100%
          )`,
  };

  // Dashboard cards
  const stats = [
    {
      icon: "C",
      title: "Total customers",
      value: loadingStats ? "..." : adminStats.totalCustomers,
      description: "Customer accounts",
      color: "mint",
    },
    {
      icon: "P",
      title: "Total providers",
      value: loadingStats ? "..." : adminStats.totalProviders,
      description: "Registered provider accounts",
      color: "yellow",
    },
    {
      icon: "B",
      title: "Total bookings",
      value: loadingBookingStats ? "..." : bookingStats.totalBookings,
      description: "Platform activity",
      color: "blue",
    },
    {
      icon: "✓",
      title: "Completed bookings",
      value: loadingBookingStats ? "..." : bookingStats.completedBookings,
      description: "Successful jobs",
      color: "mint",
    },
    {
      icon: "V",
      title: "Pending verifications",
      value: loadingStats ? "..." : adminStats.pendingProviders,
      description: "Applications awaiting review",
      color: "yellow",
    },
    {
      icon: "R",
      title: "Reported issues",
      value: "—",
      description: "Reviews and disputes",
      color: "pink",
    },
    {
      icon: "₹",
      title: "Platform revenue",
      value: "—",
      description: "Commission earned",
      color: "mint",
    },
  ];

  return (
    <main className="admin-content">
      <div className="admin-page-heading" id="overview">
        <div>
          <h1>Platform overview</h1>
          <p>Everything you need to keep Nearlink trusted and growing.</p>
        </div>

        <select defaultValue="30">
          <option value="30">Last 30 days</option>
          <option value="7">Last 7 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">This year</option>
        </select>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success">
          {success}
          <button onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      {/* Statistics cards */}
      <section className="admin-stats-grid">
        {stats.map((item) => (
          <article className="admin-stat-card" key={item.title}>
            <div className={`admin-stat-icon ${item.color}`}>
              {item.icon}
            </div>

            <div className="admin-stat-info">
              <span>{item.title}</span>
              <h2>{item.value}</h2>
              <small>{item.description}</small>
            </div>
          </article>
        ))}

        <article className="admin-checklist-summary">
          <h3>Daily checklist</h3>
          <p>
            {checkedTasks.length} of {checklistItems.length} tasks completed today
          </p>
        </article>
      </section>

      {/* Booking charts */}
      <section className="admin-chart-grid" id="bookings">
        <article className="admin-panel admin-booking-chart">
          <div className="admin-panel-heading">
            <h2>Bookings this year</h2>
            <span>
              {loadingBookingStats ? "Loading analytics..." : "Live booking data"}
            </span>
          </div>

          <div className="admin-chart-placeholder">
            <div className="chart-y-labels">
              {[4, 3, 2, 1, 0].map((step) => (
                <span key={step}>
                  {Math.round((chartMax * step) / 4)}
                </span>
              ))}
            </div>

            <div className="admin-line-chart">
              <div className="chart-grid-lines">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n}></span>
                ))}
              </div>

              <svg
                viewBox="0 0 700 190"
                preserveAspectRatio="none"
                className="admin-chart-svg"
              >
                <path
                  d={chartAreaPath}
                  className="chart-area"
                />

                <path
                  d={chartLinePath}
                  className="chart-line"
                />

                {chartData.some((value) => value > 0) && (
                  <circle
                    cx={chartPoints[maxPointIndex].x}
                    cy={chartPoints[maxPointIndex].y}
                    r="6"
                    className="chart-point"
                  />
                )}
              </svg>

              <div className="chart-months">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>

          <p className="admin-chart-note">
            Monthly booking count for the current year.
          </p>
        </article>

        <article className="admin-panel admin-booking-status">
          <h2>Booking status</h2>

          <div className="admin-donut-placeholder">
            <div className="admin-donut" style={donutStyle}>
              <div></div>
            </div>
          </div>

          <div className="admin-chart-legend">
            <span>
              Completed <strong>{completed}</strong>
            </span>
            <span>
              In progress <strong>{inProgress}</strong>
            </span>
            <span>
              Cancelled <strong>{cancelled}</strong>
            </span>
            <span>
              Rejected <strong>{rejected}</strong>
            </span>
          </div>

          <p className="admin-chart-note">
            {loadingBookingStats
              ? "Loading booking status..."
              : `Total ${statusTotal} bookings by status.`}
          </p>
        </article>
      </section>

      {/* Provider verification */}
      <section
        className="admin-panel admin-verification-panel"
        id="provider-verification"
      >
        <div className="admin-panel-heading">
          <h2>Provider verification</h2>

          <span className="admin-tag">
            {pendingProviders.length} pending applications
          </span>
        </div>

        {loadingProviders ? (
          <p className="admin-empty-message">
            Loading provider applications...
          </p>
        ) : pendingProviders.length === 0 ? (
          <div className="admin-empty-message">
            <strong>No pending applications</strong>
            <p>All provider applications have been reviewed.</p>
          </div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-verification-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {pendingProviders.map((provider) => (
                  <tr key={provider._id}>
                    <td>
                      <strong>{provider.user?.name || "Unknown"}</strong>
                      <small>{provider.user?.email || "—"}</small>
                    </td>

                    <td>{provider.service?.name || "—"}</td>
                    <td>{provider.experience} years</td>
                    <td>{provider.location || "—"}</td>
                    <td>₹{provider.price}</td>

                    <td>
                      <span className="admin-no-documents">
                        Not submitted
                      </span>
                    </td>

                    <td>
                      <div className="admin-verification-actions">
                        <button
                          className="admin-approve-btn"
                          disabled={processingId === provider._id}
                          onClick={() =>
                            handleApproval(provider._id, "approved")
                          }
                        >
                          {processingId === provider._id
                            ? "Please wait..."
                            : "Approve"}
                        </button>

                        <button
                          className="admin-reject-btn"
                          disabled={processingId === provider._id}
                          onClick={() =>
                            handleApproval(provider._id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Reports and revenue */}
      <section className="admin-bottom-grid">
        <article
          className="admin-panel admin-reports-panel"
          id="reviews-and-disputes"
        >
          <div className="admin-panel-heading">
            <h2>Reviews and disputes</h2>
            <span className="admin-tag muted-tag">
              API not connected
            </span>
          </div>

          <div className="admin-placeholder-row">
            <div>
              <strong>Reported reviews</strong>
              <small>
                Review moderation data is not available yet.
              </small>
            </div>

            <span className="admin-status-pill">—</span>
          </div>

          <div className="admin-placeholder-row">
            <div>
              <strong>Customer disputes</strong>
              <small>
                Dispute management API is not available yet.
              </small>
            </div>

            <span className="admin-status-pill warning-pill">—</span>
          </div>
        </article>

        <article
          className="admin-panel admin-revenue-panel"
          id="revenue"
        >
          <h2>Revenue</h2>

          <div className="admin-revenue-item">
            <span>Monthly revenue</span>
            <strong>—</strong>
          </div>

          <div className="admin-revenue-item">
            <span>Commission rate</span>
            <strong>—</strong>
          </div>

          <div className="admin-revenue-item">
            <span>Held in escrow</span>
            <strong>—</strong>
          </div>

          <small className="admin-chart-note">
            Revenue API not connected yet.
          </small>
        </article>
      </section>

      {/* Service categories */}
      <section
        className="admin-panel admin-categories-panel"
        id="categories"
      >
        
      <div className="admin-panel-heading">
        <h2>Service categories</h2>

        <div className="admin-service-actions">
          <span className="admin-tag">
            {activeServices.length} active services
          </span>

          <Link
            to="/admin/add-service"
            className="admin-add-service-btn"
          >
            + Add Services
          </Link>
        </div>
      </div>


        {loadingServices ? (
          <p className="admin-empty-message">
            Loading categories...
          </p>
        ) : services.length === 0 ? (
          <p className="admin-empty-message">
            No service categories found.
          </p>
        ) : (
          <div className="admin-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Management</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr key={service._id}>
                    <td>{service.name}</td>

                    <td>
                      <span
                        className={`admin-category-status ${
                          service.isActive === false
                            ? "disabled"
                            : "enabled"
                        }`}
                      >
                        {service.isActive === false
                          ? "Disabled"
                          : "Enabled"}
                      </span>
                    </td>

                    <td>
                      <span className="admin-not-available">
                        Management API not connected
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Daily checklist */}
      <section
        className="admin-daily-checklist"
        id="daily-checklist"
      >
        <h2>Daily checklist</h2>

        <div className="admin-checklist-items">
          {checklistItems.map((task) => (
            <label key={task}>
              <input
                type="checkbox"
                checked={checkedTasks.includes(task)}
                onChange={() => toggleTask(task)}
              />

              <span>{task}</span>
            </label>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AdminContent;
