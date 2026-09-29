function Sidebar({ activePage, setActivePage, onLogout }) {
  const navigation = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'route', icon: '🗺️', label: 'Route Planning' },
    { id: 'vehicles', icon: '🚛', label: 'Vehicles' },
    { id: 'live', icon: '📍', label: 'Live Tracking' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'risk', icon: '⚠️', label: 'Risk Intelligence' },
    { id: 'emergency', icon: '🚨', label: 'Emergency' },
    { id: 'stock', icon: '📊', label: 'Stock Prediction' },
    { id: 'rider', icon: '🤖', label: 'Rider Assistant' },
    { id: 'admin', icon: '⚙️', label: 'Admin Panel' },
  ]

  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="/logo.jpeg" alt="GEOLOGIX" className="brand-logo" />
        <div className="brand-text">
          <span>GEO</span>
          <span>LOGIX</span>
        </div>
      </div>
      <div className="sidebar-line"></div>
      <nav className="nav-menu">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={activePage === item.id ? 'nav-item active' : 'nav-item'}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'rider' && <span className="nav-badge">AI</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-dot"></span>
          <div>
            <strong>System Online</strong>
            <small>All services operational</small>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
        <div className="brand-tagline">SMARTER ROUTES. STRONGER NER.</div>
      </div>
    </aside>
  )
}

export default Sidebar
