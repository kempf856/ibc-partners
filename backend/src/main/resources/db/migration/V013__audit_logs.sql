CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    description TEXT,
    before JSONB,
    after JSONB,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    CHECK (event_type IN ('COMMISSION_SETTING_CHANGED'))
);
