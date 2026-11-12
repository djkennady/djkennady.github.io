import { render, screen } from '@testing-library/react'
import { Shows } from './Shows'
import { content } from '../content/content'
import type { Show } from '../content/types'

const data = content.ru.shows

// Даты держим свои: в контенте их может не быть вовсе, пока Егор не прислал
// настоящие, и тесты не должны от этого зависеть.
const list: Show[] = [
  { date: '2099-11-07', city: 'Набережные Челны', venue: 'NEFTЬ' },
  { date: '2020-09-27', city: 'Казань', venue: 'Werk' },
  { date: '2020-08-16', city: 'Москва', venue: 'Арма' },
]

it('разделяет предстоящие и прошедшие даты', () => {
  render(<Shows data={{ ...data, list }} />)
  expect(screen.getByTestId('upcoming').children).toHaveLength(1)
})

it('без предстоящих дат не показывает блок предстоящих', () => {
  // Все даты в прошлом — блока предстоящих быть не должно. Раньше это
  // решал флаг в контенте, и просроченные даты висели как ближайшие.
  const past = list.filter((s) => s.date < '2026-01-01')
  render(<Shows data={{ ...data, list: past }} />)
  expect(screen.queryByTestId('upcoming')).toBeNull()
})

it('без единой даты блок дат не рендерится вовсе', () => {
  const { container } = render(<Shows data={{ ...data, list: [] }} />)
  expect(container.querySelector('ul')).toBeNull()
})

it('у каждого шота есть осмысленный alt', () => {
  render(<Shows data={data} />)
  for (const img of screen.getAllByRole('img')) {
    expect(img.getAttribute('alt')?.trim()).not.toBe('')
  }
})

it('пустая лента шотов не ломает секцию', () => {
  expect(() => render(<Shows data={{ ...data, shots: [] }} />)).not.toThrow()
})
