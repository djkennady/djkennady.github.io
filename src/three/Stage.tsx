import { Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import type { TierSettings } from '../lib/deviceTier'

type Props = {
  settings: TierSettings
  visible: boolean
  interactive: boolean
  children: ReactNode
}

/** Отдельный модуль ровно за тем, чтобы three и R3F попали в ленивый чанк, а
 *  не в основной бандл: бюджет первой загрузки — 200 КБ gzip. */
export default function Stage({ settings, visible, interactive, children }: Props) {
  return (
    <Canvas
      dpr={settings.dpr}
      // Пока секция в экране — рендерим; ушла — рендер-луп встаёт, чтобы не
      // греть телефон.
      frameloop={visible ? 'always' : 'never'}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      // R3F по умолчанию ставит touch-action: none, и тогда по первому экрану
      // нельзя проскроллить страницу пальцем.
      style={{ touchAction: interactive ? 'pan-y' : 'none' }}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}
