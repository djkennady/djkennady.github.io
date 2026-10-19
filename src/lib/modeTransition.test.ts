import { mixHex } from './modeTransition'

it('края дают исходные цвета', () => {
  expect(mixHex('#0A0A0A', '#E8E6E1', 0).toLowerCase()).toBe('#0a0a0a')
  expect(mixHex('#0A0A0A', '#E8E6E1', 1).toLowerCase()).toBe('#e8e6e1')
})
it('середина лежит между', () => {
  expect(mixHex('#000000', '#FFFFFF', 0.5).toLowerCase()).toBe('#808080')
})
it('выход за границы зажимается', () => {
  expect(mixHex('#000000', '#FFFFFF', -1).toLowerCase()).toBe('#000000')
  expect(mixHex('#000000', '#FFFFFF', 3).toLowerCase()).toBe('#ffffff')
})
