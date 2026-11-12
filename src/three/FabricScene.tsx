import { useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader, Vector2, type ShaderMaterial } from 'three'
import { Color } from 'three'
import type { SceneProps } from './Canvas3D'
import { fabricFragment, fabricVertex } from './fabric.glsl'
import { sceneAmplitude } from './fabricAmplitude'
import { REVEAL_BAND, REVEAL_DURATION, revealDensity } from './revealSettings'
import { revealFront, revealGlow } from './revealProgress'
import { BLANK } from './blankTexture'

const PLANE_W = 8
const PLANE_H = 5

export default function FabricScene({
  settings,
  tokens,
  textureUrl,
  progress,
  reveal = false,
}: SceneProps & {
  textureUrl?: string
  progress?: { value: number }
  /** Матричное проявление. Выключено по умолчанию: полотно героя живёт без
   *  него, включает только блок бренда. */
  reveal?: boolean
}) {
  const material = useRef<ShaderMaterial>(null)
  const texture = useLoader(TextureLoader, textureUrl ?? BLANK)
  const smoothed = useRef(new Vector2())
  const elapsed = useRef(0)

  const segments = Math.max(16, settings.segments)

  // Полотно должно закрывать экран при любом соотношении сторон, поэтому
  // геометрия фиксированная, а меш масштабируется под вьюпорт.
  const { viewport } = useThree()
  const cover = Math.max(viewport.width / PLANE_W, viewport.height / PLANE_H) * 1.15

  // Доля ширины полотна, которую занимает принт, и соответствующая ей доля
  // высоты — чтобы картинка не сплющивалась вместе с плоскостью.
  const printScale = useMemo(() => {
    const image = texture.image as { width?: number; height?: number } | undefined
    const imageAspect = image?.width && image?.height ? image.width / image.height : 1
    const width = 0.42
    return new Vector2(width, (width * (PLANE_W / PLANE_H)) / imageAspect)
  }, [texture])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 1 },
      uPointer: { value: new Vector2() },
      uFg: { value: new Color(tokens.fg) },
      uBg: { value: new Color(tokens.bg) },
      uTexture: { value: texture },
      uHasTexture: { value: textureUrl ? 1 : 0 },
      uPrintScale: { value: printScale },
      // Единица и ноль — это «проявление уже закончилось»: ровно то полотно,
      // что было здесь до эффекта.
      uFront: { value: 1 },
      uGlow: { value: 0 },
      uBand: { value: REVEAL_BAND },
      uGlyph: { value: reveal ? 1 : 0 },
      // Полотно 8x5, поэтому по X знаков во столько же раз больше: иначе
      // ячейка выходит прямоугольной и знаки слипаются в сплошной текст.
      uDensity: {
        value: new Vector2(
          revealDensity(settings) * (PLANE_W / PLANE_H),
          revealDensity(settings),
        ),
      },
    }),
    [texture, textureUrl, tokens.fg, tokens.bg, printScale, reveal, settings],
  )

  useFrame((state, delta) => {
    const u = material.current?.uniforms
    if (!u) return

    u.uTime.value += delta
    u.uAmplitude.value = sceneAmplitude(progress)

    if (reveal) {
      elapsed.current += delta
      u.uFront.value = revealFront(elapsed.current, REVEAL_DURATION)
      u.uGlow.value = revealGlow(elapsed.current, REVEAL_DURATION)
    }

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
