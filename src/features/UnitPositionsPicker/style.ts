import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const LIST_MAX_HEIGHT = 360

export const list: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: LIST_MAX_HEIGHT,
  overflowY: 'scroll',
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: theme.spacing.xs,
}

export const footer: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }
