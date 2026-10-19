import { fireEvent, render, screen } from '@testing-library/react'
import { Reel } from './Reel'
import { content } from '../content/content'
import { mockReduce } from '../test/setup'

const data = content.ru.reel
const ui = content.ru.ui

it('видео без звука и с постером', () => {
  render(<Reel data={data} ui={ui} />)
  const v = screen.getByTestId('reel-video') as HTMLVideoElement
  expect(v.muted).toBe(true) // React ставит muted свойством, не атрибутом
  expect(v).toHaveAttribute('poster', data.poster)
})

it('при reduced-motion автоплея нет', () => {
  mockReduce(true)
  render(<Reel data={data} ui={ui} />)
  expect((screen.getByTestId('reel-video') as HTMLVideoElement).autoplay).toBe(false)
})

it('отсутствующий файл не оставляет чёрную дыру с кнопкой звука', () => {
  const { container } = render(<Reel data={data} ui={ui} />)
  fireEvent.error(screen.getByTestId('reel-video'))
  expect(screen.queryByTestId('reel-video')).toBeNull()
  expect(screen.queryByRole('button')).toBeNull()
  expect(container.querySelector('#reel')).toBeInTheDocument()
})
