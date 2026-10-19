import { useCallback, useEffect, useState } from 'react'
import type { Lang } from '../content/types'
import { safeStorage } from '../lib/safeStorage'
import { resolveLang } from './resolveLang'

const KEY = 'lang'

export function useLang(): { lang: Lang; setLang: (l: Lang) => void } {
  const [lang, setLangState] = useState<Lang>(() =>
    resolveLang({
      search: window.location.search,
      stored: safeStorage.get(KEY),
      navigator: navigator.language,
    }),
  )

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    safeStorage.set(KEY, l)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return { lang, setLang }
}
