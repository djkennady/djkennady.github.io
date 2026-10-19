import { modeRamp } from './modeTransition'

it('верх страницы остаётся ночным', () => expect(modeRamp(0)).toBe(0))
it('низ страницы тоже ночной', () => expect(modeRamp(1)).toBe(0))
it('на самом блоке день держится полностью', () => {
  expect(modeRamp(0.5)).toBe(1)
  expect(modeRamp(0.35)).toBe(1)
  expect(modeRamp(0.65)).toBe(1)
})
it('на входе и выходе значение промежуточное', () => {
  expect(modeRamp(0.125)).toBeCloseTo(0.5)
  expect(modeRamp(0.875)).toBeCloseTo(0.5)
})
