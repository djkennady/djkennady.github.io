import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Music } from './Music'
import { content } from '../content/content'

const data = content.ru.music

it('до клика не создаёт iframe, только постер', () => {
  render(<Music data={data} />)
  expect(document.querySelector('iframe')).toBeNull()
  expect(screen.getAllByRole('button')).toHaveLength(data.tracks.length)
})

it('по клику подставляет плеер для нужного трека', async () => {
  render(<Music data={data} />)
  await userEvent.click(
    screen.getByRole('button', { name: new RegExp(data.tracks[1].title, 'i') }),
  )
  expect(document.querySelector('iframe')).toHaveAttribute('src', data.tracks[1].embedUrl)
})

it('пустой список треков скрывает секцию целиком', () => {
  const { container } = render(<Music data={{ ...data, tracks: [] }} />)
  expect(container.querySelector('#music')).toBeNull()
})
