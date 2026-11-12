import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import {
  Box3,
  Color,
  ShaderMaterial,
  TextureLoader,
  type Group,
  type Mesh,
  type Object3D,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { SceneProps } from './Canvas3D'
import FabricScene from './FabricScene'
import GlyphRain from './GlyphRain'
import { SceneBoundary } from './SceneBoundary'
import { pickTeeSource } from './pickTeeSource'
import { revealFragment, revealVertex } from './reveal.glsl'
import { REVEAL_BAND, REVEAL_DURATION, revealDensity } from './revealSettings'
import { revealFront, revealGlow } from './revealProgress'
import { BLANK } from './blankTexture'

const AUTO_SPIN = 0.25
const DRAG_SENSITIVITY = 0.01

function Tee({
  url,
  printUrl,
  settings,
  tokens,
}: SceneProps & { url: string; printUrl: string | null }) {
  const { scene } = useLoader(GLTFLoader, url)
  // Загрузчик нельзя звать условно: без принта берём прозрачный пиксель.
  const print = useLoader(TextureLoader, printUrl ?? BLANK)
  const group = useRef<Group>(null)
  const taken = useRef(false)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const elapsed = useRef(0)

  // useLoader держит загруженную сцену в своём кеше и отдаёт тот же объект
  // при повторном монтировании. Материалы вешаем на копию, иначе сцена из
  // кеша осталась бы со ссылкой на материал, который мы уже уничтожили.
  const model = useMemo(() => scene.clone(true), [scene])

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: revealVertex,
        fragmentShader: revealFragment,
        transparent: true,
        // Модель просвечивает сама себя: спина читается сквозь грудь, и это
        // и даёт голограмму вместо плотного силуэта.
        depthWrite: false,
        uniforms: {
          uFg: { value: new Color(tokens.fg) },
          uTime: { value: 0 },
          uFront: { value: 0 },
          uGlow: { value: 1 },
          uBand: { value: REVEAL_BAND },
          uDensity: { value: revealDensity(settings) },
          uPrint: { value: print },
          uHasPrint: { value: printUrl ? 1 : 0 },
          uMinY: { value: 0 },
          uMaxY: { value: 1 },
        },
      }),
    [tokens.fg, settings, print, printUrl],
  )

  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    // Габарит в мировых координатах — в них же шейдер считает высоту точки.
    const box = new Box3().setFromObject(model)
    material.uniforms.uMinY.value = box.min.y
    material.uniforms.uMaxY.value = box.max.y

    model.traverse((o: Object3D) => {
      const mesh = o as Mesh
      if (mesh.isMesh) mesh.material = material
    })
  }, [model, material])

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
    // Отсчёт идёт от монтирования сцены, а Canvas3D монтирует её в тот
    // момент, когда до секции доскроллили. Отдельный триггер прохода не
    // нужен: проявление и так начинается при входе секции в экран.
    elapsed.current += delta

    const u = material.uniforms
    u.uTime.value = elapsed.current
    u.uFront.value = revealFront(elapsed.current, REVEAL_DURATION)
    u.uGlow.value = revealGlow(elapsed.current, REVEAL_DURATION)

    if (!taken.current && group.current) group.current.rotation.y += delta * AUTO_SPIN
  })

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        taken.current = true
        dragging.current = true
        lastX.current = e.nativeEvent.clientX
      }}
    >
      <primitive object={model} />
    </group>
  )
}

export default function TeeScene({
  settings,
  tokens,
  modelUrl,
  printUrl,
}: SceneProps & { modelUrl: string | null; printUrl: string | null }) {
  const source = pickTeeSource(modelUrl)

  // Дождь идёт за моделью в обеих ветках: он и есть тот фон, сквозь который
  // видно непроявленную часть меша.
  const rain = <GlyphRain settings={settings} tokens={tokens} />

  const fabric = (
    <FabricScene settings={settings} tokens={tokens} textureUrl={printUrl ?? undefined} reveal />
  )

  if (source.kind === 'fabric')
    return (
      <>
        {rain}
        {fabric}
      </>
    )

  return (
    <>
      {rain}
      <SceneBoundary fallback={fabric}>
        <Tee
          url={source.url}
          printUrl={printUrl}
          settings={settings}
          tokens={tokens}
        />
      </SceneBoundary>
    </>
  )
}
