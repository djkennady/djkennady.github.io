import { useCallback, useEffect, useState } from 'react'
import { content } from './content/content'
import { useLang } from './i18n/useLang'
import { initLenis } from './lib/lenis'
import { initModeTransition } from './lib/modeTransition'
import { useReducedMotion } from './lib/useReducedMotion'
import { Grain } from './components/Grain'
import { Cursor } from './components/Cursor'
import { Preloader } from './components/Preloader'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Music } from './sections/Music'
import { Shows } from './sections/Shows'
import { Etiqet } from './sections/Etiqet'

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

  // Переход ночь → день и обратно живёт на блоке бренда.
  useEffect(() => {
    const target = document.getElementById('etiqet')
    if (!target) return
    return initModeTransition(target)
  }, [lang, reduced])

  return (
    <>
      <Preloader onDone={onDone} />
      <Grain />
      <Cursor />
      <Hero data={t.hero} ui={t.ui} lang={lang} onLang={setLang} />
      <Manifesto data={t.manifesto} />
      <Music data={t.music} />
      <Shows data={t.shows} />
      <Etiqet data={t.etiqet} ui={t.ui} />
    </>
  )
}
