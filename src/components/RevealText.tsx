import { createElement, Fragment, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DUR, EASE } from '../lib/motion'
import { useReducedMotion } from '../lib/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Tag = 'p' | 'h2' | 'h3' | 'span' | 'div'

type Props = { text: string; as?: Tag; className?: string }

/** Текст раскрывается по словам при входе в экран. Слова скрыты от
 *  скринридера, а исходная строка живёт в aria-label — иначе разбивка
 *  разорвала бы фразу на куски при чтении вслух. */
export function RevealText({ text, as = 'p', className }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const words = text.split(' ')

  useEffect(() => {
    const host = ref.current
    if (reduced || !host) return

    const spans = host.querySelectorAll('[data-word]')
    const tween = gsap.fromTo(
      spans,
      { yPercent: 60, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: DUR.enter,
        ease: EASE,
        stagger: 0.04,
        scrollTrigger: { trigger: host, start: 'top 85%' },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduced, text])

  const children = words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span
        data-word
        aria-hidden="true"
        style={{ display: 'inline-block', opacity: reduced ? 1 : 0, willChange: 'transform' }}
      >
        {word}
      </span>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ))

  return createElement(as, { ref, 'aria-label': text, className }, children)
}
