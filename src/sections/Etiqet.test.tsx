import { render, screen } from '@testing-library/react'
import { Etiqet } from './Etiqet'
import { content } from '../content/content'

const data = content.ru.etiqet
const ui = content.ru.ui

it('кнопка ведёт в Instagram бренда', () => {
  render(<Etiqet data={data} ui={ui} />)
  const link = screen.getByRole('link', { name: /instagram/i })
  expect(link).toHaveAttribute('href', data.instagramUrl)
  expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
})

it('вещь без цены показывает строку «по запросу» из контента, а не пустое место', () => {
  const items = [{ ...data.items[0], price: null }]
  render(<Etiqet data={{ ...data, items }} ui={ui} />)
  expect(screen.getByText(ui.onRequest)).toBeInTheDocument()
})

it('пустой список вещей оставляет блок с 3D и ссылкой', () => {
  render(<Etiqet data={{ ...data, items: [] }} ui={ui} />)
  expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
})
