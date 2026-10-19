import { useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader, Vector2, type ShaderMaterial } from 'three'
import { Color } from 'three'
import type { SceneProps } from './Canvas3D'
import { fabricFragment, fabricVertex } from './fabric.glsl'
import { sceneAmplitude } from './fabricAmplitude'
import { BLANK } from './blankTexture'

const PLANE_W = 8
const PLANE_H = 5

export default function FabricScene({
  settings,
  tokens,
  textureUrl,
  progress,
}: SceneProps & { textureUrl?: string; progress?: { value: number } }) {
  const material = useRef<ShaderMaterial>(null)
  const texture = useLoader(TextureLoader, textureUrl ?? BLANK)
  const smoothed = useRef(new Vector2())

  const segments = Math.max(16, settings.segments)

  // Полотно должно закрывать экран при любом соотношении сторон, поэтому
  // геометрия фиксированная, а меш масштабируется под вьюпорт.
  const { viewport } = useThree()
  const cover = Math.max(viewport.width / PLANE_W, viewport.height / PLANE_H) * 1.15

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 1 },
      uPointer: { value: new Vector2() },
      uFg: { value: new Color(tokens.fg) },
      uBg: { value: new Color(tokens.bg) },
      uTexture: { value: texture },
      uHasTexture: { value: textureUrl ? 1 : 0 },
    }),
    [texture, textureUrl, tokens.fg, tokens.bg],
  )

  useFrame((state, delta) => {
    const u = material.current?.uniforms
    if (!u) return

    u.uTime.value += delta
    u.uAmplitude.value = sceneAmplitude(progress)

    // Курсор догоняется плавно: резкий скачок полотна выглядит дёшево.
    smoothed.current.lerp(
      new Vector2(state.pointer.x * 3, state.pointer.y * 2),
      Math.min(1, delta * 3),
    )
    u.uPointer.value.copy(smoothed.current)
  })

  return (
    <mesh scale={[cover, cover, 1]}>
      <planeGeometry args={[PLANE_W, PLANE_H, segments, segments]} />
      <shaderMaterial
        ref={material}
        vertexShader={fabricVertex}
        fragmentShader={fabricFragment}
        uniforms={uniforms}
      />
    </mesh>
  )
}
