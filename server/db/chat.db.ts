import { pool } from './pool'
import { ConversationKind, type IConversation, type IConversationRow } from '../types'

const toConversation = (row: IConversationRow): IConversation => ({
  id: row.id,
  kind: row.kind,
  title: row.title,
  companionId: row.companion_id ?? '',
  companionReadAt: row.companion_read_at ? row.companion_read_at.toISOString() : null,
  companionName: row.companion_name ?? '',
  companionLogin: row.companion_login ?? '',
  membersCount: Number(row.members_count),
  lastMessage: row.last_message ?? '',
  lastMessageAuthor: row.last_message_author ?? '',
  lastMessageAt: row.last_message_at ? row.last_message_at.toISOString() : null,
  unreadCount: Number(row.unread_count),
})

const BASE_SQL = `
  SELECT c.id, c.kind, c.title,
         peer.user_id AS companion_id, peer.full_name AS companion_name, peer.login AS companion_login,
         peer.last_read_at AS companion_read_at,
         (SELECT COUNT(*) FROM chat_participants total WHERE total.conversation_id = c.id) AS members_count,
         last.body AS last_message, last.author_name AS last_message_author, last.created_at AS last_message_at,
         (SELECT COUNT(*) FROM chat_messages unread
           WHERE unread.conversation_id = c.id
             AND unread.author_id <> me.user_id
             AND unread.created_at > me.last_read_at) AS unread_count
  FROM chat_conversations c
  JOIN chat_participants me ON me.conversation_id = c.id AND me.user_id = $1
  LEFT JOIN LATERAL (
    SELECT u.id AS user_id, u.full_name, u.login, u.is_active, other.last_read_at
    FROM chat_participants other
    JOIN users u ON u.id = other.user_id
    WHERE other.conversation_id = c.id AND other.user_id <> me.user_id AND c.kind = $2
    LIMIT 1
  ) peer ON true
  LEFT JOIN LATERAL (
    SELECT m.body, m.created_at, author.full_name AS author_name
    FROM chat_messages m
    JOIN users author ON author.id = m.author_id
    WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1
  ) last ON true
  WHERE (c.kind <> $2 OR peer.is_active = true)`

const SEARCH_SQL = `${BASE_SQL} ORDER BY last.created_at DESC NULLS LAST`

const FIND_ONE_SQL = `${BASE_SQL} AND c.id = $3 LIMIT 1`

const CREATE_DIRECT_SQL = `
  INSERT INTO chat_conversations (direct_key, kind) VALUES ($1, $2)
  ON CONFLICT (direct_key) DO UPDATE SET direct_key = EXCLUDED.direct_key
  RETURNING id`

const CREATE_GROUP_SQL = `
  INSERT INTO chat_conversations (kind, title, created_by) VALUES ($1, $2, $3)
  RETURNING id`

const UNREAD_TOTAL_SQL = `
  SELECT COUNT(*)::text AS total
  FROM chat_messages m
  JOIN chat_participants me ON me.conversation_id = m.conversation_id AND me.user_id = $1
  WHERE m.author_id <> $1 AND m.created_at > me.last_read_at`

const MARK_READ_SQL = `
  UPDATE chat_participants SET last_read_at = now()
  WHERE conversation_id = $1 AND user_id = $2`

export const chatDb = {
  search: async (userId: string) =>
    (await pool.query<IConversationRow>(SEARCH_SQL, [userId, ConversationKind.DIRECT])).rows.map(toConversation),
  find: async (userId: string, conversationId: string) => {
    const values = [userId, ConversationKind.DIRECT, conversationId]
    const row = (await pool.query<IConversationRow>(FIND_ONE_SQL, values)).rows[0]
    return row ? toConversation(row) : null
  },
  ensureDirect: async (directKey: string) =>
    (await pool.query<{ id: string }>(CREATE_DIRECT_SQL, [directKey, ConversationKind.DIRECT])).rows[0]?.id ?? '',
  createGroup: async (title: string, authorId: string) =>
    (await pool.query<{ id: string }>(CREATE_GROUP_SQL, [ConversationKind.GROUP, title, authorId])).rows[0]?.id ?? '',
  unreadTotal: async (userId: string) =>
    Number((await pool.query<{ total: string }>(UNREAD_TOTAL_SQL, [userId])).rows[0]?.total ?? 0),
  markRead: async (conversationId: string, userId: string) => {
    await pool.query(MARK_READ_SQL, [conversationId, userId])
  },
}
