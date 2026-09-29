import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

function Dashboard({ navigateTo }) {
  const [stats, setStats] = useState({
    activeVehicles: 128,
    activeRoutes: 46,
    totalDeliveries: 1247,
    activeAlerts: 7,
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
          activeVehicles: vehicles?.filter(v => v.status === 'active' || v.status === 'Active').length || 128,
          activeRoutes: routes?.length || 46,
          totalDeliveries: deliveries?.length || 1247,
          activeAlerts: alerts?.length || 7,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="dashboard">
      <section className="welcome-section">
        <div>
          <div className="eyebrow">⚡ LOGISTICS INTELLIGENCE PLATFORM</div>
          <h1>Good morning, <span>Admin.</span></h1>
          <p className="welcome-text">Monitor your logistics network, identify accessibility risks, and make smarter routing decisions from one intelligent command center.</p>
        </div>
        <button className="primary-button" onClick={() => navigateTo('route')}>+ Plan New Route</button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚛</div>
          <p>ACTIVE VEHICLES</p>
          <h2>{loading ? '...' : stats.activeVehicles}</h2>
          <span className="stat-positive">↑ 8.4% from last week</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <p>ACTIVE ROUTES</p>
          <h2>{loading ? '...' : stats.activeRoutes}</h2>
          <span className="stat-positive">↑ 5.2% from yesterday</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <p>TOTAL DELIVERIES</p>
          <h2>{loading ? '...' : stats.totalDeliveries.toLocaleString()}</h2>
          <span className="stat-positive">↑ 12.3% this month</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <p>ACTIVE ALERTS</p>
          <h2>{loading ? '...' : stats.activeAlerts}</h2>
          <span className="stat-warning">⚠️ 2 critical • 5 warnings</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Live Logistics Network</h3>
              <p>Real-time overview of active transportation routes</p>
            </div>
            <span className="live-badge">● LIVE</span>
          </div>
          <div className="map-placeholder">
            <div className="map-network">
              <div className="map-node n1"><span>W1</span></div>
              <div className="map-node n2"><span>W2</span></div>
              <div className="map-node n3"><span>W3</span></div>
              <div className="map-node n4"><span>W4</span></div>
              <div className="map-node n5"><span>W5</span></div>
              <div className="map-node n6"><span>W6</span></div>
              <div className="map-line l1"></div>
              <div className="map-line l2"></div>
              <div className="map-line l3"></div>
              <div className="map-line l4"></div>
              <div className="map-line l5"></div>
              <div className="map-line l6"></div>
              <div className="map-pulse"></div>
              <div className="map-vehicle v1">🚛</div>
              <div className="map-vehicle v2">🚛</div>
              <div className="map-vehicle v3">🚛</div>
              <div className="map-vehicle v4">🚛</div>
              <div className="map-legend">
                <span>● Active Route</span>
                <span>🚛 Vehicle</span>
                <span>📍 Warehouse</span>
              </div>
            </div>
          </div>
          <div className="map-stats">
            <div><span>Active Vehicles</span><strong>{stats.activeVehicles}</strong></div>
            <div><span>Routes</span><strong>{stats.activeRoutes}</strong></div>
            <div><span>Zones</span><strong>12</strong></div>
            <div><span>Uptime</span><strong>99.8%</strong></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>AI Insights</h3>
              <p>Intelligent recommendations</p>
            </div>
            <span className="ai-badge">🤖 AI</span>
          </div>
          <div className="insight">
            <div className="insight-icon">💡</div>
            <div>
              <h4>Route Optimization</h4>
              <p>Route 24 can be optimized to reduce travel distance by approximately 12%.</p>
              <button className="insight-action" onClick={() => navigateTo('route')}>Apply Optimization</button>
            </div>
          </div>
          <div className="insight">
            <div className="insight-icon">⚠️</div>
            <div>
              <h4>Accessibility Risk</h4>
              <p>Three routes contain accessibility constraints that require attention.</p>
              <button className="insight-action" onClick={() => navigateTo('risk')}>View Details</button>
            </div>
          </div>
          <div className="insight">
            <div className="insight-icon">📈</div>
            <div>
              <h4>Fleet Efficiency</h4>
              <p>Current fleet utilization is performing above the weekly average by 8%.</p>
              <button className="insight-action" onClick={() => navigateTo('analytics')}>View Report</button>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-card alerts-card">
        <div className="card-header">
          <div>
            <h3>Recent Alerts</h3>
            <p>Latest events detected across the network</p>
          </div>
          <button className="view-all" onClick={() => navigateTo('risk')}>View all →</button>
        </div>
        <div className="alerts-preview">
          <div className="alert-row critical">
            <span className="severity critical-dot"></span>
            <div>
              <h4>Accessibility obstruction detected</h4>
              <p>Route 18 • Central Zone</p>
            </div>
            <span className="alert-time">4 min ago</span>
            <button className="alert-action" onClick={() => navigateTo('risk')}>Resolve</button>
          </div>
          <div className="alert-row warning">
            <span className="severity warning-dot"></span>
            <div>
              <h4>Vehicle running behind schedule</h4>
              <p>Vehicle GX-042 • Route 12</p>
            </div>
            <span className="alert-time">11 min ago</span>
            <button className="alert-action" onClick={() => navigateTo('live')}>Monitor</button>
          </div>
          <div className="alert-row info">
            <span className="severity info-dot"></span>
            <div>
              <h4>Route optimization completed</h4>
              <p>Route 24 • AI Optimization Engine</p>
            </div>
            <span className="alert-time">19 min ago</span>
            <button className="alert-action" onClick={() => navigateTo('route')}>View</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
