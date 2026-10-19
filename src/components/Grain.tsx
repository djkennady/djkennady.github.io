// Шум задаёт сам feTurbulence, обесцвеченный feColorMatrix — поэтому в файле
// нет ни одного литерала цвета, как требует инвариант из tokens.test.ts.
const NOISE = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">' +
    '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>' +
    '<feColorMatrix type="saturate" values="0"/></filter>' +
    '<rect width="180" height="180" filter="url(#n)"/></svg>',
)

export function Grain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        pointerEvents: 'none',
        opacity: 0.045,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,${NOISE}")`,
        backgroundRepeat: 'repeat',
      }}
    />
  )
}
