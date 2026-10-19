import { render, screen } from '@testing-library/react'
import { App } from './App'

it('на странице ровно один h1', () => {
  render(<App />)
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})

it('уровни заголовков идут без пропусков', () => {
  render(<App />)
  const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName[1]))
  for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
})

it('все 3D-канвасы скрыты от скринридера', () => {
  const { container } = render(<App />)
  for (const c of container.querySelectorAll('canvas')) {
    expect(c.closest('[aria-hidden="true"]')).toBeTruthy()
  }
})

it('каждая ссылка в новое окно защищена noopener', () => {
  const { container } = render(<App />)
  for (const a of container.querySelectorAll('a[target="_blank"]')) {
    expect(a.getAttribute('rel') ?? '', a.getAttribute('href') ?? '').toContain('noopener')
  }
})

it('у каждой кнопки есть доступное имя из слов, а не из значка', () => {
  render(<App />)
  for (const button of screen.getAllByRole('button')) {
    expect(button).toHaveAccessibleName()
    // Один глиф вроде «↗» формально считается именем, но вслух это
    // «стрелка на северо-восток» и ничего не говорит о действии.
    const name = button.getAttribute('aria-label') ?? button.textContent ?? ''
    expect(name, name).toMatch(/\p{L}{2,}/u)
  }
})
