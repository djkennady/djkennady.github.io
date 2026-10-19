import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TOKENS = ['--bg', '--fg', '--muted', '--line'] as const
type Token = (typeof TOKENS)[number]
type Palette = Record<Token, string>

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16)

/** Линейная интерполяция двух цветов. Нужна, чтобы страница переезжала из
 *  ночи в день не скачком, а по прогрессу скролла. */
export function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t)
  const parts = [0, 1, 2].map((i) => {
    const v = Math.round(channel(a, i) + (channel(b, i) - channel(a, i)) * k)
    return v.toString(16).padStart(2, '0')
  })
  return `#${parts.join('')}`
}

const RAMP = 0.25

/** Насколько страница сейчас «дневная», 0 → 1, по прогрессу прохождения
 *  блока бренда: поднимается на входе, держится на блоке, падает на выходе.
 *  До блока и после него — ночь. */
export function modeRamp(progress: number): number {
  const p = clamp01(progress)
  if (p < RAMP) return p / RAMP
  if (p > 1 - RAMP) return (1 - p) / RAMP
  return 1
}

/** Палитры читаются из самого CSS, а не дублируются константами здесь:
 *  index.css остаётся единственным местом, где цвета вообще записаны. */
function readPalette(mode: 'night' | 'day'): Palette {
  const root = document.documentElement
  const previous = root.getAttribute('data-mode')

  if (mode === 'day') root.setAttribute('data-mode', 'day')
  else root.removeAttribute('data-mode')

  const cs = getComputedStyle(root)
  const palette = Object.fromEntries(
    TOKENS.map((t) => [t, cs.getPropertyValue(t).trim()]),
  ) as Palette

  if (previous) root.setAttribute('data-mode', previous)
  else root.removeAttribute('data-mode')

  return palette
}

/** Переход ночь → день перед блоком бренда и обратно после него.
 *  target — секция #etiqet. */
export function initModeTransition(target: HTMLElement): () => void {
  const root = document.documentElement
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Палитры снимаются до того, как на :root лягут инлайновые значения.
  const night = readPalette('night')
  const day = readPalette('day')

  const apply = (progress: number) => {
    for (const token of TOKENS) {
      root.style.setProperty(token, mixHex(night[token], day[token], progress))
    }
  }

  // Без движения переключаем режим атрибутом, без промежуточных значений.
  if (reduced) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) root.setAttribute('data-mode', 'day')
        else root.removeAttribute('data-mode')
      },
      { threshold: 0.5 },
    )
    io.observe(target)
    return () => {
      io.disconnect()
      root.removeAttribute('data-mode')
    }
  }

  // Один триггер на весь блок, а не два встречных: два конфликтовали между
  // собой, и до входа в блок верх страницы оказывался уже дневным.
  // k поднимается на входе, держится на блоке и падает на выходе.
  const trigger = ScrollTrigger.create({
    trigger: target,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => apply(modeRamp(self.progress)),
    onRefresh: (self) => apply(modeRamp(self.progress)),
  })

  apply(modeRamp(trigger.progress))

  return () => {
    trigger.kill()
    for (const token of TOKENS) root.style.removeProperty(token)
  }
}
