import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

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
if (!('ResizeObserver' in window)) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}

afterEach(() => {
  media.reduce = false
  media.coarsePointer = false
})
