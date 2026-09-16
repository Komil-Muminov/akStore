import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const BOX = 18

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm + theme.spacing.xxs,
  height: theme.size.button,
  paddingLeft: theme.spacing.sm,
  paddingRight: theme.spacing.sm,
  borderRadius: theme.radius.sm,
  cursor: 'pointer',
  hover: { backgroundColor: theme.colors.overlay },
}

export const box = (checked: boolean): StyleDesc => ({
  width: BOX,
  height: BOX,
  flexShrink: 0,
  borderRadius: theme.radius.sm - 2,
  borderWidth: 1.5,
  borderColor: checked ? theme.colors.accent : theme.colors.ghost,
  backgroundColor: checked ? theme.colors.accent : undefined,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
