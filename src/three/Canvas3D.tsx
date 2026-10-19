import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from 'react'
import { Canvas } from '@react-three/fiber'
import { detectTier, readEnv, tierSettings, type Tier, type TierSettings } from '../lib/deviceTier'

export type SceneProps = { settings: TierSettings }

let cached: Tier | null = null

function resolveTier(): Tier {
  cached ??= detectTier(readEnv())
  return cached
}

type Props<P> = {
  scene: LazyExoticComponent<ComponentType<P & SceneProps>>
  sceneProps: P
  fallbackSrc: string
  fallbackAlt: string
  tier?: Tier
}

/** Единственная точка входа в 3D. Решает за секцию, что показать: живую сцену
 *  или заранее отрендеренную картинку. Секции сами об этом не думают и
 *  src/three напрямую не импортируют. */
export function Canvas3D<P extends object>({
  scene: Scene,
  sceneProps,
  fallbackSrc,
  fallbackAlt,
  tier,
}: Props<P>) {
  const settings = tierSettings(tier ?? resolveTier())
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [lost, setLost] = useState(false)
  const [broken, setBroken] = useState(false)

  const live = settings.render3d && !lost

  // Браузер может отобрать WebGL-контекст на ходу. Возврата нет: дальше
  // показываем картинку, а не чёрную дыру на месте сцены.
  useEffect(() => {
    if (!live) return
    const onLost = () => setLost(true)
    window.addEventListener('webglcontextlost', onLost)
    return () => window.removeEventListener('webglcontextlost', onLost)
  }, [live])

  useEffect(() => {
    const el = host.current
    if (!live || !el) return

    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting)
        setVisible(on)
        if (on) setMounted(true)
      },
      { rootMargin: '20%' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [live])

  const sceneProps2 = { ...sceneProps, settings } as P & SceneProps

  return (
    <div ref={host} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {live
        ? mounted && (
            <Canvas
              dpr={settings.dpr}
              // Пока секция в экране — рендерим; ушла — рендер-луп встаёт,
              // чтобы не греть телефон.
              frameloop={visible ? 'always' : 'never'}
              gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
              <Suspense fallback={null}>
                <Scene {...sceneProps2} />
              </Suspense>
            </Canvas>
          )
        : !broken && (
            <img
              role="presentation"
              src={fallbackSrc}
              alt={fallbackAlt}
              onError={() => setBroken(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
    </div>
  )
}
