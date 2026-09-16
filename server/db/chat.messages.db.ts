import { pool } from './pool'
import type { IAttachment, IMessage, IMessageRow } from '../types'

const toMessage = (row: IMessageRow): IMessage => ({
  id: row.id,
  conversationId: row.conversation_id,
  authorId: row.author_id,
  authorName: row.author_name,
  body: row.body,
  createdAt: row.created_at.toISOString(),
  editedAt: row.edited_at ? row.edited_at.toISOString() : null,
  isDeleted: row.deleted_at !== null,
  fileName: row.file_name,
  fileSize: Number(row.file_size),
  fileMime: row.file_mime,
})

const HISTORY_SQL = `
  SELECT m.id, m.conversation_id, m.author_id, u.full_name AS author_name, m.body, m.created_at, m.edited_at, m.deleted_at, m.file_name, m.file_path, m.file_size, m.file_mime
  FROM chat_messages m
  JOIN users u ON u.id = m.author_id
  WHERE m.conversation_id = $1 AND ($2::timestamptz IS NULL OR m.created_at < $2)
  ORDER BY m.created_at DESC
  LIMIT $3`

const COUNT_OLDER_SQL = `
  SELECT COUNT(*)::text AS total FROM chat_messages
  WHERE conversation_id = $1 AND created_at < $2`

const CREATE_SQL = `
  WITH inserted AS (
    INSERT INTO chat_messages (conversation_id, author_id, body, file_name, file_path, file_size, file_mime)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, conversation_id, author_id, body, created_at, edited_at, deleted_at, file_name, file_path, file_size, file_mime
  )
  SELECT inserted.*, u.full_name AS author_name
  FROM inserted JOIN users u ON u.id = inserted.author_id`

const SEARCH_SQL = `
  SELECT m.id, m.conversation_id, m.author_id, u.full_name AS author_name, m.body, m.created_at, m.edited_at, m.deleted_at, m.file_name, m.file_path, m.file_size, m.file_mime
  FROM chat_messages m
  JOIN chat_participants me ON me.conversation_id = m.conversation_id AND me.user_id = $1
  JOIN users u ON u.id = m.author_id
  WHERE m.deleted_at IS NULL AND m.body ILIKE $2
  ORDER BY m.created_at DESC
  LIMIT $3`

const FIND_SQL = `
  SELECT m.id, m.conversation_id, m.author_id, u.full_name AS author_name, m.body, m.created_at, m.edited_at, m.deleted_at, m.file_name, m.file_path, m.file_size, m.file_mime
  FROM chat_messages m
  JOIN users u ON u.id = m.author_id
  WHERE m.id = $1`

const UPDATE_SQL = `
  WITH updated AS (
    UPDATE chat_messages SET body = $2, edited_at = now()
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING id, conversation_id, author_id, body, created_at, edited_at, deleted_at, file_name, file_path, file_size, file_mime
  )
  SELECT updated.*, u.full_name AS author_name
  FROM updated JOIN users u ON u.id = updated.author_id`

const SOFT_DELETE_SQL = `
  WITH removed AS (
    UPDATE chat_messages SET body = '', deleted_at = now()
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING id, conversation_id, author_id, body, created_at, edited_at, deleted_at, file_name, file_path, file_size, file_mime
  )
  SELECT removed.*, u.full_name AS author_name
  FROM removed JOIN users u ON u.id = removed.author_id`

export const chatMessagesDb = {
  history: async (conversationId: string, limit: number, before: string | null) => {
    const rows = (await pool.query<IMessageRow>(HISTORY_SQL, [conversationId, before, limit])).rows
    return rows.map(toMessage).reverse()
  },
  countOlder: async (conversationId: string, before: string) =>
    Number((await pool.query<{ total: string }>(COUNT_OLDER_SQL, [conversationId, before])).rows[0]?.total ?? 0),
  create: async (conversationId: string, authorId: string, body: string, file: IAttachment | null) => {
    const values = [
      conversationId,
      authorId,
      body,
      file?.fileName ?? '',
      file?.filePath ?? '',
      file?.fileSize ?? 0,
      file?.fileMime ?? '',
    ]
    const row = (await pool.query<IMessageRow>(CREATE_SQL, values)).rows[0]
    if (!row) throw new Error('Сообщение не сохранено')
    return toMessage(row)
  },
  search: async (userId: string, pattern: string, limit: number) =>
    (await pool.query<IMessageRow>(SEARCH_SQL, [userId, pattern, limit])).rows.map(toMessage),
  find: async (messageId: string) => {
    const row = (await pool.query<IMessageRow>(FIND_SQL, [messageId])).rows[0]
    return row ? toMessage(row) : null
  },
  update: async (messageId: string, body: string) => {
    const row = (await pool.query<IMessageRow>(UPDATE_SQL, [messageId, body])).rows[0]
    return row ? toMessage(row) : null
  },
  filePathOf: async (messageId: string) => {
    const row = (await pool.query<IMessageRow>(FIND_SQL, [messageId])).rows[0]
    return row ? { path: row.file_path, name: row.file_name, mime: row.file_mime } : null
  },
  softDelete: async (messageId: string) => {
    const row = (await pool.query<IMessageRow>(SOFT_DELETE_SQL, [messageId])).rows[0]
    return row ? toMessage(row) : null
  },
}
