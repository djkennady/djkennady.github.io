import type { Show } from '../content/types'

/** Выступление считается предстоящим до конца своего дня: вечеринка идёт
 *  ночью, и днём 23-го она ещё впереди. */
function isUpcoming(iso: string, today: Date): boolean {
  const day = today.toISOString().slice(0, 10)
  return iso >= day
}

/** Делит даты на предстоящие и прошедшие по сегодняшнему числу и сортирует:
 *  ближайшее выступление сверху, из прошедших — самое свежее.
 *  Раньше это был флаг в файле контента, и просроченные даты продолжали
 *  висеть как предстоящие. */
export function splitShows(list: Show[], today: Date): { upcoming: Show[]; past: Show[] } {
  const upcoming: Show[] = []
  const past: Show[] = []

  for (const show of list) (isUpcoming(show.date, today) ? upcoming : past).push(show)

  upcoming.sort((a, b) => a.date.localeCompare(b.date))
  past.sort((a, b) => b.date.localeCompare(a.date))

  return { upcoming, past }
}
