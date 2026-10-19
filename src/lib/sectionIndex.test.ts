import { sectionIndex } from './sectionIndex'

it('нумерует секции по порядку', () => {
  const visible = ['music', 'shows', 'etiqet']
  expect(sectionIndex(visible, 'music')).toBe('01')
  expect(sectionIndex(visible, 'shows')).toBe('02')
  expect(sectionIndex(visible, 'etiqet')).toBe('03')
})

it('скрытая секция не оставляет дырку в нумерации', () => {
  // Сеты ещё не прислали — блок музыки не рендерится, и счёт должен
  // начинаться с единицы, а не с двойки.
  const visible = ['shows', 'etiqet']
  expect(sectionIndex(visible, 'shows')).toBe('01')
  expect(sectionIndex(visible, 'etiqet')).toBe('02')
})
