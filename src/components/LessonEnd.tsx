import { Component } from 'react';
import { AE } from '../lib/ae';
import { on } from '../lib/events';

export default class LessonEnd extends Component<any, any> {
  [key: string]: any;
  componentDidMount() {
    this._off = on('ae:progress', () => this.forceUpdate());
  }
  componentWillUnmount() {
    this._off();
  }
  renderVals() {
    const n = Number(this.props.lesson || 1);
    const P = AE.lessons[n - 2],
      N = AE.lessons[n],
      R = AE.resources[n];
    const ticks = AE.progress.lesson(n).checklist || {};
    const checklist = R.checklist.map((t, i) => {
      const on = !!ticks[i];
      return {
        t,
        on,
        bg: on ? 'var(--ok-soft)' : 'transparent',
        deco: 'none',
        color: 'var(--ink)',
        toggle: () => {
          const c = Object.assign({}, ticks, { [i]: !on });
          AE.progress.update(n, { checklist: c });
        },
      };
    });
    const done = checklist.filter((c) => c.on).length;
    return {
      prevHref: P ? P.file : 'index.html',
      prevKicker: P ? 'Previous · Lesson ' + P.n : 'Back to',
      prevTitle: P ? P.title : 'Course outline',
      nextHref: N ? N.file : 'progress.html',
      nextKicker: N ? 'Next · Lesson ' + N.n : 'Finish',
      nextTitle: N ? N.title : 'Your course badge',
      links: R.links,
      checklist,
      count: done + ' of ' + checklist.length + ' done',
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div>
        <nav className="py-8 px-0 border-t border-t-line" aria-label="Lesson navigation" data-noread="">
          <div className="ae-2col gap-4">
            <a
              className="flex items-center gap-4 py-[1.1rem] px-5 rounded-[1rem] bg-surface border border-line no-underline text-ink [box-shadow:var(--shadow)] hover:border-accent!"
              href={v.prevHref}
            >
              <i className="fa-solid fa-arrow-left text-accent text-[1.1rem]" aria-hidden="true"></i>
              <span className="flex flex-col min-w-0">
                <span className="text-[.8125rem] font-bold text-muted uppercase tracking-[.05em]">{v.prevKicker}</span>
                <span className="font-bold text-[1.0625rem]">{v.prevTitle}</span>
              </span>
            </a>
            <a
              className="flex items-center justify-end gap-4 py-[1.1rem] px-5 rounded-[1rem] bg-surface border border-line no-underline text-ink [box-shadow:var(--shadow)] text-right hover:border-accent!"
              href={v.nextHref}
            >
              <span className="flex flex-col min-w-0">
                <span className="text-[.8125rem] font-bold text-muted uppercase tracking-[.05em]">{v.nextKicker}</span>
                <span className="font-bold text-[1.0625rem]">{v.nextTitle}</span>
              </span>
              <i className="fa-solid fa-arrow-right text-accent text-[1.1rem]" aria-hidden="true"></i>
            </a>
          </div>
        </nav>
        <section className="pt-10 px-0 pb-4 border-t border-t-line" id="resources" aria-labelledby="res-title">
          <h2 className="text-[1.75rem] mb-5" id="res-title">
            Resources & checklist
          </h2>
          <div className="ae-2col gap-5 [align-items:start]">
            <div className="bg-surface border border-line rounded-[1rem] p-5">
              <h3 className="font-ui text-[1.0625rem] font-bold mb-3 flex gap-2 items-center">
                <i className="fa-solid fa-link text-accent" aria-hidden="true"></i>Further reading
              </h3>
              <ul className="list-none m-0 p-0 flex flex-col gap-[.85rem]">
                {v.links?.map((l: any, i: number) => (
                  <li key={i} className="flex flex-col gap-[.1rem]">
                    <a className="font-semibold" href={l.u} target="_blank" rel="noopener">
                      {l.t}
                      <span className="sr-only"> (opens in a new tab)</span>{' '}
                      <i className="fa-solid fa-arrow-up-right-from-square text-[.75em]" aria-hidden="true"></i>
                    </a>
                    <span className="text-[.875rem] text-muted">{l.d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface border border-line rounded-[1rem] p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="font-ui text-[1.0625rem] font-bold flex gap-2 items-center">
                  <i className="fa-solid fa-list-check text-accent" aria-hidden="true"></i>Put it into practice
                </h3>
                <span className="text-[.8125rem] font-bold text-muted" aria-live="polite">
                  {v.count}
                </span>
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-[.35rem]">
                {v.checklist?.map((c: any, i: number) => (
                  <li key={i}>
                    <label className="flex gap-3 items-start py-[.55rem] px-[.6rem] rounded-[.6rem] cursor-pointer" style={{ background: c.bg }}>
                      <input
                        className="accent-accent w-[1.15rem] h-[1.15rem] mt-[.2rem] mx-0 mb-0 flex-none"
                        type="checkbox"
                        checked={!!c.on}
                        onChange={c.toggle}
                      />
                      <span style={{ textDecoration: c.deco, color: c.color }}>{c.t}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <p className="mt-3 mx-0 mb-0 text-[.8125rem] text-muted">Your ticks are saved on this device. Print this page for an offline copy.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
