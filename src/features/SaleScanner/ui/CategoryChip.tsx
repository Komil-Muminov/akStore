import { useCallback } from 'react'
import { chip, chipText } from '../style'

interface IProps {
  id: string | null
  label: string
  active: boolean
  onSelect: (id: string | null) => void
}

export const CategoryChip = ({ id, label, active, onSelect }: IProps) => {
  const handleClick = useCallback(() => onSelect(id), [id, onSelect])

  return (
    <div style={chip(active)} onClick={handleClick} testId={`sale__category-${id ?? 'all'}`}>
      <text style={chipText(active)}>{label}</text>
    </div>
  )
}
