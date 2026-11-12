import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, type ShaderMaterial } from 'three'
import type { TierSettings } from '../lib/deviceTier'
import type { SceneTokens } from './Canvas3D'
import { rainFragment, rainVertex } from './rain.glsl'

const PLANE = 10
const DEPTH = -2.5

/** Фон из падающих знаков. Одна плоскость с процедурным шейдером, а не
 *  тысяча спрайтов: столбцы считаются во фрагменте, поэтому весь дождь —
 *  один draw call и ни одного лишнего объекта в сцене. */
export default function GlyphRain({
  settings,
  tokens,
  opacity = 0.5,
}: {
  settings: TierSettings
  tokens: SceneTokens
  opacity?: number
}) {
  const material = useRef<ShaderMaterial>(null)
  const { viewport, camera } = useThree()

  // Покрытие считается на глубине самой плоскости, а не в нуле: дождь стоит
  // позади модели, у перспективной камеры там шире кадр, и масштаб с нулевой
  // плоскости оставил бы по краям пустые поля.
  const plane = viewport.getCurrentViewport(camera, [0, 0, DEPTH])
  const cover = Math.max(plane.width / PLANE, plane.height / PLANE) * 1.1

  // Плотность сетки едет за уровнем устройства: на слабых знаки крупнее, и
  // фрагментный шейдер считает их меньше.
  const cols = settings.segments >= 128 ? 26 : 18

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFg: { value: new Color(tokens.fg) },
      uCols: { value: cols },
      uRows: { value: Math.round(cols * 1.5) },
      uOpacity: { value: opacity },
    }),
    [tokens.fg, cols, opacity],
  )

  useFrame((_, delta) => {
    const u = material.current?.uniforms
    if (u) u.uTime.value += delta
  })

  return (
    <mesh position={[0, 0, DEPTH]} scale={[cover, cover, 1]}>
      <planeGeometry args={[PLANE, PLANE]} />
      <shaderMaterial
        ref={material}
        vertexShader={rainVertex}
        fragmentShader={rainFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
