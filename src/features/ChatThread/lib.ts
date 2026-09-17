import { theme } from '@/shared/config'
import { BUBBLE_WIDTH_RATIO } from './model'

const SIDE_PANELS = theme.size.sidebar + theme.size.chatPanel
const HORIZONTAL_PADDING = theme.spacing.xl * 2

export const bubbleWidthOf = (windowWidth: number) => {
  const available = windowWidth - SIDE_PANELS - HORIZONTAL_PADDING
  return Math.max(theme.size.bubbleMinWidth, Math.round(available * BUBBLE_WIDTH_RATIO))
}
