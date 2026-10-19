import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../lib/useReducedMotion'

/** Бегущая строка. Список дублируется, лента едет на половину своей ширины и
 *  начинает заново — шва не видно. Декоративна, поэтому скрыта от
 *  скринридера. */
export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const host = ref.current
    if (reduced || !host) return

    const tween = gsap.to(host, {
      xPercent: -50,
      repeat: -1,
      duration: items.length * 6,
      ease: 'none',
    })

    return () => tween.kill()
  }, [reduced, items.length])

  return (
    <div aria-hidden="true" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <div ref={ref} style={{ display: 'inline-flex', willChange: 'transform' }}>
        {[...items, ...items].map((text, i) => (
          <span key={i} className="mono" style={{ paddingInline: '0.75em' }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
