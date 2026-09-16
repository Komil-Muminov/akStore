import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = { display: 'flex', flexDirection: 'row', gap: theme.spacing.md }

export const tile: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}

export const tileHead: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }

export const value: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xl + theme.spacing.sm,
  lineHeight: theme.font.lineHeight.lg + theme.spacing.sm,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.text,
}
