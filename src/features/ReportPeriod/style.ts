import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const DATE_WIDTH = 150

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  flexWrap: 'wrap',
}

export const presets: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }

export const preset = (active: boolean): StyleDesc => ({
  height: theme.size.button,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: active ? theme.colors.borderStrong : theme.colors.border,
  backgroundColor: active ? theme.colors.raised : undefined,
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  hover: active ? undefined : { backgroundColor: theme.colors.overlay },
})

export const custom: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const dateField: StyleDesc = { width: DATE_WIDTH, display: 'flex' }
export const message: StyleDesc = { minHeight: theme.font.lineHeight.sm, display: 'flex', alignItems: 'center' }
