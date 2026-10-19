import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { act } from 'react'

/** jsdom не умеет matchMedia, а от него зависят и reduced-motion, и выбор
 *  уровня устройства, и курсор-магнит. Держим состояние медиазапросов здесь,
 *  чтобы тест мог его переключить. */
const media = { reduce: false, coarsePointer: false }

function matches(query: string): boolean {
  if (query.includes('prefers-reduced-motion')) return media.reduce
  if (query.includes('pointer: coarse')) return media.coarsePointer
  if (query.includes('pointer: fine')) return !media.coarsePointer
  return false
}

window.matchMedia = (query: string) =>
  ({
    media: query,
    matches: matches(query),
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

/** Включает или выключает prefers-reduced-motion для текущего теста. */
export function mockReduce(value: boolean): void {
  media.reduce = value
}

/** Включает или выключает грубый указатель (телефон) для текущего теста. */
export function mockCoarsePointer(value: boolean): void {
  media.coarsePointer = value
}

// Lenis и drei требуют ResizeObserver, которого в jsdom нет.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

/** jsdom не умеет IntersectionObserver, а на нём держится ленивое
 *  монтирование 3D. Запоминаем наблюдателей, чтобы тест мог сам сказать
 *  «секция вошла в экран». */
type Watcher = { cb: IntersectionObserverCallback; targets: Element[] }
const watchers: Watcher[] = []

class IntersectionObserverStub {
  private watcher: Watcher

  constructor(cb: IntersectionObserverCallback) {
    this.watcher = { cb, targets: [] }
    watchers.push(this.watcher)
  }

  observe(target: Element) {
    this.watcher.targets.push(target)
  }

  unobserve(target: Element) {
    this.watcher.targets = this.watcher.targets.filter((t) => t !== target)
  }

  disconnect() {
    this.watcher.targets = []
    const i = watchers.indexOf(this.watcher)
    if (i >= 0) watchers.splice(i, 1)
  }

  takeRecords() {
    return []
  }
}

globalThis.IntersectionObserver ??=
  IntersectionObserverStub as unknown as typeof IntersectionObserver

/** Сообщает всем наблюдателям, что их цели вошли в экран или вышли из него. */
export function intersect(isIntersecting: boolean): void {
  act(() => {
    for (const w of [...watchers]) {
      const entries = w.targets.map(
        (target) => ({ isIntersecting, target, intersectionRatio: isIntersecting ? 1 : 0 }) as IntersectionObserverEntry,
      )
      if (entries.length > 0) w.cb(entries, {} as IntersectionObserver)
    }
  })
}

afterEach(() => {
  media.reduce = false
  media.coarsePointer = false
  watchers.length = 0
})
