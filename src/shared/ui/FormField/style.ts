import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  flexGrow: 1,
  minWidth: 0,
}

export const labelRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xs,
}

export const required: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  color: theme.colors.danger,
}

export const message: StyleDesc = { minHeight: theme.font.lineHeight.sm }
