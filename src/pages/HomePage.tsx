import { Component } from 'react';
import { AE } from '../lib/ae';
import { on } from '../lib/events';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

export default class HomePage extends Component<any, any> {
  [key: string]: any;
  state: { open: Record<number, boolean> } = { open: {} };
  componentDidMount() {
    this._off = on('ae:progress', () => this.forceUpdate());
    this._s = () => {
      const hero = document.querySelector('.ae-home-hero');
      const past = hero ? hero.getBoundingClientRect().bottom <= 64 : scrollY > 0;
      document.documentElement.toggleAttribute('data-home-past-hero', past);
    };
    window.addEventListener('scroll', this._s, { passive: true });
    window.addEventListener('resize', this._s);
    this._s();
  }
  componentWillUnmount() {
    this._off();
    window.removeEventListener('scroll', this._s);
    window.removeEventListener('resize', this._s);
    document.documentElement.removeAttribute('data-home-past-hero');
  }
  renderVals() {
    const pr = AE.progress.get(),
      done = AE.progress.doneCount();
    const lessons = AE.lessons.map((l) => {
      const st = pr.lessons[l.n] || {};
      const o = !!this.state.open[l.n];
      return {
        n: l.n,
        file: l.file,
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
        pid: 'lo-' + l.n,
        expanded: o ? 'true' : 'false',
        closed: !o,
        chev: o ? 'rotate(180deg)' : 'none',
        loLabel: 'Learning outcomes (' + l.outcomes.length + ')',
        toggle: () => this.setState((s) => ({ open: Object.assign({}, s.open, { [l.n]: !o }) })),
      };
    });
    let cta: { file: string } = AE.lessons[0],
      label = 'Start the course';
    if (done === 6) {
      cta = { file: 'progress.html' };
      label = 'View your badge';
    } else if (pr.last) {
      const last = pr.last;
      const next =
        AE.lessons.find((l) => !(pr.lessons[l.n] && pr.lessons[l.n].done) && l.n >= last) ||
        AE.lessons.find((l) => !(pr.lessons[l.n] && pr.lessons[l.n].done))!;
      cta = next;
      label = 'Resume: Lesson ' + next.n;
    }
    return { lessons, done, pct: Math.round((done / 6) * 100) + '%', doneText: done + ' of 6 lessons complete', ctaHref: cta.file, ctaLabel: label };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="ae-home min-h-[100vh] flex flex-col">
        <Topbar active="course" />
        <main className="flex-1 [outline:none]" id="main" data-read-root="" tabIndex={-1}>
          <header className="ae-home-hero bg-surface border-b border-b-line">
            <div className="ae-hero-inner max-w-[72rem] my-0 mx-auto pt-14 px-5 pb-12 grid grid-cols-[minmax(0,1fr)] gap-5">
              <p className="m-0 text-[.8125rem] font-extrabold tracking-[.08em] uppercase text-accent-text">CPD TRAINING COURSE FOR ALL STAFF</p>
              <h1 className="text-[length:clamp(2.5rem,1.6rem_+_3.5vw,4.25rem)] font-bold tracking-[-.015em] max-w-[18ch]">Accessibility Essentials</h1>
              <p className="m-0 text-[length:clamp(1.125rem,1rem_+_.4vw,1.3125rem)] text-muted max-w-[42rem]">
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
              <div className="flex flex-wrap gap-[1rem_1.5rem] items-center mt-2">
                <a
                  className="inline-flex items-center gap-[.6rem] min-h-13 py-3 px-[1.4rem] rounded-[.75rem] bg-accent text-accent-ink font-bold text-[1.0625rem] no-underline hover:[filter:brightness(.92)]!"
                  href={v.ctaHref}
                >
                  {v.ctaLabel}
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
                <div className="flex items-center gap-3 min-w-[14rem]" data-gamify="">
                  <div
                    className="flex-1 h-2 rounded-full bg-line overflow-hidden min-w-[8rem]"
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
              </div>
            </div>
          </header>
          <div className="ae-home-body max-w-[72rem] my-0 mx-auto pt-12 px-5 pb-4 flex flex-col gap-12">
            <section aria-labelledby="outline-title">
              <div className="flex justify-between items-baseline gap-4 flex-wrap mb-5">
                <h2 className="text-[2rem]" id="outline-title">
                  Course outline
                </h2>
              </div>
              <ol className="list-none m-0 p-0 flex flex-col gap-[1px] bg-line border border-line rounded-[1.25rem] overflow-hidden">
                {v.lessons?.map((l: any, i: number) => (
                  <li key={i} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 py-5 px-6 bg-surface">
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
                        <h3 className="text-[1.25rem]">
                          <a className="text-ink no-underline hover:text-accent-text! hover:underline!" href={l.file}>
                            {l.title}
                          </a>
                        </h3>
                        <div className="flex gap-4 items-center text-[.8125rem] font-bold text-muted">
                          <span className="inline-flex gap-[.35rem] items-center">
                            <i className="fa-regular fa-clock" aria-hidden="true"></i>
                            {l.mins} min
                          </span>
                          <span className="inline-flex gap-[.35rem] items-center" data-gamify="" style={{ color: l.statusInk }}>
                            <i className={`fa-solid ${l.statusIcon ?? ''}`} aria-hidden="true"></i>
                            {l.status}
                          </span>
                        </div>
                      </div>
                      <p className="m-0 text-muted">{l.summary}</p>
                      <div className="mt-1">
                        <button
                          className="inline-flex items-center gap-[.55rem] min-h-11 py-[.45rem] pr-[.9rem] pl-3 rounded-[.65rem] border border-[#dddddd] bg-transparent text-ink font-bold cursor-pointer"
                          type="button"
                          onClick={l.toggle}
                          aria-expanded={l.expanded}
                          aria-controls={l.pid}
                        >
                          <i className="fa-solid fa-star text-accent" aria-hidden="true"></i>
                          <span>{l.loLabel}</span>
                          <i className="fa-solid fa-chevron-down text-[.8rem] [transition:transform_.25s]" aria-hidden="true" style={{ transform: l.chev }}></i>
                        </button>
                        <ul className="list-none mt-[.85rem] mx-0 mb-0 py-0 pr-0 pl-1 flex flex-col gap-[.45rem]" id={l.pid} hidden={l.closed}>
                          {l.outcomes?.map((o: any, j: number) => (
                            <li key={j} className="flex gap-[.7rem] items-baseline">
                              <span className="flex-none w-2 h-2 rounded-[50%] bg-accent [transform:translateY(-.1rem)]" aria-hidden="true"></span>
                              <span>{o}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
