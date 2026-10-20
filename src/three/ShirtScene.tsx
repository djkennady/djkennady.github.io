import { useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Color, DoubleSide, TextureLoader, type Group } from 'three'
import type { SceneTokens } from './Canvas3D'
import { buildShirtGeometry } from './shirtGeometry'
import { torsoProfile } from './shirtProfile'
import { BLANK } from './blankTexture'

const AUTO_SPIN = 0.22
const DRAG_SENSITIVITY = 0.008

type Props = {
  tokens: SceneTokens
  printUrl: string | null
}

export default function ShirtScene({ tokens, printUrl }: Props) {
  const group = useRef<Group>(null)
  const taken = useRef(false)
  const dragging = useRef(false)
  const lastX = useRef(0)

  const geometry = useMemo(buildShirtGeometry, [])
  const print = useLoader(TextureLoader, printUrl ?? BLANK)

  const [cloth, logo] = useMemo(() => {
    // Чёрная вещь в ноль не даёт теням разойтись: настоящая чёрная футболка
    // на свету всё равно светлее краски.
    const base = new Color(tokens.fg).lerp(new Color(tokens.bg), 0.07)
    // Логотип на чёрном не печатают чёрным в ноль: он читается тоном, как
    // вышивка на фотографии дропа.
    return [base, base.clone().lerp(new Color(tokens.bg), 0.34)]
  }, [tokens.fg, tokens.bg])

  // Принт лежит на груди, чуть впереди поверхности ткани.
  const chestZ = torsoProfile(0.78).rz + 0.03

  useFrame((_, delta) => {
    const g = group.current
    if (!g || taken.current) return
    g.rotation.y += delta * AUTO_SPIN
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Ключевой свет сверху-справа, заполняющий слева, контровой сзади:
          без контрового чёрная вещь сливается в силуэт. */}
      <directionalLight position={[4, 5, 6]} intensity={1.7} />
      <directionalLight position={[-5, 1.5, 3]} intensity={0.55} />
      <directionalLight position={[0, 3, -6]} intensity={1.1} />

      <group
        ref={group}
        scale={1.42}
        rotation={[0.06, -0.3, 0]}
        onPointerDown={(e) => {
          taken.current = true
          dragging.current = true
          lastX.current = e.nativeEvent.clientX
        }}
        onPointerMove={(e) => {
          if (!dragging.current || !group.current) return
          group.current.rotation.y += (e.nativeEvent.clientX - lastX.current) * DRAG_SENSITIVITY
          lastX.current = e.nativeEvent.clientX
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
      >
        <mesh geometry={geometry}>
          <meshStandardMaterial color={cloth} roughness={0.84} metalness={0.03} side={DoubleSide} />
        </mesh>

        {printUrl && (
          <mesh position={[0, 0.18, chestZ]}>
            <planeGeometry args={[0.92, 0.2]} />
            <meshStandardMaterial
              map={print}
              color={logo}
              transparent
              roughness={0.7}
              alphaTest={0.35}
            />
          </mesh>
        )}
      </group>
    </>
  )
}
