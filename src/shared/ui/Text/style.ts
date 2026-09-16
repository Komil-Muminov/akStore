import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'
import type { TTextVariant } from './model'

const base: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  lineHeight: theme.font.lineHeight.md,
}

export const variants: Record<TTextVariant, StyleDesc> = {
  title: { ...base, fontSize: theme.font.size.lg, color: theme.colors.text },
  body: { ...base, color: theme.colors.text },
  secondary: { ...base, fontSize: theme.font.size.sm, color: theme.colors.secondary },
  ghost: { ...base, fontSize: theme.font.size.sm, color: theme.colors.ghost },
  onAccent: { ...base, fontSize: theme.font.size.sm, color: theme.colors.onAccent },
  danger: { ...base, fontSize: theme.font.size.sm, color: theme.colors.danger },
}
