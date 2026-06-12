CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT NOT NULL,
    phone TEXT,
    roles TEXT[] NOT NULL,
    one_time_password UUID,
    referral_code TEXT UNIQUE,
    referral_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    CHECK (roles <@ ARRAY['ADMIN', 'PARTNER', 'SALES']),
    FOREIGN KEY (referral_id) REFERENCES users(id)
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_name TEXT NOT NULL,
    tax_number TEXT NOT NULL,
    source TEXT NOT NULL,
    comment TEXT,
    state TEXT NOT NULL,
    sales_id INTEGER,
    referral_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    CHECK (state IN ('CREATED', 'IN_PROGRESS', 'ACCEPTED', 'DENIED')),
    FOREIGN KEY (sales_id) REFERENCES users(id)
);
