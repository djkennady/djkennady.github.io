import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/useReducedMotion'
import { DUR } from '../lib/motion'
import { PRELOADER_TIMEOUT_MS, preloaderDone } from './preloaderDone'

/** Счётчик 0 → 100, пока грузятся шрифты. Уходит по готовности шрифтов или по
 *  таймауту — что раньше, — и ни при каких обстоятельствах не запирает
 *  страницу. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [gone, setGone] = useState(() => preloaderDone(false, 0, reduced))
  const notified = useRef(false)

  // Отдельным эффектом и под флагом: иначе повторный проход эффекта после
  // смены gone позвал бы onDone второй раз.
  useEffect(() => {
    if (!gone || notified.current) return
    notified.current = true
    onDone()
  }, [gone, onDone])

  useEffect(() => {
    if (gone) return

    let raf = 0
    let fontsReady = false
    const startedAt = performance.now()

    // Font Loading API есть не во всех браузерах. Без неё остаётся таймаут —
    // обращение через ?. важно, иначе прелоадер уронил бы всю страницу.
    document.fonts?.ready?.then(() => {
      fontsReady = true
    })

    const tick = () => {
      const elapsed = performance.now() - startedAt
      const byTime = Math.min(1, elapsed / PRELOADER_TIMEOUT_MS)
      setProgress(Math.round((fontsReady ? 1 : byTime) * 100))

      if (preloaderDone(fontsReady, elapsed, reduced)) {
        setProgress(100)
        setGone(true)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [gone, reduced])

  if (gone) return null

  return (
    <div
      role="status"
      aria-label={`${progress}%`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'var(--bg)',
        color: 'var(--fg)',
        display: 'grid',
        placeItems: 'center',
        transition: `opacity ${DUR.fast}s linear`,
      }}
    >
      <div style={{ display: 'grid', justifyItems: 'center', gap: 'clamp(20px, 4vh, 44px)' }}>
        <img
          src="/media/kennady-logo.png"
          alt=""
          width={420}
          height={280}
          style={{ width: 'min(60vw, 320px)', height: 'auto' }}
        />
        <span className="mono" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', letterSpacing: '0.08em' }}>
          {String(progress).padStart(3, '0')}
        </span>
      </div>
    </div>
  )
}
