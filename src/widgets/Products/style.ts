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
  gap: theme.spacing.md,
  padding: theme.spacing.xl,
  flexShrink: 0,
}

export const headText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1 }

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
}

export const filterBtnOf = (active: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xs,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  borderRadius: theme.radius.md,
  backgroundColor: active ? theme.colors.warning : theme.colors.surface,
  borderWidth: 1,
  borderColor: active ? theme.colors.warning : theme.colors.border,
})

export const search: StyleDesc = { width: theme.size.contentMaxWidth / 2.4 }
