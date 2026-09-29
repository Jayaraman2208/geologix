function RiskIntelligence() {
  const risks = [
    { area: 'North Chennai', type: 'Flood Risk', level: 'HIGH', score: 82 },
    { area: 'Ambattur', type: 'Traffic Congestion', level: 'MEDIUM', score: 61 },
    { area: 'Guindy', type: 'Road Blockage', level: 'HIGH', score: 76 },
    { area: 'Tambaram', type: 'Weather Risk', level: 'LOW', score: 32 },
  ]

  return (
    <div className="risk-page">
      <div className="risk-header"><div><div className="eyebrow">⚠️ PREDICTIVE INTELLIGENCE</div><h1>Risk <span>Intelligence.</span></h1><p>Detect operational risks before they impact fleet movement and delivery operations.</p></div><div className="risk-live"><span></span>LIVE ANALYSIS</div></div>
      <div className="risk-summary">
        <div className="risk-summary-card"><p>OVERALL RISK</p><strong>LOW</strong><small>Network condition</small></div>
        <div className="risk-summary-card"><p>HIGH RISK ZONES</p><strong>02</strong><small>Immediate attention</small></div>
        <div className="risk-summary-card"><p>MEDIUM RISK</p><strong>02</strong><small>Under monitoring</small></div>
        <div className="risk-summary-card"><p>SAFE ZONES</p><strong>02</strong><small>Normal operation</small></div>
      </div>
      <div className="risk-grid">
        <div className="risk-map"><div className="risk-map-title">RISK HEATMAP</div><div className="risk-grid-lines"></div><div className="risk-zone zone-one"><span>🔴 HIGH</span></div><div className="risk-zone zone-two"><span>🔴 HIGH</span></div><div className="risk-zone zone-three"><span>🟡 MED</span></div><div className="risk-zone zone-four"><span>🟢 LOW</span></div><div className="risk-map-city">CHENNAI OPERATIONS NETWORK</div></div>
        <div className="risk-alert-panel"><div className="risk-panel-heading"><div><h3>Active Risks</h3><p>Priority operational alerts</p></div><strong>09</strong></div>
          {risks.slice(0, 3).map((risk) => (<div className="risk-alert" key={risk.area}><div className={"risk-alert-icon " + risk.level.toLowerCase()}>!</div><div><strong>{risk.area}</strong><small>{risk.type}</small></div><span className={risk.level.toLowerCase()}>{risk.level}</span></div>))}
        </div>
      </div>
      <div className="risk-card"><div className="risk-card-heading"><div><h3>Risk Assessment</h3><p>Current threats detected across the network</p></div></div>
        <div className="risk-table"><div className="risk-table-head"><span>LOCATION</span><span>RISK TYPE</span><span>LEVEL</span><span>SCORE</span><span>RECOMMENDED ACTION</span></div>
          {risks.map((risk) => (<div className="risk-row" key={risk.area}><strong>{risk.area}</strong><span>{risk.type}</span><b className={risk.level.toLowerCase()}>{risk.level}</b><div className="risk-score"><span>{risk.score}</span><div><i style={{ width: risk.score + '%' }}></i></div></div><span className="risk-action">Monitor</span></div>))}
        </div>
      </div>
    </div>
  )
}

export default RiskIntelligence
