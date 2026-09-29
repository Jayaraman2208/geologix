function Analytics() {
  const stats = [
    { label: 'TOTAL DISTANCE', value: '12,842', unit: 'KM', change: '+8.2%' },
    { label: 'AVG. DELIVERY TIME', value: '34', unit: 'MIN', change: '-5.1%' },
    { label: 'FUEL EFFICIENCY', value: '8.6', unit: 'KM/L', change: '+2.3%' },
    { label: 'ON-TIME RATE', value: '94.8', unit: '%', change: '+1.2%' },
  ]

  return (
    <div className="analytics-page">
      <div className="analytics-header"><div><div className="eyebrow">📈 PERFORMANCE INTELLIGENCE</div><h1>Fleet <span>Analytics.</span></h1><p>Operational insights and performance metrics across the GEOLOGIX fleet.</p></div><select className="analytics-period" defaultValue="7"><option value="7">Last 7 Days</option><option value="30">Last 30 Days</option><option value="90">Last 90 Days</option></select></div>
      <div className="analytics-stats">{stats.map((stat) => (<div className="analytics-stat" key={stat.label}><p>{stat.label}</p><div><strong>{stat.value}</strong><span>{stat.unit}</span></div><small className={stat.change.startsWith('+') ? 'stat-positive' : 'stat-warning'}>{stat.change}</small></div>))}</div>
      <div className="analytics-grid">
        <div className="dashboard-card"><div className="analytics-card-header"><div><h3>Fleet Performance</h3><p>Weekly operational efficiency</p></div><span className="trend-up">↑ +12.4%</span></div>
          <div className="performance-chart"><div className="chart-line line-a"></div><div className="chart-line line-b"></div><div className="chart-line line-c"></div><div className="chart-line line-d"></div><div className="chart-line line-e"></div><div className="chart-point point-a"></div><div className="chart-point point-b"></div><div className="chart-point point-c"></div><div className="chart-point point-d"></div><div className="chart-point point-e"></div><div className="chart-point point-f"></div><div className="chart-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div></div>
        </div>
        <div className="dashboard-card"><div className="analytics-card-header"><div><h3>Fleet Utilization</h3><p>Current vehicle allocation</p></div></div>
          <div className="utilization-circle"><div><strong>82%</strong><span>UTILIZED</span></div></div>
          <div className="utilization-legend"><span><i></i> Active 82%</span><span><i></i> Idle 13%</span><span><i></i> Maintenance 5%</span></div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
