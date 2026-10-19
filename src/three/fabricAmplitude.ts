/** Амплитуда волны по ткани: полная, пока герой на экране, и гаснет к нулю,
 *  когда он уходит. Кривая та же, что у EASE из motion.ts (power3), поэтому
 *  затухание читается как часть одного движения страницы. */
export function fabricAmplitude(scrollProgress: number): number {
  const t = Math.min(1, Math.max(0, scrollProgress))
  return (1 - t) ** 3
}

/** Амплитуда конкретной сцены. Источник прогресса передаётся снаружи:
 *  полотно героя гаснет вместе с героем, а ткань в блоке бренда живёт
 *  всё время — к ней доскроллили тогда, когда прогресс героя давно равен
 *  единице, и общий синглтон погасил бы её в плоскую заливку. */
export function sceneAmplitude(progress?: { value: number }): number {
  return progress ? fabricAmplitude(progress.value) : 1
}
