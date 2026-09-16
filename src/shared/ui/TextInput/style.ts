import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const input: StyleDesc = {
  flexGrow: 1,
  fontSize: theme.font.size.md,
  fontFamily: theme.font.family,
  color: theme.colors.text,
}

export const inputTheme = { caret: theme.colors.accent }
