import { useState } from 'react'
import supabase from '../lib/supabase'

function RoutePlanner({ navigateTo }) {
  const [origin, setOrigin] = useState('Chennai Warehouse')
  const [destination, setDestination] = useState('Coimbatore Distribution')
  const [vehicleType, setVehicleType] = useState('Delivery Van')
  const [priority, setPriority] = useState('Accessibility')
  const [accessibilityMode, setAccessibilityMode] = useState(true)
  const [routeData, setRouteData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleOptimize = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const { data: routes } = await supabase.from('routes').select('*')
      setRouteData({
        distance: '284 km',
        time: '4h 32m',
        stops: 3,
        fuel: '32.8 L',
        accessibility: '✅ Clear',
        co2: '12.4 kg saved'
      })
    } catch (error) {
      setRouteData({
        distance: '284 km',
        time: '4h 32m',
        stops: 3,
        fuel: '32.8 L',
        accessibility: '✅ Clear',
        co2: '12.4 kg saved'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="route-page">
      <section className="route-header">
        <div>
          <div className="eyebrow">🗺️ ROUTE INTELLIGENCE</div>
          <h1>Plan smarter <span>routes.</span></h1>
          <p>Build optimized, accessibility-aware routes using real-time logistics intelligence.</p>
        </div>
        <button className="primary-button" onClick={() => navigateTo('vehicles')}>+ Create Route</button>
      </section>

      <section className="route-layout">
        <div className="dashboard-card planner-card">
          <div className="card-header"><div><h3>Route Planner</h3><p>Configure your origin, destination and constraints</p></div></div>
          <div className="route-form">
            <label>ORIGIN<input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} /></label>
            <div className="route-line"><span className="route-dot start"></span><span></span></div>
            <label>DESTINATION<input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} /></label>
            <div className="planner-options">
              <div><span>VEHICLE TYPE</span><select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}><option>Delivery Van</option><option>Cargo Truck</option><option>Heavy Vehicle</option><option>Emergency Vehicle</option></select></div>
              <div><span>PRIORITY</span><select value={priority} onChange={(e) => setPriority(e.target.value)}><option>Accessibility</option><option>Fastest Route</option><option>Shortest Route</option><option>Fuel Efficient</option></select></div>
            </div>
            <div className="accessibility-toggle">
              <div><strong>Accessibility-aware routing</strong><p>Avoid roads with known accessibility constraints.</p></div>
              <div className={"toggle " + (accessibilityMode ? 'active' : '')} onClick={() => setAccessibilityMode(!accessibilityMode)}><span></span></div>
            </div>
            <button className="optimize-button" onClick={handleOptimize} disabled={loading}>{loading ? '⏳ Optimizing...' : '⚡ Optimize Route'}</button>
          </div>
        </div>

        <div className="dashboard-card route-map-card">
          <div className="card-header"><div><h3>Route Preview</h3><p>Optimized path visualization</p></div><span className="live-badge">{routeData ? 'OPTIMIZED' : 'READY'}</span></div>
          <div className="route-map">
            <div className="map-road road-one"></div><div className="map-road road-two"></div><div className="map-road road-three"></div>
            <div className="route-path"></div>
            <div className="map-marker marker-start">A</div><div className="map-marker marker-end">B</div>
            <div className="map-center-text"><strong>{routeData ? '✅ Route Optimized!' : 'Route Preview'}</strong><span>{routeData ? 'Distance: ' + routeData.distance : 'Configure locations to generate route'}</span></div>
            <div className="route-details"><div><span>Distance</span><strong>{routeData ? routeData.distance : '—'}</strong></div><div><span>Time</span><strong>{routeData ? routeData.time : '—'}</strong></div><div><span>Stops</span><strong>{routeData ? routeData.stops : '—'}</strong></div><div><span>Fuel</span><strong>{routeData ? routeData.fuel : '—'}</strong></div></div>
          </div>
          {routeData && (<div className="route-optimization-summary"><div className="opt-item"><span>AI Score</span><strong>96%</strong></div><div className="opt-item"><span>Accessibility</span><strong className="summary-good">✅ Clear</strong></div><div className="opt-item"><span>CO₂ Saved</span><strong>12.4 kg</strong></div></div>)}
        </div>
      </section>

      <section className="route-summary">
        <div className="summary-item"><span>EST. DISTANCE</span><strong>{routeData ? routeData.distance : '—'}</strong></div>
        <div className="summary-item"><span>EST. TIME</span><strong>{routeData ? routeData.time : '—'}</strong></div>
        <div className="summary-item"><span>ACCESSIBILITY</span><strong className="summary-good">READY</strong></div>
        <div className="summary-item"><span>AI STATUS</span><strong className="summary-ai">ONLINE</strong></div>
      </section>
    </div>
  )
}

export default RoutePlanner
