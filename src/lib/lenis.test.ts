import { initLenis } from './lenis'

it('не инициализируется при reduced-motion', () => {
  expect(initLenis(true)).toBeNull()
})

it('инициализируется и умеет уничтожаться', () => {
  const l = initLenis(false)
  expect(l).not.toBeNull()
  expect(() => l!.destroy()).not.toThrow()
})
