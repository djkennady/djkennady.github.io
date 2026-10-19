import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LangToggle } from './LangToggle'

it('показывает текущий язык как выбранный и доступен с клавиатуры', async () => {
  const onChange = vi.fn()
  render(<LangToggle lang="ru" onChange={onChange} />)
  expect(screen.getByRole('button', { name: /ru/i })).toHaveAttribute('aria-pressed', 'true')
  await userEvent.tab()
  await userEvent.tab()
  await userEvent.keyboard('{Enter}')
  expect(onChange).toHaveBeenCalledWith('en')
})
