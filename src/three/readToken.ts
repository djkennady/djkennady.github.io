import { Color } from 'three'

type Token = '--fg' | '--bg' | '--muted' | '--line'

/** Цвет для 3D берётся из той же CSS-переменной, что и окружение сцены.
 *  Читать надо именно с элемента-хоста, а не с :root: светлая палитра блока
 *  ETIQET живёт на самой секции, и на :root её нет — сцена рисовала бы
 *  ночными цветами чёрную полосу поперёк светлого разворота.
 *  Литералов цвета здесь нет: ключевые слова, а не hex. */
export function readToken(name: Token, el: Element | null): string {
  const host = el ?? document.documentElement
  const raw =
    typeof getComputedStyle === 'function' ? getComputedStyle(host).getPropertyValue(name).trim() : ''
  return raw || (name === '--bg' ? 'black' : 'white')
}

export function tokenColor(name: Token, el: Element | null): Color {
  return new Color(readToken(name, el))
}
