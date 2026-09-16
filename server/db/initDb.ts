import pg from 'pg'
import { config } from '../config'
import { UnitType, UserRole } from '../types'
import { pool } from './pool'
import { SCHEMA, SEED_LEADERSHIP, SEED_POSITIONS } from './schema'
import { usersDb } from './users.db'

const MAINTENANCE_DB = 'postgres'
const DB_NAME_PATTERN = /^[a-z_][a-z0-9_]*$/

const ensureDatabase = async () => {
  if (!DB_NAME_PATTERN.test(config.db.database)) {
    throw new Error(`Недопустимое имя базы данных: ${config.db.database}`)
  }
  const client = new pg.Client({ ...config.db, database: MAINTENANCE_DB })
  await client.connect()
  try {
    const existing = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [config.db.database])
    if (existing.rowCount === 0) {
      await client.query(`CREATE DATABASE ${config.db.database}`)
      console.log(`db: создана база ${config.db.database}`)
    }
  } finally {
    await client.end()
  }
}

const seedPositions = async () => {
  const count = await pool.query<{ total: string }>('SELECT count(*)::text AS total FROM positions')
  if (Number(count.rows[0]?.total ?? 0) > 0) return
  for (const position of SEED_POSITIONS) {
    await pool.query('INSERT INTO positions (name, rank) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING', [
      position.name,
      position.rank,
    ])
  }
}

const seedLeadership = async () => {
  const existing = await pool.query('SELECT id FROM units WHERE type = $1 LIMIT 1', [UnitType.LEADERSHIP])
  if ((existing.rowCount ?? 0) > 0) return
  const unit = await pool.query<{ id: string }>('INSERT INTO units (name, type) VALUES ($1, $2) RETURNING id', [
    SEED_LEADERSHIP.name,
    UnitType.LEADERSHIP,
  ])
  const unitId = unit.rows[0]!.id
  await pool.query(
    `INSERT INTO unit_positions (unit_id, position_id, sort_order)
     SELECT $1, id, rank FROM positions WHERE rank = ANY($2::int[])`,
    [unitId, SEED_LEADERSHIP.positionRanks],
  )
}

const seedSuperadmin = async () => {
  if ((await usersDb.countActiveByRole(UserRole.SUPERADMIN)) > 0) return
  const hash = await Bun.password.hash(config.superadmin.password)
  await usersDb.create(config.superadmin.login, hash, UserRole.SUPERADMIN, 'Главный администратор')
  console.log(`db: создан главный администратор ${config.superadmin.login}`)
}

export const initDb = async () => {
  await ensureDatabase()
  await pool.query(SCHEMA)
  await seedPositions()
  await seedLeadership()
  await seedSuperadmin()
}
