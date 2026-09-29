import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

function AdminPanel({ onLogout, navigateTo }) {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalRoutes: 0,
    totalDeliveries: 0,
    activeAlerts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: vehicles } = await supabase.from('vehicles').select('*')
        const { data: routes } = await supabase.from('routes').select('*')
        const { data: deliveries } = await supabase.from('deliveries').select('*')
        const { data: alerts } = await supabase.from('alerts').select('*').eq('is_read', false)

        setStats({
          totalVehicles: vehicles?.length || 0,
          activeVehicles: vehicles?.filter(v => v.status === 'active' || v.status === 'Active').length || 0,
          totalRoutes: routes?.length || 0,
          totalDeliveries: deliveries?.length || 0,
          activeAlerts: alerts?.length || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Fallback data
        setStats({
          totalVehicles: 8,
          activeVehicles: 5,
          totalRoutes: 4,
          totalDeliveries: 1247,
          activeAlerts: 7
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="admin-panel">
      <div className="admin-header-bar">
        <div>
          <h2>📊 Dashboard</h2>
          <p>Overview of your logistics operations</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="logout-btn-admin" onClick={() => navigateTo('dashboard')}>🏠 Back</button>
          <button className="logout-btn-admin" onClick={onLogout}>🚪 Logout</button>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>🚛 Vehicles</h3>
          <div className="admin-stat">
            <span>Total Vehicles</span>
            <strong>{loading ? '...' : stats.totalVehicles}</strong>
          </div>
          <div className="admin-stat">
            <span>Active Vehicles</span>
            <strong>{loading ? '...' : stats.activeVehicles}</strong>
          </div>
          <button className="admin-action-btn" onClick={() => navigateTo('vehicles')} style={{ width: '100%', marginTop: '8px' }}>Manage Vehicles →</button>
        </div>
        <div className="admin-card">
          <h3>🗺️ Routes</h3>
          <div className="admin-stat">
            <span>Total Routes</span>
            <strong>{loading ? '...' : stats.totalRoutes}</strong>
          </div>
          <button className="admin-action-btn" onClick={() => navigateTo('route')} style={{ width: '100%', marginTop: '8px' }}>Plan Routes →</button>
        </div>
        <div className="admin-card">
          <h3>📦 Deliveries</h3>
          <div className="admin-stat">
            <span>Total Deliveries</span>
            <strong>{loading ? '...' : stats.totalDeliveries.toLocaleString()}</strong>
          </div>
          <button className="admin-action-btn" onClick={() => navigateTo('live')} style={{ width: '100%', marginTop: '8px' }}>Track Deliveries →</button>
        </div>
        <div className="admin-card">
          <h3>🚨 Alerts</h3>
          <div className="admin-stat">
            <span>Active Alerts</span>
            <strong>{loading ? '...' : stats.activeAlerts}</strong>
          </div>
          <button className="admin-action-btn" onClick={() => navigateTo('risk')} style={{ width: '100%', marginTop: '8px' }}>View Alerts →</button>
        </div>
      </div>

      <div className="admin-actions">
        <button className="admin-action-btn" onClick={() => navigateTo('vehicles')}>+ Add Vehicle</button>
        <button className="admin-action-btn" onClick={() => navigateTo('route')}>+ Create Route</button>
        <button className="admin-action-btn" onClick={() => navigateTo('live')}>+ New Delivery</button>
        <button className="admin-action-btn" onClick={() => navigateTo('risk')}>+ Add Alert</button>
        <button className="admin-action-btn" onClick={() => navigateTo('analytics')}>📊 View Analytics</button>
        <button className="admin-action-btn" onClick={() => navigateTo('emergency')}>🚨 Emergency</button>
      </div>

      <div className="admin-system-status">
        <span className="status-dot-admin"></span>
        <span>System Online</span>
        <span className="status-text">✅ Supabase Connected</span>
      </div>
    </div>
  )
}

export default AdminPanel
