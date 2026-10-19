import { render, screen } from '@testing-library/react'
import { Shows } from './Shows'
import { content } from '../content/content'
import type { Show } from '../content/types'

const data = content.ru.shows

// Даты держим свои: в контенте их может не быть вовсе, пока Егор не прислал
// настоящие, и тесты не должны от этого зависеть.
const list: Show[] = [
  { date: '2026-11-07', city: 'Набережные Челны', venue: 'NEFTЬ', upcoming: true },
  { date: '2026-09-27', city: 'Казань', venue: 'Werk', upcoming: false },
  { date: '2026-08-16', city: 'Москва', venue: 'Арма', upcoming: false },
]

it('разделяет предстоящие и прошедшие даты', () => {
  render(<Shows data={{ ...data, list }} />)
  expect(screen.getByTestId('upcoming').children).toHaveLength(1)
})

it('без предстоящих дат не показывает блок предстоящих', () => {
  const past = list.map((s) => ({ ...s, upcoming: false }))
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
