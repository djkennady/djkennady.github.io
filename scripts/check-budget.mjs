import { gzipSync } from 'node:zlib'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'dist/assets'
const LIMIT_FIRST = 200 * 1024
const LIMIT_3D = 260 * 1024

const files = readdirSync(DIR).filter((f) => f.endsWith('.js'))

// Чанк относится к 3D, если он сам тянет three или если его тянет тот, кто
// тянет: проще — ищем имена three/@react-three в содержимом.
const rows = files.map((name) => {
  const raw = readFileSync(join(DIR, name))
  const gz = gzipSync(raw).length
  const text = raw.toString('utf8')
  const is3d = /three|@react-three|react-reconciler/.test(text) || /Stage-|FabricScene-|TeeScene-/.test(name)
  return { name, gz, is3d }
})

const first = rows.filter((r) => !r.is3d).reduce((s, r) => s + r.gz, 0)
const three = rows.filter((r) => r.is3d).reduce((s, r) => s + r.gz, 0)
const kb = (n) => `${(n / 1024).toFixed(1)} КБ`

for (const r of rows.sort((a, b) => b.gz - a.gz)) {
  console.log(`${r.is3d ? '3D ' : '   '} ${kb(r.gz).padStart(10)}  ${r.name}`)
}
console.log('—')
console.log(`Первая загрузка: ${kb(first)} из ${kb(LIMIT_FIRST)}`)
console.log(`Чанк 3D:         ${kb(three)} из ${kb(LIMIT_3D)}`)

const over = []
if (first > LIMIT_FIRST) over.push(`первая загрузка ${kb(first)} > ${kb(LIMIT_FIRST)}`)
if (three > LIMIT_3D) over.push(`чанк 3D ${kb(three)} > ${kb(LIMIT_3D)}`)

if (over.length > 0) {
  console.error(`\nБюджет превышен: ${over.join('; ')}`)
  process.exit(1)
}
console.log('\nБюджеты выдержаны.')
