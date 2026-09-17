import { PASS_FIELD_LABELS, type IPass } from '@/entities/pass'

export const detailsOf = (pass: IPass) =>
  [
    { label: PASS_FIELD_LABELS.organization, value: pass.organization },
    { label: PASS_FIELD_LABELS.hostName, value: pass.hostName },
    { label: PASS_FIELD_LABELS.purpose, value: pass.purpose },
    { label: PASS_FIELD_LABELS.phone, value: pass.phone },
    { label: PASS_FIELD_LABELS.carPlate, value: pass.carPlate },
  ].filter((row) => row.value?.trim().length > 0)
