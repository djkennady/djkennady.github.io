import { RevealText } from '../components/RevealText'
import type { Content } from '../content/types'

export function Manifesto({ data }: { data: Content['manifesto'] }) {
  return (
    <section id="manifesto" className="shell section">
      {data.lines.map((line, i) => (
        <RevealText
          key={i}
          text={line}
          as="p"
          className={i === 0 ? 'display' : undefined}
          // Первая строка — заявление, поэтому крупная. Остальные ведут себя
          // как текст и набраны основным шрифтом.
        />
      ))}

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 'clamp(24px, 4vw, 64px)',
          marginTop: 'clamp(48px, 8vh, 120px)',
          borderTop: '1px solid var(--line)',
          paddingTop: 'clamp(20px, 3vh, 40px)',
        }}
      >
        {data.facts.map((fact) => (
          <div key={fact.label}>
            <dt className="display" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              {fact.value}
            </dt>
            <dd className="mono" style={{ color: 'var(--muted)', margin: '0.6em 0 0' }}>
              {fact.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
