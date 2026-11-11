function Topbar({ adminName, adminEmail }) {
  return (
    <header className="admin-topbar">
      <div className="admin-search">
        <span>⌕</span>
        <input
          type="search"
          placeholder="Search providers, bookings, reports"
          disabled
          title="Search will be connected later"
        />
      </div>

      <div className="admin-account">
        <span className="admin-notification">•</span>
        <span className="admin-profile-avatar"></span>

        <div>
          <strong>{adminName}</strong>
          <small>{adminEmail || "Administrator"}</small>
        </div>
      </div>
    </header>
  );
}

export default Topbar;