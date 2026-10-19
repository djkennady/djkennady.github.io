/** Один easing и две длительности на весь сайт: всё, что движется, движется
 *  одинаково. Больше здесь появляться не должно. */
export const EASE = 'power3.out'
export const DUR = { fast: 0.25, enter: 0.8 } as const

/** Прогресс ухода героя из экрана, 0 → 1. ScrollTrigger героя пишет сюда,
 *  3D-сцена читает в useFrame. Через пропсы это гнало бы перерисовку React
 *  каждый кадр. */
export const heroProgress = { value: 0 }
