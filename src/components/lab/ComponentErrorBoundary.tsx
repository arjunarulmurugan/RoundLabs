import { Component, type ErrorInfo, type ReactNode } from "react";

// Handles component errors safely (master prompt §17.15). A single bad
// component renders an honest inline error instead of crashing the whole lab.
interface Props {
  componentId: string;
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message?: string;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error(`Lab component "${this.props.componentId}" failed:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="lab-card component-error">
          <h3>Component unavailable</h3>
          <p>
            This panel ({this.props.componentId}) could not render. The rest of the
            lab is unaffected.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
