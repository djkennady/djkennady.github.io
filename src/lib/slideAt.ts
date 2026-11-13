const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

/** Какой кадр презентации показан при данном прогрессе прокрутки.
 *  Последний кадр держится до конца, чтобы призыв не исчезал раньше, чем
 *  человек доскроллит. */
export function slideAt(progress: number, slides: number): number {
  const i = Math.floor(clamp01(progress) * slides)
  return Math.min(slides - 1, i)
}

/** Непрозрачность кадра: свой кадр виден целиком, соседние гаснут не
 *  мгновенно, а перетекают — иначе смена читается как моргание. */
export function slideOpacity(progress: number, index: number, slides: number): number {
  const span = 1 / slides
  const centre = (index + 0.5) * span
  const distance = Math.abs(clamp01(progress) - centre)

  // Кадр держится полным почти весь свой отрезок и гаснет быстро у границы.
  // При мягком затухании на экране одновременно висели три кадра и текст
  // читался друг поверх друга.
  const hold = span * 0.35
  const fade = span * 0.25

  if (distance <= hold) return 1
  return clamp01(1 - (distance - hold) / fade)
}
