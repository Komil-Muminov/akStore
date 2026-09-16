import { describe, expect, it } from 'vitest'
import { connectTest } from '@gpuix/react/automation'
import { createTestRoot, hasNativeTestRenderer } from '@gpuix/react/testing'
import { App } from '@/app'

const describeNative = hasNativeTestRenderer ? describe : describe.skip
const TITLE = 'Все пропуска'

describeNative('gatePass', () => {
  it('рисует заголовок и композер', async () => {
    const { render, renderer } = createTestRoot()
    render(<App />)
    const app = await connectTest(renderer)

    await app.getByTestId('pass-composer__input').waitFor({ timeoutMs: 10_000 })
    expect(renderer.getPaintedText()).toContain(TITLE)

    await app.close()
  })
})
