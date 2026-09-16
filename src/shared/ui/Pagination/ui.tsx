import { Button } from '../Button'
import { Text } from '../Text'
import { NEXT_LABEL, PAGE_OF, PAGE_PREFIX, PREV_LABEL, TOTAL_LABEL, type IProps } from './model'
import { controls, info, root } from './style'

export const Pagination = ({ page, totalPages, total, onPageChange }: IProps) => (
  <div style={root} testId="pagination">
    <div style={info}>
      <Text variant="secondary">{`${PAGE_PREFIX} ${String(page)} ${PAGE_OF} ${String(Math.max(totalPages, 1))} (${TOTAL_LABEL} ${String(total)})`}</Text>
    </div>
    <div style={controls}>
      <Button
        label={PREV_LABEL}
        variant="secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        testId="pagination__prev"
      />
      <Button
        label={NEXT_LABEL}
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        testId="pagination__next"
      />
    </div>
  </div>
)
