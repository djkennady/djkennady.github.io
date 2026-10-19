import { useCallback, useEffect, useState } from 'react'
import { content } from './content/content'
import { useLang } from './i18n/useLang'
import { sectionIndex } from './lib/sectionIndex'
import { initLenis } from './lib/lenis'
import { useReducedMotion } from './lib/useReducedMotion'
import { Grain } from './components/Grain'
import { Cursor } from './components/Cursor'
import { Preloader } from './components/Preloader'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Music } from './sections/Music'
import { Shows } from './sections/Shows'
import { Etiqet } from './sections/Etiqet'
import { Reel } from './sections/Reel'
import { Contact } from './sections/Contact'

export function App() {
  const { lang, setLang } = useLang()
  const reduced = useReducedMotion()
  const [, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  const t = content[lang]

  // Блок музыки скрывается, пока нет сетов, поэтому номера секций считаются
  // по тем, что действительно отрисованы.
  const visible = [...(t.music.tracks.length > 0 ? ['music'] : []), 'shows', 'etiqet']

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
      <Music data={t.music} index={sectionIndex(visible, 'music')} />
      <Shows data={t.shows} index={sectionIndex(visible, 'shows')} />
      <Etiqet data={t.etiqet} ui={t.ui} index={sectionIndex(visible, 'etiqet')} />
      <Reel data={t.reel} ui={t.ui} />
      <Contact data={t.contact} ui={t.ui} />
    </>
  )
}
