import iconCheck from '../../../../assets/icons/check.svg' with { type: 'text' }
import iconCircleCheck from '../../../../assets/icons/circle-check.svg' with { type: 'text' }
import iconInbox from '../../../../assets/icons/inbox.svg' with { type: 'text' }
import iconPanelLeft from '../../../../assets/icons/panel-left.svg' with { type: 'text' }
import iconPlus from '../../../../assets/icons/plus.svg' with { type: 'text' }
import iconSearch from '../../../../assets/icons/search.svg' with { type: 'text' }
import iconSettings from '../../../../assets/icons/settings.svg' with { type: 'text' }
import iconSparkle from '../../../../assets/icons/sparkle.svg' with { type: 'text' }
import iconStar from '../../../../assets/icons/star.svg' with { type: 'text' }
import iconSun from '../../../../assets/icons/sun.svg' with { type: 'text' }
import iconTrash from '../../../../assets/icons/trash.svg' with { type: 'text' }

export const ICONS = {
  check: iconCheck,
  circleCheck: iconCircleCheck,
  inbox: iconInbox,
  panelLeft: iconPanelLeft,
  plus: iconPlus,
  search: iconSearch,
  settings: iconSettings,
  sparkle: iconSparkle,
  star: iconStar,
  sun: iconSun,
  trash: iconTrash,
} as const

export type TIconName = keyof typeof ICONS
