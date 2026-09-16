import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const list: StyleDesc = { flexGrow: 1, minHeight: 0 }

export const rowWrapper: StyleDesc = {
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingBottom: theme.spacing.sm,
}

export const row = (active: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  height: theme.size.row,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
  opacity: active ? 1 : 0.7,
  hover: { backgroundColor: theme.colors.raisedHover, borderColor: theme.colors.borderStrong },
})

export const avatar = (active: boolean): StyleDesc => ({
  width: theme.size.avatar,
  height: theme.size.avatar,
  flexShrink: 0,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active ? theme.colors.infoSoft : theme.colors.mutedSoft,
})

export const avatarText = (active: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.semibold,
  color: active ? theme.colors.info : theme.colors.secondary,
})

export const info: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }
export const actions: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flexShrink: 0 }

export const empty: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
}
