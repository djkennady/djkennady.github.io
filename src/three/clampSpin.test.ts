import { clampSpin, MAX_SPIN } from './clampSpin'

it('внутри допустимого угла ничего не меняет', () => {
  expect(clampSpin(0)).toBe(0)
  expect(clampSpin(0.3)).toBeCloseTo(0.3)
})

it('не даёт докрутить до плоского бока', () => {
  // Деталь выдавленная: с ребра видно, что это не настоящая ткань.
  expect(clampSpin(Math.PI)).toBeCloseTo(MAX_SPIN)
  expect(clampSpin(-Math.PI)).toBeCloseTo(-MAX_SPIN)
})

it('предел меньше четверти оборота', () => {
  expect(MAX_SPIN).toBeLessThan(Math.PI / 2)
})
