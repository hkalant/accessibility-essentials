import { Component, createRef } from 'react';
import { AE } from '../lib/ae';
import { on } from '../lib/events';

export default class Sidebar extends Component<any, any> {
  [key: string]: any;
  state = { open: false, shown: false, menuTop: '3.5rem', active: null };
  barRef = createRef<HTMLDivElement>();
  btnRef = createRef<HTMLButtonElement>();
  componentDidMount() {
    this._off = on('ae:progress', () => this.forceUpdate());
    this._mq = window.matchMedia('(min-width: 64.001em)');
    this._mqf = () => {
      if (this._mq.matches && this.state.open) this.closeMenu();
    };
    this._mq.addEventListener('change', this._mqf);
    this._ot = setTimeout(() => this.observe(), 600);
  }
  componentWillUnmount() {
    this._off();
    this._mq.removeEventListener('change', this._mqf);
    clearTimeout(this._ot);
    clearTimeout(this._t);
    if (this._io) this._io.disconnect();
    document.body.style.overflow = '';
  }
  observe() {
    const L = this.lesson();
    if (!L || !window.IntersectionObserver) return;
    this._io = new IntersectionObserver(
      (es) => {
        const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) this.setState({ active: vis[0].target.id });
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    L.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) this._io.observe(el);
    });
  }
  lesson() {
    return AE.lessons[Number(this.props.current || 1) - 1];
  }
  openMenu() {
    const r = this.barRef.current && this.barRef.current.getBoundingClientRect();
    this.setState({ open: true, menuTop: (r ? Math.max(0, r.bottom) : 56) + 'px' }, () => {
      requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ shown: true })));
    });
    document.body.style.overflow = 'hidden';
  }
  closeMenu() {
    this.setState({ shown: false });
    document.body.style.overflow = '';
    const rm = AE.prefs.reducedMotion();
    clearTimeout(this._t);
    this._t = setTimeout(() => this.setState({ open: false }), rm ? 0 : 300);
  }
  renderVals() {
    const cur = Number(this.props.current || 1);
    const pr = AE.progress.get();
    const done = AE.progress.doneCount();
    const shown = this.state.shown;
    const L = AE.lessons[cur - 1];
    const items = AE.lessons.map((l, i) => {
      const isCur = l.n === cur,
        isDone = !!(pr.lessons[l.n] && pr.lessons[l.n].done);
      return {
        n: l.n,
        file: l.file,
        title: l.title,
        meta: (isDone ? 'Complete · ' : '') + l.mins + ' min',
        isCurrent: isCur,
        current: isCur ? 'page' : undefined,
        bg: isCur ? 'var(--accent-soft)' : 'transparent',
        weight: isCur ? 700 : 500,
        dotBg: isDone ? 'var(--ok)' : isCur ? 'var(--accent)' : 'var(--surface)',
        dotInk: isDone || isCur ? '#fff' : 'var(--muted)',
        dotLine: isDone ? 'var(--ok)' : isCur ? 'var(--accent)' : 'var(--line)',
        dotIcon: isDone ? 'fa-check' : 'fa-circle',
        iconDisp: isDone ? 'inline' : 'none',
        numDisp: isDone ? 'none' : 'inline',
        mColor: isCur ? 'var(--accent-text)' : 'var(--ink)',
        mOp: shown ? 1 : 0,
        mTf: shown ? 'none' : 'translateY(-.6rem)',
        delay: 0.04 + i * 0.04 + 's',
        secs: isCur
          ? l.sections.map((s) => {
              const on = this.state.active === s.id;
              return {
                href: '#' + s.id,
                title: s.title,
                cur: on ? 'location' : undefined,
                color: on ? 'var(--accent-text)' : 'var(--muted)',
                weight: on ? 700 : 500,
                line: on ? 'var(--accent)' : 'transparent',
              };
            })
          : [],
      };
    });
    const open = this.state.open;
    return {
      items,
      done,
      doneText: done + ' of 6 lessons complete',
      pct: Math.round((done / 6) * 100) + '%',
      curLabel: 'Lesson ' + cur + ' of 6',
      curTitle: L ? L.title : '',
      closed: !open,
      expanded: open ? 'true' : 'false',
      btnLabel: open ? 'Close course outline' : 'Open course outline',
      menuTop: this.state.menuTop,
      panelOp: shown ? 1 : 0,
      barTop: shown ? 'translateY(3.5px) rotate(45deg)' : 'none',
      barBot: shown ? 'translateY(-3.5px) rotate(-45deg)' : 'none',
      barRef: this.barRef,
      btnRef: this.btnRef,
      toggle: () => (open ? this.closeMenu() : this.openMenu()),
      closeMenu: () => this.closeMenu(),
      onKey: (e) => {
        if (e.key === 'Escape' && open) {
          this.closeMenu();
          this.btnRef.current && this.btnRef.current.focus();
        }
      },
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <aside
          className="ae-desk sticky top-16 h-[calc(100vh_-_4rem)] overflow-y-auto bg-surface border-r border-r-line pt-6 px-4 pb-8 flex flex-col gap-5"
          data-chrome="sidebar"
          aria-label="Course outline"
        >
          <div className="flex flex-col gap-[.6rem] py-0 px-2">
            <a
              className="text-[.8125rem] font-bold tracking-[.06em] uppercase text-muted no-underline flex items-center gap-[.4rem] hover:text-accent-text!"
              href="index.html"
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>Course outline
            </a>
            <div className="flex flex-col gap-[.35rem]" data-gamify="">
              <div className="flex justify-between text-[.8125rem] text-muted">
                <span>{v.doneText}</span>
                <span>{v.pct}</span>
              </div>
              <div
                className="h-[.4rem] rounded-full bg-line overflow-hidden"
                role="progressbar"
                aria-label="Course progress"
                aria-valuemin={0}
                aria-valuemax={6}
                aria-valuenow={v.done}
              >
                <div className="h-full bg-accent rounded-full [transition:width_.4s]" style={{ width: v.pct }}></div>
              </div>
            </div>
          </div>
          <nav aria-label="Lessons">
            <ol className="list-none m-0 p-0 flex flex-col gap-[.15rem]">
              {v.items?.map((l: any, i: number) => (
                <li key={i}>
                  <a
                    className="flex gap-3 items-start py-[.65rem] px-2 rounded-[.65rem] no-underline text-ink hover:bg-accent-soft!"
                    href={l.file}
                    aria-current={l.current}
                    style={{ background: l.bg }}
                  >
                    <span
                      className="flex-none w-[1.9rem] h-[1.9rem] rounded-[50%] grid place-items-center text-[.8125rem] font-bold"
                      aria-hidden="true"
                      style={{ background: l.dotBg, color: l.dotInk, border: `1.5px solid ${l.dotLine ?? ''}` }}
                    >
                      <i className={`fa-solid ${l.dotIcon ?? ''}`} style={{ display: l.iconDisp }}></i>
                      <span style={{ display: l.numDisp }}>{l.n}</span>
                    </span>
                    <span className="flex flex-col min-w-0 gap-[.1rem]">
                      <span className="leading-[1.3]" style={{ fontWeight: l.weight, fontSize: '.9375rem' }}>
                        {l.title}
                      </span>
                      <span className="text-[.8125rem] text-muted">{l.meta}</span>
                    </span>
                  </a>
                  {l.isCurrent ? (
                    <>
                      <ol
                        className="list-none mt-1 mr-0 mb-2 ml-[1.45rem] py-0 pr-0 pl-[1.05rem] border-l-2 border-l-line flex flex-col"
                        aria-label="On this page"
                      >
                        {l.secs?.map((s: any, j: number) => (
                          <li key={j}>
                            <a
                              className="block py-[.35rem] px-2 ml-[-1.15rem] text-[.875rem] no-underline hover:text-accent-text!"
                              href={s.href}
                              aria-current={s.cur}
                              style={{ borderLeft: `2px solid ${s.line ?? ''}`, color: s.color, fontWeight: s.weight }}
                            >
                              {s.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <div className="ae-mob sticky top-0 z-[55]" data-chrome="sidebar" onKeyDown={v.onKey}>
          <div
            className="flex items-center gap-3 py-[.55rem] px-4 min-h-14 bg-glass [backdrop-filter:blur(20px)_saturate(1.5)] [-webkit-backdrop-filter:blur(20px)_saturate(1.5)] border-b border-b-line"
            ref={v.barRef}
          >
            <button
              className="flex-none w-11 h-11 rounded-[.65rem] border-0 bg-transparent cursor-pointer relative text-ink"
              type="button"
              ref={v.btnRef}
              onClick={v.toggle}
              aria-expanded={v.expanded}
              aria-controls="m-outline"
              aria-label={v.btnLabel}
            >
              <span
                className="absolute left-[.8rem] right-[.8rem] top-[calc(50%_-_4px)] h-[2px] rounded-[2px] [background:currentColor] [transition:transform_.35s_cubic-bezier(.4,0,.2,1)]"
                aria-hidden="true"
                style={{ transform: v.barTop }}
              ></span>{' '}
              <span
                className="absolute left-[.8rem] right-[.8rem] top-[calc(50%_+_3px)] h-[2px] rounded-[2px] [background:currentColor] [transition:transform_.35s_cubic-bezier(.4,0,.2,1)]"
                aria-hidden="true"
                style={{ transform: v.barBot }}
              ></span>
            </button>
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-[.75rem] font-bold text-accent-text tracking-[.04em] uppercase">{v.curLabel}</span>
              <span className="font-bold text-[.9375rem] whitespace-nowrap overflow-hidden text-ellipsis">{v.curTitle}</span>
            </div>
            <span className="flex-none text-[.8125rem] font-bold text-muted flex items-center gap-[.35rem]" data-gamify="">
              <i className="fa-solid fa-circle-check text-ok" aria-hidden="true"></i>
              {v.done}/6
            </span>
          </div>
          <div
            className="fixed left-0 right-0 bottom-0 z-[56] bg-surface overflow-y-auto pt-5 px-6 pb-32 [transition:opacity_.3s_ease]"
            id="m-outline"
            hidden={v.closed}
            style={{ top: v.menuTop, opacity: v.panelOp }}
          >
            <nav aria-label="Course outline">
              <a
                className="block text-[.8125rem] font-bold tracking-[.06em] uppercase text-muted no-underline py-2 px-0 [transition:opacity_.4s_ease_.05s]"
                href="index.html"
                style={{ opacity: v.panelOp }}
              >
                Course outline
              </a>
              <ol className="list-none m-0 p-0">
                {v.items?.map((l: any, i: number) => (
                  <li
                    key={i}
                    style={{
                      opacity: l.mOp,
                      transform: l.mTf,
                      transition: `opacity .45s ease ${l.delay ?? ''},transform .45s cubic-bezier(.2,.8,.2,1) ${l.delay ?? ''}`,
                    }}
                  >
                    <a
                      className="flex items-baseline gap-3 py-[.55rem] px-0 no-underline"
                      href={l.file}
                      aria-current={l.current}
                      onClick={v.closeMenu}
                      style={{ color: l.mColor }}
                    >
                      <span className="text-[.875rem] font-bold text-muted min-w-[1.2rem]">{l.n}</span>
                      <span className="font-display text-[1.5rem] font-bold leading-[1.2] flex-1">{l.title}</span>
                      <i className="fa-solid fa-circle-check text-ok" aria-hidden="true" style={{ display: l.iconDisp }}></i>
                    </a>
                    {l.isCurrent ? (
                      <>
                        <ol className="list-none mt-0 mr-0 mb-3 ml-8 p-0 flex flex-col" aria-label="On this page">
                          {l.secs?.map((s: any, j: number) => (
                            <li key={j}>
                              <a
                                className="block py-[.45rem] px-0 text-[1rem] no-underline"
                                href={s.href}
                                onClick={v.closeMenu}
                                style={{ color: s.color, fontWeight: s.weight }}
                              >
                                {s.title}
                              </a>
                            </li>
                          ))}
                        </ol>
                      </>
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </>
    );
  }
}
