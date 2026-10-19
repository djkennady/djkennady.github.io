import { Component, type ReactNode } from 'react'

type Props = { fallback: ReactNode; children: ReactNode }

/** Если модель не скачалась или не разобралась, блок показывает запасную
 *  сцену, а не пустое место. */
export class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
