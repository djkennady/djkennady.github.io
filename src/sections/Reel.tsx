import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/useReducedMotion'
import type { Content } from '../content/types'

export function Reel({ data, ui }: { data: Content['reel']; ui: Content['ui'] }) {
  const video = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [muted, setMuted] = useState(true)
  const [broken, setBroken] = useState(false)

  // Видео играет только пока оно на экране.
  useEffect(() => {
    const el = video.current
    if (reduced || !el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  // Файла может не быть — тогда на его месте ровный блок, а не чёрная дыра
  // с кнопкой звука, которой нечем управлять.
  if (broken) {
    return (
      <section id="reel">
        <div style={{ width: '100%', aspectRatio: '16 / 9', background: 'var(--line)' }} />
      </section>
    )
  }

  return (
    <section id="reel" style={{ position: 'relative' }}>
      <video
        ref={video}
        data-testid="reel-video"
        src={data.src}
        poster={data.poster}
        muted={muted}
        loop
        playsInline
        autoPlay={!reduced}
        controls={reduced}
        onError={() => setBroken(true)}
        style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }}
      />

      <button
        type="button"
        data-magnet
        onClick={() => setMuted((m) => !m)}
        className="mono"
        style={{
          position: 'absolute',
          right: 'var(--gutter)',
          bottom: 'var(--gutter)',
          appearance: 'none',
          background: 'var(--bg)',
          border: '1px solid var(--line)',
          color: 'var(--fg)',
          padding: '0.8em 1.4em',
          cursor: 'pointer',
          font: 'inherit',
        }}
      >
        {muted ? ui.soundOn : ui.soundOff}
      </button>
    </section>
  )
}
