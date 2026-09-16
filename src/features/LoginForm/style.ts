import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const CARD_WIDTH = 420

export const root: StyleDesc = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.canvas,
}

export const card: StyleDesc = {
  width: CARD_WIDTH,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xxl,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.sidebar,
  boxShadow: { offsetX: 0, offsetY: 24, blurRadius: 64, spreadRadius: 0, color: '#00000080' },
}

export const brand: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
}

export const brandMark: StyleDesc = {
  width: theme.size.row,
  height: theme.size.row,
  borderRadius: theme.radius.lg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.accentSoft,
}

export const field: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }
export const fieldRow: StyleDesc = { display: 'flex', flexDirection: 'row' }
export const message: StyleDesc = { minHeight: theme.font.lineHeight.sm, display: 'flex', alignItems: 'center' }
