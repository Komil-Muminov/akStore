import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
  gap: theme.spacing.md,
  flexShrink: 0,
}

export const field: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  width: theme.size.filterField,
}

export const searchField: StyleDesc = { ...field, flexGrow: 1, width: theme.size.sidebar }

export const spacer: StyleDesc = { flexGrow: 1 }
