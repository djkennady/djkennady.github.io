import { Grain } from './components/Grain'

export function App() {
  return (
    <>
      <Grain />
      <main className="shell section">
        <h1 className="display" style={{ fontSize: 'clamp(3rem, 12vw, 11rem)' }}>
          DJ Kennady
        </h1>
      </main>
    </>
  )
}
