import { Component } from 'react';
import { AE } from '../lib/ae';
import { on } from '../lib/events';
import type { KcAnswer } from '../lib/ae';

export default class KnowledgeCheck extends Component<any, any> {
  [key: string]: any;
  state: { i: number; ans: Record<number, KcAnswer>; pick: number | null; loaded: boolean } = { i: 0, ans: {}, pick: null, loaded: false };
  n() {
    return Number(this.props.lesson || 1);
  }
  qs() {
    return AE.kc[this.n()] || [];
  }
  componentDidMount() {
    this._off = on(['ae:progress', 'ae:prefs'], () => this.forceUpdate());
    const saved = AE.progress.lesson(this.n()).kc;
    this.setState({ ans: saved?.ans || {}, i: saved?.i || 0, loaded: true });
  }
  componentWillUnmount() {
    this._off();
    this.persist();
  }
  persist() {
    if (!this.state.loaded) return;
    AE.progress.update(this.n(), { kc: { ans: this.state.ans, i: this.state.i } });
  }
  isComplete() {
    const q = this.qs();
    return q.length > 0 && q.every((_, k) => this.state.ans[k] && this.state.ans[k].correct);
  }
  setAns(k: number, patch: KcAnswer, cb?: () => void) {
    this.setState(
      (s) => ({ ans: Object.assign({}, s.ans, { [k]: Object.assign({}, s.ans[k] || {}, patch) }) }),
      () => {
        this.persist();
        cb && cb();
      },
    );
  }
  go(k) {
    this.setState({ i: Math.max(0, Math.min(this.qs().length - 1, k)), pick: null }, () => {
      this.persist();
      const h = document.getElementById('kc-q');
      if (h) {
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      }
    });
  }
  place(item, bin) {
    const k = this.state.i;
    const a: KcAnswer = this.state.ans[k] || {};
    const place: Record<number, number> = Object.assign({}, a.place || {});
    if (bin == null) delete place[item];
    else place[item] = bin;
    this.setState({ pick: null });
    this.setAns(k, { place, checked: false });
  }
  doCheck() {
    const k = this.state.i,
      q = this.qs()[k],
      a: KcAnswer = this.state.ans[k] || {};
    let correct = false;
    if (q.type === 'mcq') correct = a.sel === q.answer;
    else correct = q.items.every((it, j) => a.place && a.place[j] === it.b);
    const wasComplete = this.isComplete();
    this.setAns(k, { checked: true, correct, tries: (a.tries || 0) + 1 }, () => {
      if (!wasComplete && this.isComplete()) {
        const L = AE.lessons[this.n() - 1];
        if (AE.progress.markDone(this.n())) AE.toast('Badge earned: ' + L.badge, 'fa-award');
      }
    });
  }
  renderVals() {
    const qs = this.qs();
    const n = this.n();
    if (!qs.length) return { q: { q: '' }, steps: [], opts: [], tray: [], bins: [], fb: { show: false } };
    const k = Math.min(this.state.i, qs.length - 1),
      q = qs[k],
      a: KcAnswer = this.state.ans[k] || {};
    const steps = qs.map((_, j) => {
      const cur = j === k,
        ok = this.state.ans[j] && this.state.ans[j].correct;
      return {
        n: j + 1,
        go: () => this.go(j),
        cur: cur ? 'step' : undefined,
        label: 'Question ' + (j + 1) + (ok ? ', answered correctly' : '') + (cur ? ', current' : ''),
        bg: cur ? 'var(--accent)' : ok ? 'var(--ok-soft)' : 'var(--surface)',
        ink: cur ? 'var(--accent-ink)' : ok ? 'var(--ok)' : 'var(--muted)',
        line: cur ? 'var(--accent)' : ok ? 'var(--ok)' : 'var(--line)',
        numDisp: ok && !cur ? 'none' : 'inline',
        tickDisp: ok && !cur ? 'inline' : 'none',
      };
    });
    let opts: any[] = [],
      tray: any[] = [],
      bins: any[] = [],
      ready = false;
    const reveal = a.checked && !a.correct && (a.tries || 0) >= 2;
    if (q.type === 'mcq') {
      ready = a.sel != null;
      opts = q.options.map((label, j) => {
        const sel = a.sel === j;
        const good = a.checked && ((sel && a.correct) || (reveal && j === q.answer));
        const bad = a.checked && sel && !a.correct;
        return {
          label,
          checked: sel,
          pick: () => this.setAns(k, { sel: j, checked: false }),
          border: good ? 'var(--ok)' : bad ? 'var(--bad)' : sel ? 'var(--accent)' : 'var(--line)',
          bg: good ? 'var(--ok-soft)' : bad ? 'var(--bad-soft)' : sel ? 'var(--accent-soft)' : 'var(--surface)',
          icon: good ? 'fa-circle-check' : 'fa-circle-xmark',
          iconColor: good ? 'var(--ok)' : 'var(--bad)',
          iconDisp: good || bad ? 'inline' : 'none',
        };
      });
    } else {
      const place = a.place || {};
      const pk = this.state.pick;
      const card = (it, j) => {
        const inBin = place[j] != null;
        const mark = a.checked && inBin;
        const right = mark && place[j] === it.b;
        const picked = pk === j;
        return {
          t: it.t,
          pressed: picked ? 'true' : 'false',
          pick: () => this.setState({ pick: picked ? null : j }),
          drag: (e) => {
            e.dataTransfer.setData('text/plain', String(j));
            this.setState({ pick: j });
          },
          border: picked ? 'var(--accent)' : mark ? (right ? 'var(--ok)' : 'var(--bad)') : 'var(--line)',
          bg: picked ? 'var(--accent-soft)' : mark ? (right ? 'var(--ok-soft)' : 'var(--bad-soft)') : 'var(--surface)',
          icon: mark ? (right ? 'fa-circle-check' : 'fa-circle-xmark') : 'fa-grip-vertical',
          iconColor: mark ? (right ? 'var(--ok)' : 'var(--bad)') : 'var(--muted)',
          aria: it.t + (mark ? (right ? ' — correct' : ' — incorrect') : '') + '. Select to move.',
        };
      };
      tray = q.items.map((it, j) => (place[j] == null ? card(it, j) : null)).filter(Boolean);
      const getIdx = (e) => {
        const v = e.dataTransfer.getData('text/plain');
        return v !== '' ? Number(v) : this.state.pick;
      };
      bins = q.bins.map((name, b) => ({
        name,
        line: pk != null ? 'var(--accent)' : 'var(--line)',
        place: () => {
          if (pk != null) this.place(pk, b);
        },
        drop: (e) => {
          e.preventDefault();
          const j = getIdx(e);
          if (j != null) this.place(j, b);
        },
        cards: q.items.map((it, j) => (place[j] === b ? card(it, j) : null)).filter(Boolean),
      }));
      ready = Object.keys(place).length === q.items.length;
    }
    let fb: any = { show: false };
    if (a.checked) {
      if (a.correct)
        fb = {
          show: true,
          title: 'Correct',
          text: q.explain || 'Every card is in the right group. Well done.',
          icon: 'fa-circle-check',
          color: 'var(--ok)',
          bg: 'var(--ok-soft)',
          line: 'var(--ok)',
        };
      else if (reveal)
        fb = {
          show: true,
          title: 'Not quite — here’s the answer',
          text: q.type === 'mcq' ? q.explain : 'The cards marked with a cross are in the wrong group. Move them and check again.',
          icon: 'fa-lightbulb',
          color: 'var(--warn)',
          bg: 'var(--warn-soft)',
          line: 'var(--warn)',
        };
      else
        fb = {
          show: true,
          title: 'Not quite',
          text:
            q.type === 'mcq'
              ? 'Have another look and try again.'
              : 'Some cards are in the wrong group — they’re marked with a cross. Move them and check again.',
          icon: 'fa-circle-xmark',
          color: 'var(--bad)',
          bg: 'var(--bad-soft)',
          line: 'var(--bad)',
        };
    }
    const L = AE.lessons[n - 1],
      nextL = AE.lessons[n];
    const complete = this.isComplete();
    return {
      intro: qs.length + ' questions. Answer them all correctly to complete the lesson and earn your badge. You can try as many times as you like.',
      q,
      isMcq: q.type === 'mcq',
      isSort: q.type === 'sort',
      opts,
      tray,
      bins,
      trayEmpty: q.type === 'sort' && tray.length === 0,
      radioName: 'kc-' + n + '-' + k,
      steps,
      qLabel: 'Question ' + (k + 1) + ' of ' + qs.length,
      fb,
      noPick: this.state.pick == null,
      placeOp: this.state.pick == null ? 0.45 : 1,
      allowDrop: (e) => e.preventDefault(),
      dropTray: (e) => {
        e.preventDefault();
        const v = e.dataTransfer.getData('text/plain');
        if (v !== '') this.place(Number(v), null);
      },
      atStart: k === 0,
      atEnd: k === qs.length - 1,
      prevOp: k === 0 ? 0.45 : 1,
      nextOp: k === qs.length - 1 ? 0.45 : 1,
      cantCheck: !ready || (a.checked && a.correct),
      checkOp: !ready || (a.checked && a.correct) ? 0.45 : 1,
      prev: () => this.go(k - 1),
      next: () => this.go(k + 1),
      check: () => this.doCheck(),
      complete,
      icon: L.icon,
      completeText: 'You’ve earned the ' + L.badge + ' badge.',
      nextHref: nextL ? nextL.file : 'progress.html',
      nextLabel: nextL ? 'Next lesson' : 'Claim your course badge',
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <section className="py-10 px-0 border-t border-t-line" id="knowledge-check" aria-labelledby="kc-title">
        <div className="flex flex-wrap items-end justify-between gap-[.75rem_1.5rem] mb-5">
          <div>
            <h2 className="text-[1.75rem] mb-[.35rem]" id="kc-title">
              Knowledge check
            </h2>
            <p className="m-0 text-muted">{v.intro}</p>
          </div>
        </div>
        {v.complete ? (
          <>
            <div className="flex gap-[1.1rem] items-center flex-wrap p-5 rounded-[1rem] bg-ok-soft border border-ok mb-4" role="status" data-noread="">
              <span
                className="flex-none w-15 h-15 rounded-[50%] bg-accent text-accent-ink grid place-items-center text-[1.4rem] [box-shadow:0_0_0_4px_var(--surface),0_0_0_6px_var(--accent)]"
                aria-hidden="true"
                data-gamify=""
              >
                <i className={`fa-solid ${v.icon ?? ''}`}></i>
              </span>
              <div className="flex-1 min-w-[12rem]">
                <p className="m-0 font-bold text-[1.125rem]">Lesson complete</p>
                <p className="m-0 text-ink">{v.completeText}</p>
              </div>
              <a
                className="inline-flex items-center gap-2 min-h-11 py-[.6rem] px-[1.1rem] rounded-[.65rem] bg-accent text-accent-ink font-bold no-underline"
                href={v.nextHref}
              >
                {v.nextLabel}
                <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
          </>
        ) : null}
        <div className="bg-surface border border-line rounded-[1.25rem] [box-shadow:var(--shadow)] overflow-hidden">
          <div className="flex items-center justify-between gap-4 py-4 px-5 border-b border-b-line flex-wrap">
            <p className="m-0 font-bold text-[.9375rem] text-muted">{v.qLabel}</p>
            <ol className="list-none m-0 p-0 flex gap-[.4rem]" aria-label="Questions">
              {v.steps?.map((s: any, i: number) => (
                <li key={i}>
                  <button
                    className="w-9 h-9 rounded-[50%] cursor-pointer font-bold text-[.875rem] grid place-items-center [transition:background_.2s,color_.2s]"
                    type="button"
                    onClick={s.go}
                    aria-label={s.label}
                    aria-current={s.cur}
                    style={{ background: s.bg, color: s.ink, border: `2px solid ${s.line ?? ''}` }}
                  >
                    <span style={{ display: s.numDisp }}>{s.n}</span>
                    <i className="fa-solid fa-check" aria-hidden="true" style={{ display: s.tickDisp }}></i>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="py-6 px-5 flex flex-col gap-[1.1rem]">
            {v.q.scenario ? (
              <>
                <div className="flex gap-[.9rem] items-start py-4 px-[1.1rem] rounded-[.875rem] bg-surface-2 border border-dashed border-accent-line">
                  <span className="flex-none w-10 h-10 rounded-[50%] bg-accent-soft text-accent grid place-items-center" aria-hidden="true">
                    <i className="fa-solid fa-user-tie"></i>
                  </span>
                  <div>
                    <p className="mt-0 mx-0 mb-[.15rem] text-[.75rem] font-bold tracking-[.06em] uppercase text-accent-text">Scenario · {v.q.scenario.who}</p>
                    <p className="m-0">{v.q.scenario.text}</p>
                  </div>
                </div>
              </>
            ) : null}
            <h3 className="font-ui text-[1.1875rem] font-bold leading-[1.4]" id="kc-q">
              {v.q.q}
            </h3>
            {v.isMcq ? (
              <>
                <fieldset className="border-0 m-0 p-0 flex flex-col gap-[.55rem]">
                  <legend className="sr-only">{v.q.q}</legend>
                  {v.opts?.map((o: any, i: number) => (
                    <label
                      key={i}
                      className="flex gap-[.8rem] items-start py-[.85rem] px-4 rounded-[.75rem] cursor-pointer [transition:border-color_.15s,background_.15s]"
                      style={{ border: `2px solid ${o.border ?? ''}`, background: o.bg }}
                    >
                      <input
                        className="accent-accent w-[1.15rem] h-[1.15rem] mt-[.2rem] mx-0 mb-0 flex-none"
                        type="radio"
                        name={v.radioName}
                        checked={!!o.checked}
                        onChange={o.pick}
                      />
                      <span className="flex-1">{o.label}</span>
                      <i className={`fa-solid ${o.icon ?? ''} mt-[.2rem]`} aria-hidden="true" style={{ color: o.iconColor, display: o.iconDisp }}></i>
                    </label>
                  ))}
                </fieldset>
              </>
            ) : null}
            {v.isSort ? (
              <>
                <div className="flex flex-col gap-4">
                  <p className="m-0 text-[.9rem] text-muted">
                    <i className="fa-solid fa-hand-pointer" aria-hidden="true"></i> Drag each card into a group — or select a card, then choose “Place here”.
                    Works with keyboard and touch.
                  </p>
                  <div
                    className="flex flex-wrap gap-2 min-h-13 p-3 rounded-[.875rem] border-2 border-dashed border-line bg-surface-2"
                    aria-label="Cards to sort"
                    role="group"
                    onDragOver={v.allowDrop}
                    onDrop={v.dropTray}
                  >
                    {v.tray?.map((c: any, i: number) => (
                      <button
                        key={i}
                        className="inline-flex items-center gap-2 min-h-11 py-2 px-[.85rem] rounded-[.6rem] text-ink font-semibold text-[.9375rem] cursor-grab text-left [box-shadow:0_1px_2px_rgba(0,0,0,.06)]"
                        type="button"
                        draggable="true"
                        onDragStart={c.drag}
                        onClick={c.pick}
                        aria-pressed={c.pressed}
                        style={{ border: `2px solid ${c.border ?? ''}`, background: c.bg }}
                      >
                        <i className="fa-solid fa-grip-vertical text-muted" aria-hidden="true"></i>
                        {c.t}
                      </button>
                    ))}
                    {v.trayEmpty ? (
                      <>
                        <span className="text-muted text-[.9rem] self-center">All cards placed.</span>
                      </>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3">
                    {v.bins?.map((b: any, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 p-[.85rem] rounded-[.875rem] bg-surface min-h-32 [transition:border-color_.15s]"
                        role="group"
                        aria-label={b.name}
                        onDragOver={v.allowDrop}
                        onDrop={b.drop}
                        style={{ border: `2px solid ${b.line ?? ''}` }}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-bold">{b.name}</span>
                          <button
                            className="min-h-9 py-1 px-[.65rem] rounded-[.5rem] border border-accent bg-accent-soft text-accent-text font-bold text-[.8125rem] cursor-pointer"
                            type="button"
                            onClick={b.place}
                            disabled={v.noPick}
                            style={{ opacity: v.placeOp }}
                          >
                            Place here
                          </button>
                        </div>
                        {b.cards?.map((c: any, j: number) => (
                          <button
                            key={j}
                            className="flex items-center gap-2 min-h-11 py-2 px-3 rounded-[.6rem] text-ink font-semibold text-[.9rem] cursor-grab text-left"
                            type="button"
                            draggable="true"
                            onDragStart={c.drag}
                            onClick={c.pick}
                            aria-pressed={c.pressed}
                            aria-label={c.aria}
                            style={{ border: `2px solid ${c.border ?? ''}`, background: c.bg }}
                          >
                            <i className={`fa-solid ${c.icon ?? ''}`} aria-hidden="true" style={{ color: c.iconColor }}></i>
                            <span className="flex-1">{c.t}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            <div className="min-h-0" aria-live="polite">
              {v.fb.show ? (
                <>
                  <div
                    className="flex gap-3 items-start py-4 px-[1.1rem] rounded-[.875rem]"
                    style={{ background: v.fb.bg, border: `1px solid ${v.fb.line ?? ''}` }}
                  >
                    <i className={`fa-solid ${v.fb.icon ?? ''} mt-1 text-[1.1rem]`} aria-hidden="true" style={{ color: v.fb.color }}></i>
                    <div>
                      <p className="m-0 font-bold">{v.fb.title}</p>
                      <p className="m-0">{v.fb.text}</p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 py-4 px-5 border-t border-t-line bg-surface-2 flex-wrap" data-noread="">
            <button
              className="inline-flex items-center gap-2 min-h-11 py-[.55rem] px-4 rounded-[.65rem] border border-line bg-surface text-ink font-bold cursor-pointer"
              type="button"
              onClick={v.prev}
              disabled={v.atStart}
              style={{ opacity: v.prevOp }}
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>Previous
            </button>
            <div className="flex gap-2 flex-wrap">
              <button
                className="inline-flex items-center gap-2 min-h-11 py-[.55rem] px-[1.1rem] rounded-[.65rem] border-0 bg-accent text-accent-ink font-bold cursor-pointer"
                type="button"
                onClick={v.check}
                disabled={v.cantCheck}
                style={{ opacity: v.checkOp }}
              >
                <i className="fa-solid fa-check" aria-hidden="true"></i>Check answer
              </button>
              <button
                className="inline-flex items-center gap-2 min-h-11 py-[.55rem] px-4 rounded-[.65rem] border border-line bg-surface text-ink font-bold cursor-pointer"
                type="button"
                onClick={v.next}
                disabled={v.atEnd}
                style={{ opacity: v.nextOp }}
              >
                Next<i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
