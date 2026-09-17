import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  flexShrink: 0,
}

export const searchRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
}

export const searchField: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const card: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: theme.spacing.xl,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}

export const cardHead: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
}

export const cardText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const codeText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.accent,
}

export const detailRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
}

export const detailLabel: StyleDesc = { width: theme.size.sidebar / 2, flexShrink: 0 }

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.sm,
}

export const empty: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.xxl,
  paddingBottom: theme.spacing.xxl,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
}

export const notice = (danger: boolean): StyleDesc => ({
  padding: theme.spacing.md,
  borderRadius: theme.radius.md,
  backgroundColor: danger ? theme.colors.dangerSoft : theme.colors.accentSoft,
})

export const noticeText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.medium,
  color: theme.colors.accentHover,
}
