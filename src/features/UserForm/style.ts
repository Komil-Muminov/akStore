import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const roles: StyleDesc = { display: 'flex', flexDirection: 'row', gap: theme.spacing.sm }

export const roleChip = (active: boolean): StyleDesc => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  padding: theme.spacing.md,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: active ? theme.colors.accent : theme.colors.border,
  backgroundColor: active ? theme.colors.accentSoft : theme.colors.overlay,
  cursor: 'pointer',
  hover: active ? undefined : { backgroundColor: theme.colors.overlayStrong },
})

export const field: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xs, width: '100%' }
export const fieldRow: StyleDesc = { display: 'flex', flexDirection: 'row', width: '100%' }
export const message: StyleDesc = { minHeight: theme.font.lineHeight.sm }
export const footer: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }
