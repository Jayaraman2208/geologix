import { useState } from 'react'

function EmergencyLogistics() {
  const incidents = [
    { id: 'EM-1042', location: 'North Chennai', type: 'Flood Alert', priority: 'CRITICAL', vehicles: 12, time: '08:42 AM' },
    { id: 'EM-1038', location: 'Guindy', type: 'Road Blockage', priority: 'HIGH', vehicles: 7, time: '08:17 AM' },
    { id: 'EM-1031', location: 'Ambattur', type: 'Traffic Disruption', priority: 'MEDIUM', vehicles: 4, time: '07:56 AM' },
  ]

  return (
    <div className="emergency-page">
      <div className="emergency-header"><div><div className="eyebrow">🚨 CRITICAL OPERATIONS</div><h1>Emergency <span>Logistics.</span></h1><p>Coordinate emergency response, priority deliveries and fleet deployment from one control center.</p></div><div className="emergency-status"><span></span>RESPONSE SYSTEM ACTIVE</div></div>
      <div className="emergency-summary">
        <div className="emergency-stat critical-stat"><div className="stat-icon">🚨</div><div><p>ACTIVE INCIDENTS</p><strong>{incidents.length}</strong></div><small>+1 today</small></div>
        <div className="emergency-stat"><div className="stat-icon">🚛</div><div><p>EMERGENCY VEHICLES</p><strong>23</strong></div><small>12 deployed</small></div>
        <div className="emergency-stat"><div className="stat-icon">🗺️</div><div><p>PRIORITY DELIVERIES</p><strong>48</strong></div><small>18 pending</small></div>
        <div className="emergency-stat"><div className="stat-icon">📊</div><div><p>RESPONSE RATE</p><strong>96%</strong></div><small>Above target</small></div>
      </div>
      <div className="emergency-main-grid">
        <div className="emergency-map"><div className="emergency-map-top"><div><strong>Emergency Response Map</strong><small>Live incident overview</small></div><span>LIVE</span></div>
          <div className="emergency-map-canvas"><div className="emergency-map-grid"></div><div className="map-route route-a"></div><div className="map-route route-b"></div><div className="map-route route-c"></div>
            <div className="emergency-zone critical-zone"><b>!</b><span>CRITICAL</span></div><div className="emergency-zone high-zone"><b>!</b><span>HIGH</span></div>
            <div className="emergency-zone medium-zone"><b>!</b><span>MEDIUM</span></div><div className="map-city-label">CHENNAI EMERGENCY NETWORK</div>
          </div>
        </div>
        <div className="incident-panel"><div className="incident-panel-header"><div><h3>Active Incidents</h3><p>Priority response queue</p></div><strong>{incidents.length}</strong></div>
          <div className="incident-list">{incidents.map((incident) => (<div className="incident-item" key={incident.id}><div className={"incident-icon " + incident.priority.toLowerCase()}>!</div><div className="incident-info"><strong>{incident.location}</strong><small>{incident.type}</small><span>{incident.id} · {incident.time}</span></div><b className={incident.priority.toLowerCase()}>{incident.priority}</b></div>))}</div>
        </div>
      </div>
      <div className="deployment-card"><div className="deployment-header"><div><h3>Emergency Fleet Deployment</h3><p>Vehicles currently assigned to emergency operations</p></div><button className="deploy-all-btn">+ DEPLOY VEHICLE</button></div>
        <div className="deployment-table"><div className="deployment-head"><span>VEHICLE</span><span>MISSION</span><span>LOCATION</span><span>STATUS</span><span>ACTION</span></div>
          <div className="deployment-row"><strong>GX-042</strong><span>Medical</span><span>Perambur</span><b className="dispatched">Dispatched</b><button className="track-btn">TRACK</button></div>
          <div className="deployment-row"><strong>GX-018</strong><span>Relief</span><span>Anna Nagar</span><b className="en-route">En Route</b><button className="track-btn">TRACK</button></div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyLogistics
