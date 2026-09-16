import { useCallback, useEffect, useState } from 'react'
import { PRESET_LABELS, ReportPreset, parseDisplayDate, toDisplayDate } from '@/entities/report'
import { Button, If, Text, TextInput } from '@/shared/ui'
import { APPLY_LABEL, DATE_ERROR, DATE_PLACEHOLDER, FROM_LABEL, ORDER_ERROR, TO_LABEL, type IProps } from './model'
import { custom, dateField, message, preset, presets, root } from './style'

const PRESETS = Object.values(ReportPreset)

export const ReportPeriod = ({ preset: active, period, onPreset, onPeriod }: IProps) => {
  const [fromText, setFromText] = useState(toDisplayDate(period.from))
  const [toText, setToText] = useState(toDisplayDate(period.to))
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    setFromText(toDisplayDate(period.from))
    setToText(toDisplayDate(period.to))
    setError(undefined)
  }, [period.from, period.to])

  const apply = useCallback(() => {
    const from = parseDisplayDate(fromText)
    const to = parseDisplayDate(toText)
    if (!from || !to) {
      setError(DATE_ERROR)
      return
    }
    if (from > to) {
      setError(ORDER_ERROR)
      return
    }
    setError(undefined)
    onPeriod({ from, to })
  }, [fromText, toText, onPeriod])

  return (
    <div style={root} testId="report-period">
      <div style={presets}>
        {PRESETS.map((entry) => (
          <div key={entry} style={preset(entry === active)} onClick={() => onPreset(entry)} testId={`report-period__preset-${entry}`}>
            <Text variant={entry === active ? 'bodyStrong' : 'body'}>{PRESET_LABELS[entry]}</Text>
          </div>
        ))}
      </div>
      <If condition={active === ReportPreset.CUSTOM}>
        <div style={custom}>
          <Text variant="secondary">{FROM_LABEL}</Text>
          <div style={dateField}>
            <TextInput value={fromText} onChange={setFromText} onSubmit={apply} placeholder={DATE_PLACEHOLDER} icon="calendar" testId="report-period__from" />
          </div>
          <Text variant="secondary">{TO_LABEL}</Text>
          <div style={dateField}>
            <TextInput value={toText} onChange={setToText} onSubmit={apply} placeholder={DATE_PLACEHOLDER} icon="calendar" testId="report-period__to" />
          </div>
          <Button label={APPLY_LABEL} variant="secondary" onClick={apply} testId="report-period__apply" />
          <div style={message}>
            <If condition={error !== undefined}>
              <Text variant="danger">{error ?? ''}</Text>
            </If>
          </div>
        </div>
      </If>
    </div>
  )
}
