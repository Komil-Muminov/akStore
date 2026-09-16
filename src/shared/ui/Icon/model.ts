import iconBan from '../../../../assets/icons/ban.svg' with { type: 'text' }
import iconBriefcase from '../../../../assets/icons/briefcase.svg' with { type: 'text' }
import iconBuilding from '../../../../assets/icons/building-2.svg' with { type: 'text' }
import iconCar from '../../../../assets/icons/car.svg' with { type: 'text' }
import iconCheck from '../../../../assets/icons/check.svg' with { type: 'text' }
import iconListChecks from '../../../../assets/icons/list-checks.svg' with { type: 'text' }
import iconPencil from '../../../../assets/icons/pencil.svg' with { type: 'text' }
import iconPhone from '../../../../assets/icons/phone.svg' with { type: 'text' }
import iconPlus from '../../../../assets/icons/plus.svg' with { type: 'text' }
import iconRotate from '../../../../assets/icons/rotate-ccw.svg' with { type: 'text' }
import iconSearch from '../../../../assets/icons/search.svg' with { type: 'text' }
import iconShieldCheck from '../../../../assets/icons/shield-check.svg' with { type: 'text' }
import iconShieldOff from '../../../../assets/icons/shield-off.svg' with { type: 'text' }
import iconSparkle from '../../../../assets/icons/sparkle.svg' with { type: 'text' }
import iconTarget from '../../../../assets/icons/target.svg' with { type: 'text' }
import iconTrash from '../../../../assets/icons/trash-2.svg' with { type: 'text' }
import iconUser from '../../../../assets/icons/user.svg' with { type: 'text' }
import iconUsers from '../../../../assets/icons/users.svg' with { type: 'text' }
import iconX from '../../../../assets/icons/x.svg' with { type: 'text' }
import iconEye from '../../../../assets/icons/eye.svg' with { type: 'text' }
import iconEyeOff from '../../../../assets/icons/eye-off.svg' with { type: 'text' }
import iconLogOut from '../../../../assets/icons/log-out.svg' with { type: 'text' }
import iconKey from '../../../../assets/icons/key-round.svg' with { type: 'text' }
import iconLock from '../../../../assets/icons/lock.svg' with { type: 'text' }
import iconUserCog from '../../../../assets/icons/user-cog.svg' with { type: 'text' }
import iconShieldAlert from '../../../../assets/icons/shield-alert.svg' with { type: 'text' }
import iconMap from '../../../../assets/icons/map.svg' with { type: 'text' }
import iconChart from '../../../../assets/icons/chart-column-big.svg' with { type: 'text' }
import iconDownload from '../../../../assets/icons/download.svg' with { type: 'text' }
import iconFolderOpen from '../../../../assets/icons/folder-open.svg' with { type: 'text' }
import iconCalendar from '../../../../assets/icons/calendar-days.svg' with { type: 'text' }
import iconMessage from '../../../../assets/icons/message-circle.svg' with { type: 'text' }
import iconSend from '../../../../assets/icons/send.svg' with { type: 'text' }
import iconInbox from '../../../../assets/icons/inbox.svg' with { type: 'text' }
import iconCheckCheck from '../../../../assets/icons/check-check.svg' with { type: 'text' }

export const ICONS = {
  ban: iconBan,
  briefcase: iconBriefcase,
  building: iconBuilding,
  car: iconCar,
  check: iconCheck,
  listChecks: iconListChecks,
  pencil: iconPencil,
  phone: iconPhone,
  plus: iconPlus,
  rotate: iconRotate,
  search: iconSearch,
  shieldCheck: iconShieldCheck,
  shieldOff: iconShieldOff,
  sparkle: iconSparkle,
  target: iconTarget,
  trash: iconTrash,
  user: iconUser,
  users: iconUsers,
  x: iconX,
  eye: iconEye,
  eyeOff: iconEyeOff,
  logOut: iconLogOut,
  key: iconKey,
  lock: iconLock,
  userCog: iconUserCog,
  shieldAlert: iconShieldAlert,
  map: iconMap,
  chart: iconChart,
  download: iconDownload,
  folderOpen: iconFolderOpen,
  calendar: iconCalendar,
  message: iconMessage,
  send: iconSend,
  inbox: iconInbox,
  checkCheck: iconCheckCheck,
} as const

export type TIconName = keyof typeof ICONS
