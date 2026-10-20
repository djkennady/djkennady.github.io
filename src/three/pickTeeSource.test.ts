import { pickTeeSource } from './pickTeeSource'

it('берёт модель, когда путь задан', () =>
  expect(pickTeeSource('/models/tee.glb')).toEqual({ kind: 'model', url: '/models/tee.glb' }))

it('без модели показывает футболку, собранную в сцене', () =>
  expect(pickTeeSource(null)).toEqual({ kind: 'shirt' }))

it('пустая строка тоже означает отсутствие модели', () =>
  expect(pickTeeSource('')).toEqual({ kind: 'shirt' }))
