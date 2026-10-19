import { act, render } from '@testing-library/react'
import { Preloader } from './Preloader'

afterEach(() => vi.useRealTimers())

it('вызывает onDone ровно один раз, даже когда медиа так и не загрузились', async () => {
  vi.useFakeTimers()
  const onDone = vi.fn()

  render(<Preloader onDone={onDone} />)
  await act(async () => {
    await vi.advanceTimersByTimeAsync(4000)
  })

  expect(onDone).toHaveBeenCalledTimes(1)
})
