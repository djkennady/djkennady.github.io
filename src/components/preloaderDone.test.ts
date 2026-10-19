import { preloaderDone } from './preloaderDone'

it('снимается, когда медиа готовы', () => expect(preloaderDone(true, 200, false)).toBe(true))
it('держится, пока медиа не готовы и таймаут не вышел', () =>
  expect(preloaderDone(false, 1500, false)).toBe(false))
it('снимается по таймауту 3 секунды даже без медиа', () =>
  expect(preloaderDone(false, 3000, false)).toBe(true))
it('при reduced-motion снимается сразу', () => expect(preloaderDone(false, 0, true)).toBe(true))
