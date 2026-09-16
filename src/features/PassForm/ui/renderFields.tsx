import { PASS_FIELD_LABELS, type IPassInput, type TPassErrors, type TPassField } from '@/entities/pass'
import { FormField, If, Select, Text, type ISelectOption } from '@/shared/ui'
import { FIELD_ROWS, HOST_EMPTY_HINT, type IFieldSpec } from '../model'
import { fieldRow, fields, selectField, selectLabelRow, selectMessage, selectRequired } from '../style'

interface IProps {
  values: IPassInput
  errors: TPassErrors
  hostOptions: ISelectOption[]
  onChange: (field: TPassField, value: string) => void
  onHostChange: (userId: string | null) => void
  onSubmit: () => void
}

const REQUIRED_MARK = '*'

const renderSelect = ({ values, errors, hostOptions, onHostChange }: IProps, spec: IFieldSpec) => (
  <div key={spec.name} style={selectField}>
    <div style={selectLabelRow}>
      <Text variant="label">{PASS_FIELD_LABELS[spec.name]}</Text>
      <text style={selectRequired}>{REQUIRED_MARK}</text>
    </div>
    <Select
      value={values.hostUserId}
      options={hostOptions}
      onChange={onHostChange}
      placeholder={spec.placeholder}
      icon={spec.icon}
      testId="pass-form__hostUserId"
    />
    <div style={selectMessage}>
      <If condition={errors[spec.name] !== undefined} fallback={<If condition={hostOptions.length === 0}><Text variant="caption">{HOST_EMPTY_HINT}</Text></If>}>
        <Text variant="danger">{errors[spec.name] ?? ''}</Text>
      </If>
    </div>
  </div>
)

export const renderFields = (props: IProps) => (
  <div style={fields}>
    {FIELD_ROWS.map((row, index) => (
      <div key={String(index)} style={fieldRow}>
        {row.map((spec) =>
          spec.select ? (
            renderSelect(props, spec)
          ) : (
            <FormField
              key={spec.name}
              label={PASS_FIELD_LABELS[spec.name]}
              value={props.values[spec.name]}
              onChange={(value) => props.onChange(spec.name, value)}
              onSubmit={props.onSubmit}
              placeholder={spec.placeholder}
              icon={spec.icon}
              error={props.errors[spec.name]}
              isRequired={spec.isRequired}
              autoFocus={index === 0 && spec.name === 'holderName'}
              testId={`pass-form__${spec.name}`}
            />
          ),
        )}
      </div>
    ))}
  </div>
)
