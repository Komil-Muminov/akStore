export const SCHEMA = `

  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    rank INTEGER NOT NULL DEFAULT 100
  );

  CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    parent_id UUID REFERENCES units(id) ON DELETE RESTRICT,
    layout_x DOUBLE PRECISION NOT NULL DEFAULT 0,
    layout_y DOUBLE PRECISION NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS units_parent_idx ON units (parent_id);

  CREATE TABLE IF NOT EXISTS unit_positions (
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    position_id UUID NOT NULL REFERENCES positions(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (unit_id, position_id)
  );
  ALTER TABLE unit_positions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

  CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    direct_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS chat_participants (
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT to_timestamp(0),
    PRIMARY KEY (conversation_id, user_id)
  );
  CREATE INDEX IF NOT EXISTS chat_participants_user_idx ON chat_participants (user_id);

  CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS chat_messages_conversation_idx ON chat_messages (conversation_id, created_at);
  ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'direct';
  ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
  ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;
  ALTER TABLE chat_conversations ALTER COLUMN direct_key DROP NOT NULL;
  ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;
  ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
  ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_name TEXT NOT NULL DEFAULT '';
  ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_path TEXT NOT NULL DEFAULT '';
  ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_size BIGINT NOT NULL DEFAULT 0;
  ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_mime TEXT NOT NULL DEFAULT '';
`

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
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS products_name_idx ON products (name);
  CREATE INDEX IF NOT EXISTS products_active_idx ON products (is_active);

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
`

export const SEED_LEADERSHIP = { name: 'Руководство' }
