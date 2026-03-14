import { Component, ErrorInfo, ReactNode } from 'react'

type MarkdownEditorErrorBoundaryProps = {
  children: ReactNode
  fallback: (error: Error) => ReactNode
  resetKey: string
}

type MarkdownEditorErrorBoundaryState = {
  error: Error | null
}

export class MarkdownEditorErrorBoundary extends Component<
  MarkdownEditorErrorBoundaryProps,
  MarkdownEditorErrorBoundaryState
> {
  state: MarkdownEditorErrorBoundaryState = {
    error: null
  }

  static getDerivedStateFromError(error: Error): MarkdownEditorErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Markdown editor crashed:', error, errorInfo)
  }

  componentDidUpdate(prevProps: MarkdownEditorErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error)
    }

    return this.props.children
  }
}
