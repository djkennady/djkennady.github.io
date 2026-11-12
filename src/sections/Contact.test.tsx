import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Contact } from './Contact'
import { content } from '../content/content'

const data = content.ru.contact
const ui = content.ru.ui
const facts = content.ru.manifesto.facts

it('почта и телеграм — настоящие ссылки', () => {
  render(<Contact data={data} ui={ui} facts={facts} />)
  expect(screen.getByRole('link', { name: data.bookingEmail })).toHaveAttribute(
    'href',
    `mailto:${data.bookingEmail}`,
  )
})

it('клик по почте копирует её и подтверждает', async () => {
  const write = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText: write } })

  render(<Contact data={data} ui={ui} facts={facts} />)
  await userEvent.click(screen.getByTestId('copy-email'))

  expect(write).toHaveBeenCalledWith(data.bookingEmail)
  expect(await screen.findByRole('status')).toHaveTextContent(ui.copied)
})

it('недоступный буфер обмена не ломает кнопку', async () => {
  Object.assign(navigator, { clipboard: undefined })
  render(<Contact data={data} ui={ui} facts={facts} />)
  await expect(userEvent.click(screen.getByTestId('copy-email'))).resolves.not.toThrow()
})

it('цифры повторяются у контактов, а не только в манифесте', () => {
  render(<Contact data={data} ui={ui} facts={facts} />)
  for (const fact of facts) {
    expect(screen.getByText(new RegExp(`${fact.value}\\s+${fact.label}`, 'i'))).toBeInTheDocument()
  }
})

it('без цифр блок контактов не показывает пустую строку', () => {
  render(<Contact data={data} ui={ui} facts={[]} />)
  expect(screen.queryByTestId('proof')).toBeNull()
})
