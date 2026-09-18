import pg from 'pg'
import { config } from '../config'
import { UnitType, UserRole } from '../types'
import { pool } from './pool'
import { SCHEMA, SEED_LEADERSHIP } from './schema'
import { RETAIL_SCHEMA } from './schema.retail'
import { SUPPLY_SCHEMA } from './schema.supply'
import { AUDIT_SCHEMA, MONEY_SCHEMA } from './schema.money'
import { migrateOutlets } from './migrate'
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

const seedLeadership = async () => {
  const existing = await pool.query('SELECT id FROM units WHERE type = $1 LIMIT 1', [UnitType.LEADERSHIP])
  if ((existing.rowCount ?? 0) > 0) return
  await pool.query('INSERT INTO units (name, type) VALUES ($1, $2)', [SEED_LEADERSHIP.name, UnitType.LEADERSHIP])
  console.log(`db: создан корневой узел «${SEED_LEADERSHIP.name}»`)
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
  await pool.query(RETAIL_SCHEMA)
  await pool.query(SUPPLY_SCHEMA)
  await pool.query(MONEY_SCHEMA)
  await pool.query(AUDIT_SCHEMA)
  await migrateOutlets()
  await seedLeadership()
  await seedSuperadmin()
}
