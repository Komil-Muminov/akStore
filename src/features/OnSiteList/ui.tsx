import {
  DIRECTION_LABELS,
  EntryDirection,
  ON_SITE_EMPTY,
  durationOf,
  entryStampOf,
  entryTimeOf,
} from '@/entities/entry'
import { theme } from '@/shared/config'
import { Icon, If, Text } from '@/shared/ui'
import { ESTIMATED_ROW_HEIGHT, JOURNAL_EMPTY, JOURNAL_TITLE, ON_SITE_TITLE, SINCE_LABEL, type IProps } from './model'
import { empty, list, mark, name, root, row, rowText, section } from './style'

export const OnSiteList = ({ people, entries }: IProps) => (
  <div style={root} testId="gate__side">
    <div style={section}>
      <Text variant="label">{`${ON_SITE_TITLE.toUpperCase()} · ${String(people.length)}`}</Text>
    </div>
    <If
      condition={people.length > 0}
      fallback={
        <div style={empty}>
          <Text variant="secondary">{ON_SITE_EMPTY}</Text>
        </div>
      }
    >
      <>
        {people.map((person) => (
          <div key={person.passId} style={row} testId={`gate__on-site-${person.passCode}`}>
            <div style={mark(true)}>
              <Icon name="user" size={theme.size.iconSm} color={theme.colors.accent} />
            </div>
            <div style={rowText}>
              <text style={name}>{person.holderName}</text>
              <Text variant="caption">
                {`${SINCE_LABEL} ${entryTimeOf(person.enteredAt)} · ${durationOf(person.enteredAt)}`}
              </Text>
            </div>
          </div>
        ))}
      </>
    </If>
    <div style={section}>
      <Text variant="label">{JOURNAL_TITLE.toUpperCase()}</Text>
    </div>
    <If
      condition={entries.length > 0}
      fallback={
        <div style={empty}>
          <Text variant="secondary">{JOURNAL_EMPTY}</Text>
        </div>
      }
    >
      <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="gate__journal">
        {entries.map((entry) => (
          <div key={entry.id} style={row}>
            <div style={mark(entry.direction === EntryDirection.IN)}>
              <Icon
                name={entry.direction === EntryDirection.IN ? 'check' : 'logOut'}
                size={theme.size.iconSm}
                color={entry.direction === EntryDirection.IN ? theme.colors.accent : theme.colors.secondary}
              />
            </div>
            <div style={rowText}>
              <text style={name}>{entry.holderName}</text>
              <Text variant="caption">
                {`${DIRECTION_LABELS[entry.direction]} · ${entryStampOf(entry.happenedAt)}`}
              </Text>
            </div>
          </div>
        ))}
      </virtual-list>
    </If>
  </div>
)
