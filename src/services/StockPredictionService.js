import * as tf from '@tensorflow/tfjs';
import supabase from '../lib/supabase';

class StockPredictionService {
  constructor() {
    this.model = null;
    this.isTraining = false;
    this.trainingData = null;
  }

  // ============================================
  // FETCH DATA FROM SUPABASE
  // ============================================

  async fetchStockData(productId = null, days = 30) {
    try {
      let query = supabase
        .from('stock_movements')
        .select('*, products(name), warehouses(name)')
        .gte('movement_date', new Date(Date.now() - days * 86400000).toISOString())
        .order('movement_date', { ascending: true });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return this.getMockStockData();
    }
  }

  // Mock data for testing
  getMockStockData() {
    const data = [];
    const products = ['Rice', 'Wheat', 'Medicines', 'Fuel', 'Food Supplies'];
    const states = ['Assam', 'Meghalaya', 'Manipur', 'Nagaland', 'Tripura'];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        id: i,
        product_id: Math.floor(Math.random() * 5) + 1,
        products: { name: products[Math.floor(Math.random() * 5)] },
        quantity: Math.floor(Math.random() * 500) + 50,
        to_state: states[Math.floor(Math.random() * 5)],
        movement_date: date.toISOString()
      });
    }
    return data;
  }

  // ============================================
  // FETCH WEATHER DATA
  // ============================================

  async fetchWeatherData(location = 'Guwahati') {
    try {
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .eq('location', location)
        .order('recorded_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0] || { temperature: 25, humidity: 70, rainfall: 0, condition: 'Clear' };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return { temperature: 25, humidity: 70, rainfall: 0, condition: 'Clear' };
    }
  }

  // ============================================
  // BUILD AI MODEL
  // ============================================

  buildModel() {
    this.model = tf.sequential();
    
    // Input: day_of_week, quantity, temp, humidity, rainfall, previous_demand
    this.model.add(tf.layers.dense({
      inputShape: [6],
      units: 32,
      activation: 'relu',
      kernelInitializer: 'heNormal'
    }));
    
    this.model.add(tf.layers.dropout({ rate: 0.2 }));
    
    this.model.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
      kernelInitializer: 'heNormal'
    }));
    
    this.model.add(tf.layers.dropout({ rate: 0.1 }));
    
    this.model.add(tf.layers.dense({
      units: 8,
      activation: 'relu'
    }));
    
    this.model.add(tf.layers.dense({
      units: 1,
      activation: 'linear'
    }));
    
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
    
    return this.model;
  }

  // ============================================
  // TRAIN MODEL
  // ============================================

  async trainModel(stockData, weatherData, epochs = 50) {
    if (!this.model) {
      this.buildModel();
    }

    const features = [];
    const labels = [];

    for (let i = 1; i < stockData.length - 1; i++) {
      const current = stockData[i];
      const previous = stockData[i - 1];
      const next = stockData[i + 1];
      
      const dayOfWeek = new Date(current.movement_date).getDay();
      
      features.push([
        dayOfWeek / 6,
        current.quantity / 1000,
        (weatherData.temperature || 25) / 45,
        (weatherData.humidity || 70) / 100,
        (weatherData.rainfall || 0) / 50,
        previous.quantity / 1000
      ]);
      
      labels.push(next.quantity / 1000);
    }

    if (features.length < 5) {
      console.warn('Not enough data for training');
      return { success: false, error: 'Insufficient data' };
    }

    this.isTraining = true;

    try {
      const featuresTensor = tf.tensor2d(features);
      const labelsTensor = tf.tensor2d(labels, [labels.length, 1]);

      const history = await this.model.fit(featuresTensor, labelsTensor, {
        epochs: epochs,
        batchSize: Math.min(16, Math.floor(features.length / 2)),
        validationSplit: 0.15,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log('Epoch ' + epoch + '/' + epochs + ': loss = ' + logs.loss.toFixed(4) + ', mae = ' + logs.mae.toFixed(4));
            }
          }
        }
      });

      featuresTensor.dispose();
      labelsTensor.dispose();

      this.isTraining = false;
      
      return {
        success: true,
        loss: history.history.loss[history.history.loss.length - 1],
        mae: history.history.mae[history.history.mae.length - 1]
      };
    } catch (error) {
      this.isTraining = false;
      console.error('Training error:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // PREDICT FUTURE STOCK
  // ============================================

  async predictStock(productId, location, daysAhead = 7) {
    try {
      const stockData = await this.fetchStockData(productId, 30);
      const weatherData = await this.fetchWeatherData(location);
      
      if (stockData.length < 3) {
        return this.getFallbackPrediction(stockData);
      }

      const latest = stockData[stockData.length - 1];
      const previous = stockData[stockData.length - 2] || latest;

      const features = [
        new Date().getDay() / 6,
        latest.quantity / 1000,
        (weatherData.temperature || 25) / 45,
        (weatherData.humidity || 70) / 100,
        (weatherData.rainfall || 0) / 50,
        previous.quantity / 1000
      ];

      let predictedQuantity;
      let confidence = 0.7;

      if (this.model && !this.isTraining) {
        const inputTensor = tf.tensor2d([features]);
        const prediction = this.model.predict(inputTensor);
        predictedQuantity = prediction.dataSync()[0] * 1000;
        inputTensor.dispose();
        prediction.dispose();
        confidence = 0.85;
      } else {
        // Fallback prediction
        const avgQuantity = stockData.reduce((sum, d) => sum + d.quantity, 0) / stockData.length;
        const trend = this.calculateTrend(stockData);
        predictedQuantity = avgQuantity * (1 + trend * 0.15);
        confidence = 0.6;
      }

      const recommendation = this.getRecommendation(predictedQuantity, stockData, location);

      // Save prediction to database
      await this.savePrediction(productId, null, Math.round(predictedQuantity), confidence);

      // Check if alert needed
      await this.checkAndCreateAlert(productId, null, Math.round(predictedQuantity), stockData);

      return {
        predictedQuantity: Math.round(Math.max(predictedQuantity, 10)),
        confidence: confidence,
        weather: weatherData,
        historicalAvg: Math.round(stockData.reduce((sum, d) => sum + d.quantity, 0) / stockData.length),
        trend: this.calculateTrend(stockData),
        recommendation: recommendation,
        nextRestockDate: this.calculateRestockDate(predictedQuantity, stockData),
        location: location
      };
    } catch (error) {
      console.error('Prediction error:', error);
      return this.getFallbackPrediction([]);
    }
  }

  // ============================================
  // CALCULATE TREND
  // ============================================

  calculateTrend(data) {
    if (!data || data.length < 3) return 0;
    
    const recent = data.slice(-7);
    const older = data.slice(-14, -7);
    
    if (recent.length === 0 || older.length === 0) return 0;
    
    const recentAvg = recent.reduce((s, d) => s + d.quantity, 0) / recent.length;
    const olderAvg = older.reduce((s, d) => s + d.quantity, 0) / older.length;
    
    if (olderAvg === 0) return 0;
    return (recentAvg - olderAvg) / olderAvg;
  }

  // ============================================
  // GET RECOMMENDATION
  // ============================================

  getRecommendation(predictedQuantity, stockData, location) {
    const avgQuantity = stockData.length > 0 
      ? stockData.reduce((sum, d) => sum + d.quantity, 0) / stockData.length 
      : 100;
    
    const ratio = predictedQuantity / avgQuantity;
    
    if (ratio > 1.5) {
      return {
        action: '🚨 URGENT RESTOCK NEEDED',
        message: 'Predicted demand of ' + Math.round(predictedQuantity) + ' units exceeds average by ' + Math.round((ratio - 1) * 100) + '%. Immediate restock recommended for ' + location + '.',
        priority: 'critical',
        timeframe: 'Immediate'
      };
    } else if (ratio > 1.2) {
      return {
        action: '⚠️ RESTOCK SOON',
        message: 'Predicted demand of ' + Math.round(predictedQuantity) + ' units is ' + Math.round((ratio - 1) * 100) + '% above average. Plan restock within 2-3 days.',
        priority: 'high',
        timeframe: '2-3 days'
      };
    } else if (ratio < 0.7) {
      return {
        action: '📊 REVIEW STOCK LEVELS',
        message: 'Predicted demand of ' + Math.round(predictedQuantity) + ' units is below average. Consider reducing stock or investigating demand drop.',
        priority: 'medium',
        timeframe: 'Review this week'
      };
    } else {
      return {
        action: '✅ STOCK LEVELS OPTIMAL',
        message: 'Predicted demand of ' + Math.round(predictedQuantity) + ' units is within normal range. Maintain current stock levels.',
        priority: 'low',
        timeframe: 'Monitor weekly'
      };
    }
  }

  // ============================================
  // CALCULATE RESTOCK DATE
  // ============================================

  calculateRestockDate(predictedQuantity, stockData) {
    if (stockData.length < 2) {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date;
    }
    
    const avgDailyUsage = stockData.reduce((sum, d) => sum + d.quantity, 0) / stockData.length / 30;
    if (avgDailyUsage === 0) {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date;
    }
    
    const daysUntilRestock = Math.max(1, Math.round(predictedQuantity / avgDailyUsage));
    const date = new Date();
    date.setDate(date.getDate() + daysUntilRestock);
    return date;
  }

  // ============================================
  // SAVE PREDICTION TO DATABASE
  // ============================================

  async savePrediction(productId, warehouseId, quantity, confidence) {
    try {
      const { error } = await supabase
        .from('stock_predictions')
        .insert([{
          product_id: productId,
          warehouse_id: warehouseId,
          predicted_quantity: quantity,
          confidence: confidence,
          prediction_date: new Date().toISOString()
        }]);
      
      if (error) throw error;
      console.log('✅ Prediction saved to database');
    } catch (error) {
      console.error('Error saving prediction:', error);
    }
  }

  // ============================================
  // CHECK AND CREATE ALERT
  // ============================================

  async checkAndCreateAlert(productId, warehouseId, predictedQuantity, stockData) {
    const avgQuantity = stockData.length > 0 
      ? stockData.reduce((sum, d) => sum + d.quantity, 0) / stockData.length 
      : 100;
    
    const ratio = predictedQuantity / avgQuantity;
    
    if (ratio > 1.5) {
      const { error } = await supabase
        .from('stock_alerts')
        .insert([{
          product_id: productId,
          warehouse_id: warehouseId,
          alert_type: 'critical_stock',
          message: 'URGENT: Stock demand predicted to exceed normal levels by ' + Math.round((ratio - 1) * 100) + '%. Immediate restock needed.',
          severity: 'critical',
          is_resolved: false
        }]);
      
      if (error) console.error('Error creating alert:', error);
    }
  }

  // ============================================
  // FALLBACK PREDICTION
  // ============================================

  getFallbackPrediction(stockData) {
    const avgQuantity = stockData.length > 0 
      ? stockData.reduce((sum, d) => sum + d.quantity, 0) / stockData.length 
      : 100;
    
    return {
      predictedQuantity: Math.round(avgQuantity * 1.1),
      confidence: 0.5,
      weather: { temperature: 25, humidity: 70, rainfall: 0, condition: 'Unknown' },
      historicalAvg: Math.round(avgQuantity),
      trend: 0,
      recommendation: {
        action: '📊 INSUFFICIENT DATA',
        message: 'Not enough historical data for accurate prediction. Please collect more data.',
        priority: 'low',
        timeframe: 'Collect data for 2 weeks'
      },
      nextRestockDate: new Date(Date.now() + 3 * 86400000),
      location: 'Unknown'
    };
  }

  // ============================================
  // GET PREDICTION HISTORY
  // ============================================

  async getPredictionHistory(productId = null, days = 7) {
    try {
      let query = supabase
        .from('stock_predictions')
        .select('*, products(name)')
        .gte('prediction_date', new Date(Date.now() - days * 86400000).toISOString())
        .order('prediction_date', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching prediction history:', error);
      return [];
    }
  }

  // ============================================
  // GET ACTIVE ALERTS
  // ============================================

  async getActiveAlerts() {
    try {
      const { data, error } = await supabase
        .from('stock_alerts')
        .select('*, products(name)')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  // ============================================
  // RESOLVE ALERT
  // ============================================

  async resolveAlert(alertId) {
    try {
      const { error } = await supabase
        .from('stock_alerts')
        .update({ is_resolved: true })
        .eq('id', alertId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error resolving alert:', error);
      return { success: false };
    }
  }
}

export default StockPredictionService;
