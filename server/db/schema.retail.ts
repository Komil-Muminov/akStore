export const RETAIL_SCHEMA = `
  CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode TEXT UNIQUE,
    name TEXT NOT NULL,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    unit TEXT NOT NULL DEFAULT 'piece',
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    sale_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    stock NUMERIC(12, 3) NOT NULL DEFAULT 0,
    vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
    mark_code TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS products_name_idx ON products (name);
  CREATE INDEX IF NOT EXISTS products_active_idx ON products (is_active);
  ALTER TABLE products ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT false;
  ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock NUMERIC(12, 3) NOT NULL DEFAULT 0;

  CREATE TABLE IF NOT EXISTS stock_moves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    note TEXT NOT NULL DEFAULT '',
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS stock_moves_product_idx ON stock_moves (product_id, created_at DESC);

  CREATE SEQUENCE IF NOT EXISTS shift_number_seq;
  CREATE TABLE IF NOT EXISTS shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number INTEGER NOT NULL DEFAULT nextval('shift_number_seq'),
    cashier_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at TIMESTAMPTZ,
    opening_cash NUMERIC(12, 2) NOT NULL DEFAULT 0,
    closing_cash NUMERIC(12, 2),
    note TEXT NOT NULL DEFAULT ''
  );
  CREATE UNIQUE INDEX IF NOT EXISTS shifts_open_idx ON shifts (cashier_id) WHERE closed_at IS NULL;

  CREATE SEQUENCE IF NOT EXISTS receipt_number_seq;
  CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number INTEGER NOT NULL DEFAULT nextval('receipt_number_seq'),
    shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE RESTRICT,
    cashier_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    payment TEXT NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS sales_shift_idx ON sales (shift_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS sales_time_idx ON sales (created_at DESC);
  ALTER TABLE sales ADD COLUMN IF NOT EXISTS fiscal_number TEXT NOT NULL DEFAULT '';
  ALTER TABLE sales ADD COLUMN IF NOT EXISTS fiscal_sign TEXT NOT NULL DEFAULT '';
  ALTER TABLE sales ADD COLUMN IF NOT EXISTS fiscal_device TEXT NOT NULL DEFAULT '';
  ALTER TABLE sales ADD COLUMN IF NOT EXISTS fiscal_at TIMESTAMPTZ;
  ALTER TABLE sales ADD COLUMN IF NOT EXISTS fiscal_qr TEXT NOT NULL DEFAULT '';
  ALTER TABLE sales ADD COLUMN IF NOT EXISTS vat_total NUMERIC(12, 2) NOT NULL DEFAULT 0;
  ALTER TABLE sales ADD COLUMN IF NOT EXISTS cash_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;
  ALTER TABLE sales ADD COLUMN IF NOT EXISTS card_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;
  ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS discount NUMERIC(12, 2) NOT NULL DEFAULT 0;

  CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS sale_items_sale_idx ON sale_items (sale_id);
  ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 0;
  ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS vat_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;
  ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS mark_code TEXT NOT NULL DEFAULT '';

  CREATE TABLE IF NOT EXISTS parked_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cashier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note TEXT NOT NULL DEFAULT '',
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    lines JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS parked_sales_cashier_idx ON parked_sales (cashier_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS fiscal_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    next_try_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    done_at TIMESTAMPTZ
  );
  CREATE UNIQUE INDEX IF NOT EXISTS fiscal_queue_pending_idx ON fiscal_queue (sale_id, kind) WHERE done_at IS NULL;
  CREATE INDEX IF NOT EXISTS fiscal_queue_order_idx ON fiscal_queue (next_try_at) WHERE done_at IS NULL;
`
