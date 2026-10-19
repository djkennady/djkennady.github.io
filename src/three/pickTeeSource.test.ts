import { pickTeeSource } from './pickTeeSource'

it('берёт модель, когда путь задан', () =>
  expect(pickTeeSource('/models/tee.glb')).toEqual({ kind: 'model', url: '/models/tee.glb' }))
it('падает в ткань, когда модели нет', () => expect(pickTeeSource(null)).toEqual({ kind: 'fabric' }))
it('падает в ткань на пустой строке', () => expect(pickTeeSource('')).toEqual({ kind: 'fabric' }))
