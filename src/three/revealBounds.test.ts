import { normalizeHeight } from './revealBounds'

it('нижняя граница меша — ноль', () => expect(normalizeHeight(-2, -2, 6)).toBe(0))
it('верхняя граница меша — единица', () => expect(normalizeHeight(6, -2, 6)).toBe(1))
it('середина — половина', () => expect(normalizeHeight(2, -2, 6)).toBeCloseTo(0.5))

it('не зависит от масштаба и смещения модели', () => {
  // Ровно это и значит «работает с любым мешем»: футболка из Tripo и полотно
  // ткани имеют разные габариты, а фронт должен идти по ним одинаково.
  expect(normalizeHeight(0.25, 0, 1)).toBeCloseTo(normalizeHeight(250, 0, 1000))
})

it('выход за габарит зажимается', () => {
  expect(normalizeHeight(-99, -2, 6)).toBe(0)
  expect(normalizeHeight(99, -2, 6)).toBe(1)
})

it('плоский меш не даёт деления на ноль', () => {
  expect(normalizeHeight(5, 5, 5)).toBe(0)
})

it('перевёрнутый габарит не даёт отрицательных значений', () => {
  expect(normalizeHeight(3, 6, -2)).toBe(0)
})
