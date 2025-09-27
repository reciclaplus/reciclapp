-- Database schema for ReciclApp PostgreSQL migration
-- This replaces Firebase/Firestore collections with SQL tables

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (replaces 'users' Firestore collection)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PDR (Points of Recycling) table (replaces 'pdr' Firestore collection)
CREATE TABLE pdr (
    id SERIAL PRIMARY KEY,
    internal_id INTEGER UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    barrio VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    comunidad VARCHAR(255),
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recogida (Collection) table (replaces 'recogida' Firestore collection)
CREATE TABLE recogida (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pdr_id INTEGER REFERENCES pdr(id) ON DELETE CASCADE,
    pdr_internal_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    week INTEGER NOT NULL,
    was_collected VARCHAR(20) NOT NULL DEFAULT 'no',
    weight DECIMAL(10, 2),
    notes TEXT,
    collected_by VARCHAR(255),
    collection_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique collection record per PDR per week
    UNIQUE(pdr_internal_id, year, week)
);

-- PDR Logs table (replaces 'pdr_logs' Firestore collection)
CREATE TABLE pdr_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(50) NOT NULL,
    pdr_id INTEGER REFERENCES pdr(id) ON DELETE SET NULL,
    pdr_data JSONB, -- Store the full PDR data as JSON for flexibility
    user_email VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_pdr_barrio ON pdr(barrio);
CREATE INDEX idx_pdr_categoria ON pdr(categoria);
CREATE INDEX idx_pdr_active ON pdr(active);
CREATE INDEX idx_pdr_lat_lng ON pdr(lat, lng);

CREATE INDEX idx_recogida_pdr_internal_id ON recogida(pdr_internal_id);
CREATE INDEX idx_recogida_year_week ON recogida(year, week);
CREATE INDEX idx_recogida_collection_date ON recogida(collection_date);

CREATE INDEX idx_pdr_logs_action ON pdr_logs(action);
CREATE INDEX idx_pdr_logs_timestamp ON pdr_logs(timestamp);

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdr_updated_at BEFORE UPDATE ON pdr
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recogida_updated_at BEFORE UPDATE ON recogida
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO users (email, name, picture) VALUES
    ('admin@reciclapp.com', 'Admin User', 'https://example.com/admin.jpg'),
    ('user@reciclapp.com', 'Test User', 'https://example.com/user.jpg');

INSERT INTO pdr (internal_id, nombre, descripcion, barrio, categoria, comunidad, lat, lng) VALUES
    (1, 'Casa familia Rodriguez', 'Casa particular en barrio central', 'Barrio Blanco', 'casa', 'Sabana Yegua', 18.4562141, -70.8290000),
    (2, 'Escuela Nacional', 'Escuela primaria local', 'Barrio Pintado', 'escuela', 'Sabana Yegua', 18.4606607, -70.8405734),
    (3, 'Colmado Maria', 'Negocio local de abarrotes', 'Barrio Nuevo', 'negocio', 'Sabana Yegua', 18.4580000, -70.8350000);

INSERT INTO recogida (pdr_internal_id, year, week, was_collected, weight) VALUES
    (1, 2024, 1, 'si', 5.5),
    (1, 2024, 2, 'no', 0),
    (2, 2024, 1, 'si', 12.3),
    (3, 2024, 1, 'si', 8.7);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO reciclapp_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO reciclapp_user;