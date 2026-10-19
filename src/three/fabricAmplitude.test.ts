import { fabricAmplitude, sceneAmplitude } from './fabricAmplitude'

it('полная амплитуда в начале скролла', () => expect(fabricAmplitude(0)).toBe(1))
it('нулевая амплитуда, когда герой ушёл', () => expect(fabricAmplitude(1)).toBe(0))
it('убывает монотонно', () => {
  const v = [0, 0.25, 0.5, 0.75, 1].map(fabricAmplitude)
  for (let i = 1; i < v.length; i++) expect(v[i]).toBeLessThan(v[i - 1])
})
it('выход за границы зажимается', () => {
  expect(fabricAmplitude(-1)).toBe(1)
  expect(fabricAmplitude(2)).toBe(0)
})

it('без источника прогресса полотно колышется всегда', () => {
  // Ткань в блоке бренда не привязана к герою: к ней доскроллили, когда
  // герой давно ушёл, и его прогресс равен единице.
  expect(sceneAmplitude(undefined)).toBe(1)
})

it('с источником прогресса гаснет вместе с ним', () => {
  expect(sceneAmplitude({ value: 0 })).toBe(1)
  expect(sceneAmplitude({ value: 1 })).toBe(0)
  expect(sceneAmplitude({ value: 0.5 })).toBeCloseTo(fabricAmplitude(0.5))
})
