CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    tax_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    headquarters TEXT NOT NULL,
    site TEXT,
    phone TEXT,
    website TEXT,
    activities INTEGER[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER
);

CREATE TABLE partner_memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    partner_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    CHECK (role IN ('OWNER', 'EMPLOYEE')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (partner_id) REFERENCES partners(id)
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    activity TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER
);
