function Navbar() {
  return (
    <header className="navbar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search routes, vehicles, alerts..." />
        <span className="search-shortcut">⌘K</span>
      </div>
      <div className="nav-right">
        <button className="theme-toggle">
          <span className="theme-icon">☀️</span>
          <span>LIGHT</span>
        </button>
        <div className="nav-system-status">
          <span className="status-dot"></span>
          <span>LIVE</span>
        </div>
        <button className="icon-button" title="Notifications">
          🔔
          <span className="notification-dot"></span>
        </button>
        <div className="profile">
          <div className="profile-icon">👤</div>
          <div className="profile-info">
            <h4>Admin</h4>
            <span>Operations Control</span>
          </div>
          <span className="profile-arrow">▼</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar
