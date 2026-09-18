import { ROLE_LABELS } from '@/entities/user'
import { AppRoutes, theme } from '@/shared/config'
import { Icon, IconButton, If, Select, Text, Tooltip } from '@/shared/ui'
import {
  APP_NAME,
  APP_TAGLINE,
  CHANGE_PASSWORD_TOOLTIP,
  LOGOUT_TOOLTIP,
  NAV_SECTION,
  OUTLET_ALL,
  type IProps,
} from './model'
import {
  account,
  accountLine,
  accountText,
  avatar,
  avatarText,
  brand,
  brandMark,
  brandText,
  outletBox,
  root,
  section,
  spacer,
} from './style'
import { NavItem } from './ui/NavItem'
import { initialsOf } from '@/shared/lib'

export const NavSidebar = ({
  active,
  items,
  unread,
  user,
  outlets,
  outletId,
  onOutletChange,
  onNavigate,
  onChangePassword,
  onLogout,
}: IProps) => (
  <div style={root} testId="nav">
    <div style={brand}>
      <div style={brandMark}>
        <Icon name="shieldCheck" size={theme.size.iconLg} color={theme.colors.accent} />
      </div>
      <div style={brandText}>
        <Text variant="title">{APP_NAME}</Text>
        <Text variant="caption">{APP_TAGLINE}</Text>
      </div>
    </div>
    <div style={section}>
      <Text variant="label">{NAV_SECTION}</Text>
    </div>
    {items.map((entry) => (
      <NavItem
        key={entry.id}
        entry={entry}
        active={entry.id === active}
        badge={entry.id === AppRoutes.CHAT ? unread : 0}
        onNavigate={onNavigate}
      />
    ))}
    <div style={spacer} />
    <If condition={outlets.length > 1}>
      <div style={outletBox}>
        <Select
          value={outletId}
          options={outlets}
          placeholder={OUTLET_ALL}
          onChange={onOutletChange}
          icon="building"
          testId="nav__outlet"
        />
      </div>
    </If>
    <div style={account} testId="nav__account">
      <div style={avatar}>
        <text style={avatarText}>{initialsOf(user.fullName || user.login)}</text>
      </div>
      <div style={accountText}>
        <Text variant="bodyStrong" style={accountLine}>{user.fullName || user.login}</Text>
        <Text variant="caption" style={accountLine}>{ROLE_LABELS[user.role]}</Text>
      </div>
      <Tooltip title={CHANGE_PASSWORD_TOOLTIP}>
        <IconButton icon="key" onClick={onChangePassword} testId="nav__change-password" />
      </Tooltip>
      <Tooltip title={LOGOUT_TOOLTIP}>
        <IconButton icon="logOut" onClick={onLogout} hoverColor={theme.colors.dangerSoft} testId="nav__logout" />
      </Tooltip>
    </div>
  </div>
)
