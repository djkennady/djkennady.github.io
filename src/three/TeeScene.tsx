import { useEffect, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, type Group, type Mesh, type MeshStandardMaterial } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { SceneProps } from './Canvas3D'
import ShirtScene from './ShirtScene'
import { SceneBoundary } from './SceneBoundary'
import { pickTeeSource } from './pickTeeSource'
import { BLANK } from './blankTexture'

const AUTO_SPIN = 0.25
const DRAG_SENSITIVITY = 0.01

function Tee({ url, printUrl }: { url: string; printUrl: string | null }) {
  const { scene } = useLoader(GLTFLoader, url)
  // Загрузчик нельзя звать условно: без принта берём прозрачный пиксель.
  const print = useLoader(TextureLoader, printUrl ?? BLANK)
  const group = useRef<Group>(null)
  const taken = useRef(false)
  const dragging = useRef(false)
  const lastX = useRef(0)

  useEffect(() => {
    if (!printUrl) return
    scene.traverse((o) => {
      const mesh = o as Mesh
      if (!mesh.isMesh) return
      const material = mesh.material as MeshStandardMaterial
      material.map = print
      material.needsUpdate = true
    })
  }, [scene, print, printUrl])

  // Слушаем окно, а не меш: палец или курсор может уйти за пределы модели,
  // и вращение не должно на этом обрываться.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current || !group.current) return
      group.current.rotation.y += (e.clientX - lastX.current) * DRAG_SENSITIVITY
      lastX.current = e.clientX
    }
    const release = () => {
      dragging.current = false
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [])

  useFrame((_, delta) => {
    if (taken.current || !group.current) return
    group.current.rotation.y += delta * AUTO_SPIN
  })

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 3]} intensity={1.2} />
      <group
        ref={group}
        onPointerDown={(e) => {
          taken.current = true
          dragging.current = true
          lastX.current = e.nativeEvent.clientX
        }}
      >
        <primitive object={scene} />
      </group>
    </>
  )
}

export default function TeeScene({
  tokens,
  modelUrl,
  printUrl,
}: SceneProps & { modelUrl: string | null; printUrl: string | null }) {
  const source = pickTeeSource(modelUrl)
  const shirt = <ShirtScene tokens={tokens} printUrl={printUrl} />

  if (source.kind === 'shirt') return shirt

  // Модель может не скачаться — тогда остаётся футболка из сцены.
  return (
    <SceneBoundary fallback={shirt}>
      <Tee url={source.url} printUrl={printUrl} />
    </SceneBoundary>
  )
}
