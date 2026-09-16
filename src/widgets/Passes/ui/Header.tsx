import { Button, Text, TextInput } from '@/shared/ui'
import { CREATE_LABEL, SEARCH_PLACEHOLDER } from '../model'
import { header, headerRow, headerText, search } from '../style'

interface IProps {
  title: string
  description: string
  query: string
  onQueryChange: (value: string) => void
  onCreate: () => void
}

export const Header = ({ title, description, query, onQueryChange, onCreate }: IProps) => (
  <div style={header}>
    <div style={headerRow}>
      <div style={headerText}>
        <Text variant="heading">{title}</Text>
        <Text variant="secondary">{description}</Text>
      </div>
      <Button label={CREATE_LABEL} icon="plus" onClick={onCreate} testId="passes__create" />
    </div>
    <div style={search}>
      <TextInput value={query} onChange={onQueryChange} placeholder={SEARCH_PLACEHOLDER} icon="search" testId="passes__search" />
    </div>
  </div>
)
