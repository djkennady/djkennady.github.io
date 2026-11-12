import { useState } from 'react'
import { Marquee } from '../components/Marquee'
import { copyToClipboard } from '../lib/copyToClipboard'
import type { Content } from '../content/types'

const big: React.CSSProperties = {
  color: 'var(--fg)',
  textDecoration: 'none',
  // Почта длинная, а шрифт крупный. Переносим по осмысленным местам, а не
  // по букве: «...GMAIL.CO / M» выглядит как ошибка вёрстки.
  fontSize: 'clamp(1rem, 3.4vw, 3.25rem)',
  overflowWrap: 'break-word',
  wordBreak: 'normal',
  minWidth: 0,
}

export function Contact({ data, ui }: { data: Content['contact']; ui: Content['ui'] }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (value: string) => {
    const ok = await copyToClipboard(value)
    if (ok) {
      setCopied(value)
      window.setTimeout(() => setCopied(null), 2000)
    }
  }

  const row = (value: string, href: string, testId: string) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '0.75em 1em',
        padding: 'clamp(16px, 3vh, 32px) 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <a className="display" href={href} style={big} data-magnet>
        {value}
      </a>
      <button
        type="button"
        data-testid={testId}
        aria-label={`${ui.copy}: ${value}`}
        onClick={() => void copy(value)}
        className="mono frame"
        style={{
          appearance: 'none',
          background: 'none',
          color: 'var(--muted)',
          padding: '0.6em 1em',
          cursor: 'pointer',
          font: 'inherit',
          flex: 'none',
        }}
      >
        {ui.copy}
      </button>
    </div>
  )

  return (
    <section id="contact" className="section">
      <div className="shell">
        {row(data.bookingEmail, `mailto:${data.bookingEmail}`, 'copy-email')}
        {row(data.telegram, `https://t.me/${data.telegram.replace('@', '')}`, 'copy-telegram')}

        <p role="status" aria-live="polite" className="mono" style={{ minHeight: '1.6em' }}>
          {copied ? ui.copied : ''}
        </p>

        <ul
          style={{
            listStyle: 'none',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5em',
            margin: 'clamp(24px, 4vh, 56px) 0 0',
            padding: 0,
          }}
        >
          {data.socials.map((s) => (
            <li key={s.url}>
              <a
                className="mono"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                data-magnet
                style={{ color: 'var(--muted)' }}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer style={{ marginTop: 'var(--rhythm)', borderTop: '1px solid var(--line)', paddingTop: '1.5em' }}>
        <Marquee items={['DJ KENNADY', 'ETIQET', String(new Date().getFullYear())]} />
      </footer>
    </section>
  )
}
