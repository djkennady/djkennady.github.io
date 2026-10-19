# DJ Kennady — личный сайт. План реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Одностраничный сайт, который равноправно держит две половины — диджея DJ Kennady и бренд одежды ETIQET — с монохромным дизайном, скролл-анимацией и двумя 3D-сценами.

**Architecture:** Статическая страница на Vite + React. Все цвета живут в четырёх CSS-переменных на `:root`, которые GSAP интерполирует по скроллу — так получается переход между ночным и светлым режимом, и ни один компонент не знает о режимах. Весь текст и все ссылки приходят из одного файла контента с двумя локалями. 3D подключается лениво через единственную обёртку `Canvas3D`, которая по уровню устройства решает, рендерить сцену или статичную картинку.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind v4, React Three Fiber + drei, GSAP + ScrollTrigger, Lenis, Vitest + Testing Library + jsdom, Vercel.

**Spec:** `docs/superpowers/specs/2026-10-19-kennady-landing-design.md`

## Global Constraints

- Монохром. Акцентного цвета нет. Цвет берётся только из CSS-переменных `--bg`, `--fg`, `--muted`, `--line`; hex-литералов вне `src/styles/index.css` быть не должно.
- Ночь: `--bg: #0A0A0A`, `--fg: #F5F5F5`, `--muted: #8A8A8A`, `--line: #2E2E2E`. День: `--bg: #E8E6E1`, `--fg: #0A0A0A`, `--muted: #6B6864`, `--line: #C4C1BC`.
- Шрифты только локально через `@fontsource`, подмножества `latin` + `cyrillic`, `font-display: swap`. Заголовки — Unbounded 700–800, отрицательный трекинг. Текст — Inter Tight 400/500. Подписи, даты и цифры — JetBrains Mono 400, uppercase, трекинг `+0.08em`.
- `prefers-reduced-motion: reduce` выключает всё движение: Lenis не инициализируется, ScrollTrigger-анимации дают мгновенное конечное состояние, автоплей видео снят, 3D заменяется статичными WebP. Страница остаётся полностью пользуемой.
- Высота героя — `100svh`, не `vh`.
- JS первой загрузки без 3D-чанка < 200 КБ gzip. 3D-чанк отдельный, ленивый, < 260 КБ gzip (измерено: three + R3F ≈ 245 КБ).
- LCP на медленном 4G < 2.5 с. CLS < 0.05. Консоль без ошибок и предупреждений.
- Контраст текста к фону ≥ 4.5:1 в обоих режимах. Один `<h1>` на странице. 3D-канвасы — `aria-hidden`.
- Весь текст и ссылки только из `src/content/content.ts`. Компоненты из `src/components/` контент не импортируют, получают пропсами. Секции не импортируют `src/three/` напрямую, только через `Canvas3D`.
- Наборы ключей `ru` и `en` совпадают полностью, пустых строк нет.
- Файл вырос примерно до 200 строк — выделить из него часть.
- Коммит после каждой задачи.

## Review Focus

Пять входных условий, которые спека подразумевает, но прямо не описывает. Для каждого в плане добавлен тест в ту задачу, которой принадлежит код.

1. **Пустые массивы в контенте.** Нет предстоящих дат, нет вещей, нет треков — секция обязана аккуратно скрыть свой блок, а не показать пустую рамку или упасть. → тесты в задачах 11, 12, 13.
2. **Недоступное `localStorage`.** Приватный режим Safari бросает исключение на запись — переключатель языка не должен ронять страницу. → тест в задаче 3.
3. **Потеря WebGL-контекста.** Браузер может отобрать контекст на ходу (`webglcontextlost`); сцена не должна оставить чёрную дыру вместо себя. → тест в задаче 7.
4. **Битое или отсутствующее медиа.** 404 на фото, видео или GLB-модели — вместо сломанной иконки нужен тихий фоллбэк. → тесты в задачах 7 и 9.
5. **Английский текст другой длины на узком экране.** Крупная типографика в 320px при более длинных английских заголовках не должна давать горизонтальный скролл. → проверка в задаче 15.

---

### Task 1: Каркас, токены, зерно

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/styles/index.css`
- Create: `src/components/Grain.tsx`
- Create: `src/test/setup.ts`
- Test: `src/styles/tokens.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: `npm run dev`, `npm run build`, `npm test`. Четыре CSS-переменные на `:root` и класс-переключатель `data-mode="day"` на `<html>`. Компонент `Grain(): JSX.Element`.

- [ ] **Step 1: Поднять каркас**

`npm create vite@latest . -- --template react-ts`, затем поставить `tailwindcss @tailwindcss/vite`, `@fontsource/unbounded @fontsource/inter-tight @fontsource/jetbrains-mono`, `vitest @testing-library/react @testing-library/jest-dom jsdom`. В `vite.config.ts` подключить плагины react и tailwind, задать `test: { environment: 'jsdom', setupFiles: ['src/test/setup.ts'], globals: true }`. В `package.json` добавить скрипт `"test": "vitest run"`.

- [ ] **Step 2: Написать падающий тест на токены**

```ts
// src/styles/tokens.test.ts
import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'

const css = readFileSync('src/styles/index.css', 'utf8')
const TOKENS = ['--bg', '--fg', '--muted', '--line']
const NIGHT = { '--bg': '#0A0A0A', '--fg': '#F5F5F5', '--muted': '#8A8A8A', '--line': '#2E2E2E' }
const DAY   = { '--bg': '#E8E6E1', '--fg': '#0A0A0A', '--muted': '#6B6864', '--line': '#C4C1BC' }

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
```

Третий тест — защита главного инварианта спеки: цвет только через переменные. Он должен оставаться зелёным до конца проекта.

- [ ] **Step 3: Запустить тест, убедиться что падает**

Run: `npm test -- src/styles/tokens.test.ts`
Expected: FAIL, файл `src/styles/index.css` ещё не содержит токенов.

- [ ] **Step 4: Написать `src/styles/index.css`**

Импорты `@fontsource`-подмножеств, `@import 'tailwindcss'`, затем `:root` с ночными токенами и `:root[data-mode="day"]` со светлыми. Там же: семейства шрифтов, гаттер `clamp(16px, 2vw, 32px)` и вертикальный ритм `clamp(96px, 14vh, 220px)` как переменные, базовый `body { background: var(--bg); color: var(--fg) }` и переход `transition: none` — цвет анимирует GSAP, а не CSS.

- [ ] **Step 5: Реализовать `Grain()` в `src/components/Grain.tsx`**

Фиксированный `div` на весь экран: `background-image` — инлайновый `data:`-URL с SVG `feTurbulence` (`baseFrequency` около 0.8), `opacity: 0.045`, `mix-blend-mode: overlay`, `pointer-events: none`, `aria-hidden`. Без анимации. Цвет шума даёт сам `feTurbulence` — hex-литералов в файле быть не должно, иначе упадёт третий тест шага 2.

- [ ] **Step 6: Собрать `App.tsx`**

Рендерит `<Grain />` и один `<h1>` с текстом `DJ KENNADY` заголовочным шрифтом — чтобы глазами проверить шрифты, токены и зерно.

- [ ] **Step 7: Запустить тесты и сборку**

Run: `npm test && npm run build`
Expected: тесты PASS, сборка без ошибок.

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "feat: каркас проекта, цветовые токены и зерно"
```

---

### Task 2: Контент и типы

**Files:**
- Create: `src/content/types.ts`, `src/content/content.ts`
- Test: `src/content/content.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: типы `Social`, `Track`, `Show`, `Item`, `Shot`, `Content`, `Lang = 'ru' | 'en'`; `content: Record<Lang, Content>` из `src/content/content.ts`.

- [ ] **Step 1: Написать падающий тест**

```ts
// src/content/content.test.ts
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
    ...content.ru.contact.socials.map(s => s.url),
    content.ru.etiqet.instagramUrl,
    ...content.ru.music.tracks.map(t => t.embedUrl),
  ]
  for (const u of urls) expect(u).toMatch(/^(https?:\/\/|mailto:)/)
})
```

- [ ] **Step 2: Запустить тест, убедиться что падает**

Run: `npm test -- src/content/content.test.ts`
Expected: FAIL, модуль `./content` не найден.

- [ ] **Step 3: Описать типы в `src/content/types.ts`**

Ровно те типы, что в §9 спеки, плюс `export type Lang = 'ru' | 'en'`. Поле `Item.price` — `string | null`, `Show.upcoming` — `boolean`, `Shot.kind` — `'image' | 'video'`. Блок `ui: { onRequest, copied, soundOn, soundOff, scrollHint }` — интерфейсные строки, которые иначе разъехались бы литералами по коду и остались русскими в английской версии.

- [ ] **Step 4: Заполнить `src/content/content.ts` заглушками правдоподобной формы**

`export const content: Record<Lang, Content>`. Заглушки реалистичные: 3 трека, 6 шотов, 8 дат (из них 2 `upcoming`), 4 вещи. Пути медиа — на файлы, которых пока нет (`/media/...`), это нормально. Текст осмысленный на обоих языках, не «Lorem ipsum»: он поедет в вёрстку и по нему будут видны проблемы длины.

- [ ] **Step 5: Запустить тесты**

Run: `npm test -- src/content/content.test.ts`
Expected: PASS, все три теста.

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "feat: модель контента с двумя локалями"
```

---

### Task 3: Язык

**Files:**
- Create: `src/i18n/resolveLang.ts`, `src/i18n/useLang.ts`, `src/lib/safeStorage.ts`
- Test: `src/i18n/resolveLang.test.ts`, `src/lib/safeStorage.test.ts`

**Interfaces:**
- Consumes: `Lang` из `src/content/types.ts`.
- Produces:
  - `resolveLang(env: { search: string; stored: string | null; navigator: string }): Lang`
  - `safeStorage.get(key: string): string | null`, `safeStorage.set(key: string, value: string): void`
  - `useLang(): { lang: Lang; setLang: (l: Lang) => void }` — пишет `document.documentElement.lang`.

- [ ] **Step 1: Написать падающие тесты**

```ts
// src/i18n/resolveLang.test.ts
import { resolveLang } from './resolveLang'

it('параметр ?lang= имеет приоритет над сохранённым', () => {
  expect(resolveLang({ search: '?lang=en', stored: 'ru', navigator: 'ru-RU' })).toBe('en')
})
it('сохранённый имеет приоритет над языком браузера', () => {
  expect(resolveLang({ search: '', stored: 'en', navigator: 'ru-RU' })).toBe('en')
})
it('по умолчанию берёт язык браузера', () => {
  expect(resolveLang({ search: '', stored: null, navigator: 'ru-RU' })).toBe('ru')
})
it('неизвестный язык браузера даёт английский', () => {
  expect(resolveLang({ search: '', stored: null, navigator: 'de-DE' })).toBe('en')
})
it('мусор в параметре игнорируется', () => {
  expect(resolveLang({ search: '?lang=zz', stored: 'ru', navigator: 'de-DE' })).toBe('ru')
})
```

```ts
// src/lib/safeStorage.test.ts
import { safeStorage } from './safeStorage'

it('не бросает, когда localStorage недоступен', () => {
  vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => { throw new Error('denied') })
  vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => { throw new Error('denied') })
  expect(() => safeStorage.set('k', 'v')).not.toThrow()
  expect(safeStorage.get('k')).toBeNull()
})
```

Второй файл закрывает пункт 2 из Review Focus.

- [ ] **Step 2: Запустить тесты, убедиться что падают**

Run: `npm test -- src/i18n src/lib/safeStorage.test.ts`
Expected: FAIL, модули не найдены.

- [ ] **Step 3: Реализовать `safeStorage` и `resolveLang`**

`safeStorage` — обёртки в `try/catch`, возвращает `null` при любой ошибке. `resolveLang` — чистая функция, порядок приоритетов из тестов, валидные значения только `'ru'` и `'en'`.

- [ ] **Step 4: Реализовать `useLang()` в `src/i18n/useLang.ts`**

`useState` с начальным значением из `resolveLang`, собранного из `window.location.search`, `safeStorage.get('lang')` и `navigator.language`. `setLang` пишет в состояние и в `safeStorage`. `useEffect` синхронизирует `document.documentElement.lang`.

- [ ] **Step 5: Запустить тесты**

Run: `npm test -- src/i18n src/lib/safeStorage.test.ts`
Expected: PASS.

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "feat: выбор языка с приоритетами и безопасным хранилищем"
```

---

### Task 4: Уровень устройства и reduced-motion

**Files:**
- Create: `src/lib/deviceTier.ts`, `src/lib/useReducedMotion.ts`
- Test: `src/lib/deviceTier.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces:
  - `type Tier = 'high' | 'mid' | 'low'`
  - `type TierEnv = { webgl2: boolean; cores: number; memory?: number; coarsePointer: boolean; reducedMotion: boolean }`
  - `detectTier(env: TierEnv): Tier`
  - `readEnv(): TierEnv` — собирает `TierEnv` из браузера
  - `tierSettings(tier: Tier): { dpr: [number, number]; segments: number; render3d: boolean }`
  - `useReducedMotion(): boolean`

- [ ] **Step 1: Написать падающий тест по таблице §6.3**

```ts
// src/lib/deviceTier.test.ts
import { detectTier, tierSettings, type TierEnv } from './deviceTier'

const env = (o: Partial<TierEnv> = {}): TierEnv =>
  ({ webgl2: true, cores: 8, memory: 8, coarsePointer: false, reducedMotion: false, ...o })

it('high: WebGL2, 8 ядер, тонкий указатель', () => expect(detectTier(env())).toBe('high'))
it('mid: WebGL2, но мало ядер', () => expect(detectTier(env({ cores: 6 }))).toBe('mid'))
it('mid: WebGL2, но грубый указатель', () => expect(detectTier(env({ coarsePointer: true }))).toBe('mid'))
it('low: нет WebGL2', () => expect(detectTier(env({ webgl2: false }))).toBe('low'))
it('low: меньше четырёх ядер', () => expect(detectTier(env({ cores: 2 }))).toBe('low'))
it('reduced-motion всегда даёт low', () => {
  expect(detectTier(env({ reducedMotion: true }))).toBe('low')
  expect(detectTier(env({ reducedMotion: true, cores: 16 }))).toBe('low')
})
it('low не рендерит 3D, high и mid рендерят', () => {
  expect(tierSettings('low').render3d).toBe(false)
  expect(tierSettings('mid').render3d).toBe(true)
  expect(tierSettings('high').dpr[1]).toBe(1.75)
  expect(tierSettings('mid').dpr[1]).toBe(1.25)
  expect(tierSettings('mid').segments).toBe(tierSettings('high').segments / 2)
})
```

- [ ] **Step 2: Запустить тест, убедиться что падает**

Run: `npm test -- src/lib/deviceTier.test.ts`
Expected: FAIL, модуль не найден.

- [ ] **Step 3: Реализовать `detectTier`, `readEnv`, `tierSettings`**

`detectTier` — чистая функция, порядок проверок: сначала `reducedMotion` и `webgl2`, потом ядра, потом указатель. `readEnv` читает `navigator.hardwareConcurrency`, `navigator.deviceMemory`, `matchMedia('(pointer: coarse)')` и наличие контекста `webgl2` на одноразовом канвасе. `segments` для `high` — 128.

- [ ] **Step 4: Реализовать `useReducedMotion()`**

Подписка на `matchMedia('(prefers-reduced-motion: reduce)')` с `addEventListener('change', ...)` и снятием подписки.

- [ ] **Step 5: Запустить тесты**

Run: `npm test -- src/lib/deviceTier.test.ts`
Expected: PASS, все семь тестов.

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "feat: определение уровня устройства и reduced-motion"
```

---

### Task 5: Движение — easing, Lenis, раскрытие текста, бегущая строка

**Files:**
- Create: `src/lib/motion.ts`, `src/lib/lenis.ts`
- Create: `src/components/RevealText.tsx`, `src/components/Marquee.tsx`
- Test: `src/lib/lenis.test.ts`, `src/components/RevealText.test.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` из задачи 4.
- Produces:
  - `EASE: string`, `DUR: { fast: number; enter: number }` из `src/lib/motion.ts`
  - `heroProgress: { value: number }` из `src/lib/motion.ts` — изменяемый синглтон: ScrollTrigger героя пишет в него прогресс, 3D-сцена читает его в `useFrame`. Через пропсы это гнало бы перерисовку React каждый кадр.
  - `initLenis(reducedMotion: boolean): { destroy: () => void } | null`
  - `RevealText({ text, as }: { text: string; as?: keyof JSX.IntrinsicElements })`
  - `Marquee({ items }: { items: string[] })`

- [ ] **Step 1: Написать падающие тесты**

```ts
// src/lib/lenis.test.ts
import { initLenis } from './lenis'
it('не инициализируется при reduced-motion', () => {
  expect(initLenis(true)).toBeNull()
})
it('инициализируется и умеет уничтожаться', () => {
  const l = initLenis(false)
  expect(l).not.toBeNull()
  expect(() => l!.destroy()).not.toThrow()
})
```

```tsx
// src/components/RevealText.test.tsx
import { render, screen } from '@testing-library/react'
import { RevealText } from './RevealText'

it('разбивает текст на слова, но целиком доступен для чтения', () => {
  render(<RevealText text="музыка и одежда" />)
  expect(screen.getByText('музыка и одежда')).toBeInTheDocument()
})
it('при reduced-motion слова сразу видимы', () => {
  matchMedia.mockReduce(true) // хелпер из src/test/setup.ts
  render(<RevealText text="музыка и одежда" />)
  for (const w of ['музыка', 'и', 'одежда']) {
    expect(screen.getByText(w)).toHaveStyle({ opacity: '1' })
  }
})
```

Первый тест `RevealText` — требование доступности: разбивка на слова не должна разрывать текст для скринридера, поэтому исходная строка остаётся в `aria-label`, а спаны — `aria-hidden`.

- [ ] **Step 2: Добавить хелпер `matchMedia` в `src/test/setup.ts`**

Мок `window.matchMedia` с переключателем, чтобы тесты могли включать `prefers-reduced-motion`. Экспортировать `matchMedia.mockReduce(value: boolean)`.

- [ ] **Step 3: Запустить тесты, убедиться что падают**

Run: `npm test -- src/lib/lenis.test.ts src/components/RevealText.test.tsx`
Expected: FAIL, модули не найдены.

- [ ] **Step 4: Реализовать `motion.ts`, `lenis.ts`**

`motion.ts` — одна строка easing, две длительности из спеки (`fast: 0.25`, `enter: 0.8`) и `heroProgress = { value: 0 }`, больше ничего. `initLenis` при `reducedMotion === true` возвращает `null`; иначе создаёт Lenis, вешает его `raf` на `gsap.ticker` и регистрирует `ScrollTrigger.scrollerProxy`.

- [ ] **Step 5: Реализовать `RevealText` и `Marquee`**

`RevealText`: обёртка с `aria-label={text}`, внутри `aria-hidden` спаны по словам; при обычном движении GSAP анимирует `y` и `opacity` по `ScrollTrigger`, при reduced-motion стили сразу конечные и анимация не создаётся. `Marquee`: дублирует список дважды и крутит `x` бесконечным GSAP-твином, при reduced-motion стоит на месте.

- [ ] **Step 6: Запустить тесты**

Run: `npm test -- src/lib src/components`
Expected: PASS.

- [ ] **Step 7: Коммит**

```bash
git add -A
git commit -m "feat: слой движения, раскрытие текста и бегущая строка"
```

---

### Task 6: Прелоадер, переключатель языка, курсор

**Files:**
- Create: `src/components/Preloader.tsx`, `src/components/preloaderDone.ts`
- Create: `src/components/LangToggle.tsx`, `src/components/Cursor.tsx`
- Test: `src/components/preloaderDone.test.ts`, `src/components/LangToggle.test.tsx`

**Interfaces:**
- Consumes: `Lang` из задачи 2, `useReducedMotion` из задачи 4, `EASE`/`DUR` из задачи 5.
- Produces:
  - `preloaderDone(assetsReady: boolean, elapsedMs: number, reducedMotion: boolean): boolean`
  - `Preloader({ onDone }: { onDone: () => void })`
  - `LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void })`
  - `Cursor()`

- [ ] **Step 1: Написать падающие тесты**

```ts
// src/components/preloaderDone.test.ts
import { preloaderDone } from './preloaderDone'
it('снимается, когда медиа готовы', () => expect(preloaderDone(true, 200, false)).toBe(true))
it('держится, пока медиа не готовы и таймаут не вышел', () => expect(preloaderDone(false, 1500, false)).toBe(false))
it('снимается по таймауту 3 секунды даже без медиа', () => expect(preloaderDone(false, 3000, false)).toBe(true))
it('при reduced-motion снимается сразу', () => expect(preloaderDone(false, 0, true)).toBe(true))
```

```tsx
// src/components/LangToggle.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LangToggle } from './LangToggle'

it('показывает текущий язык как выбранный и доступен с клавиатуры', async () => {
  const onChange = vi.fn()
  render(<LangToggle lang="ru" onChange={onChange} />)
  const en = screen.getByRole('button', { name: /en/i })
  expect(screen.getByRole('button', { name: /ru/i })).toHaveAttribute('aria-pressed', 'true')
  await userEvent.tab()
  await userEvent.tab()
  await userEvent.keyboard('{Enter}')
  expect(onChange).toHaveBeenCalledWith('en')
})
```

- [ ] **Step 2: Запустить тесты, убедиться что падают**

Run: `npm test -- src/components/preloaderDone.test.ts src/components/LangToggle.test.tsx`
Expected: FAIL, модули не найдены.

- [ ] **Step 3: Реализовать `preloaderDone` и `Preloader`**

`preloaderDone` — чистая функция, логика из тестов. `Preloader` считает прогресс через `document.fonts.ready` и загрузку изображений первого экрана, тикает счётчик 0 → 100 моношириной, по `preloaderDone` вызывает `onDone` и уходит.

- [ ] **Step 4: Реализовать `LangToggle` и `Cursor`**

`LangToggle` — два `<button>` с `aria-pressed`, видимым фокусом и разделителем. `Cursor` монтируется только при `matchMedia('(pointer: fine)')` и не при reduced-motion; следует за мышью с инерцией, увеличивается над элементами с `data-magnet`.

- [ ] **Step 5: Запустить тесты**

Run: `npm test -- src/components`
Expected: PASS.

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "feat: прелоадер, переключатель языка и курсор-магнит"
```

---

### Task 7: Обёртка Canvas3D и деградация

**Files:**
- Create: `src/three/Canvas3D.tsx`
- Test: `src/three/Canvas3D.test.tsx`

**Interfaces:**
- Consumes: `detectTier`, `tierSettings`, `readEnv` из задачи 4.
- Produces:
  - `type SceneProps = { settings: ReturnType<typeof tierSettings> }` — обёртка сама отдаёт сцене настройки её уровня
  - `Canvas3D<P>({ scene, sceneProps, fallbackSrc, fallbackAlt, tier }: { scene: React.LazyExoticComponent<React.ComponentType<P & SceneProps>>; sceneProps: P; fallbackSrc: string; fallbackAlt: string; tier?: Tier })` — единственная точка входа в 3D. Секции импортируют только её. `tier` без значения вычисляется внутри один раз через `detectTier(readEnv())`; проп нужен тестам.

- [ ] **Step 1: Написать падающие тесты**

```tsx
// src/three/Canvas3D.test.tsx
it('при low рендерит статичную картинку, а не канвас', () => {
  render(<Canvas3D tier="low" scene={LazyStub} fallbackSrc="/fallback/hero.webp" fallbackAlt="" />)
  expect(screen.getByRole('presentation')).toHaveAttribute('src', '/fallback/hero.webp')
  expect(document.querySelector('canvas')).toBeNull()
})
it('при mid монтирует сцену только после входа в экран', async () => {
  render(<Canvas3D tier="mid" scene={LazyStub} fallbackSrc="/fallback/hero.webp" fallbackAlt="" />)
  expect(screen.queryByTestId('scene')).toBeNull()
  intersect(true) // хелпер мока IntersectionObserver
  expect(await screen.findByTestId('scene')).toBeInTheDocument()
})
it('после потери WebGL-контекста показывает картинку', async () => {
  render(<Canvas3D tier="high" scene={LazyStub} fallbackSrc="/fallback/hero.webp" fallbackAlt="" />)
  intersect(true)
  await screen.findByTestId('scene')
  fireEvent(window, new Event('webglcontextlost'))
  expect(await screen.findByRole('presentation')).toBeInTheDocument()
})
it('404 на картинке-фоллбэке не оставляет битую иконку', () => {
  render(<Canvas3D tier="low" scene={LazyStub} fallbackSrc="/nope.webp" fallbackAlt="" />)
  fireEvent.error(screen.getByRole('presentation'))
  expect(screen.queryByRole('presentation')).toBeNull()
})
```

Третий и четвёртый тесты закрывают пункты 3 и 4 из Review Focus. Мок `IntersectionObserver` с хелпером `intersect` добавить в `src/test/setup.ts`.

- [ ] **Step 2: Запустить тесты, убедиться что падают**

Run: `npm test -- src/three/Canvas3D.test.tsx`
Expected: FAIL, модуль не найден.

- [ ] **Step 3: Реализовать `Canvas3D`**

Контейнер с `aria-hidden`. Если `tierSettings(tier).render3d === false` — отдаёт `<img role="presentation">`, который по `onError` убирает себя. Иначе: `IntersectionObserver` с `rootMargin: '20%'` монтирует `<Canvas dpr={tierSettings(tier).dpr} frameloop="demand">` c `Suspense` и переданной ленивой сценой, которой передаются `sceneProps` и `settings={tierSettings(tier)}`; при уходе из экрана переводит `frameloop` в `never`. Слушатель `webglcontextlost` на `window` переключает состояние на картинку окончательно.

- [ ] **Step 4: Запустить тесты**

Run: `npm test -- src/three/Canvas3D.test.tsx`
Expected: PASS, все четыре.

- [ ] **Step 5: Коммит**

```bash
git add -A
git commit -m "feat: обёртка Canvas3D с ленивым монтированием и деградацией"
```

---

### Task 8: Сцена ткани

**Files:**
- Create: `src/three/FabricScene.tsx`, `src/three/fabric.glsl.ts`
- Create: `src/three/fabricAmplitude.ts`
- Test: `src/three/fabricAmplitude.test.ts`

**Interfaces:**
- Consumes: `tierSettings` из задачи 4, монтируется через `Canvas3D` из задачи 7.
- Produces:
  - `fabricAmplitude(scrollProgress: number): number`
  - `default FabricScene({ settings, textureUrl }: SceneProps & { textureUrl?: string })` — экспорт по умолчанию, чтобы работал `React.lazy`. Разбиение плоскости берётся из `settings.segments`.

- [ ] **Step 1: Написать падающий тест**

```ts
// src/three/fabricAmplitude.test.ts
import { fabricAmplitude } from './fabricAmplitude'
it('полная амплитуда в начале скролла', () => expect(fabricAmplitude(0)).toBe(1))
it('нулевая амплитуда, когда герой ушёл', () => expect(fabricAmplitude(1)).toBe(0))
it('убывает монотонно', () => {
  const v = [0, 0.25, 0.5, 0.75, 1].map(fabricAmplitude)
  for (let i = 1; i < v.length; i++) expect(v[i]).toBeLessThan(v[i - 1])
})
it('выход за границы зажимается', () => {
  expect(fabricAmplitude(-1)).toBe(1)
  expect(fabricAmplitude(2)).toBe(0)
})
```

- [ ] **Step 2: Запустить тест, убедиться что падает**

Run: `npm test -- src/three/fabricAmplitude.test.ts`
Expected: FAIL.

- [ ] **Step 3: Реализовать `fabricAmplitude`**

Зажать вход в `[0, 1]`, вернуть `1 - easeOut(t)` на том же easing, что в `motion.ts`.

- [ ] **Step 4: Написать шейдеры в `src/three/fabric.glsl.ts`**

Два экспортированных шаблонных литерала. Вершинный: сумма двух синусов по `x` и `y` с разными частотами и фазой от `uTime`, плюс гауссово смещение к `uPointer`, всё умножено на `uAmplitude`. Фрагментный: монохром, освещение по нормали, опционально сэмпл `uTexture`, если он передан.

- [ ] **Step 5: Реализовать `FabricScene`**

`planeGeometry` с `settings.segments × settings.segments`, `shaderMaterial` с юниформами `uTime`, `uPointer`, `uAmplitude`, `uTexture`. `useFrame` двигает `uTime`, сглаживает `uPointer` к позиции указателя и ставит `uAmplitude = fabricAmplitude(heroProgress.value)` — читает синглтон из задачи 5, не проп. Одна направленная и одна заполняющая подсветка. Экспорт по умолчанию.

- [ ] **Step 6: Запустить тесты и сборку**

Run: `npm test && npm run build`
Expected: PASS, сборка без ошибок, 3D попал в отдельный чанк.

- [ ] **Step 7: Коммит**

```bash
git add -A
git commit -m "feat: 3D-сцена ткани с реакцией на курсор и скролл"
```

---

### Task 9: Сцена футболки

**Files:**
- Create: `src/three/TeeScene.tsx`, `src/three/pickTeeSource.ts`
- Test: `src/three/pickTeeSource.test.ts`

**Interfaces:**
- Consumes: `FabricScene` из задачи 8, монтируется через `Canvas3D`.
- Produces:
  - `pickTeeSource(modelUrl: string | null): { kind: 'model'; url: string } | { kind: 'fabric' }`
  - `default TeeScene({ settings, modelUrl, printUrl }: SceneProps & { modelUrl: string | null; printUrl: string })`

- [ ] **Step 1: Написать падающий тест**

```ts
// src/three/pickTeeSource.test.ts
import { pickTeeSource } from './pickTeeSource'
it('берёт модель, когда путь задан', () =>
  expect(pickTeeSource('/models/tee.glb')).toEqual({ kind: 'model', url: '/models/tee.glb' }))
it('падает в ткань, когда модели нет', () =>
  expect(pickTeeSource(null)).toEqual({ kind: 'fabric' }))
it('падает в ткань на пустой строке', () =>
  expect(pickTeeSource('')).toEqual({ kind: 'fabric' }))
```

Это пункт 4 из Review Focus на стороне модели: отсутствие GLB — штатный путь, а не поломка.

- [ ] **Step 2: Запустить тест, убедиться что падает**

Run: `npm test -- src/three/pickTeeSource.test.ts`
Expected: FAIL.

- [ ] **Step 3: Реализовать `pickTeeSource`**

- [ ] **Step 4: Реализовать `TeeScene`**

По `pickTeeSource`: для `'model'` — `useGLTF` с `printUrl` как текстурой материала и `ErrorBoundary`, который при неудачной загрузке переключает на ткань; для `'fabric'` — `FabricScene` с `textureUrl={printUrl}` и тем же `settings`. Медленное автовращение в `useFrame`, останавливается на `pointerdown`. `OrbitControls` с `enableZoom={false}`, `enablePan={false}`, `minPolarAngle === maxPolarAngle` — иначе на телефоне перехватывается скролл страницы.

- [ ] **Step 5: Запустить тесты**

Run: `npm test -- src/three`
Expected: PASS.

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "feat: 3D-футболка ETIQET с фоллбэком на ткань"
```

---

### Task 10: Герой и манифест

**Files:**
- Create: `src/sections/Hero.tsx`, `src/sections/Manifesto.tsx`
- Create: `src/components/SectionHeading.tsx`
- Modify: `src/App.tsx`
- Test: `src/sections/Hero.test.tsx`

**Interfaces:**
- Consumes: `content` (задача 2), `useLang` (3), `Canvas3D` (7), `FabricScene` (8), `RevealText` (5), `LangToggle` (6).
- Produces: `Hero({ data, ui, lang, onLang }: { data: Content['hero']; ui: Content['ui']; lang: Lang; onLang: (l: Lang) => void })`, `Manifesto({ data }: { data: Content['manifesto'] })`, `SectionHeading({ children, index }: { children: string; index: string })`.

- [ ] **Step 1: Написать падающий тест**

```tsx
// src/sections/Hero.test.tsx
it('содержит единственный h1 с псевдонимом', () => {
  render(<Hero data={content.ru.hero} ui={content.ru.ui} lang="ru" onLang={vi.fn()} />)
  const h1 = screen.getAllByRole('heading', { level: 1 })
  expect(h1).toHaveLength(1)
  expect(h1[0]).toHaveTextContent(content.ru.hero.name)
})
it('кнопки ведут на блоки букинга и бренда', () => {
  render(<Hero data={content.ru.hero} ui={content.ru.ui} lang="ru" onLang={vi.fn()} />)
  expect(screen.getByRole('link', { name: content.ru.hero.ctaBooking })).toHaveAttribute('href', '#contact')
  expect(screen.getByRole('link', { name: content.ru.hero.ctaBrand })).toHaveAttribute('href', '#etiqet')
})
it('3D-слой скрыт от скринридера', () => {
  const { container } = render(<Hero data={content.ru.hero} ui={content.ru.ui} lang="ru" onLang={vi.fn()} />)
  expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
})
```

- [ ] **Step 2: Запустить тест, убедиться что падает**

Run: `npm test -- src/sections/Hero.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Реализовать `SectionHeading`**

Номер моношириной плюс заголовок заголовочным шрифтом, размер `clamp(2.5rem, 7vw, 6rem)`.

- [ ] **Step 4: Реализовать `Hero`**

Секция `#hero`, высота `100svh`. `Canvas3D` с ленивой `FabricScene`, `sceneProps={{}}` и `fallbackSrc="/fallback/hero.webp"` — абсолютным слоем позади. В `useEffect` — ScrollTrigger на секцию, который в `onUpdate` пишет `heroProgress.value`; при reduced-motion триггер не создаётся и значение остаётся нулевым. Поверх: `<h1>` с `clamp(3rem, 12vw, 11rem)`, настоящее имя и город моношириной, две ссылки-кнопки с `data-magnet`, `LangToggle` в правом верхнем углу, подсказка о скролле `ui.scrollHint` внизу.

- [ ] **Step 5: Реализовать `Manifesto`**

Секция `#manifesto`: строки через `RevealText`, под ними сетка фактов `value` + `label` моношириной.

- [ ] **Step 6: Собрать в `App.tsx`**

`useLang`, выбор `content[lang]`, рендер `Preloader`, `Grain`, `Cursor`, `Hero`, `Manifesto`. `initLenis` в `useEffect` с уничтожением на размонтировании.

- [ ] **Step 7: Запустить тесты и посмотреть глазами**

Run: `npm test -- src/sections`
Expected: PASS. Затем открыть превью и проверить: ткань живёт и реагирует на курсор, типографика не ломается на 375px, переключатель языка меняет текст.

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "feat: герой с 3D-тканью и блок манифеста"
```

---

### Task 11: Музыка

**Files:**
- Create: `src/sections/Music.tsx`
- Modify: `src/App.tsx`
- Test: `src/sections/Music.test.tsx`

**Interfaces:**
- Consumes: `content.music` (задача 2), `SectionHeading` (10).
- Produces: `Music({ data }: { data: Content['music'] })`.

- [ ] **Step 1: Написать падающий тест**

```tsx
// src/sections/Music.test.tsx
it('до клика не создаёт iframe, только постер', () => {
  render(<Music data={content.ru.music} />)
  expect(document.querySelector('iframe')).toBeNull()
  expect(screen.getAllByRole('button')).toHaveLength(content.ru.music.tracks.length)
})
it('по клику подставляет плеер для нужного трека', async () => {
  render(<Music data={content.ru.music} />)
  await userEvent.click(screen.getByRole('button', { name: new RegExp(content.ru.music.tracks[1].title, 'i') }))
  expect(document.querySelector('iframe')).toHaveAttribute('src', content.ru.music.tracks[1].embedUrl)
})
it('пустой список треков скрывает секцию целиком', () => {
  const { container } = render(<Music data={{ ...content.ru.music, tracks: [] }} />)
  expect(container.querySelector('#music')).toBeNull()
})
```

Третий тест — пункт 1 из Review Focus.

- [ ] **Step 2: Запустить тест, убедиться что падает**

Run: `npm test -- src/sections/Music.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Реализовать `Music`**

Пустой `tracks` — вернуть `null`. Иначе секция `#music` со списком: номер моношириной, название заголовочным, длительность и площадка моношириной, постер как фон. Клик по записи заменяет постер на `<iframe>` с `loading="lazy"`, `title` из названия трека, одновременно открыт только один плеер.

- [ ] **Step 4: Запустить тесты**

Run: `npm test -- src/sections/Music.test.tsx`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add -A
git commit -m "feat: блок музыки с ленивой загрузкой плееров"
```

---

### Task 12: Выступления

**Files:**
- Create: `src/sections/Shows.tsx`
- Modify: `src/App.tsx`
- Test: `src/sections/Shows.test.tsx`

**Interfaces:**
- Consumes: `content.shows` (2), `SectionHeading` (10), `useReducedMotion` (4).
- Produces: `Shows({ data }: { data: Content['shows'] })`.

- [ ] **Step 1: Написать падающий тест**

```tsx
// src/sections/Shows.test.tsx
it('разделяет предстоящие и прошедшие даты', () => {
  render(<Shows data={content.ru.shows} />)
  const upcoming = content.ru.shows.list.filter(s => s.upcoming)
  expect(screen.getByTestId('upcoming').children).toHaveLength(upcoming.length)
})
it('без предстоящих дат не показывает блок предстоящих', () => {
  const list = content.ru.shows.list.map(s => ({ ...s, upcoming: false }))
  render(<Shows data={{ ...content.ru.shows, list }} />)
  expect(screen.queryByTestId('upcoming')).toBeNull()
})
it('у каждого шота есть осмысленный alt', () => {
  render(<Shows data={content.ru.shows} />)
  for (const img of screen.getAllByRole('img')) {
    expect(img.getAttribute('alt')?.trim()).not.toBe('')
  }
})
it('пустая лента шотов не ломает секцию', () => {
  expect(() => render(<Shows data={{ ...content.ru.shows, shots: [] }} />)).not.toThrow()
})
```

Второй и четвёртый тесты — пункт 1 из Review Focus.

- [ ] **Step 2: Запустить тест, убедиться что падает**

Run: `npm test -- src/sections/Shows.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Реализовать `Shows`**

Секция `#shows`. Горизонтальная лента: трек из шотов с `width` по контенту, при обычном движении — pinned ScrollTrigger, который гонит `x` по вертикальному скроллу; при reduced-motion — обычный горизонтальный скролл пальцем, без pin. У всех картинок и видео заданы `width`/`height` — иначе CLS. Под лентой два списка дат моношириной: `upcoming` с `data-testid="upcoming"` рендерится только если такие даты есть.

- [ ] **Step 4: Запустить тесты**

Run: `npm test -- src/sections/Shows.test.tsx`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add -A
git commit -m "feat: лента выступлений и список дат"
```

---

### Task 13: ETIQET и переход режимов

**Files:**
- Create: `src/sections/Etiqet.tsx`
- Create: `src/lib/modeTransition.ts`
- Modify: `src/App.tsx`
- Test: `src/lib/modeTransition.test.ts`, `src/sections/Etiqet.test.tsx`

**Interfaces:**
- Consumes: `content.etiqet` (2), `Canvas3D` (7), `TeeScene` (9), `SectionHeading` (10).
- Produces:
  - `Etiqet({ data, ui }: { data: Content['etiqet']; ui: Content['ui'] })`
  - `mixHex(a: string, b: string, t: number): string`
  - `initModeTransition(el: HTMLElement): () => void` — вешает ScrollTrigger на блок бренда, интерполирует четыре токена на `:root` и возвращает функцию снятия

- [ ] **Step 1: Написать падающие тесты**

```ts
// src/lib/modeTransition.test.ts
import { mixHex } from './modeTransition'
it('края дают исходные цвета', () => {
  expect(mixHex('#0A0A0A', '#E8E6E1', 0).toLowerCase()).toBe('#0a0a0a')
  expect(mixHex('#0A0A0A', '#E8E6E1', 1).toLowerCase()).toBe('#e8e6e1')
})
it('середина лежит между', () => {
  const m = mixHex('#000000', '#FFFFFF', 0.5).toLowerCase()
  expect(m).toBe('#808080')
})
it('выход за границы зажимается', () => {
  expect(mixHex('#000000', '#FFFFFF', -1).toLowerCase()).toBe('#000000')
  expect(mixHex('#000000', '#FFFFFF', 3).toLowerCase()).toBe('#ffffff')
})
```

```tsx
// src/sections/Etiqet.test.tsx
it('кнопка ведёт в Instagram бренда', () => {
  render(<Etiqet data={content.ru.etiqet} />)
  const link = screen.getByRole('link', { name: /instagram/i })
  expect(link).toHaveAttribute('href', content.ru.etiqet.instagramUrl)
  expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
})
it('вещь без цены показывает строку «по запросу» из контента, а не пустое место', () => {
  const items = [{ ...content.ru.etiqet.items[0], price: null }]
  render(<Etiqet data={{ ...content.ru.etiqet, items }} ui={content.ru.ui} />)
  expect(screen.getByText(content.ru.ui.onRequest)).toBeInTheDocument()
})
it('пустой список вещей оставляет блок с 3D и ссылкой', () => {
  render(<Etiqet data={{ ...content.ru.etiqet, items: [] }} />)
  expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
})
```

Третий тест — пункт 1 из Review Focus: бренд без заполненной витрины всё равно должен вести в Instagram.

- [ ] **Step 2: Запустить тесты, убедиться что падают**

Run: `npm test -- src/lib/modeTransition.test.ts src/sections/Etiqet.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Реализовать `mixHex` и `initModeTransition`**

`mixHex` — разбор в rgb, линейная интерполяция с зажимом, сборка обратно в hex. `initModeTransition` создаёт два ScrollTrigger: вход (зазор между `#shows` и `#etiqet`) и выход (зазор между `#etiqet` и `#reel`), зона — 40% высоты экрана у границы; в `onUpdate` пишет `mixHex` для `--bg`, `--fg`, `--muted`, `--line` в `document.documentElement.style`. При reduced-motion — просто ставит светлые токены на границе блока без интерполяции.

- [ ] **Step 4: Реализовать `Etiqet`**

Секция `#etiqet`. `Canvas3D` с ленивой `TeeScene`, `sceneProps={{ modelUrl, printUrl }}` и `fallbackSrc="/fallback/tee.webp"`. Текст о бренде, сетка вещей (название, цена или `ui.onRequest`), крупная ссылка в Instagram с `target="_blank"` и `rel="noopener noreferrer"`.

- [ ] **Step 5: Подключить переход в `App.tsx`**

- [ ] **Step 6: Запустить тесты и посмотреть глазами**

Run: `npm test -- src/lib src/sections`
Expected: PASS. Затем в превью проскроллить границу: оба перехода плавные, текст читается в каждой промежуточной точке, футболка крутится пальцем и страница при этом продолжает скроллиться.

- [ ] **Step 7: Коммит**

```bash
git add -A
git commit -m "feat: блок ETIQET с 3D-футболкой и переход режимов по скроллу"
```

---

### Task 14: Рил, контакты, футер

**Files:**
- Create: `src/sections/Reel.tsx`, `src/sections/Contact.tsx`
- Create: `src/lib/copyToClipboard.ts`
- Modify: `src/App.tsx`
- Test: `src/sections/Reel.test.tsx`, `src/sections/Contact.test.tsx`

**Interfaces:**
- Consumes: `content.reel`, `content.contact` (2), `Marquee` (5), `useReducedMotion` (4).
- Produces: `copyToClipboard(text: string): Promise<boolean>`, `Reel({ data, ui }: { data: Content['reel']; ui: Content['ui'] })`, `Contact({ data, ui }: { data: Content['contact']; ui: Content['ui'] })`.

- [ ] **Step 1: Написать падающие тесты**

```tsx
// src/sections/Reel.test.tsx
it('видео без звука и с постером', () => {
  render(<Reel data={content.ru.reel} />)
  const v = screen.getByTestId('reel-video') as HTMLVideoElement
  expect(v.muted).toBe(true)          // React ставит muted свойством, не атрибутом
  expect(v).toHaveAttribute('poster', content.ru.reel.poster)
})
it('при reduced-motion автоплея нет', () => {
  matchMedia.mockReduce(true)
  render(<Reel data={content.ru.reel} />)
  expect((screen.getByTestId('reel-video') as HTMLVideoElement).autoplay).toBe(false)
})
```

```tsx
// src/sections/Contact.test.tsx
it('почта и телеграм — настоящие ссылки', () => {
  render(<Contact data={content.ru.contact} />)
  expect(screen.getByRole('link', { name: content.ru.contact.bookingEmail }))
    .toHaveAttribute('href', `mailto:${content.ru.contact.bookingEmail}`)
})
it('клик по почте копирует её и подтверждает', async () => {
  const write = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText: write } })
  render(<Contact data={content.ru.contact} />)
  await userEvent.click(screen.getByTestId('copy-email'))
  expect(write).toHaveBeenCalledWith(content.ru.contact.bookingEmail)
  expect(await screen.findByRole('status')).toBeInTheDocument()
})
it('недоступный буфер обмена не ломает кнопку', async () => {
  Object.assign(navigator, { clipboard: undefined })
  render(<Contact data={content.ru.contact} />)
  await expect(userEvent.click(screen.getByTestId('copy-email'))).resolves.not.toThrow()
})
```

- [ ] **Step 2: Запустить тесты, убедиться что падают**

Run: `npm test -- src/sections/Reel.test.tsx src/sections/Contact.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Реализовать `copyToClipboard`**

`navigator.clipboard.writeText` в `try/catch`, возвращает `false` при любой неудаче или отсутствии API.

- [ ] **Step 4: Реализовать `Reel`**

Секция `#reel`, видео на всю ширину, `muted`, `playsInline`, `loop`, заданные размеры. `IntersectionObserver` запускает и ставит на паузу. Кнопка включения звука с подписью `ui.soundOn` / `ui.soundOff`. При reduced-motion `autoPlay` не ставится, показан постер с кнопкой воспроизведения.

- [ ] **Step 5: Реализовать `Contact`**

Секция `#contact`: почта и Telegram крупными ссылками, рядом кнопки копирования с `aria-live="polite"` подтверждением (`role="status"`, текст `ui.copied`). Иконки соцсетей из контента. Футер с `Marquee` и годом.

- [ ] **Step 6: Запустить тесты**

Run: `npm test -- src/sections`
Expected: PASS.

- [ ] **Step 7: Коммит**

```bash
git add -A
git commit -m "feat: блок рила, контакты и футер"
```

---

### Task 15: Доступность, бюджеты, настоящие материалы

**Files:**
- Create: `scripts/check-budget.mjs`
- Modify: `package.json`, `src/content/content.ts`
- Create: `public/media/*`, `public/models/*`, `public/fallback/*`
- Test: `src/a11y.test.tsx`, `scripts/check-budget.mjs`

**Interfaces:**
- Consumes: всё предыдущее.
- Produces: `npm run budget` — падает, если бюджеты из Global Constraints превышены.

- [ ] **Step 1: Написать падающий тест доступности страницы целиком**

```tsx
// src/a11y.test.tsx
it('на странице ровно один h1', () => {
  render(<App />)
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})
it('уровни заголовков идут без пропусков', () => {
  render(<App />)
  const levels = screen.getAllByRole('heading').map(h => Number(h.tagName[1]))
  for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
})
it('все 3D-канвасы скрыты от скринридера', () => {
  const { container } = render(<App />)
  for (const c of container.querySelectorAll('canvas')) {
    expect(c.closest('[aria-hidden="true"]')).toBeTruthy()
  }
})
```

- [ ] **Step 2: Написать `scripts/check-budget.mjs`**

После `npm run build` обходит `dist/assets/*.js`, жмёт gzip, делит на 3D-чанк (содержит `three`) и остальное, печатает таблицу и выходит с кодом 1, если первая загрузка > 200 КБ или 3D-чанк > 260 КБ. Добавить в `package.json`: `"budget": "vite build && node scripts/check-budget.mjs"`.

- [ ] **Step 3: Запустить и убедиться что видно текущие размеры**

Run: `npm run budget`
Expected: таблица с размерами; если превышено — чинить (вынести `drei`-импорты в точечные, проверить что `three` не попал в основной чанк).

- [ ] **Step 4: Подменить заглушки настоящими материалами Егора**

Фото и видео в `public/media/`, логотипы, модель в `public/models/tee.glb` (или оставить `null`), статичные рендеры в `public/fallback/hero.webp` и `tee.webp` — снять скриншотами сцен. Обновить пути, тексты и ссылки в `src/content/content.ts` на обоих языках.

- [ ] **Step 5: Проверить глазами то, что тесты не покрывают**

В превью, со скриншотами в отчёт:
- 1440 и 375: ни один блок не ломается, горизонтального скролла нет;
- **320px и английская локаль одновременно** — пункт 5 из Review Focus: более длинные английские заголовки при крупной типографике не должны выезжать за экран;
- контраст текста к фону в обоих режимах не ниже 4.5:1;
- `prefers-reduced-motion` включён: страница целиком пользуема, 3D заменено картинками, автоплея нет;
- консоль чистая.

- [ ] **Step 6: Запустить всё**

Run: `npm test && npm run budget`
Expected: PASS, бюджеты в пределах.

- [ ] **Step 7: Коммит**

```bash
git add -A
git commit -m "feat: доступность, бюджеты сборки и настоящие материалы"
```

---

### Task 16: Деплой

**Files:**
- Create: `vercel.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: собранный проект.
- Produces: рабочая ссылка на продакшен.

- [ ] **Step 1: Добавить `vercel.json`**

`buildCommand: "vite build"`, `outputDirectory: "dist"`, заголовки кеширования для `/assets/*` на год и `no-cache` для `index.html`.

- [ ] **Step 2: Написать `README.md`**

Короткий: как запустить, где лежит контент (`src/content/content.ts` — единственный файл, который правит Егор), куда кидать медиа, как задеплоить.

- [ ] **Step 3: Задеплоить**

Через скилл `deploy-to-vercel`. Деплой — внешнее действие, поэтому спросить Егора перед запуском.

- [ ] **Step 4: Проверить продакшен**

Открыть выданную ссылку в браузере, проверить первый экран, оба перехода режима, обе 3D-сцены и переключатель языка. Консоль чистая.

- [ ] **Step 5: Коммит**

```bash
git add -A
git commit -m "chore: конфиг Vercel и README"
```
