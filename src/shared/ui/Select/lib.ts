import { CREATE_NAME_MAX, ELLIPSIS } from './model'

export const shortNameOf = (name: string) =>
  name.length > CREATE_NAME_MAX ? `${name.slice(0, CREATE_NAME_MAX).trimEnd()}${ELLIPSIS}` : name
