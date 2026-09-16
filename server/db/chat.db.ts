import { pool } from './pool'
import type { IConversation, IConversationRow } from '../types'

const toConversation = (row: IConversationRow): IConversation => ({
  id: row.id,
  companionId: row.companion_id,
  companionName: row.companion_name,
  companionLogin: row.companion_login,
  lastMessage: row.last_message ?? '',
  lastMessageAt: row.last_message_at ? row.last_message_at.toISOString() : null,
  unreadCount: Number(row.unread_count),
})

const BASE_SQL = `
  SELECT c.id,
         u.id AS companion_id, u.full_name AS companion_name, u.login AS companion_login,
         last.body AS last_message, last.created_at AS last_message_at,
         (SELECT COUNT(*) FROM chat_messages unread
           WHERE unread.conversation_id = c.id
             AND unread.author_id <> me.user_id
             AND unread.created_at > me.last_read_at) AS unread_count
  FROM chat_conversations c
  JOIN chat_participants me ON me.conversation_id = c.id AND me.user_id = $1
  JOIN chat_participants peer ON peer.conversation_id = c.id AND peer.user_id <> me.user_id
  JOIN users u ON u.id = peer.user_id AND u.is_active = true
  LEFT JOIN LATERAL (
    SELECT body, created_at FROM chat_messages
    WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1
  ) last ON true`

const SEARCH_SQL = `${BASE_SQL} ORDER BY last.created_at DESC NULLS LAST`

const FIND_ONE_SQL = `${BASE_SQL} WHERE c.id = $2 LIMIT 1`

const CREATE_SQL = `
  INSERT INTO chat_conversations (direct_key) VALUES ($1)
  ON CONFLICT (direct_key) DO UPDATE SET direct_key = EXCLUDED.direct_key
  RETURNING id`

const ADD_PARTICIPANT_SQL = `
  INSERT INTO chat_participants (conversation_id, user_id) VALUES ($1, $2)
  ON CONFLICT (conversation_id, user_id) DO NOTHING`

const PARTICIPANTS_SQL = 'SELECT user_id FROM chat_participants WHERE conversation_id = $1'

const MARK_READ_SQL = `
  UPDATE chat_participants SET last_read_at = now()
  WHERE conversation_id = $1 AND user_id = $2`

export const chatDb = {
  search: async (userId: string) => (await pool.query<IConversationRow>(SEARCH_SQL, [userId])).rows.map(toConversation),
  find: async (userId: string, conversationId: string) => {
    const row = (await pool.query<IConversationRow>(FIND_ONE_SQL, [userId, conversationId])).rows[0]
    return row ? toConversation(row) : null
  },
  ensure: async (directKey: string, memberIds: string[]) => {
    const id = (await pool.query<{ id: string }>(CREATE_SQL, [directKey])).rows[0]?.id ?? ''
    for (const memberId of memberIds) {
      await pool.query(ADD_PARTICIPANT_SQL, [id, memberId])
    }
    return id
  },
  participants: async (conversationId: string) =>
    (await pool.query<{ user_id: string }>(PARTICIPANTS_SQL, [conversationId])).rows.map((row) => row.user_id),
  markRead: async (conversationId: string, userId: string) => {
    await pool.query(MARK_READ_SQL, [conversationId, userId])
  },
}
