import { theme } from '@/shared/config'
import { If } from '@/shared/ui'
import { EMPTY_STATES, SEARCH_EMPTY_TEXT, SEARCH_EMPTY_TITLE, type IProps } from './model'
import { list, rowWrapper } from './style'
import { EmptyState } from './ui/EmptyState'
import { PassRow } from './ui/PassRow'

const ESTIMATED_ROW_HEIGHT = theme.size.row + theme.spacing.sm

export const PassList = ({ passes, filter, searching, onDeactivate }: IProps) => {
  const emptyState = searching
    ? { icon: 'search' as const, title: SEARCH_EMPTY_TITLE, text: SEARCH_EMPTY_TEXT }
    : { icon: 'users' as const, ...EMPTY_STATES[filter] }

  return (
    <If condition={passes.length > 0} fallback={<EmptyState {...emptyState} />}>
      <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="pass-list">
        {passes.map((pass) => (
          <div key={pass.id} style={rowWrapper}>
            <PassRow pass={pass} onDeactivate={onDeactivate} />
          </div>
        ))}
      </virtual-list>
    </If>
  )
}
