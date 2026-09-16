import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const CARD_WIDTH = 400

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
  gap: theme.spacing.xl,
  padding: theme.spacing.xxl,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.borderStrong,
  backgroundColor: theme.colors.sidebar,
  boxShadow: { offsetX: 0, offsetY: 24, blurRadius: 48, spreadRadius: 0, color: '#00000099' },
}

export const brand: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.sm,
}

export const brandMark: StyleDesc = {
  width: 52,
  height: 52,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.accentSoft,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.accentSoft,
}

export const formBody: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  width: '100%',
}

export const field: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  width: '100%',
}

export const message: StyleDesc = {
  minHeight: theme.font.lineHeight.sm,
  display: 'flex',
  alignItems: 'center',
}

