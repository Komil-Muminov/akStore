import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  flexGrow: 1,
  minHeight: 0,
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.lg,
  flexShrink: 0,
}

export const headText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const search: StyleDesc = { width: theme.size.sidebar }

export const totalBox: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.raised,
}

export const totalValue: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.danger,
}
