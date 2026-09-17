const INITIALS_LIMIT = 2

export const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, INITIALS_LIMIT)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
