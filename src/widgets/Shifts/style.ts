import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing.xl,
  flexShrink: 0,
}

export const headText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1 }

export const list: StyleDesc = { flexGrow: 1 }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing.md,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
}

export const rowText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const cell: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  width: theme.size.sidebar / 2,
  flexShrink: 0,
}

export const empty: StyleDesc = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
}
