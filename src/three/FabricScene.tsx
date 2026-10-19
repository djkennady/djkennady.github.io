import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Vector2, type ShaderMaterial } from 'three'
import type { SceneProps } from './Canvas3D'
import { fabricFragment, fabricVertex } from './fabric.glsl'
import { fabricAmplitude } from './fabricAmplitude'
import { heroProgress } from '../lib/motion'
import { tokenColor } from './readToken'

// Прозрачный пиксель: useTexture нельзя звать условно, поэтому текстура есть
// всегда, а шейдер решает по uHasTexture, показывать её или нет.
const BLANK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII='

export default function FabricScene({ settings, textureUrl }: SceneProps & { textureUrl?: string }) {
  const material = useRef<ShaderMaterial>(null)
  const texture = useTexture(textureUrl ?? BLANK)
  const smoothed = useRef(new Vector2())

  const segments = Math.max(16, settings.segments)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 1 },
      uPointer: { value: new Vector2() },
      uFg: { value: tokenColor('--fg') },
      uBg: { value: tokenColor('--bg') },
      uTexture: { value: texture },
      uHasTexture: { value: textureUrl ? 1 : 0 },
    }),
    [texture, textureUrl],
  )

  useFrame((state, delta) => {
    const u = material.current?.uniforms
    if (!u) return

    u.uTime.value += delta
    u.uAmplitude.value = fabricAmplitude(heroProgress.value)

    // Курсор догоняется плавно: резкий скачок полотна выглядит дёшево.
    smoothed.current.lerp(
      new Vector2(state.pointer.x * 3, state.pointer.y * 2),
      Math.min(1, delta * 3),
    )
    u.uPointer.value.copy(smoothed.current)

    // Режим страницы мог сменить токены, пока сцена жила.
    u.uFg.value.copy(tokenColor('--fg'))
    u.uBg.value.copy(tokenColor('--bg'))
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} />
      <mesh>
        <planeGeometry args={[8, 5, segments, segments]} />
        <shaderMaterial
          ref={material}
          vertexShader={fabricVertex}
          fragmentShader={fabricFragment}
          uniforms={uniforms}
        />
      </mesh>
    </>
  )
}
