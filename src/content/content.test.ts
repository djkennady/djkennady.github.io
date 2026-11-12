import { content } from './content'

const keys = (o: unknown, p = ''): string[] =>
  o && typeof o === 'object' && !Array.isArray(o)
    ? Object.entries(o).flatMap(([k, v]) => [`${p}${k}`, ...keys(v, `${p}${k}.`)])
    : []

it('наборы ключей ru и en совпадают полностью', () => {
  expect(keys(content.ru).sort()).toEqual(keys(content.en).sort())
})

it('не содержит пустых строк', () => {
  const walk = (o: unknown): void => {
    if (typeof o === 'string') expect(o.trim()).not.toBe('')
    else if (Array.isArray(o)) o.forEach(walk)
    else if (o && typeof o === 'object') Object.values(o).forEach(walk)
  }
  walk(content)
})

it('все ссылки абсолютные или mailto', () => {
  const urls = [
    ...content.ru.contact.socials.map((s) => s.url),
    content.ru.etiqet.instagramUrl,
    ...content.ru.music.tracks.map((t) => t.embedUrl),
  ]
  for (const u of urls) expect(u).toMatch(/^(https?:\/\/|mailto:)/)
})

it('списки в обеих локалях одной длины', () => {
  // Самая частая ошибка при ручной правке: добавил дату в русский блок и
  // забыл в английский. Тогда на английской версии её просто нет.
  expect(content.ru.shows.list.length).toBe(content.en.shows.list.length)
  expect(content.ru.shows.shots.length).toBe(content.en.shows.shots.length)
  expect(content.ru.music.tracks.length).toBe(content.en.music.tracks.length)
  expect(content.ru.etiqet.items.length).toBe(content.en.etiqet.items.length)
  expect(content.ru.manifesto.lines.length).toBe(content.en.manifesto.lines.length)
  expect(content.ru.manifesto.facts.length).toBe(content.en.manifesto.facts.length)
})

it('даты записаны как ГГГГ-ММ-ДД, иначе сортировка врёт', () => {
  for (const show of [...content.ru.shows.list, ...content.en.shows.list]) {
    expect(show.date, show.venue).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  }
})
