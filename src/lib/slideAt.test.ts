import { slideAt, slideOpacity } from './slideAt'

const SLIDES = 4

it('в начале показан первый кадр', () => {
  expect(slideAt(0, SLIDES)).toBe(0)
  expect(slideAt(0.1, SLIDES)).toBe(0)
})

it('кадры сменяются по порядку', () => {
  expect(slideAt(0.3, SLIDES)).toBe(1)
  expect(slideAt(0.55, SLIDES)).toBe(2)
  expect(slideAt(0.8, SLIDES)).toBe(3)
})

it('последний кадр держится до самого конца', () => {
  expect(slideAt(1, SLIDES)).toBe(SLIDES - 1)
  expect(slideAt(0.99, SLIDES)).toBe(SLIDES - 1)
})

it('выход за границы зажимается', () => {
  expect(slideAt(-1, SLIDES)).toBe(0)
  expect(slideAt(5, SLIDES)).toBe(SLIDES - 1)
})

it('свой кадр виден, чужие погашены', () => {
  expect(slideOpacity(0.05, 0, SLIDES)).toBeCloseTo(1)
  expect(slideOpacity(0.05, 2, SLIDES)).toBe(0)
})

it('на стыке кадры перетекают, а не моргают', () => {
  // Ровно на границе уходящий уже не полный, а приходящий ещё не полный.
  const edge = 1 / SLIDES
  expect(slideOpacity(edge, 0, SLIDES)).toBeLessThan(1)
  expect(slideOpacity(edge, 1, SLIDES)).toBeLessThan(1)
  expect(slideOpacity(edge, 0, SLIDES) + slideOpacity(edge, 1, SLIDES)).toBeGreaterThan(0.5)
})
