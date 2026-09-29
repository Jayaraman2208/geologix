// ============================================
// GEOLOGIX BACKEND SERVER
// Smarter Routes. Stronger NER.
// ============================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'GEOLOGIX Backend',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// GET AVAILABLE PARTNERS
// ============================================
app.get('/api/partners', async (req, res) => {
    try {
        const { lat, lng, radius, vehicleType } = req.query;

        // Mock data (works without database)
        const mockPartners = [
            {
                id: 'DP001',
                name: 'Arun Kumar',
                vehicle_type: 'Delivery Van',
                latitude: 13.0827,
                longitude: 80.2707,
                status: 'online',
                is_available: true,
                rating: 4.8,
                total_deliveries: 150,
                distance_km: 2.3,
                eta_minutes: 8,
                ai_score: 94
            },
            {
                id: 'DP002',
                name: 'Vijay Raj',
                vehicle_type: 'Cargo Truck',
                latitude: 13.0892,
                longitude: 80.2765,
                status: 'online',
                is_available: true,
                rating: 4.5,
                total_deliveries: 120,
                distance_km: 4.1,
                eta_minutes: 14,
                ai_score: 87
            },
            {
                id: 'DP003',
                name: 'Karthik S',
                vehicle_type: '2-Wheeler',
                latitude: 13.0750,
                longitude: 80.2650,
                status: 'online',
                is_available: true,
                rating: 4.2,
                total_deliveries: 200,
                distance_km: 5.7,
                eta_minutes: 19,
                ai_score: 76
            },
            {
                id: 'DP004',
                name: 'Praveen M',
                vehicle_type: 'Medical Van',
                latitude: 13.0950,
                longitude: 80.2850,
                status: 'online',
                is_available: true,
                rating: 4.6,
                total_deliveries: 80,
                distance_km: 7.2,
                eta_minutes: 24,
                ai_score: 82
            },
            {
                id: 'DP005',
                name: 'Suresh P',
                vehicle_type: '4-Wheeler',
                latitude: 13.0700,
                longitude: 80.2600,
                status: 'online',
                is_available: true,
                rating: 4.0,
                total_deliveries: 180,
                distance_km: 8.8,
                eta_minutes: 29,
                ai_score: 69
            }
        ];

        // Filter by vehicle type if provided
        let filtered = mockPartners;
        if (vehicleType) {
            filtered = filtered.filter(p => p.vehicle_type === vehicleType);
        }

        // Filter by radius
        if (radius) {
            filtered = filtered.filter(p => p.distance_km <= parseFloat(radius));
        }

        res.json({
            success: true,
            count: filtered.length,
            data: filtered
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// GET BEST PARTNER
// ============================================
app.get('/api/partners/best', async (req, res) => {
    try {
        const { lat, lng, radius, vehicleType } = req.query;

        // Mock partner data
        const partners = [
            { id: 'DP001', name: 'Arun Kumar', distance_km: 2.3, rating: 4.8, total_deliveries: 150, ai_score: 94, vehicle_type: 'Delivery Van', eta_minutes: 8 },
            { id: 'DP002', name: 'Vijay Raj', distance_km: 4.1, rating: 4.5, total_deliveries: 120, ai_score: 87, vehicle_type: 'Cargo Truck', eta_minutes: 14 },
            { id: 'DP003', name: 'Karthik S', distance_km: 5.7, rating: 4.2, total_deliveries: 200, ai_score: 76, vehicle_type: '2-Wheeler', eta_minutes: 19 },
            { id: 'DP004', name: 'Praveen M', distance_km: 7.2, rating: 4.6, total_deliveries: 80, ai_score: 82, vehicle_type: 'Medical Van', eta_minutes: 24 },
            { id: 'DP005', name: 'Suresh P', distance_km: 8.8, rating: 4.0, total_deliveries: 180, ai_score: 69, vehicle_type: '4-Wheeler', eta_minutes: 29 }
        ];

        // Sort by AI score
        partners.sort((a, b) => b.ai_score - a.ai_score);

        res.json({
            success: true,
            best_partner: partners[0],
            alternatives: partners.slice(1, 5),
            total_available: partners.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// ASSIGN ORDER
// ============================================
app.post('/api/orders/assign', (req, res) => {
    try {
        const { orderId, partnerId } = req.body;

        if (!orderId || !partnerId) {
            return res.status(400).json({
                success: false,
                error: 'Order ID and Partner ID are required'
            });
        }

        res.json({
            success: true,
            message: 'Order assigned successfully',
            data: {
                order_id: orderId,
                partner_id: partnerId,
                status: 'assigned',
                assigned_at: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log('');
    console.log('=========================================');
    console.log('  🚀 GEOLOGIX Backend Running');
    console.log('=========================================');
    console.log(`  📍 Port: ${PORT}`);
    console.log(`  🌐 URL: http://localhost:${PORT}`);
    console.log(`  ❤️  Health: http://localhost:${PORT}/api/health`);
    console.log(`  📦 Partners: http://localhost:${PORT}/api/partners`);
    console.log('=========================================');
    console.log('');
});
