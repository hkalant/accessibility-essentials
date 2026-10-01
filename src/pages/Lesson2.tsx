import { Component } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import LessonIntro from '../components/LessonIntro';
import DosDonts from '../components/DosDonts';
import KnowledgeCheck from '../components/KnowledgeCheck';
import LessonEnd from '../components/LessonEnd';
import Footer from '../components/Footer';

export default class Lesson2 extends Component<any, any> {
  [key: string]: any;
  state = { part: 2, open: {}, guess: {}, teach: true, targets: false };
  renderVals() {
    const s = this.state,
      on = (b) => (b ? 'true' : 'false');
    const A = [
      [
        'Principle',
        '1 Perceivable',
        'The top layer. Every criterion belongs to one of four principles — here, Perceivable: can people take in the information?',
      ],
      [
        'Guideline',
        '1.4 Distinguishable',
        'Guidelines group related criteria under a goal. 1.4 is about making it easy to see and hear content, including separating foreground from background.',
      ],
      [
        'Success criterion',
        '1.4.3 Contrast (Minimum)',
        'The testable requirement: text must have a contrast ratio of at least 4.5:1 (3:1 for large text). This is what an auditor actually checks.',
      ],
      ['Level', 'AA', 'Each criterion has a level. 1.4.3 is AA, so it is required for UK public sector content. Lesson 4 lets you test contrast yourself.'],
    ];
    const anatomy = A.map((a, i) => {
      const sel = i === s.part;
      return {
        kind: a[0],
        label: a[1],
        pressed: on(sel),
        pick: () => this.setState({ part: i }),
        line: sel ? 'var(--accent)' : 'var(--line)',
        bg: sel ? 'var(--accent)' : 'var(--surface-2)',
        ink: sel ? 'var(--accent-ink)' : 'var(--ink)',
      };
    });
    const P = [
      [
        'P',
        'Perceivable',
        'Can everyone take in the content?',
        'Information can’t be invisible to all of someone’s senses.',
        ['Alt text on diagrams and photos', 'Edited captions on lecture recordings', 'Text colours with enough contrast'],
      ],
      [
        'O',
        'Operable',
        'Can everyone use it?',
        'Interfaces must work by keyboard, give enough time and avoid harm.',
        ['Quizzes that work with a keyboard', 'Extra time available on timed activities', 'No content that flashes more than three times a second'],
      ],
      [
        'U',
        'Understandable',
        'Can everyone make sense of it?',
        'Content and navigation are clear, consistent and predictable.',
        ['Plain-language assessment briefs', 'The same Moodle structure each week', 'Clear instructions and helpful error messages'],
      ],
      [
        'R',
        'Robust',
        'Does it work with everyone’s tools?',
        'Content works with current and future browsers and assistive technology.',
        ['Using Moodle’s built-in tools, not hacked HTML', 'Tagged PDFs rather than scans', 'Standard file formats students can open'],
      ],
    ];
    const pour = P.map((p, i) => {
      const o = !!s.open[i];
      return {
        letter: p[0],
        name: p[1],
        means: p[2],
        detail: p[3],
        ex: p[4],
        pid: 'pour-ex-' + i,
        expanded: on(o),
        closed: !o,
        chev: o ? 'fa-chevron-up' : 'fa-chevron-down',
        line: o ? 'var(--accent)' : 'var(--line)',
        toggle: () => this.setState((x) => ({ open: Object.assign({}, x.open, { [i]: !o }) })),
      };
    });
    const G = [
      ['1.1.1', 'Non-text content', 'A'],
      ['1.2.2', 'Captions (Prerecorded)', 'A'],
      ['1.4.3', 'Contrast (Minimum)', 'AA'],
      ['1.2.5', 'Audio Description (Prerecorded)', 'AA'],
      ['1.4.4', 'Resize Text', 'AA'],
      ['1.2.6', 'Sign Language (Prerecorded)', 'AAA'],
      ['1.4.6', 'Contrast (Enhanced)', 'AAA'],
    ];
    let right = 0,
      done = 0;
    const guesses = G.map((g, i) => {
      const pk = s.guess[i];
      const has = pk != null;
      const ok = pk === g[2];
      if (has) {
        done++;
        if (ok) right++;
      }
      return {
        sc: g[0],
        name: g[1],
        aria: 'Level for ' + g[0] + ' ' + g[1],
        bg: has ? (ok ? 'var(--ok-soft)' : 'var(--bad-soft)') : 'var(--surface-2)',
        line: has ? (ok ? 'var(--ok)' : 'var(--bad)') : 'var(--line)',
        noFb: !has,
        fbInk: ok ? 'var(--ok)' : 'var(--bad)',
        fb: has ? (ok ? 'Correct — level ' + g[2] + '.' : 'Not quite — it’s level ' + g[2] + '.') : '',
        opts: ['A', 'AA', 'AAA'].map((l) => ({
          l,
          pressed: on(pk === l),
          pick: () => this.setState((x) => ({ guess: Object.assign({}, x.guess, { [i]: l }) })),
          line: pk === l ? 'var(--accent)' : 'var(--line)',
          bg: pk === l ? 'var(--accent)' : 'var(--surface)',
          ink: pk === l ? 'var(--accent-ink)' : 'var(--ink)',
        })),
      };
    });
    const N = [
      ['2.4.11', 'Focus Not Obscured (Minimum)', 'AA', 'The keyboard focus mustn’t be completely hidden behind sticky headers, banners or chat widgets.', 1],
      ['2.4.12', 'Focus Not Obscured (Enhanced)', 'AAA', 'No part of the focused element is hidden.', 0],
      ['2.4.13', 'Focus Appearance', 'AAA', 'Focus indicators must be large and contrasting enough to see.', 0],
      ['2.5.7', 'Dragging Movements', 'AA', 'Anything done by dragging — like drag-and-drop quizzes — needs a single-click alternative.', 1],
      ['2.5.8', 'Target Size (Minimum)', 'AA', 'Clickable targets should be at least 24 × 24 CSS pixels, or well spaced.', 1],
      ['3.2.6', 'Consistent Help', 'A', 'Help links and contact details appear in the same place on every page.', 1],
      ['3.3.7', 'Redundant Entry', 'A', 'Don’t make people re-type information they’ve already given in the same process.', 1],
      ['3.3.8', 'Accessible Authentication (Minimum)', 'AA', 'Logging in mustn’t depend on memory puzzles; allow paste and password managers.', 1],
      ['3.3.9', 'Accessible Authentication (Enhanced)', 'AAA', 'Stricter: no object or image recognition tests either.', 0],
    ];
    const newSc = N.filter((n) => !s.teach || n[4]).map((n) => ({ sc: n[0], name: n[1], level: n[2], what: n[3] }));
    const pill = (sel) => ({ line: sel ? 'var(--accent)' : 'var(--line)', bg: sel ? 'var(--accent-soft)' : 'var(--surface)' });
    const T = pill(s.teach),
      AL = pill(!s.teach);
    return {
      anatomy,
      anatomyText: A[s.part][2],
      pour,
      guesses,
      guessScore: done ? right + ' of ' + done + ' correct' : '',
      newSc,
      teachSel: on(s.teach),
      allSel: on(!s.teach),
      teachLine: T.line,
      teachBg: T.bg,
      allLine: AL.line,
      allBg: AL.bg,
      showTeach: () => this.setState({ teach: true }),
      showAll: () => this.setState({ teach: false }),
      tiny: ['fa-pen', 'fa-trash', 'fa-share', 'fa-copy', 'fa-flag'],
      outlineBad: s.targets ? '2px solid var(--bad)' : '0 solid transparent',
      outlineOk: s.targets ? '2px solid var(--ok)' : '0 solid transparent',
      targetsSel: on(s.targets),
      targetsLabel: s.targets ? 'Hide hit areas' : 'Show hit areas',
      toggleTargets: () => this.setState({ targets: !s.targets }),
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="min-h-[100vh] flex flex-col" data-lesson="2">
        <Topbar active="course" />
        <div className="ae-lesson-layout flex-1">
          <Sidebar current={2} />
          <main className="min-w-0 [outline:none]" id="main" data-read-root="" tabIndex={-1}>
            <LessonIntro lesson={2} />
            <div className="max-w-[var(--measure)] my-0 mx-auto pt-0 px-5 pb-8">
              <section className="py-10 px-0 mt-8 border-t border-t-line" id="what-is-wcag" aria-labelledby="h-wcag">
                <h2 className="text-[1.75rem] mb-2" id="h-wcag">
                  What is WCAG 2.2?
                </h2>
                <p className="mt-0 mx-0 mb-4 text-[1.0625rem]">
                  The <strong>Web Content Accessibility Guidelines</strong> are published by the W3C, the international body for web standards. Version 2.2 was
                  published in October 2023. PSBAR 2018 points to WCAG level AA, so it’s the yardstick for your Moodle pages, documents and media.
                </p>
                <p className="mt-0 mx-0 mb-5">WCAG is built in layers. Select each part of this real success criterion to see how it fits together.</p>
                <div className="bg-surface border border-line rounded-[1.25rem] p-5 [box-shadow:var(--shadow)]">
                  <div className="flex flex-wrap gap-2 items-stretch" role="group" aria-label="Anatomy of a success criterion">
                    {v.anatomy?.map((a: any, i: number) => (
                      <button
                        key={i}
                        className="[flex:1_1_9rem] flex flex-col items-start gap-[.15rem] py-3 px-[.9rem] rounded-[.75rem] cursor-pointer text-left"
                        type="button"
                        onClick={a.pick}
                        aria-pressed={a.pressed}
                        style={{ border: `2px solid ${a.line ?? ''}`, background: a.bg, color: a.ink }}
                      >
                        <span className="text-[.75rem] font-bold uppercase tracking-[.06em] opacity-[.9]">{a.kind}</span>
                        <span className="font-extrabold text-[1.0625rem]">{a.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 mx-0 mb-0 p-4 rounded-[.75rem] bg-surface-2" aria-live="polite">
                    {v.anatomyText}
                  </p>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="pour" aria-labelledby="h-pour">
                <h2 className="text-[1.75rem] mb-2" id="h-pour">
                  The POUR principles
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Every WCAG criterion sits under one of four principles. If you remember nothing else, remember POUR — it works as a quick check on any piece
                  of teaching content.
                </p>
                <div className="ae-4col gap-[.9rem] [align-items:start]">
                  {v.pour?.map((p: any, i: number) => (
                    <article
                      key={i}
                      className="flex flex-col gap-3 py-5 px-[1.1rem] rounded-[1.25rem] bg-surface [box-shadow:var(--shadow)] [transition:border-color_.2s]"
                      style={{ border: `1px solid ${p.line ?? ''}` }}
                    >
                      <span
                        className="w-14 h-14 rounded-[1rem] bg-accent text-accent-ink grid place-items-center font-display text-[2rem] font-bold"
                        aria-hidden="true"
                      >
                        {p.letter}
                      </span>
                      <h3 className="text-[1.375rem]">{p.name}</h3>
                      <p className="m-0 font-semibold">{p.means}</p>
                      <p className="m-0 text-[.9375rem] text-muted">{p.detail}</p>
                      <button
                        className="flex items-center justify-between gap-2 min-h-10 py-[.4rem] px-[.7rem] rounded-[.6rem] border border-accent-line bg-accent-soft text-accent-text font-bold text-[.875rem] cursor-pointer"
                        type="button"
                        onClick={p.toggle}
                        aria-expanded={p.expanded}
                        aria-controls={p.pid}
                      >
                        In your teaching<i className={`fa-solid ${p.chev ?? ''}`} aria-hidden="true"></i>
                      </button>
                      <ul className="m-0 pl-[1.1rem] text-[.9375rem] flex flex-col gap-[.35rem]" id={p.pid} hidden={p.closed}>
                        {p.ex?.map((e: any, j: number) => (
                          <li key={j}>{e}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="levels" aria-labelledby="h-levels">
                <h2 className="text-[1.75rem] mb-2" id="h-levels">
                  Conformance levels
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Success criteria are graded A, AA or AAA. Levels are cumulative: to meet AA you must meet every A criterion too.
                </p>
                <div className="ae-3col gap-[.9rem]">
                  <article className="flex flex-col gap-[.6rem] p-5 rounded-[1.25rem] bg-surface border border-line">
                    <span className="font-display text-[2.25rem] font-bold text-accent">A</span>
                    <h3 className="font-ui text-[1.125rem] font-bold">Essential</h3>
                    <p className="m-0">Without these, some people can’t use the content at all.</p>
                    <ul className="m-0 pl-[1.1rem] text-[.9375rem] text-muted flex flex-col gap-1">
                      <li>Alt text for images</li>
                      <li>Captions on recorded video</li>
                      <li>Everything works by keyboard</li>
                    </ul>
                  </article>
                  <article className="flex flex-col gap-[.6rem] p-5 rounded-[1.25rem] bg-surface border-2 border-accent [box-shadow:var(--shadow)] relative">
                    <span className="absolute top-4 right-4 text-[.75rem] font-extrabold tracking-[.05em] uppercase bg-accent text-accent-ink py-1 px-[.6rem] rounded-full">
                      Legal target
                    </span>
                    <span className="font-display text-[2.25rem] font-bold text-accent">AA</span>
                    <h3 className="font-ui text-[1.125rem] font-bold">Standard</h3>
                    <p className="m-0">Removes the most common, significant barriers. Required by PSBAR 2018.</p>
                    <ul className="m-0 pl-[1.1rem] text-[.9375rem] text-muted flex flex-col gap-1">
                      <li>4.5:1 text contrast</li>
                      <li>Audio description for recorded video</li>
                      <li>Text resizes to 200%</li>
                    </ul>
                  </article>
                  <article className="flex flex-col gap-[.6rem] p-5 rounded-[1.25rem] bg-surface border border-line">
                    <span className="font-display text-[2.25rem] font-bold text-accent">AAA</span>
                    <h3 className="font-ui text-[1.125rem] font-bold">Enhanced</h3>
                    <p className="m-0">Goes further. Worth meeting where you can, but not required for whole sites.</p>
                    <ul className="m-0 pl-[1.1rem] text-[.9375rem] text-muted flex flex-col gap-1">
                      <li>7:1 text contrast</li>
                      <li>Sign language for video</li>
                      <li>Plain reading level</li>
                    </ul>
                  </article>
                </div>
                <div className="mt-6 bg-surface border border-line rounded-[1.25rem] p-5 [box-shadow:var(--shadow)]">
                  <div className="flex justify-between gap-4 flex-wrap items-baseline mb-[.9rem]">
                    <h3 className="font-ui text-[1.125rem] font-bold">Guess the level</h3>
                    <span className="font-bold text-accent-text" aria-live="polite">
                      {v.guessScore}
                    </span>
                  </div>
                  <ul className="list-none m-0 p-0 flex flex-col gap-2">
                    {v.guesses?.map((g: any, i: number) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-center gap-[.5rem_1rem] py-[.7rem] px-[.85rem] rounded-[.75rem]"
                        style={{ background: g.bg, border: `1px solid ${g.line ?? ''}` }}
                      >
                        <span className="[flex:1_1_14rem]">
                          <strong>{g.sc}</strong> {g.name}
                        </span>
                        <span className="flex gap-[.35rem]" role="group" aria-label={g.aria}>
                          {g.opts?.map((o: any, j: number) => (
                            <button
                              key={j}
                              className="min-w-[3.25rem] min-h-10 rounded-[.55rem] font-extrabold cursor-pointer"
                              type="button"
                              onClick={o.pick}
                              aria-pressed={o.pressed}
                              style={{ border: `1px solid ${o.line ?? ''}`, background: o.bg, color: o.ink }}
                            >
                              {o.l}
                            </button>
                          ))}
                        </span>
                        <span className="basis-[100%] text-[.875rem]" hidden={g.noFb} style={{ color: g.fbInk }}>
                          {g.fb}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="new-in-22" aria-labelledby="h-new">
                <h2 className="text-[1.75rem] mb-2" id="h-new">
                  New in WCAG 2.2
                </h2>
                <p className="mt-0 mx-0 mb-4 text-[1.0625rem]">
                  WCAG 2.2 added nine success criteria and removed one (4.1.1 Parsing). These are the ones you’re most likely to meet when building teaching
                  activities.
                </p>
                <div className="flex gap-[.4rem] flex-wrap mb-4" role="group" aria-label="Filter">
                  <button
                    className="min-h-10 py-[.4rem] px-[.9rem] rounded-full font-bold cursor-pointer text-ink"
                    type="button"
                    onClick={v.showTeach}
                    aria-pressed={v.teachSel}
                    style={{ border: `1px solid ${v.teachLine ?? ''}`, background: v.teachBg }}
                  >
                    Most relevant to teaching
                  </button>
                  <button
                    className="min-h-10 py-[.4rem] px-[.9rem] rounded-full font-bold cursor-pointer text-ink"
                    type="button"
                    onClick={v.showAll}
                    aria-pressed={v.allSel}
                    style={{ border: `1px solid ${v.allLine ?? ''}`, background: v.allBg }}
                  >
                    All nine
                  </button>
                </div>
                <ul className="ae-2col list-none m-0 p-0 gap-3">
                  {v.newSc?.map((n: any, i: number) => (
                    <li key={i} className="flex flex-col gap-[.35rem] py-4 px-[1.1rem] rounded-[1rem] bg-surface border border-line">
                      <span className="flex gap-2 items-center flex-wrap">
                        <strong className="tabular-nums">{n.sc}</strong>
                        <span className="font-bold">{n.name}</span>
                        <span className="ml-[auto] text-[.75rem] font-extrabold py-[.15rem] px-2 rounded-full bg-accent-soft text-accent-text">{n.level}</span>
                      </span>
                      <span className="text-[.9375rem] text-muted">{n.what}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 bg-surface border border-line rounded-[1.25rem] p-5 [box-shadow:var(--shadow)]">
                  <h3 className="font-ui text-[1.125rem] font-bold mb-[.35rem]">See it: target size</h3>
                  <p className="mt-0 mx-0 mb-4 text-[.9375rem] text-muted">
                    Show the hit area of each icon. Tiny targets are hard to hit with a tremor, on a touchscreen, or with a head pointer.
                  </p>
                  <div className="ae-2col gap-4">
                    <div className="p-4 rounded-[.875rem] bg-bad-soft">
                      <p className="mt-0 mx-0 mb-[.6rem] font-bold text-bad">
                        <i className="fa-solid fa-circle-xmark" aria-hidden="true"></i> 14 × 14 px, no spacing
                      </p>
                      <div className="flex gap-0" aria-hidden="true">
                        {v.tiny?.map((t: any, i: number) => (
                          <span
                            key={i}
                            className="w-[14px] h-[14px] grid place-items-center text-[10px] text-ink"
                            style={{ outline: v.outlineBad, outlineOffset: '-1px' }}
                          >
                            <i className={`fa-solid ${t ?? ''}`}></i>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-[.875rem] bg-ok-soft">
                      <p className="mt-0 mx-0 mb-[.6rem] font-bold text-ok">
                        <i className="fa-solid fa-circle-check" aria-hidden="true"></i> At least 24 × 24 px
                      </p>
                      <div className="flex gap-[6px]" aria-hidden="true">
                        {v.tiny?.map((t: any, i: number) => (
                          <span
                            key={i}
                            className="w-[32px] h-[32px] grid place-items-center text-[15px] text-ink rounded-[6px]"
                            style={{ outline: v.outlineOk, outlineOffset: '-1px' }}
                          >
                            <i className={`fa-solid ${t ?? ''}`}></i>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    className="mt-4 inline-flex items-center gap-2 min-h-11 py-2 px-4 rounded-[.65rem] border-0 bg-accent text-accent-ink font-bold cursor-pointer"
                    type="button"
                    onClick={v.toggleTargets}
                    aria-pressed={v.targetsSel}
                  >
                    <i className="fa-solid fa-crosshairs" aria-hidden="true"></i>
                    {v.targetsLabel}
                  </button>
                </div>
              </section>
              <DosDonts lesson={2} />
              <KnowledgeCheck lesson={2} />
              <LessonEnd lesson={2} />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}
