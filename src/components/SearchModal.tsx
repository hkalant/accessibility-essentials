import { Component, createRef } from 'react';
import { AE } from '../lib/ae';

export default class SearchModal extends Component<any, any> {
  [key: string]: any;
  state = { open: false, q: '', all: false };
  dlgRef = createRef<HTMLDivElement>();
  inputRef = createRef<HTMLInputElement>();
  componentDidMount() {
    this._k = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.state.open ? this.close() : this.openIt();
      }
    };
    this._o = () => this.openIt();
    document.addEventListener('keydown', this._k, true);
    window.addEventListener('ae:search', this._o);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this._k, true);
    window.removeEventListener('ae:search', this._o);
  }
  focusInput(tries = 0) {
    const i = this.inputRef.current || (document.getElementById('sm-input') as HTMLInputElement | null);
    if (i) {
      i.focus();
      i.select();
      if (document.activeElement === i) return;
    }
    if (tries < 20) requestAnimationFrame(() => this.focusInput(tries + 1));
  }
  openIt() {
    if (this.state.open) {
      this.focusInput();
      return;
    }
    this._ret = document.activeElement;
    this.setState({ open: true, all: false }, () => requestAnimationFrame(() => this.focusInput()));
  }
  close(restore = true) {
    this.setState({ open: false });
    if (restore && this._ret && this._ret.focus) setTimeout(() => this._ret.focus(), 0);
  }
  index() {
    if (this._idx) return this._idx;
    const out: { kind: string; icon: string; title: string; text: string; href: string; w: number; hay: string }[] = [];
    const add = (kind, icon, title, text, href, w) =>
      out.push({ kind, icon, title, text: text || '', href, w, hay: (title + ' ' + (text || '')).toLowerCase() });
    AE.lessons.forEach((l) => {
      const L = 'Lesson ' + l.n;
      add(L, l.icon || 'fa-book-open', l.title, l.summary, l.file, 4);
      l.sections.forEach((s) => add(L + ' · Section', 'fa-bookmark', s.title, l.title, l.file + '#' + s.id, 3));
      (l.outcomes || []).forEach((o) => add(L + ' · Learning outcome', 'fa-star', o, '', l.file, 1));
      const d = AE.dosdonts && AE.dosdonts[l.n];
      if (d) {
        (d.dos || []).forEach((t) => add(L + ' · Do', 'fa-circle-check', t, '', l.file + '#dos-donts', 1));
        (d.donts || []).forEach((t) => add(L + ' · Don’t', 'fa-circle-xmark', t, '', l.file + '#dos-donts', 1));
      }
      const r = AE.resources && AE.resources[l.n];
      if (r) (r.checklist || []).forEach((t) => add(L + ' · Checklist', 'fa-list-check', t, '', l.file + '#resources', 1));
    });
    (AE.glossary || []).forEach((g) =>
      add('Glossary', 'fa-book', g.term, g.def + (g.alias.length ? ' (' + g.alias.join(', ') + ')' : ''), 'glossary.html#' + g.id, 3),
    );
    return (this._idx = out);
  }
  search(q) {
    const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!toks.length) return [];
    return this.index()
      .filter((e) => toks.every((t) => e.hay.includes(t)))
      .map((e) => {
        const tl = e.title.toLowerCase();
        let s = e.w;
        toks.forEach((t) => {
          if (tl.includes(t)) s += 5;
          if (tl.startsWith(t)) s += 3;
        });
        if (tl === q.toLowerCase().trim()) s += 10;
        return { e, s };
      })
      .sort((a, b) => b.s - a.s)
      .map((x) => x.e);
  }
  parts(text, toks) {
    if (!toks.length) return [{ t: text, bg: 'transparent', ink: 'inherit' }];
    const re = new RegExp('(' + toks.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig');
    return text
      .split(re)
      .filter(Boolean)
      .map((t) => {
        const m = toks.some((k) => k === t.toLowerCase());
        return { t, bg: m ? 'var(--accent-soft)' : 'transparent', ink: m ? 'var(--ink)' : 'inherit' };
      });
  }
  snip(text, toks) {
    if (!text) return '';
    const cut = (s) => (s.length > 140 ? s.slice(0, 140).replace(/\s\S*$/, '') + '…' : s);
    const lo = text.toLowerCase();
    let i = -1;
    toks.some((t) => (i = lo.indexOf(t)) >= 0);
    if (text.length <= 140 || i < 60) return cut(text);
    const st = text.lastIndexOf(' ', i - 40);
    return '…' + cut(text.slice(st > 0 ? st + 1 : 0));
  }
  focusables() {
    const d = this.dlgRef.current;
    return d
      ? [...d.querySelectorAll<HTMLElement>('input,button,a[href]')].filter((el) => !(el as HTMLButtonElement).disabled && el.offsetParent !== null)
      : [];
  }
  renderVals() {
    const q = this.state.q,
      toks = q.toLowerCase().split(/\s+/).filter(Boolean),
      hits = q.trim() ? this.search(q) : [],
      LIM = 8;
    const shown = this.state.all ? hits : hits.slice(0, LIM);
    const results = shown.map((e) => {
      const sn = this.snip(e.text, toks);
      return { href: e.href, icon: e.icon, kind: e.kind, titleParts: this.parts(e.title, toks), hasSnip: !!sn, snipParts: this.parts(sn, toks) };
    });
    const setQ = (v) => this.setState({ q: v, all: false });
    const input = () => this.inputRef.current;
    const links = () => [...document.querySelectorAll<HTMLAnchorElement>('#sm-results a')];
    const status = !q.trim()
      ? ''
      : hits.length
        ? hits.length +
          ' result' +
          (hits.length === 1 ? '' : 's') +
          ' for “' +
          q.trim() +
          '”' +
          (hits.length > shown.length ? ' · showing top ' + shown.length : '')
        : 'No results for “' + q.trim() + '”. Try a shorter or different word.';
    return {
      open: this.state.open,
      dlgRef: this.dlgRef,
      inputRef: this.inputRef,
      q,
      close: () => this.close(),
      pick: () => this.close(false),
      onQ: (e) => setQ(e.target.value),
      onKey: (e) => {
        if (e.key === 'ArrowDown' && hits.length) {
          e.preventDefault();
          const l = links()[0];
          l && l.focus();
        } else if (e.key === 'Enter' && hits.length) {
          e.preventDefault();
          this.close(false);
          location.href = hits[0].href;
        }
      },
      onResKey: (e) => {
        const list = links(),
          i = list.indexOf(e.currentTarget);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          (list[i + 1] || list[i]).focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (i > 0) list[i - 1].focus();
          else input()?.focus();
        }
      },
      trap: (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          this.close();
          return;
        }
        if (e.key !== 'Tab') return;
        const f = this.focusables();
        if (!f.length) return;
        const a = f[0],
          z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      },
      showChips: !q.trim(),
      chips: ['Alt text', 'Captions', 'Contrast', 'PSBAR', 'Reasonable adjustments', 'Moodle'].map((t) => ({
        t,
        go: () => {
          setQ(t);
          const i = input();
          i && i.focus();
        },
      })),
      status,
      hasResults: results.length > 0,
      results,
      hasMore: hits.length > shown.length,
      moreLabel: 'Show all ' + hits.length + ' results',
      showAll: () => this.setState({ all: true }),
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        {v.open ? (
          <>
            <div
              className="fixed inset-0 z-[2000] flex justify-center items-start pt-[max(min(12vh,6rem),env(safe-area-inset-top,0px))] px-4 pb-4"
              data-chrome="search"
            >
              {/* The page stays scrollable (no overflow: hidden, which upsets Safari 26+'s toolbar); touches on the backdrop just don't scroll it. The backdrop bleeds past the screen edges to reach under Safari's floating toolbars. */}
              <div className="absolute inset-x-0 top-[-6rem] bottom-[-6rem] bg-[rgba(0,0,0,.55)] touch-none" onClick={v.close} aria-hidden="true"></div>
              <div
                className="relative w-[min(100%,42rem)] max-h-[calc(100dvh_-_min(12vh,6rem)_-_1rem_-_env(safe-area-inset-bottom,0px))] flex flex-col rounded-[1.25rem] bg-surface border border-line [box-shadow:var(--shadow)] overflow-hidden text-ink"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sm-title"
                ref={v.dlgRef}
                onKeyDown={v.trap}
              >
                <h2 className="sr-only" id="sm-title">
                  Search the course
                </h2>
                <div className="flex-none relative flex items-center gap-2 py-[.6rem] pr-[.6rem] pl-[1.1rem] border-b border-b-line" role="search">
                  <i className="fa-solid fa-magnifying-glass text-accent" aria-hidden="true"></i>
                  <label className="sr-only" htmlFor="sm-input">
                    Search lessons, topics, glossary terms and tips
                  </label>
                  <input
                    className="flex-1 min-w-0 min-h-12 py-2 px-1 border-0 bg-transparent text-ink text-[1.125rem] [outline:none]"
                    id="sm-input"
                    ref={v.inputRef}
                    type="search"
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="Search lessons, topics, glossary…"
                    value={v.q ?? ''}
                    onChange={v.onQ}
                    onKeyDown={v.onKey}
                    aria-describedby="sm-status"
                    aria-controls="sm-results"
                  />
                  <button
                    className="inline-flex items-center gap-[.4rem] min-h-11 py-[.3rem] px-[.7rem] rounded-[.6rem] border border-line bg-transparent text-muted text-[.8125rem] font-bold cursor-pointer hover:text-ink! hover:bg-surface-2!"
                    type="button"
                    onClick={v.close}
                    aria-label="Close search"
                  >
                    Esc
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pt-4 px-[1.1rem] pb-[1.1rem] flex flex-col gap-[.85rem]">
                  {v.showChips ? (
                    <>
                      <div className="flex-none flex flex-col gap-[.6rem]">
                        <p className="m-0 text-[.75rem] font-extrabold tracking-[.08em] uppercase text-muted">Popular searches</p>
                        <div className="flex flex-wrap gap-2">
                          {v.chips?.map((c: any, i: number) => (
                            <button
                              key={i}
                              className="min-h-11 py-[.4rem] px-[.9rem] rounded-full border border-[#dddddd] bg-transparent text-ink text-[.9rem] font-semibold cursor-pointer hover:border-accent! hover:text-accent-text!"
                              type="button"
                              onClick={c.go}
                            >
                              {c.t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                  <p className="flex-none m-0 text-[.875rem] font-bold text-muted" id="sm-status" role="status" aria-live="polite">
                    {v.status}
                  </p>
                  {v.hasResults ? (
                    <>
                      <ul
                        className="flex-none list-none m-0 p-0 flex flex-col gap-[1px] bg-line border border-line rounded-[1rem] overflow-hidden"
                        id="sm-results"
                        aria-label="Search results"
                      >
                        {v.results?.map((r: any, i: number) => (
                          <li key={i} className="flex">
                            <a
                              className="flex-1 grid grid-cols-[2.25rem_minmax(0,1fr)] gap-[.9rem] [align-items:start] py-[.9rem] px-[1.1rem] bg-surface text-ink no-underline [outline-offset:-3px] hover:bg-surface-2! focus:bg-surface-2!"
                              href={r.href}
                              onClick={v.pick}
                              onKeyDown={v.onResKey}
                            >
                              <span className="w-9 h-9 rounded-[.6rem] grid place-items-center bg-accent-soft text-accent-text" aria-hidden="true">
                                <i className={`fa-solid ${r.icon ?? ''}`}></i>
                              </span>
                              <span className="flex flex-col gap-[.2rem] min-w-0">
                                <span className="text-[.75rem] font-extrabold tracking-[.06em] uppercase text-muted">{r.kind}</span>
                                <span className="font-bold leading-[1.35]">
                                  {r.titleParts?.map((p: any, j: number) => (
                                    <span key={j} className="rounded-[.2rem]" style={{ background: p.bg, color: p.ink }}>
                                      {p.t}
                                    </span>
                                  ))}
                                </span>
                                {r.hasSnip ? (
                                  <>
                                    <span className="text-[.9375rem] text-muted leading-[1.45]">
                                      {r.snipParts?.map((p: any, j: number) => (
                                        <span key={j} className="rounded-[.2rem]" style={{ background: p.bg, color: p.ink }}>
                                          {p.t}
                                        </span>
                                      ))}
                                    </span>
                                  </>
                                ) : null}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {v.hasMore ? (
                    <>
                      <button
                        className="flex-none self-start min-h-11 py-[.45rem] px-[.9rem] rounded-[.65rem] border border-[#dddddd] bg-transparent text-ink font-bold cursor-pointer"
                        type="button"
                        onClick={v.showAll}
                      >
                        {v.moreLabel}
                      </button>
                    </>
                  ) : null}
                </div>
                <div
                  className="flex-none flex flex-wrap gap-[.4rem_1.25rem] py-[.7rem] px-[1.1rem] border-t border-t-line bg-surface-2 text-[.8125rem] text-muted"
                  aria-hidden="true"
                >
                  <span className="flex items-center gap-[.35rem]">
                    <kbd>↑</kbd>
                    <kbd>↓</kbd>Move
                  </span>
                  <span className="flex items-center gap-[.35rem]">
                    <kbd>Enter</kbd>Open
                  </span>
                  <span className="flex items-center gap-[.35rem]">
                    <kbd>Esc</kbd>Close
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </>
    );
  }
}
