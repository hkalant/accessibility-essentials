import { Component, createRef } from 'react';
import { AE } from '../lib/ae';
import { on } from '../lib/events';

export default class A11yPanel extends Component<any, any> {
  [key: string]: any;
  state = { open: false, shown: false, anim: false, announce: '', mob: false, drag: 0, dragging: false };
  closeRef = createRef<HTMLButtonElement>();
  componentDidMount() {
    this._out = (e) => {
      if (!this.state.open) return;
      const t = e.target,
        pn = document.getElementById('ae-panel');
      if (!t || !t.closest || (pn && pn.contains(t)) || t.closest('[aria-controls="ae-panel"]')) return;
      this._ret = null;
      this.setOpen(false);
    };
    document.addEventListener('pointerdown', this._out, true);
    this._mq = window.matchMedia('(max-width:64em)');
    this._mqf = () => this.setState({ mob: this._mq.matches });
    this._mqf();
    this._mq.addEventListener('change', this._mqf);
    this._u = () => this.forceUpdate();
    this._p = (e) => {
      const d = e.detail || {};
      const open = d.toggle ? !this.state.open : !!d.open;
      this.setOpen(open);
    };
    this._off = on('ae:prefs', this._u);
    window.addEventListener('ae:panel', this._p);
  }
  componentWillUnmount() {
    this._off();
    window.removeEventListener('ae:panel', this._p);
    document.removeEventListener('pointerdown', this._out, true);
    if (this._mq) this._mq.removeEventListener('change', this._mqf);
  }
  setOpen(open) {
    if (open) {
      this._ret = document.activeElement;
    }
    clearTimeout(this._hideT);
    cancelAnimationFrame(this._raf);
    const rm = AE.prefs.reducedMotion();
    const done = () => {
      window.dispatchEvent(new CustomEvent('ae:panel-state', { detail: { open } }));
      if (open && this.closeRef.current) this.closeRef.current.focus({ preventScroll: true });
      if (!open && this._ret && this._ret.focus) this._ret.focus();
    };
    if (open) {
      this.setState({ open: true, shown: true }, () => {
        done();
        this._raf = requestAnimationFrame(() => {
          this._raf = requestAnimationFrame(() => this.setState({ anim: true }));
        });
      });
    } else {
      this.setState({ open: false, anim: false }, done);
      this._hideT = setTimeout(
        () => {
          if (!this.state.open) this.setState({ shown: false });
        },
        rm ? 0 : 480,
      );
    }
  }
  renderVals() {
    const P = AE.prefs,
      p = P.get();
    const set = (k, v) => {
      P.set({ [k]: v });
      this.setState({ announce: 'Setting updated' });
    };
    const grp = (id, label, opts) => ({
      id: 'ae-' + id,
      label,
      opts: opts.map(([value, l]) => {
        const checked = p[id] === value;
        return {
          value: String(value),
          label: l,
          checked,
          pick: () => set(id, value),
          border: checked ? 'var(--accent)' : 'var(--line)',
          bg: checked ? 'var(--accent-soft)' : 'var(--surface)',
        };
      }),
    });
    const tog = (id, label, hint) => {
      const on = !!p[id];
      return {
        label,
        hint,
        aria: on ? 'true' : 'false',
        toggle: () => set(id, !on),
        track: on ? 'var(--accent)' : 'var(--line)',
        knob: on ? '1.475rem' : '.225rem',
      };
    };
    const sections = [
      {
        title: 'Text & typography',
        icon: 'fa-font',
        open: true,
        hasStepper: true,
        groups: [
          grp('lh', 'Line height', [
            ['normal', 'Standard'],
            ['loose', 'Relaxed'],
            ['xloose', 'Extra'],
          ]),
          grp('ls', 'Letter spacing', [
            ['normal', 'Standard'],
            ['wide', 'Wider'],
            ['xwide', 'Widest'],
          ]),
          grp('ws', 'Word spacing', [
            ['normal', 'Standard'],
            ['wide', 'Wider'],
            ['xwide', 'Widest'],
          ]),
          grp('font', 'Font', [
            ['default', 'System font'],
            ['public', 'Public Sans'],
            ['atkinson', 'Atkinson Hyperlegible'],
            ['serif', 'Serif'],
          ]),
          grp('measure', 'Content width', [
            ['narrow', 'Narrow'],
            ['standard', 'Standard'],
            ['wide', 'Wide'],
          ]),
        ],
        toggles: [tog('alignLeft', 'Left-align all text', 'Turns off justified and centred body text')],
      },
      {
        title: 'Colour & contrast',
        icon: 'fa-circle-half-stroke',
        groups: [
          grp('theme', 'Theme', [
            ['auto', 'Match my system'],
            ['light', 'Light'],
            ['dark', 'Dark'],
            ['hc', 'High contrast'],
            ['sepia', 'Sepia, less blue'],
          ]),
        ],
        toggles: [
          tog('focusStrong', 'Stronger focus outlines', 'A thicker, two-tone outline on the focused element'),
          tog('underline', 'Underline all links', 'Links don’t rely on colour alone'),
          tog('bigCursor', 'Large cursor', 'A bigger, high-contrast pointer'),
        ],
      },
      {
        title: 'Motion & distraction',
        icon: 'fa-wind',
        groups: [
          grp('motion', 'Animations and transitions', [
            ['auto', 'Match my system'],
            ['reduce', 'Stop them'],
            ['allow', 'Allow'],
          ]),
          grp('ruler', 'Reading guide', [
            ['off', 'Off'],
            ['ruler', 'Reading ruler'],
            ['mask', 'Line focus mask'],
          ]),
        ],
        toggles: [tog('focusMode', 'Focus mode', 'Hides the sidebar, badges, progress and notifications')],
        note: 'Nothing in this course autoplays. Videos and audio only start when you press play.',
      },
      {
        title: 'Reading support',
        icon: 'fa-book-open-reader',
        hasListen: true,
        hasDownloads: true,
        groups: [
          grp('ttsRate', 'Reading speed', [
            [0.75, '0.75×'],
            [1, '1×'],
            [1.25, '1.25×'],
            [1.5, '1.5×'],
            [2, '2×'],
          ]),
        ],
        toggles: [
          tog('ttsHighlight', 'Highlight words as they’re read', 'Follows the voice word by word'),
          tog('reader', 'Plain reader view', 'Strips the page to a single column of content'),
          tog('lookup', 'Glossary look-up', 'Select a term to see its definition'),
        ],
      },
      {
        title: 'Captions & media',
        icon: 'fa-closed-captioning',
        hasSlider: true,
        groups: [
          grp('capSize', 'Caption size', [
            ['s', 'Small'],
            ['m', 'Medium'],
            ['l', 'Large'],
            ['xl', 'Extra large'],
          ]),
          grp('capFont', 'Caption font', [
            ['default', 'System font'],
            ['public', 'Public Sans'],
            ['atkinson', 'Atkinson'],
            ['serif', 'Serif'],
            ['mono', 'Monospace'],
          ]),
          grp('capPos', 'Caption position', [
            ['bottom', 'Bottom'],
            ['top', 'Top'],
          ]),
          grp('speed', 'Playback speed', [
            [0.75, '0.75×'],
            [1, '1×'],
            [1.25, '1.25×'],
            [1.5, '1.5×'],
            [2, '2×'],
          ]),
        ],
        toggles: [
          tog('ad', 'Audio description on by default', 'Plays extra narration of key visuals'),
          tog('transcriptScroll', 'Transcript follows the video', 'Scrolls and highlights the current line'),
        ],
        note: 'Caption settings are separate from page text settings. Changing speed keeps captions in sync.',
      },
      {
        title: 'This panel',
        icon: 'fa-window-maximize',
        groups: [
          grp('dock', 'Dock panel on the', [
            ['left', 'Left'],
            ['right', 'Right'],
          ]),
        ],
      },
    ].map((s) =>
      Object.assign({ groups: [], toggles: [], hasStepper: false, hasListen: false, hasSlider: false, hasDownloads: false, note: '', open: false }, s),
    );
    const presets = P.presets.map((x) => {
      const on = P.isPreset(x.id);
      return {
        label: x.label,
        icon: x.icon,
        pressed: on ? 'true' : 'false',
        border: on ? 'var(--accent)' : 'var(--line)',
        bg: on ? 'var(--accent-soft)' : 'var(--surface)',
        apply: () => {
          P.applyPreset(x.id);
          this.setState({ announce: x.label + ' applied' });
        },
      };
    });
    const onLesson = !!AE.currentLesson();
    const dl = (k) => () => AE.download(k);
    const right = p.dock !== 'left';
    const mob = this.state.mob;
    return {
      closed: !this.state.shown,
      panelTf: mob
        ? this.state.anim
          ? 'translateY(' + this.state.drag + 'px)'
          : 'translateY(104%)'
        : this.state.anim
          ? 'translateX(0)'
          : right
            ? 'translateX(104%)'
            : 'translateX(-104%)',
      panelOp: mob || this.state.anim ? '1' : '0',
      panelVis: this.state.shown ? 'visible' : 'hidden',
      pTrans: this.state.dragging
        ? 'none'
        : mob
          ? 'transform .44s cubic-bezier(.32,.72,0,1),visibility 0s linear ' + (this.state.anim ? '0s' : '.44s')
          : 'transform .34s cubic-bezier(.22,.9,.24,1),opacity .24s ease,visibility 0s linear ' + (this.state.anim ? '0s' : '.34s'),
      pTop: mob ? 'auto' : '0',
      pW: mob ? '100%' : 'min(27rem,100vw)',
      pMaxH: mob ? '88vh' : 'none',
      pRad: mob ? '1.25rem 1.25rem 0 0' : '0',
      pBorder: mob ? '1px solid var(--line)' : '0',
      ariaModal: mob ? 'true' : 'false',
      scrimOp: mob && this.state.anim ? Math.max(0, 1 - this.state.drag / 400) : 0,
      scrimVis: mob && this.state.shown ? 'visible' : 'hidden',
      scrimDelay: this.state.anim ? '0s' : '.3s',
      dStart: (e) => {
        if (!mob) return;
        this._y0 = e.touches[0].clientY;
        this.setState({ dragging: true });
      },
      dMove: (e) => {
        if (!mob || this._y0 == null) return;
        this.setState({ drag: Math.max(0, e.touches[0].clientY - this._y0) });
      },
      dEnd: () => {
        if (!mob) return;
        const far = this.state.drag > 110;
        this._y0 = null;
        this.setState({ dragging: false, drag: 0 });
        if (far) this.setOpen(false);
      },
      onTEnd: (e) => {
        if (e.target === e.currentTarget && e.propertyName === 'transform' && !this.state.open) this.setState({ shown: false });
      },
      leftPos: mob || !right ? '0' : 'auto',
      rightPos: mob || right ? '0' : 'auto',
      dockLabel: right ? 'Move panel to the left' : 'Move panel to the right',
      toggleDock: () => set('dock', right ? 'left' : 'right'),
      close: () => this.setOpen(false),
      onKey: (e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          this.setOpen(false);
        }
      },
      closeRef: this.closeRef,
      presets,
      sections,
      announce: this.state.announce,
      sizePct: Math.round(p.scale * 100) + '%',
      sizeMin: p.scale <= 1,
      sizeMax: p.scale >= 2,
      sizeDown: () => set('scale', Math.max(1, Math.round((p.scale - 0.1) * 10) / 10)),
      sizeUp: () => set('scale', Math.min(2, Math.round((p.scale + 0.1) * 10) / 10)),
      capBg: p.capBg,
      capBgPct: p.capBg + '%',
      setCapBg: (e) => set('capBg', Number(e.target.value)),
      listen: () => {
        this.setOpen(false);
        AE.tts.play();
      },
      onLesson,
      notLesson: !onLesson,
      downloads: [
        { label: 'Plain text', icon: 'fa-file-lines', run: dl('text') },
        { label: 'EPUB', icon: 'fa-book', run: dl('epub') },
        { label: 'Tagged PDF', icon: 'fa-file-pdf', run: dl('pdf') },
        { label: 'Large print', icon: 'fa-magnifying-glass-plus', run: dl('large') },
      ],
      reset: () => {
        P.reset();
        this.setState({ announce: 'All settings reset to default' });
      },
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div
          className="fixed inset-0 z-[190] bg-[rgba(20,10,20,.38)]"
          aria-hidden="true"
          onClick={v.close}
          style={{ opacity: v.scrimOp, visibility: v.scrimVis, transition: `opacity .3s ease,visibility 0s linear ${v.scrimDelay ?? ''}` }}
        ></div>
        <aside
          className="[will-change:transform] fixed z-[200] border-x border-x-line overflow-hidden bg-surface text-ink [box-shadow:0_0_60px_rgba(20,10,20,.22)] flex flex-col"
          id="ae-panel"
          data-chrome="panel"
          role="dialog"
          aria-modal={v.ariaModal}
          aria-labelledby="ae-panel-title"
          hidden={v.closed}
          onKeyDown={v.onKey}
          onTransitionEnd={v.onTEnd}
          style={{
            transform: v.panelTf,
            opacity: v.panelOp,
            visibility: v.panelVis,
            transition: v.pTrans,
            top: v.pTop,
            bottom: '0',
            left: v.leftPos,
            right: v.rightPos,
            width: v.pW,
            maxHeight: v.pMaxH,
            borderRadius: v.pRad,
            borderTop: v.pBorder,
            borderBottom: v.pBorder,
          }}
        >
          <div
            className="ae-mob flex-none pt-[.6rem] px-0 pb-[.1rem] touch-none"
            aria-hidden="true"
            onTouchStart={v.dStart}
            onTouchMove={v.dMove}
            onTouchEnd={v.dEnd}
          >
            <div className="w-10 h-[.3rem] rounded-full bg-line my-0 mx-auto"></div>
          </div>
          <div
            className="flex-none pt-[1.1rem] px-5 pb-4 border-b border-b-line flex flex-col gap-3"
            onTouchStart={v.dStart}
            onTouchMove={v.dMove}
            onTouchEnd={v.dEnd}
          >
            <div className="flex items-center gap-3">
              <span className="flex-none w-9 h-9 rounded-[.65rem] bg-accent-soft text-accent grid place-items-center" aria-hidden="true">
                <i className="fa-solid fa-sliders"></i>
              </span>
              <h2 className="text-[1.25rem] flex-1" id="ae-panel-title">
                Display & accessibility
              </h2>
              <button
                className="ae-desk w-11 h-11 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink"
                type="button"
                onClick={v.toggleDock}
                aria-label={v.dockLabel}
                title={v.dockLabel}
              >
                <i className="fa-solid fa-right-left" aria-hidden="true"></i>
              </button>
              <button
                className="w-11 h-11 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink"
                type="button"
                ref={v.closeRef}
                onClick={v.close}
                aria-label="Close accessibility settings"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>
            <p className="m-0 text-[.875rem] text-muted">
              Tune the course to suit you. We start from your system and browser settings. This panel doesn’t replace your own assistive technology — the course
              is built to work with it.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain pt-4 px-5 pb-[calc(2rem_+_env(safe-area-inset-bottom))] flex flex-col gap-4">
            <section className="flex flex-col gap-[.6rem]" aria-labelledby="ps-title">
              <h3 className="font-ui text-[.8125rem] font-bold tracking-[.06em] uppercase text-muted" id="ps-title">
                Quick settings
              </h3>
              <div className="flex flex-wrap gap-[.4rem]">
                {v.presets?.map((p: any, i: number) => (
                  <button
                    key={i}
                    className="inline-flex items-center gap-[.45rem] min-h-10 py-[.45rem] px-[.8rem] rounded-[.6rem] text-ink font-semibold text-[.875rem] cursor-pointer text-left"
                    type="button"
                    aria-pressed={p.pressed}
                    onClick={p.apply}
                    style={{ border: `1px solid ${p.border ?? ''}`, background: p.bg }}
                  >
                    <i className={`fa-solid ${p.icon ?? ''} text-accent`} aria-hidden="true"></i>
                    {p.label}
                  </button>
                ))}
              </div>
            </section>
            {v.sections?.map((s: any, i: number) => (
              <details key={i} className="border border-line rounded-[.875rem] bg-surface-2" open={s.open}>
                <summary className="cursor-pointer list-none flex items-center gap-[.65rem] py-[.85rem] px-4 font-bold text-[1rem] min-h-11">
                  <i className={`fa-solid ${s.icon ?? ''} text-accent w-[1.1rem] text-center`} aria-hidden="true"></i>
                  <span className="flex-1">{s.title}</span>
                  <i className="fa-solid fa-chevron-down text-[.8rem] text-muted" aria-hidden="true"></i>
                </summary>
                <div className="pt-1 px-4 pb-4 flex flex-col gap-4">
                  {s.hasStepper ? (
                    <>
                      <div className="flex items-center gap-3 flex-wrap" role="group" aria-labelledby="size-lbl">
                        <span className="font-semibold text-[.9375rem] flex-1" id="size-lbl">
                          Text size
                        </span>
                        <button
                          className="w-11 h-11 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink"
                          type="button"
                          onClick={v.sizeDown}
                          aria-label="Decrease text size"
                          disabled={v.sizeMin}
                        >
                          <i className="fa-solid fa-minus" aria-hidden="true"></i>
                        </button>
                        <output className="min-w-[3.5rem] text-center font-bold tabular-nums" aria-live="polite">
                          {v.sizePct}
                        </output>
                        <button
                          className="w-11 h-11 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink"
                          type="button"
                          onClick={v.sizeUp}
                          aria-label="Increase text size"
                          disabled={v.sizeMax}
                        >
                          <i className="fa-solid fa-plus" aria-hidden="true"></i>
                        </button>
                      </div>
                    </>
                  ) : null}
                  {s.hasListen ? (
                    <>
                      <button
                        className="flex items-center justify-center gap-2 min-h-11 rounded-[.6rem] border-0 bg-accent text-accent-ink font-bold cursor-pointer"
                        type="button"
                        onClick={v.listen}
                      >
                        <i className="fa-solid fa-headphones" aria-hidden="true"></i>Read this page aloud
                      </button>
                    </>
                  ) : null}
                  {s.groups?.map((g: any, j: number) => (
                    <fieldset key={j} className="border-0 m-0 p-0 min-w-0">
                      <legend className="font-semibold text-[.9375rem] p-0 mb-[.45rem]">{g.label}</legend>
                      <div className="flex flex-wrap gap-[.4rem]">
                        {g.opts?.map((o: any, k: number) => (
                          <label
                            key={k}
                            className="inline-flex items-center gap-[.45rem] min-h-10 py-[.4rem] px-3 rounded-full text-[.875rem] font-semibold cursor-pointer"
                            style={{ border: `1px solid ${o.border ?? ''}`, background: o.bg }}
                          >
                            <input
                              className="accent-accent m-0 w-4 h-4"
                              type="radio"
                              name={g.id}
                              value={o.value ?? ''}
                              checked={!!o.checked}
                              onChange={o.pick}
                            />
                            {o.label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  {s.hasSlider ? (
                    <>
                      <label className="flex flex-col gap-[.35rem] font-semibold text-[.9375rem]">
                        <span>Caption background opacity: {v.capBgPct}</span>
                        <input className="accent-accent w-full" type="range" min="0" max="100" step="10" value={v.capBg ?? ''} onChange={v.setCapBg} />
                      </label>
                    </>
                  ) : null}
                  {s.toggles?.map((t: any, j: number) => (
                    <button
                      key={j}
                      className="flex items-center justify-between gap-4 w-full py-[.35rem] px-0 [background:none] border-0 cursor-pointer text-left text-ink"
                      type="button"
                      role="switch"
                      aria-checked={t.aria}
                      onClick={t.toggle}
                    >
                      <span className="flex flex-col gap-[.1rem]">
                        <span className="font-semibold text-[.9375rem]">{t.label}</span>
                        <span className="text-[.8125rem] text-muted leading-[1.4]">{t.hint}</span>
                      </span>
                      <span
                        className="flex-none relative w-[2.9rem] h-[1.65rem] rounded-full [transition:background_.2s]"
                        aria-hidden="true"
                        style={{ background: t.track }}
                      >
                        <span
                          className="absolute top-[.225rem] w-[1.2rem] h-[1.2rem] rounded-[50%] bg-white [box-shadow:0_1px_3px_rgba(0,0,0,.35)] [transition:left_.2s]"
                          style={{ left: t.knob }}
                        ></span>
                      </span>
                    </button>
                  ))}
                  {s.hasDownloads ? (
                    <>
                      <div className="flex flex-col gap-[.45rem]">
                        <span className="font-semibold text-[.9375rem]">Download this lesson</span>
                        {v.onLesson ? (
                          <>
                            <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[.4rem]">
                              {v.downloads?.map((d: any, j: number) => (
                                <button
                                  key={j}
                                  className="flex items-center gap-2 min-h-11 py-[.45rem] px-[.7rem] rounded-[.6rem] border border-line bg-surface text-ink font-semibold text-[.875rem] cursor-pointer text-left"
                                  type="button"
                                  onClick={d.run}
                                >
                                  <i className={`fa-solid ${d.icon ?? ''} text-accent`} aria-hidden="true"></i>
                                  {d.label}
                                </button>
                              ))}
                            </div>
                          </>
                        ) : null}
                        {v.notLesson ? (
                          <>
                            <p className="m-0 text-[.875rem] text-muted">Open a lesson to download it as plain text, EPUB, tagged PDF or large print.</p>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                  {s.note ? (
                    <>
                      <p className="m-0 text-[.8125rem] text-muted flex gap-2">
                        <i className="fa-solid fa-circle-info mt-[.2rem]" aria-hidden="true"></i>
                        <span>{s.note}</span>
                      </p>
                    </>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
          <div className="flex-none py-[.9rem] px-5 border-t border-t-line flex items-center gap-3 flex-wrap">
            <p className="m-0 flex-1 min-w-[10rem] text-[.8125rem] text-muted">Display preferences are saved to your browser.</p>
            <button
              className="flex items-center gap-2 min-h-11 py-2 px-[.9rem] rounded-[.6rem] border border-line bg-surface text-ink font-bold cursor-pointer"
              type="button"
              onClick={v.reset}
            >
              <i className="fa-solid fa-rotate-left" aria-hidden="true"></i>Reset to default
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {v.announce}
          </p>
        </aside>
      </>
    );
  }
}
