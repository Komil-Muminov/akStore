export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holder_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS host_name TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS organization TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS purpose TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS car_plate TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS host_user_id UUID;
  CREATE INDEX IF NOT EXISTS passes_status_idx ON passes (status);

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
`

export const SEED_LEADERSHIP = { name: 'Руководство' }
