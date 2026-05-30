CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    roles TEXT[] NOT NULL,
    CHECK (roles <@ ARRAY['ADMIN', 'PARTNER', 'SALES'])
);
