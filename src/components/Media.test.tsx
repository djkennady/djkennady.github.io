import { fireEvent, render, screen } from '@testing-library/react'
import { Media } from './Media'

it('битый файл заменяется нейтральным блоком, а не иконкой сломанной картинки', () => {
  const { container } = render(<Media src="/nope.webp" kind="image" alt="танцпол в дыму" />)
  fireEvent.error(container.querySelector('img')!)
  expect(container.querySelector('img')).toBeNull()
  expect(screen.getByRole('img', { name: 'танцпол в дыму' })).toBeInTheDocument()
})

it('подпись остаётся доступной и для видео', () => {
  render(<Media src="/clip.mp4" kind="video" alt="съёмка с дека" />)
  expect(screen.getByLabelText('съёмка с дека')).toBeInTheDocument()
})
