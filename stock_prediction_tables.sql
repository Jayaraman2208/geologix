-- ============================================
-- AI STOCK PREDICTION TABLES
-- GEOLOGIX - Smart Stock Management
-- ============================================

-- Stock predictions table
CREATE TABLE IF NOT EXISTS stock_predictions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    predicted_quantity INTEGER NOT NULL,
    actual_quantity INTEGER,
    confidence DECIMAL(5,2),
    prediction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock alerts table
CREATE TABLE IF NOT EXISTS stock_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'warning',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather data table (for prediction factors)
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    rainfall DECIMAL(5,2),
    condition VARCHAR(50),
    recorded_at DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample weather data for NER region
INSERT INTO weather_data (location, temperature, humidity, rainfall, condition, recorded_at) VALUES
    ('Guwahati', 22.5, 82, 15.2, 'Rainy', CURRENT_DATE),
    ('Shillong', 18.3, 78, 8.5, 'Cloudy', CURRENT_DATE),
    ('Imphal', 24.1, 72, 5.0, 'Partly Cloudy', CURRENT_DATE),
    ('Aizawl', 20.8, 75, 12.0, 'Rainy', CURRENT_DATE),
    ('Kohima', 19.2, 70, 3.5, 'Clear', CURRENT_DATE);
