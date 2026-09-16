import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const PANEL_WIDTH = 340

export const root: StyleDesc = {
  width: PANEL_WIDTH,
  height: '100%',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  backgroundColor: theme.colors.sidebar,
  borderLeftWidth: 1,
  borderColor: theme.colors.border,
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
}

export const spacer: StyleDesc = { flexGrow: 1 }

export const person: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.sm,
}

export const avatar = (active: boolean): StyleDesc => ({
  width: theme.size.row,
  height: theme.size.row,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active ? theme.colors.accentSoft : theme.colors.mutedSoft,
})

export const avatarText = (active: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xl,
  fontWeight: theme.font.weight.semibold,
  color: active ? theme.colors.accent : theme.colors.secondary,
})

export const details: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}

export const detailRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: theme.spacing.md,
}

export const detailText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const meta: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xxs }

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
}

export const actionRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.sm,
}
