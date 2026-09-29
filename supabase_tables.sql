-- ============================================
-- GEOLOGIX - COMPLETE SUPABASE TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- VEHICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    driver VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'idle',
    fuel_level INTEGER DEFAULT 100,
    speed INTEGER DEFAULT 0,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    progress INTEGER DEFAULT 0,
    route VARCHAR(50),
    trips INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROUTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance VARCHAR(20),
    time VARCHAR(20),
    stops INTEGER DEFAULT 0,
    fuel VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DELIVERIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer VARCHAR(100) NOT NULL,
    product VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    weight DECIMAL(10,2),
    origin VARCHAR(100),
    destination VARCHAR(100),
    vehicle_id UUID REFERENCES vehicles(id),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    alert_type VARCHAR(20) NOT NULL,
    location VARCHAR(100),
    time_ago VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INCIDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    incident_id VARCHAR(20) UNIQUE NOT NULL,
    location VARCHAR(100) NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    vehicles_required INTEGER DEFAULT 0,
    time VARCHAR(20),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RISKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS risks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    area VARCHAR(100) NOT NULL,
    risk_type VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,
    score INTEGER NOT NULL,
    action VARCHAR(200) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert vehicles
INSERT INTO vehicles (vehicle_id, vehicle_type, driver, location, status, fuel_level, speed, latitude, longitude, progress, route, trips) VALUES
    ('GX-042', 'Delivery Van', 'Arun Kumar', 'Anna Nagar', 'active', 82, 42, 13.0827, 80.2707, 72, 'Route 12', 14),
    ('GX-018', 'Cargo Truck', 'Vijay Raj', 'Guindy', 'active', 67, 31, 13.0128, 80.2046, 54, 'Route 24', 9),
    ('GX-031', 'Delivery Van', 'Karthik S', 'Ambattur', 'idle', 91, 0, 13.0986, 80.1591, 38, 'Route 08', 11),
    ('GX-063', 'Medical Van', 'Praveen M', 'Velachery', 'active', 74, 48, 12.9775, 80.2203, 86, 'Route 18', 16),
    ('GX-077', 'Cargo Truck', 'Rahul K', 'Tambaram', 'maintenance', 43, 27, 12.9240, 80.1278, 61, 'Route 33', 6),
    ('GX-089', 'Delivery Van', 'Suresh P', 'T Nagar', 'active', 56, 55, 13.0339, 80.2127, 93, 'Route 07', 8),
    ('GX-101', 'Heavy Truck', 'Murali R', 'Perungudi', 'idle', 88, 0, 13.0545, 80.2495, 12, 'Route 45', 4),
    ('GX-112', 'Medical Van', 'Priya S', 'Adyar', 'active', 69, 38, 13.0065, 80.2546, 47, 'Route 19', 12);

-- Insert routes
INSERT INTO routes (name, origin, destination, distance, time, stops, fuel, status) VALUES
    ('Route 12', 'Chennai Warehouse', 'Anna Nagar', '284 km', '4h 32m', 3, '32.8 L', 'active'),
    ('Route 24', 'South Hub', 'Guindy', '196 km', '3h 15m', 2, '22.4 L', 'active'),
    ('Route 08', 'West Hub', 'Ambattur', '154 km', '2h 40m', 1, '18.6 L', 'active'),
    ('Route 18', 'Central Hub', 'Velachery', '238 km', '3h 50m', 3, '27.2 L', 'active');

-- Insert alerts
INSERT INTO alerts (title, description, alert_type, location, time_ago) VALUES
    ('Accessibility obstruction detected', 'Route 18 • Central Zone', 'critical', 'Central Zone', '4 min ago'),
    ('Vehicle running behind schedule', 'Vehicle GX-042 • Route 12', 'warning', 'Route 12', '11 min ago'),
    ('Route optimization completed', 'Route 24 • AI Optimization Engine', 'info', 'Route 24', '19 min ago');

-- Insert incidents
INSERT INTO incidents (incident_id, location, incident_type, priority, vehicles_required, time, latitude, longitude) VALUES
    ('EM-1042', 'North Chennai', 'Flood Alert', 'CRITICAL', 12, '08:42 AM', 13.12, 80.21),
    ('EM-1038', 'Guindy', 'Road Blockage', 'HIGH', 7, '08:17 AM', 13.01, 80.20),
    ('EM-1031', 'Ambattur', 'Traffic Disruption', 'MEDIUM', 4, '07:56 AM', 13.09, 80.15);

-- Insert risks
INSERT INTO risks (area, risk_type, level, score, action, details) VALUES
    ('North Chennai', 'Flood Risk', 'HIGH', 82, 'Reroute recommended', 'Heavy rainfall expected'),
    ('Ambattur', 'Traffic Congestion', 'MEDIUM', 61, 'Monitor traffic', 'Peak hour congestion'),
    ('Guindy', 'Road Blockage', 'HIGH', 76, 'Alternative route', 'Construction work'),
    ('Tambaram', 'Weather Risk', 'LOW', 32, 'Normal operation', 'Clear weather');
