import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing.md,
  flexShrink: 0,
}

export const card: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  paddingTop: theme.spacing.md,
  paddingBottom: theme.spacing.md,
  paddingLeft: theme.spacing.lg,
  paddingRight: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.raised,
  borderWidth: 1,
  borderColor: theme.colors.border,
  minWidth: theme.size.filterField,
  flexGrow: 1,
}

const TONE_COLORS: Record<string, string> = {
  accent: theme.colors.accentHover,
  plain: theme.colors.text,
  muted: theme.colors.secondary,
}

export const cardValue = (tone: string): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xl,
  fontWeight: theme.font.weight.semibold,
  color: TONE_COLORS[tone] ?? theme.colors.text,
})
