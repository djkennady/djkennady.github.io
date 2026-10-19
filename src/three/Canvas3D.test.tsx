import { lazy } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Canvas3D } from './Canvas3D'
import { intersect } from '../test/setup'

// В jsdom нет WebGL, поэтому настоящий Canvas из R3F здесь не поднимется.
// Под проверкой не рендерер, а политика обёртки: картинка или сцена, когда
// сцена монтируется и что происходит при потере контекста.
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div data-testid="r3f-canvas" style={style}>
      {children}
    </div>
  ),
}))

const LazyStub = lazy(async () => ({
  default: () => <mesh data-testid="scene" />,
}))

const img = () => screen.queryByRole('presentation', { hidden: true })

it('при low рендерит статичную картинку, а не канвас', () => {
  render(
    <Canvas3D tier="low" scene={LazyStub} sceneProps={{}} fallbackSrc="/fallback/hero.webp" fallbackAlt="" />,
  )
  expect(img()).toHaveAttribute('src', '/fallback/hero.webp')
  expect(screen.queryByTestId('r3f-canvas')).toBeNull()
})

it('при mid монтирует сцену только после входа в экран', async () => {
  render(
    <Canvas3D tier="mid" scene={LazyStub} sceneProps={{}} fallbackSrc="/fallback/hero.webp" fallbackAlt="" />,
  )
  expect(screen.queryByTestId('r3f-canvas')).toBeNull()
  intersect(true)
  expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument()
})

it('после потери WebGL-контекста показывает картинку', async () => {
  render(
    <Canvas3D tier="high" scene={LazyStub} sceneProps={{}} fallbackSrc="/fallback/hero.webp" fallbackAlt="" />,
  )
  intersect(true)
  await screen.findByTestId('r3f-canvas')
  fireEvent(window, new Event('webglcontextlost'))
  expect(await screen.findByRole('presentation', { hidden: true })).toBeInTheDocument()
  expect(screen.queryByTestId('r3f-canvas')).toBeNull()
})

it('404 на картинке-фоллбэке не оставляет битую иконку', () => {
  render(
    <Canvas3D tier="low" scene={LazyStub} sceneProps={{}} fallbackSrc="/nope.webp" fallbackAlt="" />,
  )
  fireEvent.error(img()!)
  expect(img()).toBeNull()
})

it('сцена-фон не перехватывает касания и клики', () => {
  const { container } = render(
    <Canvas3D tier="high" scene={LazyStub} sceneProps={{}} fallbackSrc="/f.webp" fallbackAlt="" />,
  )
  expect(container.firstChild).toHaveStyle({ pointerEvents: 'none' })
})

it('интерактивная сцена оставляет вертикальный скролл странице', async () => {
  render(
    <Canvas3D
      tier="high"
      interactive
      scene={LazyStub}
      sceneProps={{}}
      fallbackSrc="/f.webp"
      fallbackAlt=""
    />,
  )
  intersect(true)
  expect(await screen.findByTestId('r3f-canvas')).toHaveStyle({ touchAction: 'pan-y' })
})
