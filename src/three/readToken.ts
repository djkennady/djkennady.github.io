import { Color } from 'three'

/** Цвет для 3D берётся из той же CSS-переменной, что и вся страница, —
 *  поэтому сцена сама собой переезжает из ночного режима в светлый.
 *  Литералов цвета здесь нет: ключевые слова, а не hex. */
export function tokenColor(name: '--fg' | '--bg' | '--muted' | '--line'): Color {
  const raw =
    typeof getComputedStyle === 'function'
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : ''
  return new Color(raw || (name === '--bg' ? 'black' : 'white'))
}
