// src/components/RiderAssistant.jsx
// ENHANCED VERSION WITH DATABASE INTEGRATION - FIXED
import { useState, useEffect, useRef } from 'react';
import RiderAssistantService from '../services/RiderAssistantService';

function RiderAssistant() {
  const [partners, setPartners] = useState([]);
  const [bestPartner, setBestPartner] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 13.0827, lng: 80.2707 });
  const [radius, setRadius] = useState(10);
  const [vehicleType, setVehicleType] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [orderId, setOrderId] = useState('order_123');
  const [realtimeStatus, setRealtimeStatus] = useState('connected');
  const [filterRating, setFilterRating] = useState(0);
  const [searchHistory, setSearchHistory] = useState([]);

  const riderService = useRef(new RiderAssistantService());

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {
          console.log('Using default location');
        }
      );
    }

    riderService.current.initializeRealtime((payload) => {
      console.log('Real-time update received:', payload);
      setRealtimeStatus('update_received');
      findPartners();
      setTimeout(() => setRealtimeStatus('connected'), 2000);
    });

    findPartners();

    return () => {
      riderService.current.cleanup();
    };
  }, []);

  const findPartners = async () => {
    setLoading(true);
    try {
      const result = await riderService.current.getBestPartner(
        location.lat,
        location.lng,
        {
          radius,
          vehicleType: vehicleType || undefined,
          minRating: filterRating || undefined
        }
      );
      
      if (result.success) {
        setBestPartner(result.best_partner);
        setAlternatives(result.alternatives || []);
        setPartners([result.best_partner, ...(result.alternatives || [])]);
        
        setSearchHistory(prev => {
          const newEntry = {
            lat: location.lat,
            lng: location.lng,
            radius,
            vehicleType,
            timestamp: new Date().toISOString(),
            resultCount: result.total_available
          };
          return [newEntry, ...prev].slice(0, 10);
        });
      } else {
        alert('No partners found nearby. Try increasing radius or changing vehicle type.');
      }
    } catch (error) {
      console.error('Error finding partners:', error);
      alert('Error finding partners. Please try again.');
    }
    setLoading(false);
  };

  const handleAssignOrder = async (partnerId) => {
    setAssigning(true);
    try {
      const result = await riderService.current.assignOrderToPartner(orderId, partnerId);
      if (result.success) {
        alert('✅ Order assigned successfully!');
        findPartners();
      } else {
        alert('❌ Failed to assign order: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('❌ Error assigning order');
    }
    setAssigning(false);
  };

  const handleCompleteDelivery = async (partnerId) => {
    if (!confirm('Confirm delivery completion?')) return;
    
    try {
      const result = await riderService.current.completeDelivery(orderId, partnerId);
      if (result.success) {
        alert('✅ Delivery completed successfully!');
        findPartners();
      } else {
        alert('❌ Failed to complete delivery');
      }
    } catch (error) {
      alert('❌ Error completing delivery');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return '#42c58a';
      case 'busy': return '#e4ae50';
      case 'offline': return '#ef5d5d';
      default: return '#8a8e8b';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#42c58a';
    if (score >= 60) return '#e4ae50';
    return '#ef5d5d';
  };

  return (
    <div className="rider-assistant">
      <div className="rider-header">
        <h2>🤖 AI Rider Assistant</h2>
        <p>Find the nearest available delivery partners with AI-powered matching</p>
        <div className="realtime-status">
          <span className={'status-indicator ' + (realtimeStatus === 'connected' ? 'online' : 'updating')}>
            ● {realtimeStatus === 'connected' ? 'Live Updates Connected' : 'Updating...'}
          </span>
        </div>
      </div>

      <div className="rider-controls">
        <div className="control-group">
          <label>📍 Your Location</label>
          <div className="location-display">
            <span>Lat: {location.lat.toFixed(4)}</span>
            <span>Lng: {location.lng.toFixed(4)}</span>
            <button className="locate-btn" onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setLocation({
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude
                    });
                  },
                  () => alert('Unable to get location')
                );
              }
            }}>📍 Get Location</button>
          </div>
        </div>

        <div className="control-group">
          <label>📏 Search Radius (km)</label>
          <input 
            type="number" 
            value={radius} 
            onChange={(e) => setRadius(Number(e.target.value))}
            min="1"
            max="50"
          />
        </div>

        <div className="control-group">
          <label>🚛 Vehicle Type</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
            <option value="">All Vehicles</option>
            <option value="2-wheeler">2-Wheeler</option>
            <option value="4-wheeler">4-Wheeler</option>
            <option value="truck">Truck</option>
            <option value="delivery_van">Delivery Van</option>
            <option value="medical_van">Medical Van</option>
            <option value="cargo_truck">Cargo Truck</option>
          </select>
        </div>

        <div className="control-group">
          <label>⭐ Minimum Rating</label>
          <select value={filterRating} onChange={(e) => setFilterRating(Number(e.target.value))}>
            <option value="0">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        <div className="control-group">
          <label>📦 Order ID</label>
          <input 
            type="text" 
            value={orderId} 
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter order ID"
          />
        </div>

        <div className="control-group">
          <button className="find-btn" onClick={findPartners} disabled={loading}>
            {loading ? '⏳ Searching...' : '🔍 Find Partners'}
          </button>
        </div>
      </div>

      {bestPartner && (
        <div className="best-partner">
          <div className="best-partner-badge">🏆 BEST MATCH</div>
          <div className="best-partner-content">
            <div className="partner-info">
              <div className="partner-avatar">🚛</div>
              <div className="partner-details">
                <h3>{bestPartner.user?.username || 'Partner ' + bestPartner.id}</h3>
                <div className="partner-meta">
                  <span className="rating">⭐ {bestPartner.avg_rating?.toFixed(1) || '4.5'}</span>
                  <span className="deliveries">📦 {bestPartner.total_deliveries || 0} deliveries</span>
                  <span className="vehicle">🚗 {bestPartner.vehicle?.vehicle_type || 'Vehicle'}</span>
                  <span className="reliability">🛡️ {bestPartner.reliability_score}% reliable</span>
                </div>
                <div className="partner-distance">
                  <span>📍 {bestPartner.distance_text} away</span>
                  <span>⏱️ ETA: {bestPartner.eta_minutes} min</span>
                  <span className={'status-' + (bestPartner.status || 'online')}>
                    ● {bestPartner.status || 'Online'}
                  </span>
                </div>
                <div className="ai-score">
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: bestPartner.ai_score + '%', background: getScoreColor(bestPartner.ai_score) }}></div>
                  </div>
                  <span>AI Match Score: <strong style={{ color: getScoreColor(bestPartner.ai_score) }}>{bestPartner.ai_score}%</strong></span>
                  <span className="match-reason">💡 {bestPartner.match_reason}</span>
                </div>
              </div>
            </div>
            <div className="partner-actions">
              <button 
                className="assign-btn"
                onClick={() => handleAssignOrder(bestPartner.id)}
                disabled={assigning}
              >
                {assigning ? '⏳ Assigning...' : '✅ Assign Order'}
              </button>
              <button 
                className="complete-btn"
                onClick={() => handleCompleteDelivery(bestPartner.id)}
                disabled={assigning}
              >
                📦 Complete Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {alternatives.length > 0 && (
        <div className="alternatives-section">
          <h3>🔄 Alternative Partners ({alternatives.length})</h3>
          <div className="alternatives-grid">
            {alternatives.map((partner) => (
              <div 
                key={partner.id} 
                className={'alternative-card ' + (selectedPartner?.id === partner.id ? 'selected' : '')}
                onClick={() => setSelectedPartner(partner)}
              >
                <div className="alt-header">
                  <span className="alt-avatar">🚛</span>
                  <span className="alt-name">{partner.user?.username || partner.id}</span>
                  <span className="alt-score-badge">{partner.ai_score}%</span>
                </div>
                <div className="alt-details">
                  <span>📍 {partner.distance_text}</span>
                  <span>⏱️ {partner.eta_minutes} min</span>
                  <span>⭐ {(partner.avg_rating || 0).toFixed(1)}</span>
                </div>
                <div className="alt-score">
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: partner.ai_score + '%', background: getScoreColor(partner.ai_score) }}></div>
                  </div>
                </div>
                <button 
                  className="alt-assign-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAssignOrder(partner.id);
                  }}
                  disabled={assigning}
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchHistory.length > 0 && (
        <div className="search-history">
          <h3>📋 Recent Searches</h3>
          <div className="history-list">
            {searchHistory.slice(0, 5).map((entry, index) => (
              <div key={index} className="history-item">
                <span>📍 {entry.lat.toFixed(4)}, {entry.lng.toFixed(4)}</span>
                <span>📏 {entry.radius}km</span>
                <span>🚛 {entry.vehicleType || 'Any'}</span>
                <span>📊 {entry.resultCount} found</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">🔍 Searching for partners...</div>
        </div>
      )}
    </div>
  );
}

export default RiderAssistant;
