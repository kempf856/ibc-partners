CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT NOT NULL,
    roles TEXT[] NOT NULL,
    one_time_password UUID,
    CHECK (roles <@ ARRAY['ADMIN', 'PARTNER', 'SALES'])
);
