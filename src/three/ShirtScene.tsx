import { useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import {
  Color,
  DoubleSide,
  ExtrudeGeometry,
  Shape,
  TextureLoader,
  type BufferAttribute,
  type Group,
} from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { SceneTokens } from './Canvas3D'
import { SHIRT, neckBottom, shirtOutline } from './shirtOutline'
import { BLANK } from './blankTexture'
import { clampSpin } from './clampSpin'

const DEPTH = 0.26
const AUTO_SPIN = 0.5
const DRAG_SENSITIVITY = 0.008

/** Силуэт превращается в объёмную деталь, после чего вершины слегка
 *  выгибаются: плоская выдавленная фигура читается как картон, а не как
 *  ткань. */
function buildGeometry() {
  const shape = new Shape()
  const outline = shirtOutline()
  const [startX, startY] = outline[0]

  shape.moveTo(startX, startY)
  for (const [x, y] of outline.slice(1)) shape.lineTo(x, y)

  // Горловина: плавный вырез обратно к левому плечу.
  const [neckX, neckY] = neckBottom()
  shape.quadraticCurveTo(neckX, neckY, startX, startY)

  const geometry = new ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.05,
    bevelSegments: 6,
    curveSegments: 32,
  })

  const position = geometry.attributes.position as BufferAttribute
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const y = position.getY(i)
    const z = position.getZ(i)

    // Грудь полнее краёв, по полотну идут две мягкие складки.
    const chest = (1 - Math.min(1, (x / SHIRT.sleeveX) ** 2)) * 0.18
    const folds = Math.cos(x * 2.1) * 0.022 + Math.sin(y * 1.5 + x * 0.5) * 0.018
    position.setZ(i, z + chest + folds)
  }
  position.needsUpdate = true

  const smoothed = mergeVertices(geometry, 1e-4)
  smoothed.computeVertexNormals()
  smoothed.center()

  return smoothed
}

type Props = {
  tokens: SceneTokens
  printUrl: string | null
  progress?: { value: number }
}

export default function ShirtScene({ tokens, printUrl }: Props) {
  const group = useRef<Group>(null)
  const taken = useRef(false)
  const dragging = useRef(false)
  const lastX = useRef(0)

  const geometry = useMemo(buildGeometry, [])
  const print = useLoader(TextureLoader, printUrl ?? BLANK)

  const [cloth, logo] = useMemo(() => {
    // Чёрная вещь в ноль не даёт теням разойтись: настоящая чёрная футболка
    // на свету всё равно светлее краски.
    const base = new Color(tokens.fg).lerp(new Color(tokens.bg), 0.05)
    // Логотип на чёрной футболке не печатают чёрным в ноль: он читается
    // тоном, как вышивка на фотографии.
    return [base, base.clone().lerp(new Color(tokens.bg), 0.3)]
  }, [tokens.fg, tokens.bg])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    if (taken.current) {
      // Взяли в руки — крутит только человек.
      g.rotation.y += 0
      return
    }

    // Не полный оборот, а покачивание: на полном обороте выдавленная
    // геометрия показывает плоский торец и перестаёт быть похожей на ткань.
    g.rotation.y = Math.sin(state.clock.elapsedTime * AUTO_SPIN) * 0.45
    g.rotation.x = Math.sin(state.clock.elapsedTime * AUTO_SPIN * 0.7) * 0.08
    void delta
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      {/* Ключевой свет сверху-справа, заполняющий слева и контровой сзади:
          без них чёрная вещь остаётся силуэтом без формы. */}
      <directionalLight position={[4, 5, 6]} intensity={1.5} />
      <directionalLight position={[-5, 1, 3]} intensity={0.5} />
      <directionalLight position={[0, 2, -6]} intensity={0.9} />

      <group
        ref={group}
        scale={1.9}
        onPointerDown={(e) => {
          taken.current = true
          dragging.current = true
          lastX.current = e.nativeEvent.clientX
        }}
        onPointerMove={(e) => {
          if (!dragging.current || !group.current) return
          group.current.rotation.y = clampSpin(
            group.current.rotation.y + (e.nativeEvent.clientX - lastX.current) * DRAG_SENSITIVITY,
          )
          lastX.current = e.nativeEvent.clientX
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
      >
        <mesh geometry={geometry} castShadow>
          <meshStandardMaterial color={cloth} roughness={0.78} metalness={0.04} side={DoubleSide} />
        </mesh>

        {printUrl && (
          <mesh position={[0, 0.28, DEPTH / 2 + 0.18]}>
            <planeGeometry args={[0.92, 0.2]} />
            <meshStandardMaterial
              map={print}
              color={logo}
              transparent
              roughness={0.75}
              // Текстура даёт только форму букв, цвет берётся тоном от ткани.
              alphaTest={0.35}
            />
          </mesh>
        )}
      </group>
    </>
  )
}
