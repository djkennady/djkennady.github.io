import { useCallback, useEffect, useState } from 'react'
import { content } from './content/content'
import { useLang } from './i18n/useLang'
import { initLenis } from './lib/lenis'
import { useReducedMotion } from './lib/useReducedMotion'
import { Grain } from './components/Grain'
import { Cursor } from './components/Cursor'
import { Preloader } from './components/Preloader'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'

export function App() {
  const { lang, setLang } = useLang()
  const reduced = useReducedMotion()
  const [, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  const t = content[lang]

  useEffect(() => {
    const lenis = initLenis(reduced)
    return () => lenis?.destroy()
  }, [reduced])

  return (
    <>
      <Preloader onDone={onDone} />
      <Grain />
      <Cursor />
      <Hero data={t.hero} ui={t.ui} lang={lang} onLang={setLang} />
      <Manifesto data={t.manifesto} />
    </>
  )
}
