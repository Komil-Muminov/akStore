import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm + theme.spacing.xxs,
  height: theme.size.input,
  width: '100%',
  flexGrow: 1,
  minWidth: 0,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.borderStrong,
  backgroundColor: theme.colors.canvas,
  hover: { borderColor: theme.colors.ghost },
}

export const input: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  fontSize: theme.font.size.md,
  fontFamily: theme.font.family,
  color: theme.colors.text,
}

export const inputTheme = { caret: theme.colors.accent }
