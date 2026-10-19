/** Буфер обмена недоступен без защищённого контекста и в части браузеров.
 *  Кнопка от этого ломаться не должна: ссылка рядом работает всегда. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
