/** localStorage недоступен в приватном режиме Safari и при заблокированных
 *  данными сайта — любое обращение там бросает. Молча глотаем: язык вернётся
 *  к языку браузера, страница не упадёт. */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* пусто: запоминать язык — удобство, а не требование */
    }
  },
}
