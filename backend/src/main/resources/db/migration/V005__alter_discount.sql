ALTER TABLE discounts ADD COLUMN transaction_id INTEGER NOT NULL;
ALTER TABLE discounts ADD CONSTRAINT discounts_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES transactions(id);
