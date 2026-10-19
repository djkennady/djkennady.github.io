import { readFileSync, globSync } from 'node:fs'

const css = readFileSync('src/styles/index.css', 'utf8')
const NIGHT = { '--bg': '#0A0A0A', '--fg': '#F5F5F5', '--muted': '#8A8A8A', '--line': '#2E2E2E' }
const DAY = { '--bg': '#E8E6E1', '--fg': '#0A0A0A', '--muted': '#6A6763', '--line': '#C4C1BC' }

it('объявляет все четыре токена в ночном режиме с точными значениями', () => {
  for (const [t, v] of Object.entries(NIGHT)) expect(css).toMatch(new RegExp(`${t}:\\s*${v}`, 'i'))
})

it('объявляет все четыре токена в светлом режиме с точными значениями', () => {
  for (const [t, v] of Object.entries(DAY)) expect(css).toMatch(new RegExp(`${t}:\\s*${v}`, 'i'))
})

it('не содержит hex-литералов в компонентах и секциях', () => {
  const files = globSync('src/{components,sections,three}/**/*.{ts,tsx}')
  for (const f of files) {
    expect(readFileSync(f, 'utf8'), f).not.toMatch(/#[0-9a-f]{3,8}\b/i)
  }
})
