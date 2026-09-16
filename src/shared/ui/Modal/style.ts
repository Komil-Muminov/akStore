import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const BACKDROP = '#020617B3'
const CARD_WIDTH = 580

export const backdrop: StyleDesc = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: BACKDROP,
}

export const card: StyleDesc = {
  width: CARD_WIDTH,
  maxWidth: '90%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.borderStrong,
  backgroundColor: theme.colors.sidebar,
  overflow: 'hidden',
  boxShadow: { offsetX: 0, offsetY: 16, blurRadius: 48, spreadRadius: 0, color: '#00000099' },
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: theme.spacing.md,
}

export const headText: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minWidth: 0,
  gap: theme.spacing.xxs,
}

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: theme.motion.fast },
}
