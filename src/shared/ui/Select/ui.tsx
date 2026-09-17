import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  type ComboboxValue,
} from '@gpuix/react/combobox'
import { theme } from '@/shared/config'
import { Icon, type TIconName } from '../Icon'
import { If } from '../If'
import { Text } from '../Text'
import { EMPTY_LABEL, type ISelectManage, type ISelectOption } from './model'
import { content, empty, group, input, inputTheme, item, root, trigger } from './style'
import { ManagePanel } from './ui/ManagePanel'

interface IProps {
  value: string | null
  options: ISelectOption[]
  onChange: (id: string | null) => void
  placeholder?: string
  icon?: TIconName
  autoOpen?: boolean
  manage?: ISelectManage
  testId?: string
}

const NO_GROUP = ''

const AUTO_OPEN_DELAY_MS = 200

export const Select = ({ value, options, onChange, placeholder, icon, autoOpen = false, manage, testId }: IProps) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [managing, setManaging] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const byId = useMemo(() => new Map(options.map((option) => [option.id, option])), [options])
  const ids = useMemo(() => options.map((option) => option.id), [options])
  const matches = useCallback((option: ISelectOption, needle: string) => {
    const text = needle.trim().toLowerCase()
    if (!text) return true
    return [option.label, option.description ?? '', ...(option.keywords ?? [])].some((part) => part.toLowerCase().includes(text))
  }, [])
  const groups = useMemo(() => {
    const order: string[] = []
    const map = new Map<string, ISelectOption[]>()
    const selectedLabel = value ? byId.get(value)?.label ?? '' : ''
    const needle = query === selectedLabel ? '' : query
    options.filter((option) => matches(option, needle)).forEach((option) => {
      const key = option.group ?? NO_GROUP
      if (!map.has(key)) {
        map.set(key, [])
        order.push(key)
      }
      map.get(key)?.push(option)
    })
    return order.map((key) => ({ key, items: map.get(key) ?? [] }))
  }, [options, query, value, byId, matches])

  const labelOf = useCallback((id: string) => byId.get(id)?.label ?? '', [byId])

  useEffect(() => {
    setQuery(value ? labelOf(value) : '')
  }, [value, labelOf])

  useEffect(() => {
    if (!autoOpen) return
    const timer = setTimeout(() => setOpen(true), AUTO_OPEN_DELAY_MS)
    return () => clearTimeout(timer)
  }, [autoOpen])
  const filter = useCallback(
    (id: string, needle: string) => {
      const option = byId.get(id)
      return option ? matches(option, needle) : false
    },
    [byId, matches],
  )
  const handleValueChange = useCallback(
    (next: ComboboxValue) => onChange(typeof next === 'string' ? next : null),
    [onChange],
  )

  const knownLabel = useMemo(
    () => options.some((option) => option.label.trim().toLowerCase() === query.trim().toLowerCase()),
    [options, query],
  )
  const newName = manage && !knownLabel ? query : ''

  const toggleManage = useCallback(() => {
    setManaging((current) => !current)
    setConfirmId(null)
  }, [])
  const changeDraft = useCallback((id: string, text: string) => setDrafts((current) => ({ ...current, [id]: text })), [])
  const saveDraft = useCallback(
    (id: string) => {
      const name = (drafts[id] ?? '').trim()
      if (name.length === 0) return
      manage?.onRename(id, name)
    },
    [drafts, manage],
  )
  const cancelRemove = useCallback(() => setConfirmId(null), [])
  const confirmRemove = useCallback(
    (id: string) => {
      manage?.onRemove(id)
      setConfirmId(null)
    },
    [manage],
  )
  const createOption = useCallback(() => {
    const name = query.trim()
    if (name.length === 0) return
    manage?.onCreate(name)
    setQuery(name)
    setManaging(false)
    setOpen(false)
  }, [manage, query])

  return (
    <div style={root}>
      <Combobox
        items={ids}
        value={value}
        onValueChange={handleValueChange}
        itemToStringValue={labelOf}
        filter={filter}
        inputValue={query}
        onInputValueChange={setQuery}
        open={open}
        onOpenChange={setOpen}
        autoHighlight
        style={trigger(open)}
      >
        <If condition={icon !== undefined}>
          <Icon name={icon ?? 'search'} size={theme.size.iconMd} color={theme.colors.tertiary} />
        </If>
        <ComboboxInput placeholder={placeholder} theme={inputTheme} style={input} testId={testId} />
        <ComboboxContent style={content} sideOffset={theme.spacing.xs}>
          <If condition={!managing}>
            <ComboboxList>
            {groups.map((entry) => (
              <ComboboxGroup key={entry.key || 'default'}>
                <If condition={entry.key !== NO_GROUP}>
                  <ComboboxLabel style={group}>
                    <Text variant="label">{entry.key}</Text>
                  </ComboboxLabel>
                </If>
                {entry.items.map((option) => (
                  <ComboboxItem
                    key={option.id}
                    value={option.id}
                    style={(state) => item(state.highlighted, state.selected)}
                    testId={testId ? `${testId}-option-${option.id}` : undefined}
                  >
                    <Text variant="body">{option.label}</Text>
                    <If condition={option.description !== undefined}>
                      <Text variant="caption">{option.description ?? ''}</Text>
                    </If>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            ))}
            </ComboboxList>
          </If>
          <If condition={newName.trim().length === 0 && !managing}>
            <ComboboxEmpty style={empty}>
              <Text variant="secondary">{EMPTY_LABEL}</Text>
            </ComboboxEmpty>
          </If>
          <If condition={manage !== undefined}>
            <ManagePanel
              options={options}
              managing={managing}
              drafts={drafts}
              confirmId={confirmId}
              newName={newName}
              onToggleManage={toggleManage}
              onDraftChange={changeDraft}
              onSave={saveDraft}
              onAskRemove={setConfirmId}
              onCancelRemove={cancelRemove}
              onConfirmRemove={confirmRemove}
              onCreate={createOption}
            />
          </If>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
