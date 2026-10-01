import { Component } from 'react';
import A11yPanel from './A11yPanel';
import FloatingBar from './FloatingBar';

export default class Topbar extends Component<any, any> {
  [key: string]: any;
  state = { panelOpen: false };
  componentDidMount() {
    this._p = (e) => this.setState({ panelOpen: !!(e.detail && e.detail.open) });
    window.addEventListener('ae:panel-state', this._p);
  }
  componentWillUnmount() {
    window.removeEventListener('ae:panel-state', this._p);
  }
  renderVals() {
    const active = this.props.active || 'course';
    const nav = [
      ['course', 'index.html', 'Course', 'fa-house'],
      ['glossary', 'glossary.html', 'Glossary', 'fa-book'],
      ['badge', 'progress.html', 'Progress', 'fa-chart-simple'],
    ].map(([id, href, label, icon]) => {
      const on = id === active;
      return {
        href,
        label,
        icon,
        current: on ? 'page' : undefined,
        color: on ? 'var(--accent-text)' : 'var(--ink)',
        bg: on ? 'var(--accent-soft)' : 'transparent',
      };
    });
    return {
      nav,
      active,
      panelOpen: this.state.panelOpen ? 'true' : 'false',
      openPanel: () => window.dispatchEvent(new CustomEvent('ae:panel', { detail: { toggle: true } })),
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="ae-sticky-desk z-[60]">
        <a
          className="fixed left-4 top-[-8rem] z-[300] bg-ink text-surface py-3 px-[1.1rem] rounded-[.6rem] font-bold no-underline focus:top-4!"
          href="#main"
          data-chrome="skip"
        >
          Skip to main content
        </a>
        <header className="ae-sticky-desk z-[60] bg-surface border-b border-b-line" data-chrome="topbar">
          <div className="h-16 py-0 px-5 flex items-center gap-4">
            <a className="flex items-center gap-[.65rem] no-underline text-ink min-w-0" href="index.html">
              <span className="flex-none w-9 h-9 rounded-[.65rem] bg-accent text-accent-ink grid place-items-center text-[1.15rem]" aria-hidden="true">
                <i className="fa-solid fa-universal-access"></i>
              </span>
              <span className="font-display font-bold text-[1.125rem] leading-[1.1]">Accessibility Essentials</span>
            </a>
            <div className="flex-1"></div>
            <nav className="ae-desk flex gap-1" aria-label="Main">
              {v.nav?.map((it: any, i: number) => (
                <a
                  key={i}
                  className="flex items-center gap-2 py-[.55rem] px-[.85rem] rounded-[.6rem] no-underline font-semibold text-[.9375rem] hover:bg-accent-soft! hover:text-accent-text!"
                  href={it.href}
                  aria-current={it.current}
                  style={{ color: it.color, background: it.bg }}
                >
                  <i className={`fa-solid ${it.icon ?? ''}`} aria-hidden="true"></i>
                  {it.label}
                </a>
              ))}
            </nav>
            <button
              className="ae-desk flex-none flex items-center gap-2 min-h-11 py-2 px-[.9rem] rounded-full border border-line bg-surface text-ink font-bold text-[.9375rem] cursor-pointer hover:bg-accent-soft! hover:border-accent-soft! hover:text-accent-text!"
              type="button"
              onClick={v.openPanel}
              aria-expanded={v.panelOpen}
              aria-controls="ae-panel"
            >
              <i className="fa-solid fa-sliders text-accent" aria-hidden="true"></i>
              <span>Display</span>
            </button>
          </div>
        </header>
        <A11yPanel />
        <FloatingBar active={v.active} />
      </div>
    );
  }
}
