export const MONEY_SCHEMA = `
  CREATE TABLE IF NOT EXISTS cash_moves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    cashier_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    kind TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS cash_moves_shift_idx ON cash_moves (shift_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS debtors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE UNIQUE INDEX IF NOT EXISTS debtors_name_idx ON debtors (lower(name)) WHERE is_active;

  CREATE TABLE IF NOT EXISTS debt_moves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debtor_id UUID NOT NULL REFERENCES debtors(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS debt_moves_debtor_idx ON debt_moves (debtor_id, created_at DESC);
`
