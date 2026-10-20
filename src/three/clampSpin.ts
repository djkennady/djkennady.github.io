/** Футболка собрана выдавливанием плоского силуэта: с ребра это видно, и
 *  вещь перестаёт читаться. Поэтому крутить её можно, но не до бока. */
export const MAX_SPIN = Math.PI / 4

export function clampSpin(angle: number): number {
  return Math.min(MAX_SPIN, Math.max(-MAX_SPIN, angle))
}
