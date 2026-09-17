import { pool } from './pool'
import type { IColleague, IColleagueRow, IMember, IMemberRow } from '../types'

const toMember = (row: IMemberRow): IMember => ({
  userId: row.user_id,
  fullName: row.full_name,
  login: row.login,
})

const ADD_SQL = `
  INSERT INTO chat_participants (conversation_id, user_id) VALUES ($1, $2)
  ON CONFLICT (conversation_id, user_id) DO NOTHING`

const IDS_SQL = 'SELECT user_id FROM chat_participants WHERE conversation_id = $1'

const LIST_SQL = `
  SELECT p.user_id, u.full_name, u.login
  FROM chat_participants p
  JOIN users u ON u.id = p.user_id
  WHERE p.conversation_id = $1
  ORDER BY u.full_name`

const REMOVE_SQL = 'DELETE FROM chat_participants WHERE conversation_id = $1 AND user_id = $2'

const COUNT_SQL = 'SELECT COUNT(*)::text AS total FROM chat_participants WHERE conversation_id = $1'

const DROP_EMPTY_SQL = 'DELETE FROM chat_conversations WHERE id = $1'

const COLLEAGUES_SQL = `
  SELECT DISTINCT ON (u.id) u.id AS user_id, u.full_name, u.login, p.name AS position_name
  FROM users u
  LEFT JOIN unit_positions up ON up.user_id = u.id
  LEFT JOIN positions p ON p.id = up.position_id
  WHERE u.is_active = true AND u.id <> $1
  ORDER BY u.id, p.rank NULLS LAST`

const toColleague = (row: IColleagueRow): IColleague => ({
  userId: row.user_id,
  fullName: row.full_name,
  login: row.login,
  positionName: row.position_name ?? '',
})

export const chatMembersDb = {
  add: async (conversationId: string, userIds: string[]) => {
    for (const userId of userIds) {
      await pool.query(ADD_SQL, [conversationId, userId])
    }
  },
  ids: async (conversationId: string) =>
    (await pool.query<{ user_id: string }>(IDS_SQL, [conversationId])).rows.map((row) => row.user_id),
  list: async (conversationId: string) =>
    (await pool.query<IMemberRow>(LIST_SQL, [conversationId])).rows.map(toMember),
  remove: async (conversationId: string, userId: string) => {
    await pool.query(REMOVE_SQL, [conversationId, userId])
  },
  count: async (conversationId: string) =>
    Number((await pool.query<{ total: string }>(COUNT_SQL, [conversationId])).rows[0]?.total ?? 0),
  colleagues: async (userId: string) => {
    const rows = (await pool.query<IColleagueRow>(COLLEAGUES_SQL, [userId])).rows.map(toColleague)
    return rows.sort((first, second) => first.fullName.localeCompare(second.fullName))
  },
  dropEmpty: async (conversationId: string) => {
    await pool.query(DROP_EMPTY_SQL, [conversationId])
  },
}
