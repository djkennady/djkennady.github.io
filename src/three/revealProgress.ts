function phase(elapsed: number, duration: number): number {
  if (duration <= 0) return 1
  return Math.min(1, Math.max(0, elapsed / duration))
}

/** Положение фронта проявления, 0 — низ меша, 1 — верх. Кривая power3.out,
 *  та же, что EASE в motion.ts: проход срывается с места быстро и мягко
 *  доезжает, поэтому читается как часть общего движения страницы, а не как
 *  отдельная анимация со своим характером. */
export function revealFront(elapsed: number, duration: number): number {
  const t = phase(elapsed, duration)
  return 1 - (1 - t) ** 3
}

/** Яркость полосы на фронте. Пропорциональна скорости самого фронта —
 *  производной power3.out с точностью до множителя. Поэтому полоса светится
 *  ровно пока меш проявляется, и сходит в ноль там же, где движение: в покое
 *  остаётся чистый вайрфрейм без застывшего свечения поперёк модели. */
export function revealGlow(elapsed: number, duration: number): number {
  const t = phase(elapsed, duration)
  return (1 - t) ** 2
}
