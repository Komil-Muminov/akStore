import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const footer: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }
