ALTER TABLE users DROP COLUMN referral_id;

ALTER TABLE partners ADD COLUMN key_words TEXT;
ALTER TABLE partners ADD COLUMN introduction TEXT;
ALTER TABLE partners ADD COLUMN referral_id INTEGER;

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    fulfillment_date DATE,
    seller_approved TIMESTAMP WITH TIME ZONE,
    buyer_approved TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    FOREIGN KEY (seller_id) REFERENCES partners(id),
    FOREIGN KEY (buyer_id) REFERENCES partners(id),
    CHECK (status IN ('PENDING', 'APPROVED', 'PAID', 'ACCOUNTED'))
);

CREATE TABLE discounts (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    discount INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    FOREIGN KEY (seller_id) REFERENCES partners(id),
    FOREIGN KEY (buyer_id) REFERENCES partners(id),
    CHECK (status IN ('LISTED', 'ACCOUNTED'))
);

CREATE TABLE commission_settings (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER UNIQUE,
    transaction_id INTEGER UNIQUE,
    director1_id INTEGER,
    director1_percent INTEGER,
    director2_id INTEGER,
    director2_percent INTEGER,
    director3_id INTEGER,
    director3_percent INTEGER,
    referral_id INTEGER,
    referral_percent INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    FOREIGN KEY (director1_id) REFERENCES users(id),
    FOREIGN KEY (director2_id) REFERENCES users(id),
    FOREIGN KEY (director3_id) REFERENCES users(id),
    FOREIGN KEY (referral_id) REFERENCES users(id),
    FOREIGN KEY (partner_id) REFERENCES partners(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    commission INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    CHECK (status IN ('LISTED', 'ACCOUNTED'))
);

CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER
);
