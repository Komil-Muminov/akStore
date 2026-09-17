import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const body: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.md,
}

export const pair: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.md,
}

export const half: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.md,
}

export const categoryControl: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const categoryRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
}
