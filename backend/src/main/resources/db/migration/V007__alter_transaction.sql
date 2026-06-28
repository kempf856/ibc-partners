ALTER TABLE transactions ADD COLUMN seller_approver INTEGER;
ALTER TABLE transactions ADD COLUMN buyer_approver INTEGER;

ALTER TABLE transactions ADD CONSTRAINT transactions_seller_approver_fkey FOREIGN KEY (seller_approver) REFERENCES users(id);
ALTER TABLE transactions ADD CONSTRAINT transactions_buyer_approver_fkey FOREIGN KEY (buyer_approver) REFERENCES users(id);
