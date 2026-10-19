import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Contact } from './Contact'
import { content } from '../content/content'

const data = content.ru.contact
const ui = content.ru.ui

it('почта и телеграм — настоящие ссылки', () => {
  render(<Contact data={data} ui={ui} />)
  expect(screen.getByRole('link', { name: data.bookingEmail })).toHaveAttribute(
    'href',
    `mailto:${data.bookingEmail}`,
  )
})

it('клик по почте копирует её и подтверждает', async () => {
  const write = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText: write } })

  render(<Contact data={data} ui={ui} />)
  await userEvent.click(screen.getByTestId('copy-email'))

  expect(write).toHaveBeenCalledWith(data.bookingEmail)
  expect(await screen.findByRole('status')).toHaveTextContent(ui.copied)
})

it('недоступный буфер обмена не ломает кнопку', async () => {
  Object.assign(navigator, { clipboard: undefined })
  render(<Contact data={data} ui={ui} />)
  await expect(userEvent.click(screen.getByTestId('copy-email'))).resolves.not.toThrow()
})
