import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: theme.spacing.lg,
  borderTopWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
  flexShrink: 0,
}

export const statsRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing.lg,
}

export const stat: StyleDesc = { display: 'flex', flexDirection: 'column' }

export const statValue: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.text,
}

export const payRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing.sm,
}

export const cashField: StyleDesc = { width: theme.size.payField, flexShrink: 0 }

export const changeText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.info,
}

export const closedBox: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
}

export const closedText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1 }

export const noticeText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.medium,
  color: theme.colors.accentHover,
}
