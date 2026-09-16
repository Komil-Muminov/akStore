import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const PANEL_WIDTH = 340

export const root: StyleDesc = {
  width: PANEL_WIDTH,
  height: '100%',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  backgroundColor: theme.colors.sidebar,
  borderLeftWidth: 1,
  borderColor: theme.colors.border,
}

export const head: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1 }
export const block: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }

export const card: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}

export const typeRow = (accent: string): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingLeft: theme.spacing.sm,
  paddingRight: theme.spacing.sm,
  height: theme.spacing.xl,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.overlay,
  borderWidth: 1,
  borderColor: accent,
})

export const chipRow: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }

export const actions: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }
