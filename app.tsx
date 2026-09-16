import { render } from '@gpuix/react'
import { App } from '@/app'

const WINDOW = {
  title: 'gatePass',
  width: 1180,
  height: 720,
  trafficLightX: 16,
  trafficLightY: 17,
} as const

const isEntryPoint =
  typeof Bun !== 'undefined'
    ? Bun.isStandaloneExecutable || Bun.main === import.meta.path
    : typeof window !== 'undefined'

const focus = typeof process === 'undefined' || process.env.GPUIX_BACKGROUND !== '1'

if (isEntryPoint) {
  render(<App />, {
    ...WINDOW,
    titlebarTransparent: true,
    windowBackground: 'blurred',
    focus,
    onKeyDown: (event, renderer) => {
      const isTab = event.key?.toLowerCase() === 'tab' || event.keyChar === '\t'
      if (isTab) {
        if (event.modifiers?.shift) {
          renderer.focusPrevious?.()
        } else {
          renderer.focusNext?.()
        }
      }
    },
  })
}

export { App }
