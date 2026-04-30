-- Initialize PostgreSQL Tables for IMS

CREATE TABLE IF NOT EXISTS work_items (
    id SERIAL PRIMARY KEY,
    component_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- OPEN, INVESTIGATING, RESOLVED, CLOSED
    severity VARCHAR(10) DEFAULT 'P2',
    rca JSONB,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP
);

-- Index for faster lookups by component_id
CREATE INDEX IF NOT EXISTS idx_component_id ON work_items(component_id);
-- Index for active incidents
CREATE INDEX IF NOT EXISTS idx_status ON work_items(status);
