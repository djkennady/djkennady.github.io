import { detectTier, tierSettings, type TierEnv } from './deviceTier'

const env = (o: Partial<TierEnv> = {}): TierEnv => ({
  webgl2: true,
  cores: 8,
  memory: 8,
  coarsePointer: false,
  reducedMotion: false,
  ...o,
})

it('high: WebGL2, 8 ядер, тонкий указатель', () => expect(detectTier(env())).toBe('high'))
it('mid: WebGL2, но мало ядер', () => expect(detectTier(env({ cores: 6 }))).toBe('mid'))
it('mid: WebGL2, но грубый указатель', () =>
  expect(detectTier(env({ coarsePointer: true }))).toBe('mid'))
it('low: нет WebGL2', () => expect(detectTier(env({ webgl2: false }))).toBe('low'))
it('low: меньше четырёх ядер', () => expect(detectTier(env({ cores: 2 }))).toBe('low'))
it('low: меньше четырёх гигабайт памяти', () => expect(detectTier(env({ memory: 2 }))).toBe('low'))
it('неизвестная память не понижает уровень', () =>
  expect(detectTier(env({ memory: undefined }))).toBe('high'))
it('reduced-motion всегда даёт low', () => {
  expect(detectTier(env({ reducedMotion: true }))).toBe('low')
  expect(detectTier(env({ reducedMotion: true, cores: 16 }))).toBe('low')
})
it('low не рендерит 3D, high и mid рендерят', () => {
  expect(tierSettings('low').render3d).toBe(false)
  expect(tierSettings('mid').render3d).toBe(true)
  expect(tierSettings('high').dpr[1]).toBe(1.75)
  expect(tierSettings('mid').dpr[1]).toBe(1.25)
  expect(tierSettings('mid').segments).toBe(tierSettings('high').segments / 2)
})
