import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Инерционный скролл. При reduced-motion не создаётся вовсе — страница
 *  скроллится браузером как обычно. */
export function initLenis(reducedMotion: boolean): { destroy: () => void } | null {
  if (reducedMotion) return null

  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  const raf = (time: number) => lenis.raf(time * 1000)

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return {
    destroy() {
      gsap.ticker.remove(raf)
      lenis.destroy()
    },
  }
}
