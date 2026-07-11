CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER,
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE commissions ADD COLUMN invoice_id INTEGER;
ALTER TABLE commissions ADD CONSTRAINT commissions_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES invoices(id);

ALTER TABLE commissions DROP CONSTRAINT commissions_status_check;
ALTER TABLE commissions ADD CONSTRAINT commissions_status_check CHECK (status IN ('LISTED', 'ACCOUNTED'));

