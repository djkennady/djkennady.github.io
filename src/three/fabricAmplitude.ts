/** Амплитуда волны по ткани: полная, пока герой на экране, и гаснет к нулю,
 *  когда он уходит. Кривая та же, что у EASE из motion.ts (power3), поэтому
 *  затухание читается как часть одного движения страницы. */
export function fabricAmplitude(scrollProgress: number): number {
  const t = Math.min(1, Math.max(0, scrollProgress))
  return (1 - t) ** 3
}
