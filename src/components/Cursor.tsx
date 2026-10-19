import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../lib/useReducedMotion'

const SIZE = 14
const MAGNET_SCALE = 2.6

/** Курсор-магнит. Только для мыши: на тач-устройствах он бессмысленен, при
 *  reduced-motion — тоже. */
export function Cursor() {
  const reduced = useReducedMotion()
  const [fine, setFine] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches)
  }, [])

  useEffect(() => {
    const dot = ref.current
    if (!dot || reduced || !fine) return

    const move = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3.out' })
    const moveY = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      move(e.clientX - SIZE / 2)
      moveY(e.clientY - SIZE / 2)
      const magnet = (e.target as Element | null)?.closest?.('[data-magnet]')
      gsap.to(dot, { scale: magnet ? MAGNET_SCALE : 1, duration: 0.25, ease: 'power3.out' })
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, fine])

  if (reduced || !fine) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        borderRadius: '50%',
        background: 'var(--fg)',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 70,
      }}
    />
  )
}
