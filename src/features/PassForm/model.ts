import type { IHost } from '@/entities/host'
import type { IPass, IPassInput, TPassField } from '@/entities/pass'
import type { TIconName } from '@/shared/ui'

export type TFormMode = 'create' | 'edit'

export interface IProps {
  mode: TFormMode | null
  initial?: IPass
  hosts: IHost[]
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
  select?: boolean
}

export const HOST_PLACEHOLDER = 'Начните вводить ФИО, должность или подразделение'
export const HOST_EMPTY_HINT = 'В структуре ещё нет закреплённых сотрудников — назначьте их в разделе «Структура»'

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
    { name: 'hostName', placeholder: 'Начните вводить ФИО, должность или подразделение', icon: 'users', isRequired: true, select: true },
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
