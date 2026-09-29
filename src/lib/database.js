// src/lib/database.js
// Database integration utilities for Rider Assistant
import supabase from './supabase';

export const DatabaseUtils = {
  async getAvailablePartners(filters = {}) {
    let query = supabase
      .from('delivery_partners')
      .select('*, vehicles(*)')
      .eq('is_available', true)
      .eq('status', 'online');

    if (filters.vehicleType) {
      query = query.eq('vehicle_type', filters.vehicleType);
    }

    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getPartnerMetrics(partnerId) {
    const { data, error } = await supabase
      .from('partner_statistics')
      .select('*')
      .eq('partner_id', partnerId)
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data;
  },

  async getPartnerRatingTrends(partnerId) {
    const { data, error } = await supabase
      .from('partner_ratings')
      .select('rating, created_at')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },

  async updateBulkAvailability(partnerIds, isAvailable) {
    const { data, error } = await supabase
      .from('delivery_partners')
      .update({ is_available: isAvailable })
      .in('id', partnerIds)
      .select();

    if (error) throw error;
    return data;
  },

  async getOptimalPartner(criteria) {
    const partners = await this.getAvailablePartners(criteria);
    
    const scored = partners.map(partner => {
      let score = 0;
      
      if (criteria.location) {
        const distance = calculateDistance(
          criteria.location.lat,
          criteria.location.lng,
          partner.latitude,
          partner.longitude
        );
        score += (1 / (distance + 1)) * 30;
      }

      score += (partner.rating / 5) * 25;
      score += Math.min(1, partner.total_deliveries / 100) * 25;
      score += partner.is_available ? 20 : 0;

      return { ...partner, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0] || null;
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
