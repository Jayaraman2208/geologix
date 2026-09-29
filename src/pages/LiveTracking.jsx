import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

function LiveTracking() {
  const [vehicles, setVehicles] = useState([])
  const [stats, setStats] = useState({
    active: 0,
    moving: 0,
    idle: 0,
    health: 98
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await supabase.from('vehicles').select('*')
        if (data) {
          setVehicles(data)
          setStats({
            active: data.length,
            moving: data.filter(v => v.status === 'active').length,
            idle: data.filter(v => v.status === 'idle').length,
            health: 98
          })
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        // Fallback data
        setVehicles([
          { id: 'GX-042', vehicle_id: 'GX-042', driver: 'Arun Kumar', status: 'moving', speed: 42 },
          { id: 'GX-018', vehicle_id: 'GX-018', driver: 'Vijay Raj', status: 'moving', speed: 31 },
          { id: 'GX-031', vehicle_id: 'GX-031', driver: 'Karthik S', status: 'idle', speed: 0 },
        ])
        setStats({ active: 42, moving: 36, idle: 6, health: 98 })
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <div>
          <div className="eyebrow">📍 REAL-TIME FLEET MONITORING</div>
          <h1>Live <span>Tracking.</span></h1>
          <p>Monitor fleet movement, vehicle status and route progress across the logistics network.</p>
        </div>
        <div className="tracking-live"><span></span>LIVE</div>
      </div>

      <div className="tracking-stats">
        <div className="tracking-stat"><p>ACTIVE VEHICLES</p><strong>{loading ? '...' : stats.active}</strong><small>Currently online</small></div>
        <div className="tracking-stat"><p>MOVING</p><strong>{loading ? '...' : stats.moving}</strong><small>On active routes</small></div>
        <div className="tracking-stat"><p>IDLE</p><strong>{loading ? '...' : stats.idle}</strong><small>Awaiting dispatch</small></div>
        <div className="tracking-stat"><p>NETWORK HEALTH</p><strong>{loading ? '...' : stats.health}%</strong><small>Fleet connectivity</small></div>
      </div>

      <div className="tracking-layout">
        <div className="tracking-map">
          <div className="tracking-map-header">
            <div><h3>Fleet Network</h3><p>Live vehicle positions</p></div>
            <div className="map-filter">ALL VEHICLES</div>
          </div>
          <div className="tracking-map-area">
            <div className="tracking-map-grid"></div>
            <div className="tracking-road road-1"></div>
            <div className="tracking-road road-2"></div>
            <div className="tracking-road road-3"></div>
            <div className="tracking-road road-4"></div>
            <div className="tracking-map-label">CHENNAI FLEET NETWORK</div>
            <div className="map-vehicles">
              {vehicles.slice(0, 6).map((v, i) => (
                <span key={i} className="vehicle-marker">🚛</span>
              ))}
            </div>
          </div>
        </div>

        <div className="vehicle-panel">
          <div className="vehicle-panel-header">
            <div><h3>Fleet Vehicles</h3><p>Currently connected</p></div>
            <strong>{loading ? '...' : stats.active}</strong>
          </div>
          <div className="vehicle-list">
            {vehicles.slice(0, 4).map((v) => (
              <div className="vehicle-item" key={v.id}>
                <div className="vehicle-icon">🚛</div>
                <div className="vehicle-info">
                  <strong>{v.vehicle_id || v.id}</strong>
                  <small>{v.vehicle_type || 'Vehicle'}</small>
                  <span>{v.location || 'On Route'}</span>
                </div>
                <div className="vehicle-status">
                  <b className={v.status === 'moving' || v.status === 'active' ? 'moving' : 'idle'}>
                    {v.status === 'moving' || v.status === 'active' ? 'Moving' : 'Idle'}
                  </b>
                  <small>{v.speed || 0} km/h</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveTracking
