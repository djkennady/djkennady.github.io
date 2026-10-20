/** Размеры футболки в мировых единицах. Оверсайз: корпус широкий, рукава
 *  короткие и опущенные, как на фотографиях дропа. */
export const SHIRT = {
  hemY: -1.3,
  shoulderY: 1.02,
  neckRx: 0.34,
  neckRz: 0.22,
  sleeveLength: 0.56,
  sleeveDrop: 0.85,
  collarHeight: 0.07,
} as const

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

/** Полуширина и полуглубина корпуса на высоте v, где 0 — подол, 1 — плечи.
 *  Вещь плоская в сечении: ткань висит, а не обтягивает цилиндр. */
export function torsoProfile(v: number): { rx: number; rz: number } {
  const t = clamp01(v)

  // Подол слегка расходится, талия самая узкая, грудь и плечи шире.
  // Оверсайз: корпус широкий и почти прямой, лишь слегка забирая к талии.
  const hemFlare = (1 - t) ** 2 * 0.08
  const chest = Math.sin(clamp01((t - 0.3) / 0.7) * Math.PI * 0.5) * 0.22
  const rx = 1.04 + hemFlare + chest

  const rz = 0.34 + (1 - t) * 0.03 + chest * 0.3

  return { rx, rz }
}

/** Радиус рукава на длине u: 0 — пройма, 1 — край. */
export function sleeveProfile(u: number): number {
  const t = clamp01(u)
  // У проймы рукав почти равен плечу, к краю заметно сужается.
  return 0.4 - t * 0.1
}
