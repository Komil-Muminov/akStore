import type { IPass, IPassInput, TPassField } from '@/entities/pass'
import type { TIconName } from '@/shared/ui'

export type TFormMode = 'create' | 'edit'

export interface IProps {
  mode: TFormMode | null
  initial?: IPass
  pending: boolean
  error?: string
  onSubmit: (input: IPassInput) => void
  onClose: () => void
}

export interface IFieldSpec {
  name: TPassField
  placeholder: string
  icon: TIconName
  isRequired?: boolean
}

export const TITLES: Record<TFormMode, { title: string; description: string; submit: string }> = {
  create: {
    title: 'Выдать пропуск',
    description: 'Заполните данные посетителя. Обязательны только имя и принимающий.',
    submit: 'Выдать пропуск',
  },
  edit: {
    title: 'Редактировать пропуск',
    description: 'Изменения сохранятся сразу после подтверждения.',
    submit: 'Сохранить',
  },
}

export const CANCEL_LABEL = 'Отмена'

export const FIELD_ROWS: IFieldSpec[][] = [
  [
    { name: 'holderName', placeholder: 'Иванов Иван Иванович', icon: 'user', isRequired: true },
    { name: 'hostName', placeholder: 'Петрова А. / Бухгалтерия', icon: 'users', isRequired: true },
  ],
  [
    { name: 'organization', placeholder: 'ООО «Ромашка»', icon: 'building' },
    { name: 'purpose', placeholder: 'Встреча, доставка, собеседование', icon: 'target' },
  ],
  [
    { name: 'phone', placeholder: '+7 900 000-00-00', icon: 'phone' },
    { name: 'carPlate', placeholder: 'А123БВ77', icon: 'car' },
  ],
]
