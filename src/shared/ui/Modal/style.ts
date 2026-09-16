import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const BACKDROP = '#020617B3'
const CARD_WIDTH = 520

export const backdrop: StyleDesc = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: BACKDROP,
}

export const card: StyleDesc = {
  width: CARD_WIDTH,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.borderStrong,
  backgroundColor: theme.colors.sidebar,
  boxShadow: { offsetX: 0, offsetY: 16, blurRadius: 48, spreadRadius: 0, color: '#00000099' },
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
}

export const headText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1 }

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: theme.motion.fast },
}
