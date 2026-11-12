import { revealFront, revealGlow } from './revealProgress'

const DUR = 2.8

it('в начале фронт стоит у нижнего края', () => expect(revealFront(0, DUR)).toBe(0))
it('к концу фронт доходит до верха', () => expect(revealFront(DUR, DUR)).toBe(1))

it('растёт монотонно', () => {
  const v = [0, 0.7, 1.4, 2.1, 2.8].map((t) => revealFront(t, DUR))
  for (let i = 1; i < v.length; i++) expect(v[i]).toBeGreaterThan(v[i - 1])
})

it('идёт по power3.out — половина пути пройдена заметно раньше половины времени', () => {
  // Та же кривая, что EASE в motion.ts: 1-(1-t)^3. На середине времени это
  // 0.875, то есть проявление почти закончено, а не на половине.
  expect(revealFront(DUR / 2, DUR)).toBeCloseTo(0.875)
})

it('выход за границы зажимается', () => {
  expect(revealFront(-1, DUR)).toBe(0)
  expect(revealFront(DUR * 2, DUR)).toBe(1)
})

it('нулевая длительность не даёт деления на ноль', () => {
  expect(revealFront(0, 0)).toBe(1)
})

it('полоса светится в середине прохода', () => {
  expect(revealGlow(DUR / 2, DUR)).toBeGreaterThan(0)
})

it('полоса гаснет к концу — в покое остаётся ровный вайрфрейм', () => {
  expect(revealGlow(DUR, DUR)).toBe(0)
})

it('полоса гаснет и после конца', () => {
  expect(revealGlow(DUR * 3, DUR)).toBe(0)
})
