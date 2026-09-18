export const SUPPLY_SCHEMA = `
  CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE UNIQUE INDEX IF NOT EXISTS suppliers_name_idx ON suppliers (lower(name)) WHERE is_active;

  CREATE SEQUENCE IF NOT EXISTS invoice_number_seq;
  CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number INTEGER NOT NULL DEFAULT nextval('invoice_number_seq'),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    outlet_id UUID REFERENCES outlets(id) ON DELETE SET NULL,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS invoices_supplier_idx ON invoices (supplier_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS invoice_items_invoice_idx ON invoice_items (invoice_id);
`
