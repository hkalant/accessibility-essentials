import { Component } from 'react';
import { AE } from '../lib/ae';
import { on } from '../lib/events';
import DocPage from '../components/DocPage';

export default class HomePrintPage extends Component<any, any> {
  [key: string]: any;
  componentDidMount() {
    this._off = on('ae:progress', () => this.forceUpdate());
  }
  componentWillUnmount() {
    this._off();
  }
  renderVals() {
    const pr = AE.progress.get(),
      done = AE.progress.doneCount();
    const lessons = AE.lessons.map((l) => {
      const st = pr.lessons[l.n] || {};
      return {
        n: l.n,
        title: l.title,
        mins: l.mins,
        summary: l.summary,
        outcomes: l.outcomes,
        status: st.done ? 'Complete' : st.visited ? 'In progress' : 'Not started',
        statusIcon: st.done ? 'fa-circle-check' : st.visited ? 'fa-circle-half-stroke' : 'fa-circle',
        statusInk: st.done ? 'var(--ok)' : 'var(--muted)',
        dotBg: st.done ? 'var(--ok)' : 'var(--surface)',
        dotInk: st.done ? '#fff' : 'var(--accent)',
        dotLine: st.done ? 'var(--ok)' : 'var(--accent-line)',
        numDisp: st.done ? 'none' : 'inline',
        tickDisp: st.done ? 'inline' : 'none',
        loLabel: 'Learning outcomes (' + l.outcomes.length + ')',
      };
    });
    return { lessons, done, pct: Math.round((done / 6) * 100) + '%', doneText: done + ' of 6 lessons complete' };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <DocPage margin="0.6in">
        <header className="flex flex-col gap-[.9rem] pb-6 border-b border-b-line">
          <p className="m-0 text-[.8125rem] font-extrabold tracking-[.08em] uppercase text-accent-text">CPD TRAINING COURSE FOR ALL STAFF</p>
          <h1 className="m-0 text-[3rem] font-bold tracking-[-.015em] leading-[1.05]">Accessibility Essentials</h1>
          <p className="m-0 text-[1.1875rem] text-muted max-w-[42rem]">
            What the Public Sector Bodies Accessibility Regulations 2018 and the Equality Act 2010 mean for your teaching — and the practical skills to make
            documents, media and Moodle courses that work for every student.
          </p>
          <ul className="list-none mt-1 mx-0 mb-0 p-0 flex flex-wrap gap-2" aria-label="Course details">
            <li className="inline-flex items-center gap-[.45rem] py-[.4rem] px-[.8rem] rounded-full bg-surface-2 border border-line text-[.9rem] font-semibold">
              <i className="fa-regular fa-clock text-accent" aria-hidden="true"></i>90 minutes
            </li>
            <li className="inline-flex items-center gap-[.45rem] py-[.4rem] px-[.8rem] rounded-full bg-surface-2 border border-line text-[.9rem] font-semibold">
              <i className="fa-solid fa-layer-group text-accent" aria-hidden="true"></i>6 lessons
            </li>
            <li className="inline-flex items-center gap-[.45rem] py-[.4rem] px-[.8rem] rounded-full bg-surface-2 border border-line text-[.9rem] font-semibold">
              <i className="fa-solid fa-shield-halved text-accent" aria-hidden="true"></i>Digital badge on completion
            </li>
            <li className="inline-flex items-center gap-[.45rem] py-[.4rem] px-[.8rem] rounded-full bg-surface-2 border border-line text-[.9rem] font-semibold">
              <i className="fa-solid fa-headphones text-accent" aria-hidden="true"></i>Audio version of every lesson
            </li>
          </ul>
          <div className="flex items-center gap-3 max-w-[26rem]">
            <div
              className="flex-1 h-2 rounded-full bg-line overflow-hidden"
              role="progressbar"
              aria-label="Course progress"
              aria-valuemin={0}
              aria-valuemax={6}
              aria-valuenow={v.done}
            >
              <div className="h-full bg-accent rounded-full" style={{ width: v.pct }}></div>
            </div>
            <span className="text-[.9rem] font-bold text-muted whitespace-nowrap">{v.doneText}</span>
          </div>
        </header>
        <section className="mt-8" aria-labelledby="outline-title">
          <h2 className="mt-0 mx-0 mb-[1.1rem] text-[2rem]" id="outline-title">
            Course outline
          </h2>
          <ol className="list-none m-0 p-0 flex flex-col gap-[1px] bg-line border border-line rounded-[1.25rem] overflow-hidden">
            {v.lessons?.map((l: any, i: number) => (
              <li key={i} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 py-[1.15rem] px-[1.4rem] bg-surface [break-inside:avoid]">
                <span
                  className="w-9 h-9 rounded-[50%] grid place-items-center font-display font-bold text-[1rem]"
                  aria-hidden="true"
                  style={{ background: l.dotBg, color: l.dotInk, border: `1.5px solid ${l.dotLine ?? ''}` }}
                >
                  <span style={{ display: l.numDisp }}>{l.n}</span>
                  <i className="fa-solid fa-check text-[.9rem]" style={{ display: l.tickDisp }}></i>
                </span>
                <div className="flex flex-col gap-[.4rem] min-w-0">
                  <div className="min-h-9 flex flex-wrap items-center justify-between gap-[.25rem_1rem]">
                    <h3 className="m-0 text-[1.25rem]">{l.title}</h3>
                    <div className="flex gap-4 items-center text-[.8125rem] font-bold text-muted">
                      <span className="inline-flex gap-[.35rem] items-center">
                        <i className="fa-regular fa-clock" aria-hidden="true"></i>
                        {l.mins} min
                      </span>
                      <span className="inline-flex gap-[.35rem] items-center" style={{ color: l.statusInk }}>
                        <i className={`fa-solid ${l.statusIcon ?? ''}`} aria-hidden="true"></i>
                        {l.status}
                      </span>
                    </div>
                  </div>
                  <p className="m-0 text-muted">{l.summary}</p>
                  <p className="mt-[.35rem] mx-0 mb-0 flex items-center gap-2 font-bold">
                    <i className="fa-solid fa-star text-accent" aria-hidden="true"></i>
                    {l.loLabel}
                  </p>
                  <ul className="list-none m-0 py-0 pr-0 pl-1 flex flex-col gap-[.4rem]">
                    {l.outcomes?.map((o: any, j: number) => (
                      <li key={j} className="flex gap-[.7rem] items-baseline">
                        <span className="flex-none w-2 h-2 rounded-[50%] bg-accent [transform:translateY(-.1rem)]" aria-hidden="true"></span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </DocPage>
    );
  }
}
