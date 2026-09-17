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

  CREATE SEQUENCE IF NOT EXISTS pass_code_seq;
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS code TEXT;
  UPDATE passes SET code = 'GP-' || to_char(created_at, 'YYYY') || '-' ||
    lpad(nextval('pass_code_seq')::text, 6, '0') WHERE code IS NULL;
  ALTER TABLE passes ALTER COLUMN code SET DEFAULT 'GP-' || to_char(now(), 'YYYY') || '-' ||
    lpad(nextval('pass_code_seq')::text, 6, '0');
  CREATE UNIQUE INDEX IF NOT EXISTS passes_code_idx ON passes (code);

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

  CREATE TABLE IF NOT EXISTS pass_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pass_id UUID NOT NULL REFERENCES passes(id) ON DELETE CASCADE,
    direction TEXT NOT NULL,
    guard_id UUID REFERENCES users(id) ON DELETE SET NULL,
    happened_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS pass_entries_pass_idx ON pass_entries (pass_id, happened_at DESC);
  CREATE INDEX IF NOT EXISTS pass_entries_time_idx ON pass_entries (happened_at DESC);
`

export const SEED_LEADERSHIP = { name: 'Руководство' }
