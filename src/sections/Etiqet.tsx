import { lazy } from 'react'
import { Canvas3D } from '../three/Canvas3D'
import { Media } from '../components/Media'
import { SectionHeading } from '../components/SectionHeading'
import type { Content } from '../content/types'

const TeeScene = lazy(() => import('../three/TeeScene'))

export function Etiqet({ data, ui }: { data: Content['etiqet']; ui: Content['ui'] }) {
  return (
    <section id="etiqet" className="section day day-panel">
      <div className="shell">
        <SectionHeading index="03">{data.title}</SectionHeading>
      </div>

      <div
        style={{
          position: 'relative',
          height: 'clamp(380px, 60vh, 720px)',
          marginBottom: 'clamp(32px, 6vh, 80px)',
        }}
      >
        <Canvas3D
          interactive
          scene={TeeScene}
          sceneProps={{ modelUrl: data.model, printUrl: data.print }}
          fallbackSrc="/fallback/tee.webp"
          fallbackAlt=""
        />
      </div>

      <div className="shell">
        <p style={{ maxWidth: '46ch', fontSize: 'clamp(1.0625rem, 1.4vw, 1.375rem)' }}>
          {data.text}
        </p>

        {data.items.length > 0 && (
          <ul
            style={{
              listStyle: 'none',
              margin: 'clamp(40px, 7vh, 96px) 0 0',
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
              gap: 'clamp(16px, 2vw, 32px)',
            }}
          >
            {data.items.map((item) => (
              <li key={item.name}>
                <Media
                  src={item.image}
                  kind="image"
                  alt={item.alt}
                  style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', display: 'block' }}
                />
                <p className="mono" style={{ margin: '0.9em 0 0' }}>
                  {item.name}
                </p>
                <p className="mono" style={{ margin: '0.3em 0 0', color: 'var(--muted)' }}>
                  {item.price ?? ui.onRequest}
                </p>
              </li>
            ))}
          </ul>
        )}

        <a
          className="mono"
          href={data.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-magnet
          style={{
            display: 'inline-block',
            marginTop: 'clamp(32px, 5vh, 72px)',
            padding: '1em 1.8em',
            border: '1px solid var(--line)',
            color: 'var(--fg)',
            textDecoration: 'none',
          }}
        >
          Instagram ETIQET
        </a>
      </div>
    </section>
  )
}
