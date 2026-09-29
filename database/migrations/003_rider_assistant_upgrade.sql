-- ============================================
-- GEOLOGIX DATABASE MIGRATION
-- Rider Assistant Enhancement
-- ============================================

-- Add new columns to delivery_partners
ALTER TABLE delivery_partners 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS shift_preference VARCHAR(20) DEFAULT 'any',
ADD COLUMN IF NOT EXISTS max_orders INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMP,
ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(3,2) DEFAULT 0.95,
ADD COLUMN IF NOT EXISTS on_time_rate DECIMAL(3,2) DEFAULT 0.92,
ADD COLUMN IF NOT EXISTS positive_feedback_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_feedback_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_assignments INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reliability_score INTEGER DEFAULT 70;

-- Create partner_assignments table
CREATE TABLE IF NOT EXISTS partner_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES delivery_partners(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active',
    assignment_type VARCHAR(20) DEFAULT 'auto',
    priority VARCHAR(20) DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create partner_statistics table
CREATE TABLE IF NOT EXISTS partner_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES delivery_partners(id) ON DELETE CASCADE,
    period VARCHAR(20) DEFAULT 'daily',
    date DATE DEFAULT CURRENT_DATE,
    deliveries_completed INTEGER DEFAULT 0,
    total_hours_worked INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    earnings DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(partner_id, period, date)
);

-- Create partner_ratings table
CREATE TABLE IF NOT EXISTS partner_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES delivery_partners(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(order_id, partner_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_delivery_partners_location 
ON delivery_partners(latitude, longitude) 
WHERE status = 'online';

CREATE INDEX IF NOT EXISTS idx_delivery_partners_availability 
ON delivery_partners(is_available, status);

CREATE INDEX IF NOT EXISTS idx_partner_assignments_order 
ON partner_assignments(order_id, partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_statistics_date 
ON partner_statistics(partner_id, date);
