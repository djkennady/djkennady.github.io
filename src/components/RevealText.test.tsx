import { render, screen } from '@testing-library/react'
import { RevealText } from './RevealText'
import { mockReduce } from '../test/setup'

it('разбивает текст на слова, но целиком доступен для чтения', () => {
  render(<RevealText text="музыка и одежда" />)
  expect(screen.getByLabelText('музыка и одежда')).toBeInTheDocument()
})

it('при reduced-motion слова сразу видимы', () => {
  mockReduce(true)
  render(<RevealText text="музыка и одежда" />)
  for (const w of ['музыка', 'и', 'одежда']) {
    expect(screen.getByText(w)).toHaveStyle({ opacity: '1' })
  }
})
