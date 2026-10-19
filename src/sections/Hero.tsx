import { lazy, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas3D } from '../three/Canvas3D'
import { LangToggle } from '../components/LangToggle'
import { heroProgress } from '../lib/motion'
import { useReducedMotion } from '../lib/useReducedMotion'
import type { Content, Lang } from '../content/types'

gsap.registerPlugin(ScrollTrigger)

const FabricScene = lazy(() => import('../three/FabricScene'))

type Props = {
  data: Content['hero']
  ui: Content['ui']
  lang: Lang
  onLang: (l: Lang) => void
}

const link: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.9em 1.6em',
  border: '1px solid var(--line)',
  color: 'var(--fg)',
  textDecoration: 'none',
}

export function Hero({ data, ui, lang, onLang }: Props) {
  const section = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // Прогресс ухода героя пишется в синглтон: его читает шейдер ткани в
  // useFrame, и это не вызывает перерисовку React.
  useEffect(() => {
    const el = section.current
    if (reduced || !el) {
      heroProgress.value = 0
      return
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        heroProgress.value = self.progress
      },
    })

    return () => trigger.kill()
  }, [reduced])

  return (
    <section
      id="hero"
      ref={section}
      style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}
    >
      <Canvas3D
        scene={FabricScene}
        sceneProps={{}}
        fallbackSrc="/fallback/hero.webp"
        fallbackAlt=""
      />

      {/* Полотно под текстом может оказаться светлым в любой точке — скрим
          держит контраст независимо от того, куда легла складка. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(to top, var(--bg) 0%, color-mix(in srgb, var(--bg) 70%, transparent) 35%, transparent 70%)',
        }}
      />

      <div
        className="shell"
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBlock: 'clamp(20px, 4vh, 48px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LangToggle lang={lang} onChange={onLang} />
        </div>

        <div>
          <h1 className="display" style={{ fontSize: 'clamp(3rem, 12vw, 11rem)', margin: 0 }}>
            {data.name}
          </h1>
          <p
            className="mono"
            style={{ color: 'var(--muted)', margin: '1.2em 0 0', display: 'flex', gap: '1.5em' }}
          >
            <span>{data.realName}</span>
            <span>{data.city}</span>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'clamp(24px, 4vh, 48px)' }}>
            <a className="mono" href="#contact" style={link} data-magnet>
              {data.ctaBooking}
            </a>
            <a className="mono" href="#etiqet" style={link} data-magnet>
              {data.ctaBrand}
            </a>
          </div>
        </div>

        <p className="mono" style={{ color: 'var(--muted)', margin: 0 }}>
          {ui.scrollHint}
        </p>
      </div>
    </section>
  )
}
