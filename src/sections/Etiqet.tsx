import { Media } from '../components/Media'
import { SectionHeading } from '../components/SectionHeading'
import { EtiqetStage } from './EtiqetStage'
import type { Content } from '../content/types'

export function Etiqet({
  data,
  ui,
  index = '03',
}: {
  data: Content['etiqet']
  ui: Content['ui']
  index?: string
}) {
  return (
    <section id="etiqet" className="section day day-panel">
      <div className="shell">
        <SectionHeading index={index}>{data.title}</SectionHeading>
      </div>

      <EtiqetStage data={data}>
        <a
          className="mono frame"
          href={data.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-magnet
          style={{
            display: 'inline-block',
            padding: '1em 1.8em',
            color: 'var(--fg)',
            textDecoration: 'none',
          }}
        >
          {data.cta}
        </a>
      </EtiqetStage>

      {data.items.length > 0 && (
        <div className="shell">
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
                  kind={item.kind}
                  alt={item.alt}
                  autoPlay
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 5',
                    objectFit: 'cover',
                    display: 'block',
                  }}
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
        </div>
      )}
    </section>
  )
}
