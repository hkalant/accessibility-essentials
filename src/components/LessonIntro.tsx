import { Component } from 'react';
import { AE } from '../lib/ae';
import { on } from '../lib/events';

export default class LessonIntro extends Component<any, any> {
  [key: string]: any;
  state = { status: 'idle', i: 0, total: 0 };
  componentDidMount() {
    this._u = () => this.forceUpdate();
    this._t = (e) => this.setState(e.detail);
    this._off = on(['ae:progress', 'ae:prefs'], this._u);
    window.addEventListener('ae:tts', this._t);
    AE.progress.setLast(Number(this.props.lesson || 1));
  }
  componentWillUnmount() {
    this._off();
    window.removeEventListener('ae:tts', this._t);
  }
  renderVals() {
    const n = Number(this.props.lesson || 1);
    const L = AE.lessons[n - 1];
    const done = !!AE.progress.lesson(n).done;
    const { status, i, total } = this.state;
    const sup = AE.tts.supported;
    return {
      crumb: 'Lesson ' + n,
      eyebrow: 'Lesson ' + n + ' of 6',
      mins: L.mins + ' minutes',
      title: L.title,
      summary: L.summary,
      outcomes: L.outcomes,
      icon: L.icon,
      badgeBg: done ? 'var(--accent)' : 'var(--accent-soft)',
      badgeInk: done ? 'var(--accent-ink)' : 'var(--accent)',
      badgeText: done ? 'You earned the ' + L.badge + ' badge' : 'Pass the knowledge check to earn the ' + L.badge + ' badge',
      noTts: !sup,
      idle: status === 'idle',
      playIcon: status === 'playing' ? 'fa-pause' : 'fa-play',
      playLabel: status === 'playing' ? 'Pause audio' : status === 'paused' ? 'Resume audio' : 'Listen to this lesson',
      audioTitle: sup ? 'Listen to this lesson' : 'Audio isn’t available in this browser',
      audioStatus: !sup
        ? 'Try Chrome, Edge or Safari, or use your own screen reader.'
        : status === 'idle'
          ? 'About ' + L.mins + ' minutes · uses your device’s voice · Alt+Shift+L'
          : (status === 'paused' ? 'Paused' : 'Reading') + ' — section ' + (i + 1) + ' of ' + total,
      audioPct: total ? Math.round(((i + 1) / total) * 100) + '%' : '0%',
      playPause: () => AE.tts.toggle(),
      stop: () => AE.tts.stop(),
      back: () => AE.tts.skip(-1),
      fwd: () => AE.tts.skip(1),
      rate: String(AE.prefs.get().ttsRate),
      setRate: (e) => AE.prefs.set({ ttsRate: Number(e.target.value) }),
      print: () => window.print(),
      more: () => AE.openPanel(),
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div>
        <header className="bg-surface border-b border-b-line">
          <div className="max-w-[var(--measure)] my-0 mx-auto pt-8 px-5 pb-7 flex flex-col gap-4">
            <nav className="text-[.875rem]" aria-label="Breadcrumb" data-noread="">
              <ol className="list-none m-0 p-0 flex flex-wrap gap-[.4rem] items-center text-muted">
                <li>
                  <a href="index.html">Accessibility Essentials</a>
                </li>
                <li aria-hidden="true">
                  <i className="fa-solid fa-chevron-right text-[.7rem]"></i>
                </li>
                <li aria-current="page">{v.crumb}</li>
              </ol>
            </nav>
            <div className="flex flex-wrap gap-2 items-center text-[.875rem] font-semibold text-muted">
              <span className="text-accent-text font-bold tracking-[.06em] uppercase text-[.8125rem]">{v.eyebrow}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex gap-[.35rem] items-center">
                <i className="fa-regular fa-clock" aria-hidden="true"></i>
                {v.mins}
              </span>
            </div>
            <h1 className="text-[length:clamp(2rem,1.4rem_+_2.2vw,2.875rem)] font-bold tracking-[-.01em]">{v.title}</h1>
            <p className="m-0 text-[1.1875rem] text-muted max-w-[40rem]">{v.summary}</p>
            <div className="flex items-center gap-[.6rem] text-[.9rem] text-muted" data-gamify="" data-noread="">
              <span
                className="w-8 h-8 rounded-[50%] grid place-items-center text-[.85rem]"
                aria-hidden="true"
                style={{ background: v.badgeBg, color: v.badgeInk }}
              >
                <i className={`fa-solid ${v.icon ?? ''}`}></i>
              </span>
              <span>{v.badgeText}</span>
            </div>
            <div
              className="flex flex-wrap items-center gap-[.75rem_1rem] mt-2 py-3 px-[.9rem] border border-line rounded-[1rem] bg-surface-2"
              data-noread=""
              data-noprint=""
              role="region"
              aria-label="Audio version of this lesson"
            >
              <button
                className="flex-none w-12 h-12 rounded-[50%] border-0 bg-accent text-accent-ink cursor-pointer text-[1.05rem] grid place-items-center"
                type="button"
                onClick={v.playPause}
                disabled={v.noTts}
                aria-label={v.playLabel}
              >
                <i className={`fa-solid ${v.playIcon ?? ''}`} aria-hidden="true"></i>
              </button>
              <div className="[flex:1_1_calc(100%_-_4.5rem)] min-w-0 flex flex-col gap-[.3rem]">
                <span className="font-bold text-[.9375rem]">{v.audioTitle}</span>
                <div className="h-[.3rem] rounded-full bg-line overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-accent [transition:width_.3s]" style={{ width: v.audioPct }}></div>
                </div>
                <span className="text-[.8125rem] text-muted" aria-live="polite">
                  {v.audioStatus}
                </span>
              </div>
              <div className="flex items-center gap-[.35rem]">
                <button
                  className="w-10 h-10 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink"
                  type="button"
                  onClick={v.back}
                  aria-label="Previous paragraph"
                  disabled={v.idle}
                >
                  <i className="fa-solid fa-backward-step" aria-hidden="true"></i>
                </button>
                <button
                  className="w-10 h-10 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink"
                  type="button"
                  onClick={v.fwd}
                  aria-label="Next paragraph"
                  disabled={v.idle}
                >
                  <i className="fa-solid fa-forward-step" aria-hidden="true"></i>
                </button>
                <button
                  className="w-10 h-10 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink"
                  type="button"
                  onClick={v.stop}
                  aria-label="Stop"
                  disabled={v.idle}
                >
                  <i className="fa-solid fa-stop" aria-hidden="true"></i>
                </button>
                <label className="flex items-center gap-[.35rem] text-[.8125rem] font-semibold ml-1">
                  Speed{' '}
                  <select className="min-h-10 rounded-[.6rem] border border-line bg-surface py-0 px-[.4rem]" value={v.rate ?? ''} onChange={v.setRate}>
                    <option value="0.75">0.75×</option>
                    <option value="1">1×</option>
                    <option value="1.25">1.25×</option>
                    <option value="1.5">1.5×</option>
                    <option value="2">2×</option>
                  </select>{' '}
                </label>
              </div>
              <div className="flex gap-[.35rem] flex-wrap">
                <button
                  className="flex items-center gap-[.4rem] min-h-10 py-[.4rem] px-3 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink font-semibold text-[.875rem]"
                  type="button"
                  onClick={v.print}
                >
                  <i className="fa-solid fa-print" aria-hidden="true"></i>Print
                </button>
                <button
                  className="flex items-center gap-[.4rem] min-h-10 py-[.4rem] px-3 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink font-semibold text-[.875rem]"
                  type="button"
                  onClick={v.more}
                >
                  <i className="fa-solid fa-download" aria-hidden="true"></i>Other formats
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-[var(--measure)] my-0 mx-auto pt-8 px-5 pb-0">
          <section className="flex gap-4 items-start pt-5 px-5 pb-[1.1rem] rounded-[1rem] bg-accent-soft border border-accent-line" aria-labelledby="lo-title">
            <span className="flex-none w-10 h-10 rounded-[.75rem] bg-accent text-accent-ink grid place-items-center" aria-hidden="true">
              <i className="fa-solid fa-star"></i>
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="font-ui text-[1.125rem] font-bold mb-[.2rem]" id="lo-title">
                Learning outcomes
              </h2>
              <p className="mt-0 mx-0 mb-[.6rem] text-muted text-[.9375rem]">By the end of this lesson you will be able to:</p>
              <ul className="list-none m-0 p-0 flex flex-col gap-[.45rem]">
                {v.outcomes?.map((o: any, i: number) => (
                  <li key={i} className="flex gap-[.65rem] items-baseline">
                    <span className="flex-none w-2 h-2 rounded-[50%] bg-accent [transform:translateY(-.1rem)]" aria-hidden="true"></span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
