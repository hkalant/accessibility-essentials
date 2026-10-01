import { Component, createRef } from 'react';
import { AE } from '../lib/ae';
import { on } from '../lib/events';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import LessonIntro from '../components/LessonIntro';
import DosDonts from '../components/DosDonts';
import KnowledgeCheck from '../components/KnowledgeCheck';
import LessonEnd from '../components/LessonEnd';
import Footer from '../components/Footer';

export default class Lesson5 extends Component<any, any> {
  [key: string]: any;
  state: { mt: number; edited: boolean; li: number; cplay: boolean; t: number; playing: boolean; cc: boolean; ad: boolean | null; q: string; math: number } = {
    mt: 0,
    edited: false,
    li: 0,
    cplay: false,
    t: 0,
    playing: false,
    cc: true,
    ad: null,
    q: '',
    math: 0,
  };
  trRef = createRef<HTMLDivElement>();
  CUES: [number, string, number?][] = [
    [0, 'Welcome back. Today: how markets find a price.'],
    [5, 'A slide shows an empty graph. Price is on the vertical axis, quantity on the horizontal.', 1],
    [10, 'Here’s the demand curve — it slopes downwards.'],
    [15, 'As price falls, people buy more.'],
    [20, 'A second line appears, sloping upwards, labelled “Supply”.', 1],
    [24, 'Supply slopes upwards: higher prices bring in more producers.'],
    [29, 'Where the two lines cross is the equilibrium price.'],
    [34, 'The crossing point is circled in red and labelled “P star”.', 1],
    [38, '[Pen tapping] So — at P star, the market clears.'],
    [44, 'Next week, we’ll shift these curves and see what happens.'],
  ];
  componentDidMount() {
    this._off = on('ae:prefs', () => this.forceUpdate());
    this._iv = setInterval(() => {
      if (this.state.playing) {
        const sp = AE.prefs.get().speed;
        const nt = Math.min(50, this.state.t + 0.25 * sp);
        const prevIdx = this.cueAt(this.state.t);
        this.setState({ t: nt, playing: nt < 50 });
        const idx = this.cueAt(nt);
        if (idx !== prevIdx) {
          this.onCue(idx);
        }
      }
    }, 250);
    this._c = setInterval(() => {
      if (this.state.cplay) this.setState((s) => ({ li: s.li < 5 ? s.li + 1 : 5, cplay: s.li < 4 }));
    }, 3200);
  }
  componentWillUnmount() {
    this._off();
    clearInterval(this._iv);
    clearInterval(this._c);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }
  adOn() {
    return this.state.ad != null ? this.state.ad : !!AE.prefs.get().ad;
  }
  cueAt(t) {
    let k = 0;
    this.CUES.forEach((c, i) => {
      if (t >= c[0]) k = i;
    });
    return k;
  }
  onCue(idx) {
    const c = this.CUES[idx];
    if (c[2] && this.adOn() && 'speechSynthesis' in window) {
      this.setState({ playing: false });
      const u = new SpeechSynthesisUtterance(c[1]);
      u.lang = 'en-GB';
      u.rate = AE.prefs.get().speed;
      u.onend = () => this.setState({ playing: true });
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
    const box = this.trRef.current;
    const p = AE.prefs.get();
    if (box && p.transcriptScroll) {
      const li = box.querySelector<HTMLElement>('[data-cue="' + idx + '"]');
      if (li) box.scrollTo({ top: li.offsetTop - box.offsetTop - 40, behavior: AE.prefs.reducedMotion() ? 'auto' : 'smooth' });
    }
  }
  fmt(t) {
    const s = Math.floor(t);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  renderVals() {
    const s = this.state,
      on = (b) => (b ? 'true' : 'false'),
      P = AE.prefs.get();
    const MT = [
      [
        'Captions',
        'fa-closed-captioning',
        'Level A',
        'Synchronised text of all speech and meaningful sounds, like [laughter] or [alarm].',
        'Deaf and hard of hearing students, people watching without sound, non-native speakers, and anyone taking notes.',
        'All pre-recorded video with speech. For live sessions, arrange live captions when a student needs them.',
      ],
      [
        'Subtitles',
        'fa-language',
        'Not a WCAG term',
        'A translation of dialogue into another language. Usually leaves out sound effects.',
        'Viewers who don’t speak the language of the video.',
        'When your video is in another language. Subtitles don’t replace captions.',
      ],
      [
        'Transcripts',
        'fa-file-lines',
        'Level A for audio-only',
        'A full text version of the audio, ideally with key visuals described.',
        'Deafblind braille users, people who prefer reading, and anyone searching for a quote.',
        'All audio-only content, like podcasts. Very helpful alongside video too.',
      ],
      [
        'Audio description',
        'fa-audio-description',
        'Level AA',
        'Extra narration describing important visuals not covered by the speech.',
        'Blind and partially sighted students.',
        'When visuals carry meaning that isn’t spoken. Describing as you teach often removes the need.',
      ],
    ];
    const mtypes = MT.map((m, i) => {
      const sel = i === s.mt;
      return {
        name: m[0],
        icon: m[1],
        level: m[2],
        pressed: on(sel),
        pick: () => this.setState({ mt: i }),
        line: sel ? 'var(--accent)' : 'var(--line)',
        bg: sel ? 'var(--accent-soft)' : 'var(--surface)',
      };
    });
    const L = [
      ["today we're looking at the shrewd injure equation", 'Today we’re looking at the Schrödinger equation.'],
      ['it describes how a quantum state evolves over time', 'It describes how a quantum state evolves over time.'],
      ['when we measure the system it collapses into an I can state', 'When we measure the system, it collapses into an eigenstate.'],
      ['the probability is given by the square of the way function', 'The probability is given by the square of the wave function.'],
      ['any questions so far', '[Students laugh] Right — any questions so far?'],
      ["ah yes plank's constant is H bar", 'Yes — Planck’s constant, h-bar.'],
    ];
    const wrong = (i) => L[i][0].replace(/[^a-z ]/gi, '').toLowerCase() !== L[i][1].replace(/[^a-z ]/gi, '').toLowerCase() && i !== 1;
    const said = L.map((l, i) => {
      const cur = i === s.li,
        bad = wrong(i);
      return {
        t: l[1],
        auto: l[0],
        autoDisp: !s.edited && bad ? 'block' : 'none',
        cur: cur ? 'true' : undefined,
        go: () => this.setState({ li: i, cplay: false }),
        line: cur ? 'var(--accent)' : 'var(--line)',
        bg: cur ? 'var(--accent-soft)' : 'var(--surface)',
        icon: s.edited || !bad ? 'fa-circle-check' : 'fa-triangle-exclamation',
        iconInk: s.edited || !bad ? 'var(--ok)' : 'var(--bad)',
      };
    });
    const errs = L.filter((_, i) => wrong(i)).length;
    const seg = (b) => ({ bg: b ? 'var(--accent)' : 'transparent', ink: b ? 'var(--accent-ink)' : 'var(--ink)' });
    const AU = seg(!s.edited),
      ED = seg(s.edited);
    const idx = this.cueAt(s.t);
    const c = this.CUES[idx];
    const ad = this.adOn();
    const lastSpeech = (() => {
      for (let i = idx; i >= 0; i--) if (!this.CUES[i][2]) return this.CUES[i][1];
      return '';
    })();
    const q = s.q.trim().toLowerCase();
    const cues = this.CUES.map((cu, i) => {
      const isAd = !!cu[2];
      const hit = q && cu[1].toLowerCase().includes(q);
      const cur = i === idx && s.t > 0;
      return {
        i,
        ts: this.fmt(cu[0]),
        t: cu[1],
        cur: cur ? 'true' : undefined,
        go: () => {
          this.setState({ t: cu[0] + 0.01 });
        },
        bg: cur ? 'var(--accent-soft)' : 'transparent',
        op: isAd && !ad ? 0.55 : 1,
        adDisp: isAd ? 'inline' : 'none',
        fs: isAd ? 'italic' : 'normal',
        hitDisp: hit ? 'inline' : 'none',
      };
    });
    const hits = q ? this.CUES.filter((cu) => cu[1].toLowerCase().includes(q)).length : 0;
    const pl = (b) => ({ line: b ? 'var(--accent)' : 'var(--line)', bg: b ? 'var(--accent-soft)' : 'var(--surface)' });
    const CC = pl(s.cc),
      ADp = pl(ad);
    const top = P.capPos === 'top';
    const MM = [
      [
        'As an image',
        'fa-image',
        'A screenshot of the equation pasted into a slide or Moodle page.',
        '“Image. equation dot p n g.”',
        'The equation is lost. Even with alt text, students can’t explore it term by term or zoom it without blurring.',
      ],
      [
        'As MathML (via LaTeX)',
        'fa-square-root-variable',
        'Typed in LaTeX and rendered by MathJax in Moodle, or with Word’s equation editor.',
        '“x equals, fraction, negative b plus or minus, square root of b squared minus 4 a c, end root, over 2 a, end fraction.”',
        'Screen readers can read it aloud and step through each part. It also scales cleanly and can be copied into other tools.',
      ],
    ];
    const mathOpts = MM.map((m, i) => {
      const sel = i === s.math;
      return {
        name: m[0],
        icon: m[1],
        how: m[2],
        pressed: on(sel),
        pick: () => this.setState({ math: i }),
        line: sel ? 'var(--accent)' : 'var(--line)',
        bg: sel ? 'var(--accent-soft)' : 'var(--surface)',
      };
    });
    return {
      mtypes,
      mt: { what: MT[s.mt][3], who: MT[s.mt][4], when: MT[s.mt][5] },
      autoSel: on(!s.edited),
      editSel: on(s.edited),
      autoBg: AU.bg,
      autoInk: AU.ink,
      editBg: ED.bg,
      editInk: ED.ink,
      showAuto: () => this.setState({ edited: false }),
      showEdit: () => this.setState({ edited: true }),
      errText: s.edited ? '0 errors — ready to publish' : errs + ' of 6 lines have errors',
      errInk: s.edited ? 'var(--ok)' : 'var(--bad)',
      capNow: s.edited ? L[s.li][1] : L[s.li][0],
      said,
      capPos: 'Line ' + (s.li + 1) + ' of 6',
      capPrev: () => this.setState({ li: Math.max(0, s.li - 1), cplay: false }),
      capNext: () => this.setState({ li: Math.min(5, s.li + 1), cplay: false }),
      capPlay: () => this.setState({ cplay: !s.cplay, li: !s.cplay && s.li === 5 ? 0 : s.li }),
      capPlayIcon: s.cplay ? 'fa-pause' : 'fa-play',
      capPlayLabel: s.cplay ? 'Pause' : 'Play',
      pCap: s.cc ? lastSpeech : '',
      capOp: s.cc && lastSpeech && (s.t > 0 || s.playing) ? 1 : 0,
      capTop: top ? '6%' : 'auto',
      capBottom: top ? 'auto' : '7%',
      adNow: ad && c[2] && s.t > 0 ? c[1] : '',
      liveText: ad && c[2] && s.t > 0 ? 'Description: ' + c[1] : '',
      demandOp: s.t >= 10 ? 1 : 0,
      supplyOp: s.t >= 20 ? 1 : 0,
      eqOp: s.t >= 34 ? 1 : 0,
      pT: s.t,
      pTime: this.fmt(s.t) + ' / 0:50',
      pPlayIcon: s.playing ? 'fa-pause' : 'fa-play',
      pPlayLabel: s.playing ? 'Pause video' : 'Play video',
      pToggle: () => {
        if ('speechSynthesis' in window) speechSynthesis.cancel();
        this.setState({ playing: !s.playing, t: !s.playing && s.t >= 50 ? 0 : s.t });
      },
      pSeek: (e) => this.setState({ t: Number(e.target.value) }),
      ccSel: on(s.cc),
      ccLine: CC.line,
      ccBg: CC.bg,
      ccToggle: () => this.setState({ cc: !s.cc }),
      adSel: on(ad),
      adLine: ADp.line,
      adBg: ADp.bg,
      adToggle: () => this.setState({ ad: !ad }),
      speed: String(P.speed),
      setSpeed: (e) => AE.prefs.set({ speed: Number(e.target.value) }),
      capSettings: () => AE.openPanel(),
      q: s.q,
      setQ: (e) => this.setState({ q: e.target.value }),
      qInfo: q ? hits + ' line' + (hits === 1 ? '' : 's') + ' match “' + s.q.trim() + '”' : 'Select a line to jump to that point in the video.',
      cues,
      trRef: this.trRef,
      mathOpts,
      hideImg: s.math !== 0,
      hideMml: s.math !== 1,
      srSays: MM[s.math][3],
      mathNote: MM[s.math][4],
      speakMath: () => {
        if (!('speechSynthesis' in window)) return;
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(MM[s.math][3].replace(/[“”]/g, ''));
        u.lang = 'en-GB';
        speechSynthesis.speak(u);
      },
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="min-h-[100vh] flex flex-col" data-lesson="5">
        <Topbar active="course" />
        <div className="ae-lesson-layout flex-1">
          <Sidebar current={5} />
          <main className="min-w-0 [outline:none]" id="main" data-read-root="" tabIndex={-1}>
            <LessonIntro lesson={5} />
            <div className="max-w-[var(--measure)] my-0 mx-auto pt-0 px-5 pb-8">
              <section className="py-10 px-0 mt-8 border-t border-t-line" id="media-types" aria-labelledby="h-media">
                <h2 className="text-[1.75rem] mb-2" id="h-media">
                  Four media alternatives
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Pre-recorded video and audio published after 23 September 2020 is covered by PSBAR. Live media is exempt from PSBAR — but not from the
                  Equality Act. Select each alternative to see who it helps and when you need it.
                </p>
                <div className="ae-4col gap-[.6rem] mb-[.9rem]">
                  {v.mtypes?.map((m: any, i: number) => (
                    <button
                      key={i}
                      className="flex flex-col items-start gap-2 p-4 rounded-[1rem] cursor-pointer text-left text-ink min-h-26"
                      type="button"
                      onClick={m.pick}
                      aria-pressed={m.pressed}
                      style={{ border: `2px solid ${m.line ?? ''}`, background: m.bg }}
                    >
                      <i className={`fa-solid ${m.icon ?? ''} text-[1.3rem] text-accent`} aria-hidden="true"></i>
                      <span className="font-bold text-[1.0625rem]">{m.name}</span>
                      <span className="text-[.8125rem] font-bold text-muted">{m.level}</span>
                    </button>
                  ))}
                </div>
                <div className="ae-3col gap-4 p-5 rounded-[1rem] bg-surface border border-line [box-shadow:var(--shadow)]" aria-live="polite">
                  <div>
                    <p className="mt-0 mx-0 mb-1 text-[.75rem] font-extrabold tracking-[.06em] uppercase text-accent-text">What it is</p>
                    <p className="m-0">{v.mt.what}</p>
                  </div>
                  <div>
                    <p className="mt-0 mx-0 mb-1 text-[.75rem] font-extrabold tracking-[.06em] uppercase text-accent-text">Who it helps</p>
                    <p className="m-0">{v.mt.who}</p>
                  </div>
                  <div>
                    <p className="mt-0 mx-0 mb-1 text-[.75rem] font-extrabold tracking-[.06em] uppercase text-accent-text">When you need it</p>
                    <p className="m-0">{v.mt.when}</p>
                  </div>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="captions" aria-labelledby="h-captions">
                <h2 className="text-[1.75rem] mb-2" id="h-captions">
                  Auto vs edited captions
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Automatic captions are a good start, but they struggle most with exactly the words that matter in your subject. Step through this physics clip
                  with each caption track.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] [box-shadow:var(--shadow)] overflow-hidden">
                  <div className="flex flex-wrap gap-3 items-center justify-between py-4 px-5 border-b border-b-line">
                    <div className="flex p-1 rounded-full bg-surface-2 border border-line" role="radiogroup" aria-label="Caption track">
                      <button
                        className="min-h-10 py-[.4rem] px-4 rounded-full border-0 font-bold cursor-pointer"
                        type="button"
                        role="radio"
                        aria-checked={v.autoSel}
                        onClick={v.showAuto}
                        style={{ background: v.autoBg, color: v.autoInk }}
                      >
                        Automatic
                      </button>
                      <button
                        className="min-h-10 py-[.4rem] px-4 rounded-full border-0 font-bold cursor-pointer"
                        type="button"
                        role="radio"
                        aria-checked={v.editSel}
                        onClick={v.showEdit}
                        style={{ background: v.editBg, color: v.editInk }}
                      >
                        Edited
                      </button>
                    </div>
                    <p className="m-0 font-bold" aria-live="polite" style={{ color: v.errInk }}>
                      {v.errText}
                    </p>
                  </div>
                  <div className="ae-2col gap-0">
                    <div className="p-5 flex flex-col gap-3 border-r border-r-line">
                      <div
                        className="aspect-[16/9] rounded-[.875rem] [background:linear-gradient(160deg,#1f2330,#10121a)] relative overflow-hidden flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <div className="flex flex-col items-center gap-2 text-[#8e96ab]">
                          <i className="fa-solid fa-person-chalkboard text-[3rem]"></i>
                          <span className="text-[.75rem] font-bold tracking-[.08em] uppercase">PHY2101 · Lecture 7</span>
                        </div>
                        <div className="absolute left-[6%] right-[6%] bottom-[8%] flex justify-center">
                          <span className="bg-[rgba(0,0,0,.82)] text-white py-[.3rem] px-[.6rem] rounded-[.3rem] text-[length:clamp(.8rem,1.6vw,1rem)] leading-[1.4] text-center">
                            {v.capNow}
                          </span>
                        </div>
                      </div>
                      <p className="sr-only" aria-live="polite">
                        Caption: {v.capNow}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-11 h-11 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink"
                          type="button"
                          onClick={v.capPrev}
                          aria-label="Previous line"
                        >
                          <i className="fa-solid fa-backward-step" aria-hidden="true"></i>
                        </button>
                        <button
                          className="w-11 h-11 rounded-[50%] border-0 bg-accent text-accent-ink cursor-pointer"
                          type="button"
                          onClick={v.capPlay}
                          aria-label={v.capPlayLabel}
                        >
                          <i className={`fa-solid ${v.capPlayIcon ?? ''}`} aria-hidden="true"></i>
                        </button>
                        <button
                          className="w-11 h-11 rounded-[.6rem] border border-line bg-surface cursor-pointer text-ink"
                          type="button"
                          onClick={v.capNext}
                          aria-label="Next line"
                        >
                          <i className="fa-solid fa-forward-step" aria-hidden="true"></i>
                        </button>
                        <span className="ml-[auto] text-[.875rem] text-muted font-semibold">{v.capPos}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-ui text-[1.0625rem] font-bold mb-3">What was actually said</h3>
                      <ol className="list-none m-0 p-0 flex flex-col gap-[.35rem]">
                        {v.said?.map((l: any, i: number) => (
                          <li key={i}>
                            <button
                              className="w-full text-left flex gap-[.6rem] items-start py-[.55rem] px-[.7rem] rounded-[.6rem] cursor-pointer text-ink text-[.9375rem]"
                              type="button"
                              onClick={l.go}
                              aria-current={l.cur}
                              style={{ border: `1px solid ${l.line ?? ''}`, background: l.bg }}
                            >
                              <i className={`fa-solid ${l.icon ?? ''} mt-1`} aria-hidden="true" style={{ color: l.iconInk }}></i>
                              <span className="flex flex-col gap-[.15rem]">
                                <span>{l.t}</span>
                                <span className="text-[.8125rem] text-bad" style={{ display: l.autoDisp }}>
                                  Auto: “{l.auto}”
                                </span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
                <p className="mt-4 mx-0 mb-0 text-[.9375rem]">
                  Tip: most lecture capture systems let you edit captions in the browser. Add your module’s key terms to the platform’s custom vocabulary if it
                  has one.
                </p>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="player" aria-labelledby="h-player">
                <h2 className="text-[1.75rem] mb-2" id="h-player">
                  An accessible lecture player
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  This clip has edited captions, audio description and a searchable, interactive transcript. Caption size, font and position follow your
                  settings in the Accessibility panel.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] [box-shadow:var(--shadow)] overflow-hidden">
                  <div className="pt-5 px-5 pb-3">
                    <div
                      className="aspect-[16/9] rounded-[.875rem] [background:linear-gradient(160deg,#1c2433,#0f131b)] relative overflow-hidden flex items-center justify-center"
                      role="region"
                      aria-label="Video: Supply and demand, 50 seconds"
                    >
                      <div className="w-[58%] h-[62%] border-l-2 border-l-[#8e96ab] border-b-2 border-b-[#8e96ab] relative" aria-hidden="true">
                        <span className="absolute left-[-1.6rem] top-0 text-[#8e96ab] text-[.75rem] font-bold">P</span>{' '}
                        <span className="absolute right-0 bottom-[-1.3rem] text-[#8e96ab] text-[.75rem] font-bold">Q</span>{' '}
                        <span
                          className="absolute left-[5%] top-[5%] w-[95%] h-[2px] bg-[#6fb3ff] [transform-origin:left_top] [transform:rotate(32deg)] [transition:opacity_.4s]"
                          style={{ opacity: v.demandOp }}
                        ></span>{' '}
                        <span
                          className="absolute left-[5%] bottom-[5%] w-[95%] h-[2px] bg-[#ffb86b] [transform-origin:left_bottom] [transform:rotate(-32deg)] [transition:opacity_.4s]"
                          style={{ opacity: v.supplyOp }}
                        ></span>{' '}
                        <span
                          className="absolute left-[calc(50%_-_.9rem)] top-[calc(50%_-_.9rem)] w-[1.8rem] h-[1.8rem] rounded-[50%] border-2 border-[#ff6b6b] [transition:opacity_.4s]"
                          style={{ opacity: v.eqOp }}
                        ></span>
                      </div>
                      <div className="absolute left-[5%] right-[5%] flex justify-center pointer-events-none" style={{ top: v.capTop, bottom: v.capBottom }}>
                        <span
                          className="[background:var(--cap-bg)] text-white py-[.25em] px-[.6em] rounded-[.25em] [font-family:var(--cap-font)] text-[length:var(--cap-size)] leading-[1.35] text-center"
                          aria-hidden="true"
                          style={{ opacity: v.capOp }}
                        >
                          {v.pCap}
                        </span>
                      </div>
                      {v.adNow ? (
                        <>
                          <div className="absolute left-[4%] top-[4%] max-w-[70%] bg-[rgba(209,3,115,.92)] text-white py-[.4rem] px-[.7rem] rounded-[.5rem] text-[.8125rem] leading-[1.4]">
                            <i className="fa-solid fa-audio-description" aria-hidden="true"></i> {v.adNow}
                          </div>
                        </>
                      ) : null}
                      <p className="sr-only" aria-live="polite">
                        {v.liveText}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-[.6rem] mt-3">
                      <button
                        className="w-12 h-12 rounded-[50%] border-0 bg-accent text-accent-ink cursor-pointer text-[1.05rem]"
                        type="button"
                        onClick={v.pToggle}
                        aria-label={v.pPlayLabel}
                      >
                        <i className={`fa-solid ${v.pPlayIcon ?? ''}`} aria-hidden="true"></i>
                      </button>
                      <input
                        className="[flex:1_1_10rem] accent-accent"
                        type="range"
                        min="0"
                        max="50"
                        step="0.5"
                        value={v.pT ?? ''}
                        onChange={v.pSeek}
                        aria-label="Seek"
                        aria-valuetext={v.pTime}
                      />
                      <span className="tabular-nums text-[.875rem] font-semibold min-w-[5.5rem]">{v.pTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-[.6rem]">
                      <button
                        className="inline-flex items-center gap-[.4rem] min-h-10 py-[.4rem] px-[.8rem] rounded-[.6rem] font-bold text-[.875rem] cursor-pointer text-ink"
                        type="button"
                        role="switch"
                        aria-checked={v.ccSel}
                        onClick={v.ccToggle}
                        style={{ border: `1px solid ${v.ccLine ?? ''}`, background: v.ccBg }}
                      >
                        <i className="fa-solid fa-closed-captioning" aria-hidden="true"></i>Captions
                      </button>
                      <button
                        className="inline-flex items-center gap-[.4rem] min-h-10 py-[.4rem] px-[.8rem] rounded-[.6rem] font-bold text-[.875rem] cursor-pointer text-ink"
                        type="button"
                        role="switch"
                        aria-checked={v.adSel}
                        onClick={v.adToggle}
                        style={{ border: `1px solid ${v.adLine ?? ''}`, background: v.adBg }}
                      >
                        <i className="fa-solid fa-audio-description" aria-hidden="true"></i>Audio description
                      </button>
                      <label className="inline-flex items-center gap-[.4rem] font-bold text-[.875rem]">
                        Speed{' '}
                        <select className="min-h-10 rounded-[.6rem] border border-line bg-surface py-0 px-[.4rem]" value={v.speed ?? ''} onChange={v.setSpeed}>
                          <option value="0.75">0.75×</option>
                          <option value="1">1×</option>
                          <option value="1.25">1.25×</option>
                          <option value="1.5">1.5×</option>
                          <option value="2">2×</option>
                        </select>{' '}
                      </label>
                      <button
                        className="inline-flex items-center gap-[.4rem] min-h-10 py-[.4rem] px-[.8rem] rounded-[.6rem] border border-line bg-surface font-bold text-[.875rem] cursor-pointer text-ink"
                        type="button"
                        onClick={v.capSettings}
                      >
                        <i className="fa-solid fa-sliders" aria-hidden="true"></i>Caption style
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-t-line pt-4 px-5 pb-5">
                    <div className="flex flex-wrap gap-3 items-center justify-between mb-[.6rem]">
                      <h3 className="font-ui text-[1.0625rem] font-bold">Interactive transcript</h3>
                      <label className="flex items-center gap-2 [flex:0_1_16rem]">
                        <span className="sr-only">Search transcript</span>
                        <i className="fa-solid fa-magnifying-glass text-muted" aria-hidden="true"></i>
                        <input
                          className="w-full min-h-10 py-0 px-[.7rem] rounded-[.6rem] border border-line bg-surface"
                          type="search"
                          value={v.q ?? ''}
                          onChange={v.setQ}
                          placeholder="Search transcript"
                        />
                      </label>
                    </div>
                    <p className="mt-0 mx-0 mb-2 text-[.8125rem] text-muted" aria-live="polite">
                      {v.qInfo}
                    </p>
                    <ol className="list-none m-0 p-0 max-h-[15rem] overflow-y-auto flex flex-col gap-[.2rem] rounded-[.6rem]" ref={v.trRef}>
                      {v.cues?.map((c: any, i: number) => (
                        <li key={i} data-cue={c.i}>
                          <button
                            className="w-full text-left flex gap-3 py-[.45rem] px-[.6rem] rounded-[.5rem] border-0 cursor-pointer text-ink text-[.9375rem]"
                            type="button"
                            onClick={c.go}
                            aria-current={c.cur}
                            style={{ background: c.bg, opacity: c.op }}
                          >
                            <span className="tabular-nums text-muted text-[.8125rem] min-w-[2.5rem] pt-[.1rem]">{c.ts}</span>
                            <span style={{ fontStyle: c.fs }}>
                              <strong className="text-accent-text" style={{ display: c.adDisp }}>
                                Description:{' '}
                              </strong>
                              {c.t}
                              <mark className="bg-accent text-white rounded-[.2rem] py-0 px-1 ml-[.4rem] text-[.75rem]" style={{ display: c.hitDisp }}>
                                match
                              </mark>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="maths" aria-labelledby="h-maths">
                <h2 className="text-[1.75rem] mb-2" id="h-maths">
                  Accessible maths & STEM
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  An equation pasted as a picture is a dead end for screen readers, magnifiers and text-to-speech. Choose a version and listen to what a screen
                  reader announces.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] [box-shadow:var(--shadow)] overflow-hidden">
                  <div className="ae-2col gap-0">
                    <div className="p-5 flex flex-col gap-3 border-r border-r-line">
                      {v.mathOpts?.map((m: any, i: number) => (
                        <button
                          key={i}
                          className="flex flex-col gap-[.6rem] p-4 rounded-[.875rem] cursor-pointer text-left text-ink"
                          type="button"
                          onClick={m.pick}
                          aria-pressed={m.pressed}
                          style={{ border: `2px solid ${m.line ?? ''}`, background: m.bg }}
                        >
                          <span className="font-bold flex items-center gap-2">
                            <i className={`fa-solid ${m.icon ?? ''} text-accent`} aria-hidden="true"></i>
                            {m.name}
                          </span>
                          <span className="text-[.8125rem] text-muted">{m.how}</span>
                        </button>
                      ))}
                      <div className="p-4 rounded-[.875rem] bg-white text-[#111] border border-line flex justify-center min-h-20 items-center">
                        <div
                          className="[filter:blur(.35px)] [image-rendering:pixelated] text-[1.35rem] tracking-[.02em] relative"
                          hidden={v.hideImg}
                          aria-hidden="true"
                          style={{ fontFamily: "'Times New Roman',serif" }}
                        >
                          <math display="block">
                            <mi>x</mi>
                            <mo>=</mo>
                            <mfrac>
                              <mrow>
                                <mo>−</mo>
                                <mi>b</mi>
                                <mo>±</mo>
                                <msqrt>
                                  <msup>
                                    <mi>b</mi>
                                    <mn>2</mn>
                                  </msup>
                                  <mo>−</mo>
                                  <mn>4</mn>
                                  <mi>a</mi>
                                  <mi>c</mi>
                                </msqrt>
                              </mrow>
                              <mrow>
                                <mn>2</mn>
                                <mi>a</mi>
                              </mrow>
                            </mfrac>
                          </math>{' '}
                          <span className="absolute right-[-.5rem] bottom-[-1rem] [font-family:ui-monospace,monospace] text-[.625rem] text-[#888]">
                            equation.png
                          </span>
                        </div>
                        <div className="text-[1.35rem]" hidden={v.hideMml}>
                          <math display="block" aria-label="x equals negative b plus or minus the square root of b squared minus 4 a c, all over 2 a">
                            <mi>x</mi>
                            <mo>=</mo>
                            <mfrac>
                              <mrow>
                                <mo>−</mo>
                                <mi>b</mi>
                                <mo>±</mo>
                                <msqrt>
                                  <msup>
                                    <mi>b</mi>
                                    <mn>2</mn>
                                  </msup>
                                  <mo>−</mo>
                                  <mn>4</mn>
                                  <mi>a</mi>
                                  <mi>c</mi>
                                </msqrt>
                              </mrow>
                              <mrow>
                                <mn>2</mn>
                                <mi>a</mi>
                              </mrow>
                            </mfrac>
                          </math>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="font-ui text-[1.0625rem] font-bold">
                        <i className="fa-solid fa-volume-high text-accent" aria-hidden="true"></i> What a screen reader says
                      </h3>
                      <p
                        className="m-0 p-4 rounded-[.75rem] bg-ink text-surface [font-family:ui-monospace,Menlo,monospace] text-[.9375rem] leading-[1.6]"
                        aria-live="polite"
                      >
                        {v.srSays}
                      </p>
                      <button
                        className="self-start inline-flex items-center gap-2 min-h-11 py-2 px-4 rounded-[.65rem] border-0 bg-accent text-accent-ink font-bold cursor-pointer"
                        type="button"
                        onClick={v.speakMath}
                      >
                        <i className="fa-solid fa-play" aria-hidden="true"></i>Hear it
                      </button>
                      <p className="m-0 text-[.9375rem]">{v.mathNote}</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-ui text-[1.1875rem] font-bold mt-8 mx-0 mb-3">Quick wins for STEM content</h3>
                <ul className="ae-2col list-none m-0 p-0 gap-[.6rem]">
                  <li className="flex gap-3 py-[.9rem] px-4 rounded-[.875rem] bg-surface border border-line">
                    <i className="fa-solid fa-square-root-variable text-accent mt-1" aria-hidden="true"></i>
                    <span>
                      <strong>Moodle:</strong> write maths in LaTeX between <code>\( … \)</code> and let the MathJax filter render it.
                    </span>
                  </li>
                  <li className="flex gap-3 py-[.9rem] px-4 rounded-[.875rem] bg-surface border border-line">
                    <i className="fa-solid fa-file-word text-accent mt-1" aria-hidden="true"></i>
                    <span>
                      <strong>Word:</strong> use Insert › Equation, not images. Equations stay editable and readable.
                    </span>
                  </li>
                  <li className="flex gap-3 py-[.9rem] px-4 rounded-[.875rem] bg-surface border border-line">
                    <i className="fa-solid fa-table text-accent mt-1" aria-hidden="true"></i>
                    <span>
                      <strong>Graphs:</strong> provide the data as a table and state the trend in words.
                    </span>
                  </li>
                  <li className="flex gap-3 py-[.9rem] px-4 rounded-[.875rem] bg-surface border border-line">
                    <i className="fa-solid fa-code text-accent mt-1" aria-hidden="true"></i>
                    <span>
                      <strong>Code:</strong> share it as text in a code block, never as a screenshot.
                    </span>
                  </li>
                  <li className="flex gap-3 py-[.9rem] px-4 rounded-[.875rem] bg-surface border border-line">
                    <i className="fa-solid fa-comment text-accent mt-1" aria-hidden="true"></i>
                    <span>
                      <strong>In lectures:</strong> say equations aloud as you write them — “x equals minus b, plus or minus…”.
                    </span>
                  </li>
                  <li className="flex gap-3 py-[.9rem] px-4 rounded-[.875rem] bg-surface border border-line">
                    <i className="fa-solid fa-atom text-accent mt-1" aria-hidden="true"></i>
                    <span>
                      <strong>Chemistry:</strong> give structures a name or formula in the alt text, and a description of key features.
                    </span>
                  </li>
                </ul>
              </section>
              <DosDonts lesson={5} />
              <KnowledgeCheck lesson={5} />
              <LessonEnd lesson={5} />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}
