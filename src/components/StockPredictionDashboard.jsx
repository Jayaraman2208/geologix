import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import StockPredictionService from '../services/StockPredictionService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function StockPredictionDashboard() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [productId, setProductId] = useState('');
  const [location, setLocation] = useState('Guwahati');
  const [training, setTraining] = useState(false);

  const predictionService = new StockPredictionService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [predictionData, alertData, historyData] = await Promise.all([
        predictionService.predictStock(productId || null, location),
        predictionService.getActiveAlerts(),
        predictionService.getPredictionHistory(productId || null)
      ]);
      
      setPrediction(predictionData);
      setAlerts(alertData);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleTrainModel = async () => {
    setTraining(true);
    try {
      const stockData = await predictionService.fetchStockData(productId || null);
      const weatherData = await predictionService.fetchWeatherData(location);
      const result = await predictionService.trainModel(stockData, weatherData, 30);
      
      if (result.success) {
        alert('✅ Model trained successfully!');
        await loadData();
      } else {
        alert('❌ Training failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('❌ Training error: ' + error.message);
    }
    setTraining(false);
  };

  const handleResolveAlert = async (alertId) => {
    await predictionService.resolveAlert(alertId);
    loadData();
  };

  const handlePredict = () => {
    loadData();
  };

  // Chart data
  const predictionChartData = {
    labels: history.map(h => new Date(h.prediction_date).toLocaleDateString()),
    datasets: [
      {
        label: 'Predicted Quantity',
        data: history.map(h => h.predicted_quantity),
        borderColor: '#f47b20',
        backgroundColor: 'rgba(244, 123, 32, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Actual Quantity',
        data: history.map(h => h.actual_quantity || null),
        borderColor: '#42c58a',
        backgroundColor: 'rgba(66, 197, 138, 0.1)',
        fill: true,
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };

  return (
    <div className="stock-prediction-dashboard">
      <div className="prediction-header">
        <h2>📊 AI Stock Prediction</h2>
        <p>Smart inventory management with predictive analytics</p>
      </div>

      {/* Controls */}
      <div className="prediction-controls">
        <div className="control-group">
          <label>Product</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">All Products</option>
            <option value="1">Rice</option>
            <option value="2">Wheat</option>
            <option value="3">Medicines</option>
            <option value="4">Fuel</option>
            <option value="5">Food Supplies</option>
          </select>
        </div>
        <div className="control-group">
          <label>Location</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="Guwahati">Guwahati, Assam</option>
            <option value="Shillong">Shillong, Meghalaya</option>
            <option value="Imphal">Imphal, Manipur</option>
            <option value="Aizawl">Aizawl, Mizoram</option>
            <option value="Kohima">Kohima, Nagaland</option>
          </select>
        </div>
        <div className="control-group">
          <button className="predict-btn" onClick={handlePredict}>
            🔮 Predict Now
          </button>
        </div>
        <div className="control-group">
          <button className="train-btn" onClick={handleTrainModel} disabled={training}>
            {training ? '⏳ Training...' : '🤖 Train AI Model'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading predictions...</div>
      ) : (
        <>
          {/* Prediction Result */}
          {prediction && (
            <div className="prediction-result">
              <div className="prediction-card">
                <div className="prediction-number">
                  <span className="number">{prediction.predictedQuantity}</span>
                  <span className="unit">units</span>
                </div>
                <div className="prediction-details">
                  <div className="detail-item">
                    <span>Confidence</span>
                    <strong>{(prediction.confidence * 100).toFixed(0)}%</strong>
                  </div>
                  <div className="detail-item">
                    <span>Trend</span>
                    <strong className={prediction.trend > 0 ? 'trend-up' : 'trend-down'}>
                      {prediction.trend > 0 ? '↑' : '↓'} {Math.abs(prediction.trend * 100).toFixed(1)}%
                    </strong>
                  </div>
                  <div className="detail-item">
                    <span>Historical Avg</span>
                    <strong>{prediction.historicalAvg}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Restock Date</span>
                    <strong>{new Date(prediction.nextRestockDate).toLocaleDateString()}</strong>
                  </div>
                </div>
                <div className="weather-info">
                  <h4>🌤️ Weather Impact</h4>
                  <div className="weather-details">
                    <span>Temp: {prediction.weather.temperature}°C</span>
                    <span>Humidity: {prediction.weather.humidity}%</span>
                    <span>Rainfall: {prediction.weather.rainfall}mm</span>
                    <span>Condition: {prediction.weather.condition}</span>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="recommendation-card">
                <div className={'recommendation-badge ' + (prediction.recommendation.priority || 'low')}>
                  {prediction.recommendation.action}
                </div>
                <p>{prediction.recommendation.message}</p>
                <small>Timeframe: {prediction.recommendation.timeframe}</small>
              </div>
            </div>
          )}

          {/* Prediction Chart */}
          {history.length > 0 && (
            <div className="history-chart">
              <h3>Prediction History</h3>
              <Line data={predictionChartData} options={{ 
                responsive: true,
                plugins: {
                  legend: {
                    labels: { color: '#8a8e8b' }
                  }
                },
                scales: {
                  x: {
                    ticks: { color: '#8a8e8b' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                  },
                  y: {
                    ticks: { color: '#8a8e8b' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                  }
                }
              }} />
            </div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="alerts-section">
              <h3>🚨 Active Alerts</h3>
              <div className="alerts-list">
                {alerts.map((alert) => (
                  <div key={alert.id} className={'alert-item ' + (alert.severity || 'medium')}>
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-content">
                      <strong>{alert.alert_type}</strong>
                      <p>{alert.message}</p>
                      <small>{new Date(alert.created_at).toLocaleString()}</small>
                    </div>
                    <button onClick={() => handleResolveAlert(alert.id)}>Resolve</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StockPredictionDashboard;
