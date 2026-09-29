import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    vehicle_id: '',
    vehicle_type: 'Delivery Van',
    driver: '',
    location: '',
    status: 'idle',
    fuel_level: 100,
    speed: 0
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const { data } = await supabase.from('vehicles').select('*')
      if (data && data.length > 0) {
        setVehicles(data)
      } else {
        // Fallback data
        setVehicles([
          { id: '1', vehicle_id: 'GX-042', vehicle_type: 'Delivery Van', driver: 'Arun Kumar', location: 'Anna Nagar', status: 'Active', fuel_level: 82, trips: 14 },
          { id: '2', vehicle_id: 'GX-018', vehicle_type: 'Cargo Truck', driver: 'Vijay Raj', location: 'Guindy', status: 'Active', fuel_level: 67, trips: 9 },
          { id: '3', vehicle_id: 'GX-031', vehicle_type: 'Delivery Van', driver: 'Karthik S', location: 'Ambattur', status: 'Idle', fuel_level: 91, trips: 11 },
          { id: '4', vehicle_id: 'GX-063', vehicle_type: 'Medical Van', driver: 'Praveen M', location: 'Velachery', status: 'Active', fuel_level: 74, trips: 16 },
          { id: '5', vehicle_id: 'GX-077', vehicle_type: 'Cargo Truck', driver: 'Rahul K', location: 'Tambaram', status: 'Maintenance', fuel_level: 43, trips: 6 },
        ])
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVehicle = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.from('vehicles').insert([{
        vehicle_id: formData.vehicle_id,
        vehicle_type: formData.vehicle_type,
        driver: formData.driver,
        location: formData.location,
        status: formData.status,
        fuel_level: parseInt(formData.fuel_level),
        speed: parseInt(formData.speed) || 0
      }]).select()
      
      if (error) throw error
      
      setVehicles([...vehicles, data[0]])
      setShowAddForm(false)
      setFormData({
        vehicle_id: '',
        vehicle_type: 'Delivery Van',
        driver: '',
        location: '',
        status: 'idle',
        fuel_level: 100,
        speed: 0
      })
      alert('✅ Vehicle added successfully!')
    } catch (error) {
      alert('❌ Error adding vehicle: ' + error.message)
    }
  }

  const handleView = (vehicle) => {
    setSelected(vehicle)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setSelected(null)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await supabase.from('vehicles').delete().eq('id', id)
        setVehicles(vehicles.filter(v => v.id !== id))
        alert('✅ Vehicle deleted!')
      } catch (error) {
        alert('❌ Error deleting vehicle')
      }
    }
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return '#42c58a'
      case 'idle': return '#e4ae50'
      case 'maintenance': return '#ef5d5d'
      default: return '#8a8e8b'
    }
  }

  return (
    <div className="vehicles-page">
      <div className="vehicles-header">
        <div>
          <div className="eyebrow">🚛 FLEET MANAGEMENT</div>
          <h1>Fleet <span>Vehicles.</span></h1>
          <p>Manage vehicle availability, drivers, fuel levels and operational performance.</p>
        </div>
        <button className="add-vehicle-btn" onClick={() => setShowAddForm(true)}>+ ADD VEHICLE</button>
      </div>

      <div className="vehicle-summary">
        <div><p>TOTAL FLEET</p><strong>{loading ? '...' : vehicles.length}</strong><small>Registered vehicles</small></div>
        <div><p>ACTIVE</p><strong>{loading ? '...' : vehicles.filter(v => v.status === 'Active' || v.status === 'active').length}</strong><small>Currently operating</small></div>
        <div><p>IDLE</p><strong>{loading ? '...' : vehicles.filter(v => v.status === 'Idle' || v.status === 'idle').length}</strong><small>Available for dispatch</small></div>
        <div><p>MAINTENANCE</p><strong>{loading ? '...' : vehicles.filter(v => v.status === 'Maintenance' || v.status === 'maintenance').length}</strong><small>Service required</small></div>
      </div>

      <div className="vehicles-card">
        <div className="vehicles-card-header">
          <div><h3>Vehicle Registry</h3><p>All registered fleet vehicles</p></div>
          <div className="vehicle-search">🔍 Search vehicle...</div>
        </div>
        <div className="vehicles-table">
          <div className="vehicles-table-head">
            <span>VEHICLE</span><span>TYPE</span><span>DRIVER</span>
            <span>LOCATION</span><span>STATUS</span><span>FUEL</span><span>ACTION</span>
          </div>
          {vehicles.map((vehicle) => (
            <div className="vehicle-table-row" key={vehicle.id}>
              <strong>{vehicle.vehicle_id || vehicle.id}</strong>
              <span>{vehicle.vehicle_type || vehicle.type}</span>
              <span>{vehicle.driver}</span>
              <span>{vehicle.location}</span>
              <b className={(vehicle.status || '').toLowerCase().replace(' ', '-')}>
                {vehicle.status || 'Idle'}
              </b>
              <div className="fuel-level">
                <div><i style={{ width: (vehicle.fuel_level || vehicle.fuel || 0) + '%' }}></i></div>
                <span>{(vehicle.fuel_level || vehicle.fuel || 0)}%</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="view-vehicle" onClick={() => handleView(vehicle)}>VIEW</button>
                <button className="view-vehicle" onClick={() => handleDelete(vehicle.id)} style={{ color: '#ef5d5d' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddForm && (
        <div className="vehicle-modal-backdrop" onClick={() => setShowAddForm(false)}>
          <div className="vehicle-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setShowAddForm(false)}>×</button>
            <span>➕ ADD NEW VEHICLE</span>
            <h2>Register Vehicle</h2>
            <form onSubmit={handleAddVehicle} style={{ marginTop: '20px' }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ color: '#8a8e8b', fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Vehicle ID *</label>
                <input type="text" placeholder="e.g., GX-999" value={formData.vehicle_id} onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})} required style={{ width: '100%', padding: '10px', background: '#0a0c0c', border: '1px solid #252828', borderRadius: '8px', color: '#eee' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ color: '#8a8e8b', fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Vehicle Type *</label>
                <select value={formData.vehicle_type} onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0c0c', border: '1px solid #252828', borderRadius: '8px', color: '#eee' }}>
                  <option>Delivery Van</option>
                  <option>Cargo Truck</option>
                  <option>Medical Van</option>
                  <option>Heavy Truck</option>
                  <option>Emergency Vehicle</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ color: '#8a8e8b', fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Driver Name *</label>
                <input type="text" placeholder="Driver name" value={formData.driver} onChange={(e) => setFormData({...formData, driver: e.target.value})} required style={{ width: '100%', padding: '10px', background: '#0a0c0c', border: '1px solid #252828', borderRadius: '8px', color: '#eee' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ color: '#8a8e8b', fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Location</label>
                <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0c0c', border: '1px solid #252828', borderRadius: '8px', color: '#eee' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ color: '#8a8e8b', fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0c0c', border: '1px solid #252828', borderRadius: '8px', color: '#eee' }}>
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ color: '#8a8e8b', fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Fuel Level (%)</label>
                <input type="number" min="0" max="100" value={formData.fuel_level} onChange={(e) => setFormData({...formData, fuel_level: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0c0c', border: '1px solid #252828', borderRadius: '8px', color: '#eee' }} />
              </div>
              <button type="submit" className="primary-button" style={{ width: '100%', marginTop: '8px' }}>✅ Add Vehicle</button>
            </form>
          </div>
        </div>
      )}

      {/* View Vehicle Modal */}
      {showModal && selected && (
        <div className="vehicle-modal-backdrop" onClick={handleClose}>
          <div className="vehicle-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}>×</button>
            <span>VEHICLE DETAILS</span>
            <h2>{selected.vehicle_id || selected.id}</h2>
            <div className="modal-grid">
              <div><small>TYPE</small><strong>{selected.vehicle_type || selected.type}</strong></div>
              <div><small>DRIVER</small><strong>{selected.driver}</strong></div>
              <div><small>LOCATION</small><strong>{selected.location}</strong></div>
              <div><small>FUEL LEVEL</small><strong>{(selected.fuel_level || selected.fuel || 0)}%</strong></div>
              <div><small>STATUS</small><strong style={{ color: getStatusColor(selected.status) }}>{selected.status}</strong></div>
              <div><small>TRIPS</small><strong>{selected.trips || 0}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vehicles
