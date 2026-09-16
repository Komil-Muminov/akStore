import { PASS_FIELD_LABELS, type IPassInput, type TPassErrors, type TPassField } from '@/entities/pass'
import { FormField } from '@/shared/ui'
import { FIELD_ROWS } from '../model'
import { fieldRow, fields } from '../style'

interface IProps {
  values: IPassInput
  errors: TPassErrors
  onChange: (field: TPassField, value: string) => void
  onSubmit: () => void
}

export const renderFields = ({ values, errors, onChange, onSubmit }: IProps) => (
  <div style={fields}>
    {FIELD_ROWS.map((row, index) => (
      <div key={String(index)} style={fieldRow}>
        {row.map((spec) => (
          <FormField
            key={spec.name}
            label={PASS_FIELD_LABELS[spec.name]}
            value={values[spec.name]}
            onChange={(value) => onChange(spec.name, value)}
            onSubmit={onSubmit}
            placeholder={spec.placeholder}
            icon={spec.icon}
            error={errors[spec.name]}
            isRequired={spec.isRequired}
            autoFocus={index === 0 && spec.name === 'holderName'}
            testId={`pass-form__${spec.name}`}
          />
        ))}
      </div>
    ))}
  </div>
)
