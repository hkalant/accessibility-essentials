import { Component } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import LessonIntro from '../components/LessonIntro';
import DosDonts from '../components/DosDonts';
import KnowledgeCheck from '../components/KnowledgeCheck';
import LessonEnd from '../components/LessonEnd';
import Footer from '../components/Footer';

export default class Lesson1 extends Component<any, any> {
  [key: string]: any;
  state = { tab: 'psbar', picks: {}, stmt: {}, ant: false, duty: 0 };
  renderVals() {
    const s = this.state,
      on = (b) => (b ? 'true' : 'false');
    const tabSty = (sel) => ({ line: sel ? 'var(--accent)' : 'transparent', ink: sel ? 'var(--accent-text)' : 'var(--muted)' });
    const P = tabSty(s.tab === 'psbar'),
      E = tabSty(s.tab === 'ea');
    const D = [
      [
        '23 Sep 2018',
        'In force',
        'The regulations came into force.',
        'PSBAR became law. Any new public sector website published from this date had a year to comply.',
      ],
      [
        '23 Sep 2019',
        'New sites',
        'New websites must comply.',
        'Websites published after 23 September 2018 had to meet the standard. Intranets, extranets and VLEs published or substantially revised from now on are covered too.',
      ],
      [
        '23 Sep 2020',
        'All sites + media',
        'All websites, plus new media.',
        'Every public sector website had to comply. Pre-recorded audio and video published from this date needs captions and other alternatives — this includes lecture recordings.',
      ],
      ['23 Jun 2021', 'Apps', 'Mobile apps must comply.', 'University mobile apps — timetabling, library, VLE apps — now fall under the regulations.'],
      [
        'Oct 2024',
        'WCAG 2.2',
        'Monitoring moves to WCAG 2.2.',
        'Government monitoring began testing against WCAG 2.2 AA, which adds criteria such as target size and accessible authentication. Lesson 2 covers these.',
      ],
    ];
    const ST = [
      'Whether the site fully, partially or does not comply',
      'Content that isn’t accessible, and why',
      'How to request an accessible alternative',
      'How to report an accessibility problem',
      'The enforcement procedure (EHRC or ECNI)',
      'When it was prepared and last reviewed',
    ];
    const statement = ST.map((t, i) => {
      const o = !!s.stmt[i];
      return {
        t,
        on: o,
        toggle: () => this.setState((x) => ({ stmt: Object.assign({}, x.stmt, { [i]: !o }) })),
        line: o ? 'var(--ok)' : 'var(--line)',
        bg: o ? 'var(--ok-soft)' : 'var(--surface)',
      };
    });
    const C = [
      ['fa-file-lines', 'A Moodle page you wrote this term', 0, 'Covered', 'New content on a VLE must meet WCAG AA.'],
      [
        'fa-video',
        'Last week’s lecture recording, posted to Moodle',
        0,
        'Covered',
        'Pre-recorded media published after 23 September 2020 needs accurate captions.',
      ],
      [
        'fa-tower-broadcast',
        'A live-streamed seminar on Teams',
        1,
        'Exempt from PSBAR — Equality Act still applies',
        'Live media is exempt from PSBAR. But if a student needs live captions, providing them is likely to be a reasonable adjustment.',
      ],
      [
        'fa-book',
        'A publisher’s e-book on your reading list',
        1,
        'Exempt from PSBAR — Equality Act still applies',
        'Third-party content you don’t fund or control is exempt. Work with the library to source accessible versions when needed.',
      ],
      [
        'fa-box-archive',
        'A 2016 handout students still need for this year’s assignment',
        0,
        'Covered in practice',
        'Older office documents are exempt only if they aren’t needed for current services. If students need it now, make it accessible.',
      ],
      [
        'fa-clock-rotate-left',
        'An archived module page from 2017 that nobody uses or updates',
        1,
        'Exempt from PSBAR — Equality Act still applies',
        'Archived content that isn’t needed for active processes is exempt. If a student ever needs it, you’d still need to adjust.',
      ],
    ];
    let right = 0,
      answered = 0;
    const cases = C.map((c, i) => {
      const p = s.picks[i];
      const shown = p != null;
      const ok = p === c[2];
      if (shown) {
        answered++;
        if (ok) right++;
      }
      const btn = (v) => ({ press: on(p === v), line: p === v ? 'var(--accent)' : 'var(--line)', bg: p === v ? 'var(--accent-soft)' : 'var(--surface-2)' });
      const bc = btn(0),
        be = btn(1);
      return {
        icon: c[0],
        t: c[1],
        groupLabel: 'Your verdict: ' + c[1],
        pickC: () => this.setState((x) => ({ picks: Object.assign({}, x.picks, { [i]: 0 }) })),
        pickE: () => this.setState((x) => ({ picks: Object.assign({}, x.picks, { [i]: 1 }) })),
        pressC: bc.press,
        lineC: bc.line,
        bgC: bc.bg,
        pressE: be.press,
        lineE: be.line,
        bgE: be.bg,
        shown,
        verdict: (ok ? 'Right — ' : 'Not quite — ') + c[3],
        why: c[4],
        fbBg: ok ? 'var(--ok-soft)' : 'var(--warn-soft)',
        fbInk: ok ? 'var(--ok)' : 'var(--warn)',
        fbIcon: ok ? 'fa-circle-check' : 'fa-lightbulb',
        line: shown ? (ok ? 'var(--ok)' : 'var(--warn)') : 'var(--line)',
      };
    });
    const DU = [
      [
        'Plan',
        'Think about disabled students before term starts. Use accessible templates, choose accessible readings, and build in flexibility — that’s the anticipatory duty in action.',
      ],
      ['Build', 'Create content to WCAG AA from the start: real headings, alt text, good contrast, edited captions. Lessons 2–5 show you how.'],
      [
        'Respond',
        'When a student asks for an alternative, act promptly and don’t ask them to justify it. Log what you did so it carries forward to next year.',
      ],
      [
        'Report',
        'If the platform itself has a barrier you can’t fix, report it to your digital or accessibility team so it can be fixed or listed in the accessibility statement.',
      ],
    ];
    const duties = DU.map((d, i) => {
      const sel = i === s.duty;
      return {
        n: i + 1,
        title: d[0],
        pressed: on(sel),
        pick: () => this.setState({ duty: i }),
        line: sel ? 'var(--accent)' : 'var(--line)',
        bg: sel ? 'var(--accent-soft)' : 'var(--surface)',
        dotBg: sel ? 'var(--accent)' : 'var(--surface-2)',
        dotInk: sel ? 'var(--accent-ink)' : 'var(--muted)',
      };
    });
    return {
      psbarSel: on(s.tab === 'psbar'),
      eaSel: on(s.tab === 'ea'),
      psbarTi: s.tab === 'psbar' ? 0 : -1,
      eaTi: s.tab === 'ea' ? 0 : -1,
      psbarLine: P.line,
      psbarInk: P.ink,
      eaLine: E.line,
      eaInk: E.ink,
      hidePsbar: s.tab !== 'psbar',
      hideEa: s.tab !== 'ea',
      showPsbar: () => this.setState({ tab: 'psbar' }),
      showEa: () => this.setState({ tab: 'ea' }),
      tabKey: (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const nx = s.tab === 'psbar' ? 'ea' : 'psbar';
        this.setState({ tab: nx }, () => {
          const b = document.getElementById('tab-' + nx);
          b && b.focus();
        });
      },
      timeline: D.map((d, i) => ({
        date: d[0],
        tag: d[1],
        title: d[2],
        text: d[3],
        lineDisp: i < D.length - 1 ? 'block' : 'none',
        pad: i < D.length - 1 ? '1.75rem' : '0',
      })),
      statement,
      cases,
      coveredScore: answered
        ? 'You’ve got ' +
          right +
          ' of ' +
          answered +
          ' right so far' +
          (answered === 6 ? (right === 6 ? ' — perfect!' : ' — the Equality Act always applies.') : '')
        : '',
      reactSel: on(!s.ant),
      antSel: on(s.ant),
      reactBg: !s.ant ? 'var(--bad)' : 'transparent',
      reactInk: !s.ant ? '#fff' : 'var(--ink)',
      antBg: s.ant ? 'var(--ok)' : 'transparent',
      antInk: s.ant ? '#fff' : 'var(--ink)',
      hideReact: s.ant,
      hideAnt: !s.ant,
      showReact: () => this.setState({ ant: false }),
      showAnt: () => this.setState({ ant: true }),
      duties,
      dutyTitle: s.duty + 1 + '. ' + DU[s.duty][0],
      dutyText: DU[s.duty][1],
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="min-h-[100vh] flex flex-col" data-lesson="1">
        <Topbar active="course" />
        <div className="ae-lesson-layout flex-1">
          <Sidebar current={1} />
          <main className="min-w-0 [outline:none]" id="main" data-read-root="" tabIndex={-1}>
            <LessonIntro lesson={1} />
            <div className="max-w-[var(--measure)] my-0 mx-auto pt-0 px-5 pb-8">
              <section className="py-10 px-0 mt-8 border-t border-t-line" id="two-laws" aria-labelledby="h-two-laws">
                <h2 className="text-[1.75rem] mb-2" id="h-two-laws">
                  Two laws, one goal
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Two pieces of UK law shape how you publish teaching content. <strong>PSBAR 2018</strong> sets a technical standard for your university’s
                  digital estate. The <strong>Equality Act 2010</strong> protects individual disabled students. They overlap — but they’re not the same, and
                  meeting one doesn’t always satisfy the other.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] overflow-hidden [box-shadow:var(--shadow)]">
                  <div className="flex border-b border-b-line bg-surface-2" role="tablist" aria-label="Compare the two laws" onKeyDown={v.tabKey}>
                    <button
                      className="flex-1 min-h-13 py-3 px-4 border-0 bg-transparent font-bold cursor-pointer"
                      type="button"
                      role="tab"
                      id="tab-psbar"
                      aria-controls="panel-psbar"
                      aria-selected={v.psbarSel}
                      tabIndex={v.psbarTi}
                      onClick={v.showPsbar}
                      style={{ borderBottom: `3px solid ${v.psbarLine ?? ''}`, color: v.psbarInk }}
                    >
                      <i className="fa-solid fa-building-columns" aria-hidden="true"></i> PSBAR 2018
                    </button>
                    <button
                      className="flex-1 min-h-13 py-3 px-4 border-0 bg-transparent font-bold cursor-pointer"
                      type="button"
                      role="tab"
                      id="tab-ea"
                      aria-controls="panel-ea"
                      aria-selected={v.eaSel}
                      tabIndex={v.eaTi}
                      onClick={v.showEa}
                      style={{ borderBottom: `3px solid ${v.eaLine ?? ''}`, color: v.eaInk }}
                    >
                      <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i> Equality Act 2010
                    </button>
                  </div>
                  <div className="py-5 px-6" role="tabpanel" id="panel-psbar" aria-labelledby="tab-psbar" hidden={v.hidePsbar}>
                    <p className="mt-0 mx-0 mb-4 text-[.875rem] text-muted">
                      The Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 · SI 2018/952
                    </p>
                    <dl className="m-0 grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-[.9rem_1.25rem]">
                      <dt className="font-bold text-accent-text">What it is</dt>
                      <dd className="m-0">Regulations that came into force on 23 September 2018. They still apply across the UK.</dd>
                      <dt className="font-bold text-accent-text">Who it covers</dt>
                      <dd className="m-0">
                        Public sector bodies — which includes most UK universities. It covers websites, intranets, extranets, VLEs and apps, <em>and</em> the
                        documents and media published on them.
                      </dd>
                      <dt className="font-bold text-accent-text">What it asks</dt>
                      <dd className="m-0">
                        Meet WCAG level AA, publish and keep an accessibility statement up to date, and offer a way to request content in an accessible format.
                        Government monitoring has tested against WCAG 2.2 AA since October 2024.
                      </dd>
                      <dt className="font-bold text-accent-text">Who enforces</dt>
                      <dd className="m-0">
                        The Government Digital Service (GDS) monitors compliance. Enforcement is by the EHRC in England, Scotland and Wales, and the ECNI in
                        Northern Ireland.
                      </dd>
                    </dl>
                  </div>
                  <div className="py-5 px-6" role="tabpanel" id="panel-ea" aria-labelledby="tab-ea" hidden={v.hideEa}>
                    <p className="mt-0 mx-0 mb-4 text-[.875rem] text-muted">Equality Act 2010 · Part 6 (Education) and Schedule 13</p>
                    <dl className="m-0 grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-[.9rem_1.25rem]">
                      <dt className="font-bold text-accent-text">What it is</dt>
                      <dd className="m-0">
                        An Act of Parliament protecting people from discrimination on the basis of nine protected characteristics, including disability. It
                        applies in England, Scotland and Wales.
                      </dd>
                      <dt className="font-bold text-accent-text">Who it covers</dt>
                      <dd className="m-0">Universities as education providers — and so you, when you design and deliver teaching on their behalf.</dd>
                      <dt className="font-bold text-accent-text">What it asks</dt>
                      <dd className="m-0">
                        Make reasonable adjustments so disabled students aren’t put at a substantial disadvantage. In education the duty is{' '}
                        <strong>anticipatory</strong>: plan ahead rather than waiting to be asked.
                      </dd>
                      <dt className="font-bold text-accent-text">Who enforces</dt>
                      <dd className="m-0">
                        Students can complain to the university, then to an independent body (the OIA in England and Wales, the SPSO in Scotland), or bring a
                        claim in court. The EHRC can also act.
                      </dd>
                    </dl>
                  </div>
                </div>
                <p className="mt-4 mx-0 mb-0 text-[.9rem] text-muted flex gap-2">
                  <i className="fa-solid fa-circle-info mt-1 text-accent" aria-hidden="true"></i>
                  <span>
                    In Northern Ireland, disability equality in education is covered by the Disability Discrimination Act 1995 (as amended), not the Equality
                    Act. PSBAR 2018 applies across the UK.
                  </span>
                </p>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="psbar" aria-labelledby="h-psbar">
                <h2 className="text-[1.75rem] mb-2" id="h-psbar">
                  PSBAR 2018 in practice
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">The regulations came in stages — here’s what changed at each one, and why your VLE counts.</p>
                <ol className="list-none m-0 p-0 flex flex-col" aria-label="PSBAR 2018 timeline">
                  {v.timeline?.map((t: any, i: number) => (
                    <li key={i} className="grid grid-cols-[minmax(0,7.5rem)_1.5rem_minmax(0,1fr)] gap-x-4">
                      <div className="pt-[.1rem] text-right">
                        <p className="m-0 font-extrabold text-[1rem] text-accent-text">{t.date}</p>
                        <p className="mt-[.1rem] mx-0 mb-0 text-[.8125rem] font-bold text-muted uppercase tracking-[.04em]">{t.tag}</p>
                      </div>
                      <div className="relative flex justify-center" aria-hidden="true">
                        <span className="absolute top-[1.6rem] bottom-0 left-1/2 w-[2px] ml-[-1px] bg-line" style={{ display: t.lineDisp }}></span>
                        <span className="relative mt-[.3rem] w-4 h-4 rounded-[50%] bg-accent [box-shadow:0_0_0_4px_var(--accent-soft)]"></span>
                      </div>
                      <div style={{ paddingBottom: t.pad }}>
                        <p className="mt-0 mx-0 mb-1 font-bold">{t.title}</p>
                        <p className="m-0 text-ink">{t.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <h3 className="font-ui text-[1.1875rem] font-bold mt-8 mx-0 mb-2">What goes in an accessibility statement?</h3>
                <p className="mt-0 mx-0 mb-4">
                  Your institution publishes these, but you’ll be asked to feed into them. Tick off each part as you check your university’s statement.
                </p>
                <ul className="list-none m-0 p-0 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-[.6rem]">
                  {v.statement?.map((s: any, i: number) => (
                    <li key={i}>
                      <label
                        className="flex gap-[.7rem] items-start h-full py-[.85rem] px-4 rounded-[.75rem] cursor-pointer"
                        style={{ border: `1px solid ${s.line ?? ''}`, background: s.bg }}
                      >
                        <input
                          className="accent-accent w-[1.1rem] h-[1.1rem] mt-[.2rem] mx-0 mb-0 flex-none"
                          type="checkbox"
                          checked={!!s.on}
                          onChange={s.toggle}
                        />
                        <span>{s.t}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="covered" aria-labelledby="h-covered">
                <h2 className="text-[1.75rem] mb-2" id="h-covered">
                  Covered or exempt?
                </h2>
                <p className="mt-0 mx-0 mb-2 text-[1.0625rem]">
                  PSBAR has some exemptions — but <strong>the Equality Act has none of them</strong>. Make your call on each item, then see the verdict.
                </p>
                <p className="mt-0 mx-0 mb-5 font-bold text-accent-text" aria-live="polite">
                  {v.coveredScore}
                </p>
                <div className="ae-2col gap-[.9rem]">
                  {v.cases?.map((c: any, i: number) => (
                    <article
                      key={i}
                      className="flex flex-col gap-3 p-[1.1rem] rounded-[1rem] bg-surface [box-shadow:var(--shadow)]"
                      style={{ border: `1px solid ${c.line ?? ''}` }}
                    >
                      <div className="flex gap-3 items-start">
                        <i className={`fa-solid ${c.icon ?? ''} text-accent text-[1.15rem] mt-[.2rem] w-5 text-center`} aria-hidden="true"></i>
                        <h3 className="font-ui text-[1rem] font-bold leading-[1.4]">{c.t}</h3>
                      </div>
                      <div className="flex gap-[.4rem] flex-wrap" role="group" aria-label={c.groupLabel}>
                        <button
                          className="flex-1 min-h-10 py-[.4rem] px-[.6rem] rounded-[.6rem] font-bold text-[.875rem] cursor-pointer text-ink"
                          type="button"
                          onClick={c.pickC}
                          aria-pressed={c.pressC}
                          style={{ border: `1px solid ${c.lineC ?? ''}`, background: c.bgC }}
                        >
                          Covered
                        </button>
                        <button
                          className="flex-1 min-h-10 py-[.4rem] px-[.6rem] rounded-[.6rem] font-bold text-[.875rem] cursor-pointer text-ink"
                          type="button"
                          onClick={c.pickE}
                          aria-pressed={c.pressE}
                          style={{ border: `1px solid ${c.lineE ?? ''}`, background: c.bgE }}
                        >
                          Exempt
                        </button>
                      </div>
                      {c.shown ? (
                        <>
                          <div className="py-3 px-[.85rem] rounded-[.65rem] text-[.9375rem]" style={{ background: c.fbBg }}>
                            <p className="mt-0 mx-0 mb-1 font-bold" style={{ color: c.fbInk }}>
                              <i className={`fa-solid ${c.fbIcon ?? ''}`} aria-hidden="true"></i> {c.verdict}
                            </p>
                            <p className="m-0">{c.why}</p>
                          </div>
                        </>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="equality-act" aria-labelledby="h-ea">
                <h2 className="text-[1.75rem] mb-2" id="h-ea">
                  The Equality Act 2010
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  A student is disabled under the Act if they have a physical or mental impairment with a substantial and long-term adverse effect on their
                  normal day-to-day activities. Many students never disclose, or haven’t been diagnosed — which is exactly why the duty is anticipatory.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] overflow-hidden [box-shadow:var(--shadow)]">
                  <div className="py-4 px-5 border-b border-b-line flex flex-wrap gap-3 items-center justify-between">
                    <p className="m-0 font-bold">Same module, two approaches</p>
                    <div className="flex p-1 rounded-full bg-surface-2 border border-line" role="radiogroup" aria-label="Approach">
                      <button
                        className="min-h-10 py-[.4rem] px-4 rounded-full border-0 font-bold cursor-pointer"
                        type="button"
                        role="radio"
                        aria-checked={v.reactSel}
                        onClick={v.showReact}
                        style={{ background: v.reactBg, color: v.reactInk }}
                      >
                        Reactive
                      </button>
                      <button
                        className="min-h-10 py-[.4rem] px-4 rounded-full border-0 font-bold cursor-pointer"
                        type="button"
                        role="radio"
                        aria-checked={v.antSel}
                        onClick={v.showAnt}
                        style={{ background: v.antBg, color: v.antInk }}
                      >
                        Anticipatory
                      </button>
                    </div>
                  </div>
                  <div className="p-5" aria-live="polite">
                    <ol className="m-0 pl-5 flex flex-col gap-[.6rem]" hidden={v.hideReact}>
                      <li>
                        <strong>Week 0:</strong> Slides uploaded as scanned PDFs. No captions on recordings.
                      </li>
                      <li>
                        <strong>Week 2:</strong> A student with dyslexia gets a support plan. Disability services email the module team.
                      </li>
                      <li>
                        <strong>Week 4:</strong> Accessible slides arrive for that one student. Meanwhile, three other students who never disclosed are
                        struggling.
                      </li>
                      <li className="text-bad font-semibold">Result: weeks of disadvantage, repeated effort each year, and legal risk.</li>
                    </ol>
                    <ol className="m-0 pl-5 flex flex-col gap-[.6rem]" hidden={v.hideAnt}>
                      <li>
                        <strong>Before term:</strong> Slides built from accessible templates, with headings and alt text. Recordings have edited captions.
                      </li>
                      <li>
                        <strong>Week 1:</strong> Students are told how to request other formats — no questions asked.
                      </li>
                      <li>
                        <strong>Week 2:</strong> The support plan arrives. Only specialist needs remain, such as a braille copy.
                      </li>
                      <li className="text-ok font-semibold">Result: most barriers never arise, for any student.</li>
                    </ol>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-5">
                  <details className="bg-surface border border-line rounded-[.875rem] py-0 px-[1.1rem]">
                    <summary className="cursor-pointer py-[.9rem] px-0 font-bold">The three requirements of reasonable adjustments (section 20)</summary>
                    <ul className="mt-0 mx-0 mb-4 pl-5 flex flex-col gap-[.35rem]">
                      <li>
                        Changing a <strong>provision, criterion or practice</strong> — e.g. how you share slides or set deadlines.
                      </li>
                      <li>
                        Changing <strong>physical features</strong> — e.g. room layout.
                      </li>
                      <li>
                        Providing an <strong>auxiliary aid</strong> — which explicitly includes information in an accessible format.
                      </li>
                    </ul>
                  </details>
                  <details className="bg-surface border border-line rounded-[.875rem] py-0 px-[1.1rem]">
                    <summary className="cursor-pointer py-[.9rem] px-0 font-bold">Who pays?</summary>
                    <p className="mt-0 mx-0 mb-4">Not the student. The Act says a disabled person can’t be asked to pay for a reasonable adjustment.</p>
                  </details>
                  <details className="bg-surface border border-line rounded-[.875rem] py-0 px-[1.1rem]">
                    <summary className="cursor-pointer py-[.9rem] px-0 font-bold">The Public Sector Equality Duty (section 149)</summary>
                    <p className="mt-0 mx-0 mb-4">
                      Universities must also have “due regard” to removing discrimination and advancing equality of opportunity. Accessible teaching materials
                      are one of the clearest ways to show this.
                    </p>
                  </details>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="duties" aria-labelledby="h-duties">
                <h2 className="text-[1.75rem] mb-2" id="h-duties">
                  What this means for you
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">Four habits cover almost everything the law expects of an individual teacher.</p>
                <div className="ae-4col gap-[.6rem] mb-[.9rem]">
                  {v.duties?.map((d: any, i: number) => (
                    <button
                      key={i}
                      className="flex flex-col items-start gap-2 p-4 rounded-[1rem] cursor-pointer text-left text-ink min-h-26"
                      type="button"
                      onClick={d.pick}
                      aria-pressed={d.pressed}
                      style={{ border: `2px solid ${d.line ?? ''}`, background: d.bg }}
                    >
                      <span
                        className="w-9 h-9 rounded-[50%] grid place-items-center font-extrabold"
                        aria-hidden="true"
                        style={{ background: d.dotBg, color: d.dotInk }}
                      >
                        {d.n}
                      </span>
                      <span className="font-bold text-[1.0625rem]">{d.title}</span>
                    </button>
                  ))}
                </div>
                <div className="p-5 rounded-[1rem] bg-surface border border-line [box-shadow:var(--shadow)]" aria-live="polite">
                  <p className="mt-0 mx-0 mb-[.35rem] font-bold text-[1.0625rem]">{v.dutyTitle}</p>
                  <p className="m-0">{v.dutyText}</p>
                </div>
              </section>
              <DosDonts lesson={1} />
              <KnowledgeCheck lesson={1} />
              <LessonEnd lesson={1} />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}
