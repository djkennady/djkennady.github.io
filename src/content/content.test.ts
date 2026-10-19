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
