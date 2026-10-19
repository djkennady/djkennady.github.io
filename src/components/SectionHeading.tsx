export function SectionHeading({ children, index }: { children: string; index: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 'clamp(12px, 2vw, 28px)',
        marginBottom: 'clamp(32px, 5vh, 72px)',
      }}
    >
      <span className="mono" style={{ color: 'var(--muted)' }}>
        {index}
      </span>
      <h2 className="display" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', margin: 0 }}>
        {children}
      </h2>
    </div>
  )
}
