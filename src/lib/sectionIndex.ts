/** Номер секции считается по тем, что реально отрисованы. Блок музыки
 *  скрывается, пока нет сетов, и нумерация не должна начинаться с двойки. */
export function sectionIndex(visible: string[], id: string): string {
  const i = visible.indexOf(id)
  return i < 0 ? '' : String(i + 1).padStart(2, '0')
}
