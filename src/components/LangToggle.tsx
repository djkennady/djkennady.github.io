import type { Lang } from '../content/types'

const LANGS: Lang[] = ['ru', 'en']

export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
      {LANGS.map((l, i) => (
        <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
          {i > 0 && <span aria-hidden="true" style={{ color: 'var(--line)' }}>/</span>}
          <button
            type="button"
            aria-pressed={l === lang}
            onClick={() => onChange(l)}
            data-magnet
            style={{
              appearance: 'none',
              background: 'none',
              border: 0,
              padding: '0.25em',
              cursor: 'pointer',
              font: 'inherit',
              letterSpacing: 'inherit',
              textTransform: 'inherit',
              color: l === lang ? 'var(--fg)' : 'var(--muted)',
            }}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  )
}
