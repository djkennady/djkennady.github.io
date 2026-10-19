import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import type { SceneProps } from './Canvas3D'
import FabricScene from './FabricScene'
import { SceneBoundary } from './SceneBoundary'
import { pickTeeSource } from './pickTeeSource'

const AUTO_SPIN = 0.25
const DRAG_SENSITIVITY = 0.01

function Tee({ url, printUrl }: { url: string; printUrl: string }) {
  const { scene } = useGLTF(url)
  const print = useTexture(printUrl)
  const group = useRef<Group>(null)
  const taken = useRef(false)
  const dragging = useRef(false)
  const lastX = useRef(0)

  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as Mesh
      if (!mesh.isMesh) return
      const material = mesh.material as MeshStandardMaterial
      material.map = print
      material.needsUpdate = true
    })
  }, [scene, print])

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
  settings,
  modelUrl,
  printUrl,
}: SceneProps & { modelUrl: string | null; printUrl: string }) {
  const source = pickTeeSource(modelUrl)
  const fabric = <FabricScene settings={settings} textureUrl={printUrl} />

  if (source.kind === 'fabric') return fabric

  return (
    <SceneBoundary fallback={fabric}>
      <Tee url={source.url} printUrl={printUrl} />
    </SceneBoundary>
  )
}
