import { Component, type ReactNode } from 'react'

type Props = { fallback: ReactNode; onError?: () => void; children: ReactNode }

/** Загрузчики three бросают при 404 на текстуре или модели, и без этой
 *  границы такое исключение уносит из DOM всю секцию целиком. */
export class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
