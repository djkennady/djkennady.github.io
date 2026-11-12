import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Media } from '../components/Media'
import { SectionHeading } from '../components/SectionHeading'
import { useReducedMotion } from '../lib/useReducedMotion'
import { splitShows } from '../lib/splitShows'
import type { Content, Show } from '../content/types'

gsap.registerPlugin(ScrollTrigger)

const SHOT_W = 'clamp(240px, 32vw, 520px)'
const SHOT_H = 'clamp(320px, 42vw, 640px)'

function date(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function ShowList({
  items,
  testId,
  upcoming = false,
}: {
  items: Show[]
  testId?: string
  upcoming?: boolean
}) {
  return (
    <ul data-testid={testId} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((s) => (
        <li
          key={`${s.date}-${s.venue}`}
          className={`mono show-row${upcoming ? ' is-upcoming' : ''}`}
        >
          <span>{date(s.date)}</span>
          <span>{s.city}</span>
          <span>{s.venue}</span>
        </li>
      ))}
    </ul>
  )
}

export function Shows({ data, index = '02' }: { data: Content['shows']; index?: string }) {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // Что предстоит, а что прошло, решает сегодняшнее число, а не пометка в
  // файле: иначе просроченные даты продолжают висеть как ближайшие.
  const { upcoming, past } = splitShows(data.list, new Date())

  // Лента едет вбок по вертикальному скроллу. Закрепление сделано на
  // position: sticky, а не на pin из ScrollTrigger: pin оборачивает узел в
  // свой pin-spacer, и React потом не может его размонтировать.
  // При reduced-motion триггера нет вовсе, лента листается пальцем.
  useEffect(() => {
    const host = section.current
    const row = track.current
    if (reduced || !host || !row || data.shots.length === 0) return

    const distance = () => Math.max(0, row.scrollWidth - window.innerWidth)
    const sizeHost = () => {
      host.style.height = `${window.innerHeight + distance()}px`
    }
    sizeHost()

    const tween = gsap.to(row, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: host,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: sizeHost,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      host.style.height = ''
    }
  }, [reduced, data.shots.length])

  return (
    <>
      <section id="shows" ref={section} style={{ position: 'relative' }}>
        <div
          style={{
            position: reduced ? 'static' : 'sticky',
            top: 0,
            height: reduced ? 'auto' : '100svh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
            paddingBlock: reduced ? 'var(--rhythm)' : 0,
          }}
        >
          <div className="shell">
            <SectionHeading index={index}>{data.title}</SectionHeading>
          </div>

          <div style={{ overflowX: reduced ? 'auto' : 'hidden' }}>
            <div
              ref={track}
              style={{
                display: 'flex',
                gap: 'clamp(12px, 2vw, 28px)',
                paddingInline: 'var(--gutter)',
                width: 'max-content',
              }}
            >
              {data.shots.map((shot) => (
                <Media
                  key={shot.src}
                  src={shot.src}
                  kind={shot.kind}
                  alt={shot.alt}
                  autoPlay={!reduced}
                  style={{ width: SHOT_W, height: SHOT_H, objectFit: 'cover', flex: 'none' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Нет ни одной даты — нет и блока: иначе остаются две пустоты вокруг
          пустого списка. */}
      {data.list.length > 0 && (
        <div className="shell" style={{ paddingBlock: 'var(--rhythm)' }}>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: 'clamp(32px, 6vh, 80px)' }}>
              <ShowList items={upcoming} testId="upcoming" upcoming />
            </div>
          )}
          {past.length > 0 && <ShowList items={past} />}
        </div>
      )}
    </>
  )
}
