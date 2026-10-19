import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { content } from '../content/content'

const data = content.ru.hero
const ui = content.ru.ui

it('содержит единственный h1 с псевдонимом', () => {
  render(<Hero data={data} ui={ui} lang="ru" onLang={vi.fn()} />)
  const h1 = screen.getAllByRole('heading', { level: 1 })
  expect(h1).toHaveLength(1)
  expect(h1[0]).toHaveTextContent(data.name)
})

it('кнопки ведут на блоки букинга и бренда', () => {
  render(<Hero data={data} ui={ui} lang="ru" onLang={vi.fn()} />)
  expect(screen.getByRole('link', { name: data.ctaBooking })).toHaveAttribute('href', '#contact')
  expect(screen.getByRole('link', { name: data.ctaBrand })).toHaveAttribute('href', '#etiqet')
})

it('3D-слой скрыт от скринридера', () => {
  const { container } = render(<Hero data={data} ui={ui} lang="ru" onLang={vi.fn()} />)
  expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
})
