ALTER TABLE commissions DROP CONSTRAINT commissions_status_check;
ALTER TABLE commissions ADD CONSTRAINT commissions_status_check CHECK (status IN ('LISTED', 'ACCOUNTED', 'INVOICED'));
