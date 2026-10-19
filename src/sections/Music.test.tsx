import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Music } from './Music'
import { content } from '../content/content'
import type { Track } from '../content/types'

// Сеты держим свои: в контенте их может не быть, пока Егор не прислал ссылки.
const tracks: Track[] = [
  {
    num: '01',
    title: 'Ночная смена',
    length: '58:20',
    platform: 'soundcloud',
    embedUrl: 'https://w.soundcloud.com/player/?url=track-one',
    poster: '/media/booth.jpg',
  },
  {
    num: '02',
    title: 'Гараж на Сходне',
    length: '1:12:04',
    platform: 'soundcloud',
    embedUrl: 'https://w.soundcloud.com/player/?url=track-two',
    poster: '/media/portrait-wall.jpg',
  },
]

const data = { ...content.ru.music, tracks }

it('до клика не создаёт iframe, только постер', () => {
  render(<Music data={data} />)
  expect(document.querySelector('iframe')).toBeNull()
  expect(screen.getAllByRole('button')).toHaveLength(tracks.length)
})

it('по клику подставляет плеер для нужного трека', async () => {
  render(<Music data={data} />)
  await userEvent.click(screen.getByRole('button', { name: new RegExp(tracks[1].title, 'i') }))
  expect(document.querySelector('iframe')).toHaveAttribute('src', tracks[1].embedUrl)
})

it('пустой список треков скрывает секцию целиком', () => {
  const { container } = render(<Music data={{ ...data, tracks: [] }} />)
  expect(container.querySelector('#music')).toBeNull()
})

it('до клика на месте плеера стоит постер трека', () => {
  render(<Music data={data} />)
  const btn = screen.getByRole('button', { name: new RegExp(tracks[0].title, 'i') })
  // jsdom не вычисляет background-image из инлайнового стиля, поэтому
  // смотрим на сам атрибут.
  expect(btn.getAttribute('style')).toContain(tracks[0].poster)
})
