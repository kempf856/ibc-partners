CREATE TABLE discount_accounts (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    all_discounts INTEGER NOT NULL,
    available_balance INTEGER NOT NULL,
    blocked_balance INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    FOREIGN KEY (seller_id) REFERENCES partners(id),
    FOREIGN KEY (buyer_id) REFERENCES partners(id)
);

ALTER TABLE transactions ADD COLUMN discount INTEGER NOT NULL DEFAULT 0;

