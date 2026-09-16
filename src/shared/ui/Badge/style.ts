import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'
import type { TBadgeTone } from './model'

const TONES: Record<TBadgeTone, { background: string; color: string }> = {
  success: { background: theme.colors.accentSoft, color: theme.colors.accent },
  muted: { background: theme.colors.mutedSoft, color: theme.colors.secondary },
  danger: { background: theme.colors.dangerSoft, color: theme.colors.danger },
  info: { background: theme.colors.infoSoft, color: theme.colors.info },
}

export const root = (tone: TBadgeTone): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xs,
  paddingLeft: theme.spacing.sm,
  paddingRight: theme.spacing.sm,
  height: theme.spacing.xl,
  borderRadius: theme.radius.full,
  backgroundColor: TONES[tone].background,
})

export const text = (tone: TBadgeTone): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.medium,
  color: TONES[tone].color,
})

export const dot = (tone: TBadgeTone): StyleDesc => ({
  width: theme.spacing.sm - theme.spacing.xxs,
  height: theme.spacing.sm - theme.spacing.xxs,
  borderRadius: theme.radius.full,
  backgroundColor: TONES[tone].color,
})
