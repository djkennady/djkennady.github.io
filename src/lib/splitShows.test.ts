import { splitShows } from './splitShows'
import type { Show } from '../content/types'

const show = (date: string, city = 'Набережные Челны'): Show => ({
  date,
  city,
  venue: 'LAKI',
})

const today = new Date('2026-11-12T12:00:00Z')

it('относит к предстоящим только то, что ещё не прошло', () => {
  const { upcoming, past } = splitShows(
    [show('2026-10-23'), show('2026-12-01'), show('2027-01-15')],
    today,
  )
  expect(upcoming.map((s) => s.date)).toEqual(['2026-12-01', '2027-01-15'])
  expect(past.map((s) => s.date)).toEqual(['2026-10-23'])
})

it('сегодняшняя дата ещё предстоящая: вечер впереди', () => {
  const { upcoming } = splitShows([show('2026-11-12')], today)
  expect(upcoming.map((s) => s.date)).toEqual(['2026-11-12'])
})

it('предстоящие идут от ближайшей, прошедшие — от свежей', () => {
  const { upcoming, past } = splitShows(
    [show('2027-03-01'), show('2026-12-01'), show('2026-05-01'), show('2026-10-23')],
    today,
  )
  expect(upcoming.map((s) => s.date)).toEqual(['2026-12-01', '2027-03-01'])
  expect(past.map((s) => s.date)).toEqual(['2026-10-23', '2026-05-01'])
})

it('пустой список не ломается', () => {
  expect(splitShows([], today)).toEqual({ upcoming: [], past: [] })
})
