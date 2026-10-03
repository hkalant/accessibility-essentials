import { Component } from 'react';
import { AE } from '../lib/ae';

export default class FloatingBar extends Component<any, any> {
  [key: string]: any;
  state = { hover: null, moving: false, panelOpen: false };
  componentDidMount() {
    this._p = (e) => this.setState({ panelOpen: !!(e.detail && e.detail.open) });
    window.addEventListener('ae:panel-state', this._p);
  }
  setHover(i) {
    if (i === this.state.hover) return;
    this.setState({ hover: i, moving: true });
    clearTimeout(this._t);
    this._t = setTimeout(() => this.setState({ moving: false }), 260);
  }
  componentWillUnmount() {
    clearTimeout(this._t);
    window.removeEventListener('ae:panel-state', this._p);
  }
  renderVals() {
    const ids = ['course', 'glossary', 'badge'];
    const activeIdx = ids.indexOf(this.props.active || 'course');
    const pos = this.state.hover != null ? this.state.hover : activeIdx;
    const defs = [
      ['index.html', 'Course', 'fa-house'],
      ['glossary.html', 'Glossary', 'fa-book'],
      ['progress.html', 'Progress', 'fa-chart-simple'],
    ];
    const links = defs.map(([href, label, icon], i) => ({
      href,
      label,
      icon,
      current: i === activeIdx ? 'page' : undefined,
      color: i === pos ? '#fff' : 'var(--ink)',
      enter: () => this.setHover(i),
    }));
    return {
      links,
      pillOp: pos < 0 ? 0 : 1,
      pillTf: `translateX(${Math.max(pos, 0) * 100}%) scale(${this.state.moving ? '1.1, 0.94' : '1, 1'})`,
      dispColor: pos === 3 ? '#fff' : 'var(--ink)',
      dispEnter: () => this.setHover(3),
      panelOpen: this.state.panelOpen ? 'true' : 'false',
      openPanel: () => window.dispatchEvent(new CustomEvent('ae:panel', { detail: { toggle: true } })),
      topColor: pos === 4 ? '#fff' : 'var(--ink)',
      topEnter: () => this.setHover(4),
      leave: () => this.setHover(null),
      toTop: () => {
        const rm = AE.prefs.reducedMotion();
        window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
        const m = document.getElementById('main');
        if (m) {
          m.setAttribute('tabindex', '-1');
          setTimeout(() => m.focus({ preventScroll: true }), rm ? 0 : 400);
        }
      },
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <nav
        className="ae-mob fixed left-1/2 bottom-[calc(1rem_+_env(safe-area-inset-bottom))] [transform:translateX(-50%)] z-[70] w-[min(26rem,calc(100vw_-_1.5rem))] p-1.5 rounded-full border border-transparent"
        aria-label="Quick navigation"
        data-chrome="fab"
        onMouseLeave={v.leave}
      >
        {/* The glass lives on a child, not the fixed bar: Safari 26+ samples a fixed element's own background and blur for its toolbar tint. */}
        <span
          className="absolute inset-[-1px] -z-10 rounded-full bg-glass [backdrop-filter:blur(20px)_saturate(1.6)] [-webkit-backdrop-filter:blur(20px)_saturate(1.6)] border border-[color:var(--fab-line,rgba(255,255,255,.55))] [box-shadow:0_12px_32px_rgba(20,10,20,.18),inset_0_1px_0_var(--fab-hl,rgba(255,255,255,.6))]"
          aria-hidden="true"
        ></span>
        <div className="relative grid grid-cols-[repeat(5,minmax(0,1fr))]">
          <span
            className="absolute top-0 bottom-0 left-0 w-[20%] rounded-full bg-accent [transition:transform_.55s_cubic-bezier(.34,1.5,.5,1),opacity_.25s_ease] [box-shadow:inset_0_1px_0_rgba(255,255,255,.4),inset_0_-1px_0_rgba(0,0,0,.12),0_6px_16px_rgba(209,3,115,.35)]"
            aria-hidden="true"
            style={{ opacity: v.pillOp, transform: v.pillTf }}
          ></span>
          {v.links?.map((it: any, i: number) => (
            <a
              key={i}
              className="relative z-[1] flex flex-col items-center justify-center gap-[.2rem] min-h-13 py-[.4rem] px-0 no-underline text-[.75rem] font-bold rounded-full [transition:color_.3s_ease]"
              href={it.href}
              aria-current={it.current}
              onMouseEnter={it.enter}
              onFocus={it.enter}
              onBlur={v.leave}
              style={{ color: it.color }}
            >
              <i className={`fa-solid ${it.icon ?? ''} text-[1.1rem]`} aria-hidden="true"></i>
              <span>{it.label}</span>
            </a>
          ))}
          <button
            className="relative z-[1] flex flex-col items-center justify-center gap-[.2rem] min-h-13 py-[.4rem] px-0 border-0 [background:none] cursor-pointer text-[.75rem] font-bold rounded-full [transition:color_.3s_ease]"
            type="button"
            onClick={v.openPanel}
            aria-expanded={v.panelOpen}
            aria-controls="ae-panel"
            onMouseEnter={v.dispEnter}
            onFocus={v.dispEnter}
            onBlur={v.leave}
            style={{ color: v.dispColor }}
          >
            <i className="fa-solid fa-universal-access text-[1.1rem]" aria-hidden="true"></i>
            <span>Display</span>
          </button>
          <button
            className="relative z-[1] flex flex-col items-center justify-center gap-[.2rem] min-h-13 py-[.4rem] px-0 border-0 [background:none] cursor-pointer text-[.75rem] font-bold rounded-full [transition:color_.3s_ease]"
            type="button"
            onClick={v.toTop}
            onMouseEnter={v.topEnter}
            onFocus={v.topEnter}
            onBlur={v.leave}
            style={{ color: v.topColor }}
          >
            <i className="fa-solid fa-circle-arrow-up text-[1.1rem]" aria-hidden="true"></i>
            <span>Top</span>
          </button>
        </div>
      </nav>
    );
  }
}
