import { useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import type { Content } from '../content/types'

export function Music({ data }: { data: Content['music'] }) {
  const [open, setOpen] = useState<string | null>(null)

  // Нечего показывать — нет и секции: пустая рамка хуже её отсутствия.
  if (data.tracks.length === 0) return null

  return (
    <section id="music" className="shell section">
      <SectionHeading index="01">{data.title}</SectionHeading>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--line)' }}>
        {data.tracks.map((track) => (
          <li key={track.num} style={{ borderBottom: '1px solid var(--line)' }}>
            {open === track.num ? (
              <iframe
                src={track.embedUrl}
                title={track.title}
                loading="lazy"
                allow="autoplay"
                style={{ width: '100%', height: 166, border: 0, display: 'block' }}
              />
            ) : (
              <button
                type="button"
                data-magnet
                onClick={() => setOpen(track.num)}
                style={{
                  appearance: 'none',
                  backgroundColor: 'transparent',
                  border: 0,
                  width: '100%',
                  padding: 'clamp(18px, 3vh, 36px) 0',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 'clamp(12px, 3vw, 40px)',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  font: 'inherit',
                  // Постер стоит вместо плеера, пока по треку не кликнули:
                  // чужие скрипты не грузятся на старте.
                  backgroundImage: `url(${track.poster})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  paddingInline: 'clamp(12px, 2vw, 24px)',
                }}
              >
                <span className="mono" style={{ color: 'var(--muted)' }}>
                  {track.num}
                </span>
                <span
                  className="display"
                  style={{ flex: 1, fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
                >
                  {track.title}
                </span>
                <span className="mono" style={{ color: 'var(--muted)' }}>
                  {track.length}
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
