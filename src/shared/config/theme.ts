const isBrowser = typeof window !== 'undefined'

export const theme = {
  colors: {
    canvas: '#1A1A1A',
    sidebar: '#181818',
    raised: '#232323',
    overlay: '#E6EAF20D',
    overlayStrong: '#E6EAF217',
    border: '#E6EAF212',
    sidebarBorder: '#292929',
    text: '#E2E2E2',
    secondary: '#A3A3A3',
    tertiary: '#7D7D7D',
    ghost: '#575757',
    accent: '#E2795B',
    accentHover: '#EC8767',
    onAccent: '#17181C',
    danger: '#E25B5B',
    success: '#5BC58A',
  },
  font: {
    family: isBrowser ? 'IBM Plex Sans' : 'Helvetica',
    size: { xs: 12, sm: 13, md: 14, lg: 15, xl: 20 },
    lineHeight: { md: 20 },
  },
  spacing: { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { sm: 7, md: 9, lg: 12, full: 999 },
  size: {
    iconSm: 11,
    iconMd: 15,
    iconLg: 22,
    control: 28,
    row: 44,
    input: 46,
    header: 52,
    contentMaxWidth: 640,
  },
  motion: { fast: 0.2, normal: 0.25 },
} as const

export type TThemeColor = keyof typeof theme.colors
