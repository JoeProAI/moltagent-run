import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

// Keeps one misbehaving module from white-screening the whole workbench.
// A thrown render error is caught here and shown as a recoverable panel.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown render error' };
  }

  componentDidCatch(error, info) {
    console.error('Module crashed:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="module">
        <div className="panel" style={{ borderColor: 'var(--danger)' }}>
          <div className="panel-head">
            <div className="panel-title" style={{ color: 'var(--danger)' }}>
              <AlertTriangle size={15} />
              This module hit an error
            </div>
          </div>
          <p className="panel-sub">
            Something in this panel failed to render. The rest of the workbench is fine — you can
            reset this module or switch to another from the nav above.
          </p>
          <code style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--frost-2)', background: 'var(--ink-0)', border: '1px solid var(--seam)', padding: 'var(--sp-3)', marginBottom: 'var(--sp-4)', overflowX: 'auto' }}>
            {this.state.message}
          </code>
          <button type="button" className="btn primary" onClick={this.handleReset}>
            <RotateCcw size={14} />
            Reset module
          </button>
        </div>
      </div>
    );
  }
}
