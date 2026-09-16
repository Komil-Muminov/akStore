import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const field: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xs, width: '100%' }
export const fieldRow: StyleDesc = { display: 'flex', flexDirection: 'row', width: '100%' }
export const footer: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }
