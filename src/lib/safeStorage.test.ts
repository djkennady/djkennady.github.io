import { safeStorage } from './safeStorage'

afterEach(() => vi.restoreAllMocks())

it('не бросает, когда localStorage недоступен', () => {
  // В jsdom getItem/setItem живут на Storage.prototype, а не на самом объекте,
  // поэтому подменять надо прототип.
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('denied')
  })
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('denied')
  })
  expect(() => safeStorage.set('k', 'v')).not.toThrow()
  expect(safeStorage.get('k')).toBeNull()
})
