import { useState, type CSSProperties } from 'react'

type Props = {
  src: string
  kind: 'image' | 'video'
  alt: string
  style?: CSSProperties
  autoPlay?: boolean
}

/** Если файла нет, на его месте остаётся ровный блок, а не иконка битой
 *  картинки, — и подпись по-прежнему доступна скринридеру. */
export function Media({ src, kind, alt, style, autoPlay = false }: Props) {
  const [broken, setBroken] = useState(false)

  if (broken) {
    return <div role="img" aria-label={alt} style={{ background: 'var(--line)', ...style }} />
  }

  if (kind === 'video') {
    return (
      <video
        src={src}
        aria-label={alt}
        muted
        loop
        playsInline
        autoPlay={autoPlay}
        onError={() => setBroken(true)}
        style={style}
      />
    )
  }

  return (
    <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} style={style} />
  )
}
