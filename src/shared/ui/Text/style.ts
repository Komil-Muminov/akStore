import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'
import type { TTextVariant } from './model'

const base: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  lineHeight: theme.font.lineHeight.md,
  fontWeight: theme.font.weight.regular,
}

const small: StyleDesc = { ...base, fontSize: theme.font.size.sm, lineHeight: theme.font.lineHeight.sm }

export const variants: Record<TTextVariant, StyleDesc> = {
  heading: {
    ...base,
    fontSize: theme.font.size.xl,
    lineHeight: theme.font.lineHeight.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.colors.text,
    whiteSpace: 'nowrap',
  },
  title: { ...base, fontSize: theme.font.size.lg, fontWeight: theme.font.weight.semibold, color: theme.colors.text },
  body: { ...base, color: theme.colors.text },
  bodyStrong: { ...base, fontWeight: theme.font.weight.medium, color: theme.colors.text },
  secondary: { ...small, color: theme.colors.secondary },
  caption: { ...small, fontSize: theme.font.size.xs, color: theme.colors.tertiary },
  label: { ...small, fontSize: theme.font.size.xs, fontWeight: theme.font.weight.medium, color: theme.colors.tertiary },
  ghost: { ...small, color: theme.colors.ghost },
  onAccent: { ...small, fontWeight: theme.font.weight.medium, color: theme.colors.onAccent },
  danger: { ...small, color: theme.colors.danger },
}
