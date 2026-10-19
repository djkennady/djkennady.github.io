import { resolveLang } from './resolveLang'

it('параметр ?lang= имеет приоритет над сохранённым', () => {
  expect(resolveLang({ search: '?lang=en', stored: 'ru', navigator: 'ru-RU' })).toBe('en')
})
it('сохранённый имеет приоритет над языком браузера', () => {
  expect(resolveLang({ search: '', stored: 'en', navigator: 'ru-RU' })).toBe('en')
})
it('по умолчанию берёт язык браузера', () => {
  expect(resolveLang({ search: '', stored: null, navigator: 'ru-RU' })).toBe('ru')
})
it('неизвестный язык браузера даёт английский', () => {
  expect(resolveLang({ search: '', stored: null, navigator: 'de-DE' })).toBe('en')
})
it('мусор в параметре игнорируется', () => {
  expect(resolveLang({ search: '?lang=zz', stored: 'ru', navigator: 'de-DE' })).toBe('ru')
})
