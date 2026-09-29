const API_BASE_URL = '/api';

export const api = {
  // Health check
  healthCheck: async function() {
    try {
      const response = await fetch(API_BASE_URL + '/health/');
      if (!response.ok) throw new Error('Backend not responding');
      return await response.json();
    } catch (error) {
      console.warn('?? Backend not available:', error.message);
      return { status: 'offline', message: 'Backend not running' };
    }
  },

  // Dashboard Stats
  getDashboardStats: async function() {
    try {
      // Try backend first
      const response = await fetch(API_BASE_URL + '/stock-movements/dashboard_stats/');
      if (response.ok) {
        const data = await response.json();
        return {
          activeVehicles: data.total_delivered || 128,
          activeRoutes: data.state_wise?.length || 46,
          totalDeliveries: data.total_delivered || 1247,
          activeAlerts: 7,
          source: 'backend'
        };
      }
      throw new Error('Backend API failed');
    } catch (error) {
      console.warn('?? Using fallback data:', error.message);
      // Return fallback data
      return {
        activeVehicles: 128,
        activeRoutes: 46,
        totalDeliveries: 1247,
        activeAlerts: 7,
        source: 'fallback'
      };
    }
  },

  // Stock Movements
  getStockMovements: async function() {
    try {
      const response = await fetch(API_BASE_URL + '/stock-movements/');
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.warn('?? Stock movements error:', error.message);
      return [];
    }
  },

  // Delivery Partners
  getDeliveryPartners: async function() {
    try {
      const response = await fetch(API_BASE_URL + '/delivery-partners/');
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.warn('?? Delivery partners error:', error.message);
      return [];
    }
  }
};

export default api;
