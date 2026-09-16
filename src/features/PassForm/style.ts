import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const fields: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
}

export const fieldRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.md,
}

export const footer: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
}

export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const selectField: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xs, flexGrow: 1, minWidth: 0 }
export const selectLabelRow: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }
export const selectRequired: StyleDesc = { fontFamily: theme.font.family, fontSize: theme.font.size.xs, color: theme.colors.danger }
export const selectMessage: StyleDesc = { minHeight: theme.font.lineHeight.sm }
