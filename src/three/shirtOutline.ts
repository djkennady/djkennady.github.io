/** Пропорции футболки в мировых единицах. Вынесены отдельно, потому что по
 *  ним считается и силуэт, и место принта на груди. */
export const SHIRT = {
  bodyX: 1.0,
  sleeveX: 1.62,
  shoulderY: 1.1,
  sleeveTopY: 0.98,
  sleeveBottomY: 0.34,
  armpitY: 0.48,
  hemY: -1.32,
  hemX: 0.94,
  neckDrop: 0.78,
  neckX: 0.42,
} as const

/** Половина контура, от горловины до середины подола. Точек намеренно много:
 *  по ним скругляются плечо, окат рукава и бок, иначе силуэт читается как
 *  выкройка из картона, а не как вещь. */
function halfOutline(): [number, number][] {
  const s = SHIRT
  return [
    [s.neckX, s.shoulderY],
    [s.neckX + 0.22, s.shoulderY + 0.02],
    [s.bodyX, s.shoulderY - 0.04],
    [s.bodyX + 0.3, s.sleeveTopY + 0.04],
    [s.sleeveX, s.sleeveTopY],
    [s.sleeveX + 0.02, s.sleeveTopY - 0.22],
    [s.sleeveX - 0.04, s.sleeveBottomY],
    [s.bodyX + 0.26, s.sleeveBottomY + 0.06],
    [s.bodyX, s.armpitY],
    [s.bodyX - 0.03, s.armpitY - 0.5],
    [s.hemX + 0.02, s.hemY + 0.5],
    [s.hemX, s.hemY + 0.12],
    [s.hemX - 0.12, s.hemY],
    [0, s.hemY - 0.06],
  ]
}

/** Полный контур: правая половина сверху вниз, затем её зеркало снизу вверх.
 *  Фигура замыкается сама, поэтому крайние точки не дублируются. */
export function shirtOutline(): [number, number][] {
  const half = halfOutline()
  const mirrored = half
    .slice(0, -1)
    .reverse()
    .map(([x, y]): [number, number] => [-x, y])
  return [...half, ...mirrored]
}

/** Середина горловины: точка, до которой провисает вырез. */
export function neckBottom(): [number, number] {
  return [0, SHIRT.neckDrop]
}
