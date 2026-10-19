import { render, screen } from '@testing-library/react'
import { Shows } from './Shows'
import { content } from '../content/content'

const data = content.ru.shows

it('разделяет предстоящие и прошедшие даты', () => {
  render(<Shows data={data} />)
  const upcoming = data.list.filter((s) => s.upcoming)
  expect(screen.getByTestId('upcoming').children).toHaveLength(upcoming.length)
})

it('без предстоящих дат не показывает блок предстоящих', () => {
  const list = data.list.map((s) => ({ ...s, upcoming: false }))
  render(<Shows data={{ ...data, list }} />)
  expect(screen.queryByTestId('upcoming')).toBeNull()
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
