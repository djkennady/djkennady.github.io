import { lazy, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas3D } from '../three/Canvas3D'
import { slideOpacity } from '../lib/slideAt'
import { useReducedMotion } from '../lib/useReducedMotion'
import type { Content } from '../content/types'

gsap.registerPlugin(ScrollTrigger)

const TeeScene = lazy(() => import('../three/TeeScene'))

/** Экранов прокрутки на кадр. Меньше — презентация пролетает, больше —
 *  человек успевает заскучать. */
const SCREENS_PER_SLIDE = 0.9

type Props = {
  data: Content['etiqet']
  children: React.ReactNode
}

/** Презентация бренда: ткань с логотипом остаётся на месте, а поверх неё
 *  сменяются кадры — слоган, условия дропа, закрывающая строка. Полотно
 *  сквозное специально: это одна вещь, которую показывают с разных сторон,
 *  а не четыре разных экрана. */
export function EtiqetStage({ data, children }: Props) {
  const section = useRef<HTMLDivElement>(null)
  const scrim = useRef<HTMLDivElement>(null)
  const slides = useRef<(HTMLDivElement | null)[]>([])
  const reduced = useReducedMotion()

  const count = 4

  useEffect(() => {
    const host = section.current
    if (reduced || !host) return

    const paint = (progress: number) => {
      let textVisible = 0

      slides.current.forEach((el, i) => {
        if (!el) return
        const o = slideOpacity(progress, i, count)
        el.style.opacity = String(o)
        // Кадр не просто гаснет, а чуть оседает: иначе смена выглядит как
        // переключение слайдов в презентации, а не как движение.
        el.style.transform = `translateY(${(1 - o) * 18}px)`
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
        if (i > 0) textVisible = Math.max(textVisible, o)
      })

      // Первый кадр показывает полотно чистым. Как только поверх ложится
      // текст, под него подводится подложка — иначе он спорит с принтом.
      if (scrim.current) scrim.current.style.opacity = String(textVisible * 0.82)
    }

    const trigger = ScrollTrigger.create({
      trigger: host,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => paint(self.progress),
      onRefresh: (self) => paint(self.progress),
    })
    paint(trigger.progress)

    return () => trigger.kill()
  }, [reduced])

  const slide = (i: number, node: React.ReactNode) => (
    <div
      key={i}
      ref={(el) => {
        slides.current[i] = el
      }}
      className="shell"
      style={{
        gridArea: '1 / 1',
        alignSelf: 'center',
        // Без движения всё видно сразу и стоит друг под другом.
        opacity: reduced ? 1 : 0,
        willChange: 'opacity, transform',
      }}
    >
      {node}
    </div>
  )

  const stage = (
    <>
      {slide(0, null)}
      {slide(
        1,
        <p className="display" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', margin: 0 }}>
          {data.slogan}
        </p>,
      )}
      {slide(
        2,
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.5em' }}>
          {data.facts.map((fact) => (
            <li key={fact} className="display" style={{ fontSize: 'clamp(1.5rem, 4vw, 3.25rem)' }}>
              {fact}
            </li>
          ))}
        </ul>,
      )}
      {slide(
        3,
        <div style={{ display: 'grid', gap: 'clamp(24px, 4vh, 48px)', justifyItems: 'start' }}>
          <p style={{ maxWidth: '22ch', fontSize: 'clamp(1.25rem, 2.6vw, 2.25rem)', margin: 0 }}>
            {data.closing}
          </p>
          {children}
        </div>,
      )}
    </>
  )

  if (reduced) {
    return (
      <div style={{ position: 'relative', display: 'grid', gap: 'clamp(40px, 7vh, 96px)' }}>
        {stage}
      </div>
    )
  }

  return (
    <div
      ref={section}
      style={{ position: 'relative', height: `${count * SCREENS_PER_SLIDE * 100}svh` }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          display: 'grid',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ gridArea: '1 / 1', position: 'relative', height: '100%' }}>
          <Canvas3D
            interactive
            scene={TeeScene}
            sceneProps={{ modelUrl: data.model, printUrl: data.print }}
            fallbackSrc="/fallback/tee.jpg"
            fallbackAlt=""
          />
        </div>

        <div
          ref={scrim}
          aria-hidden="true"
          style={{
            gridArea: '1 / 1',
            // Контейнер центрирует содержимое, поэтому подложку надо
            // растянуть явно — иначе у неё нулевая высота и её не видно.
            alignSelf: 'stretch',
            background: 'var(--bg)',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />

        {stage}
      </div>
    </div>
  )
}
