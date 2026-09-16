import { theme } from '@/shared/config'
import { Icon, If, Text } from '@/shared/ui'
import { EMPTY_TEXT, EMPTY_TITLE, type IProps } from './model'
import { empty, list, rowWrapper } from './style'
import { UserRow } from './ui/UserRow'

const ESTIMATED_ROW_HEIGHT = theme.size.row + theme.spacing.sm

export const UserList = ({ users, onResetPassword, onToggleActive, onDelete }: IProps) => (
  <If
    condition={users.length > 0}
    fallback={
      <div style={empty} testId="user-list__empty">
        <Icon name="userCog" size={theme.size.iconXl} color={theme.colors.tertiary} />
        <Text variant="title">{EMPTY_TITLE}</Text>
        <Text variant="secondary">{EMPTY_TEXT}</Text>
      </div>
    }
  >
    <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="user-list">
      {users.map((user) => (
        <div key={user.id} style={rowWrapper}>
          <UserRow user={user} onResetPassword={onResetPassword} onToggleActive={onToggleActive} onDelete={onDelete} />
        </div>
      ))}
    </virtual-list>
  </If>
)
