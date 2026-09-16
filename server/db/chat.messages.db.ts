import { pool } from './pool'
import type { IMessage, IMessageRow } from '../types'

const toMessage = (row: IMessageRow): IMessage => ({
  id: row.id,
  conversationId: row.conversation_id,
  authorId: row.author_id,
  authorName: row.author_name,
  body: row.body,
  createdAt: row.created_at.toISOString(),
})

const HISTORY_SQL = `
  SELECT m.id, m.conversation_id, m.author_id, u.full_name AS author_name, m.body, m.created_at
  FROM chat_messages m
  JOIN users u ON u.id = m.author_id
  WHERE m.conversation_id = $1
  ORDER BY m.created_at DESC
  LIMIT $2`

const CREATE_SQL = `
  WITH inserted AS (
    INSERT INTO chat_messages (conversation_id, author_id, body)
    VALUES ($1, $2, $3)
    RETURNING id, conversation_id, author_id, body, created_at
  )
  SELECT inserted.*, u.full_name AS author_name
  FROM inserted JOIN users u ON u.id = inserted.author_id`

export const chatMessagesDb = {
  history: async (conversationId: string, limit: number) => {
    const rows = (await pool.query<IMessageRow>(HISTORY_SQL, [conversationId, limit])).rows
    return rows.map(toMessage).reverse()
  },
  create: async (conversationId: string, authorId: string, body: string) => {
    const row = (await pool.query<IMessageRow>(CREATE_SQL, [conversationId, authorId, body])).rows[0]
    if (!row) throw new Error('Сообщение не сохранено')
    return toMessage(row)
  },
}
