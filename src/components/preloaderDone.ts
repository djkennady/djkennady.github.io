export const PRELOADER_TIMEOUT_MS = 3000

/** Прелоадер не имеет права запереть страницу: если медиа почему-то не
 *  загрузились, он всё равно уходит через три секунды. При reduced-motion его
 *  нет вовсе. */
export function preloaderDone(
  assetsReady: boolean,
  elapsedMs: number,
  reducedMotion: boolean,
): boolean {
  if (reducedMotion) return true
  if (assetsReady) return true
  return elapsedMs >= PRELOADER_TIMEOUT_MS
}
