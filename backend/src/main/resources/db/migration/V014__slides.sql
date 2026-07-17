CREATE TABLE slides (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    slide TEXT NOT NULL,
    active BOOLEAN NOT NULL,
    visible_from DATE,
    visible_to DATE,
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER
);
