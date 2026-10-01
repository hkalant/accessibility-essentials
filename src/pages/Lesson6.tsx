import { Component } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import LessonIntro from '../components/LessonIntro';
import DosDonts from '../components/DosDonts';
import KnowledgeCheck from '../components/KnowledgeCheck';
import LessonEnd from '../components/LessonEnd';
import Footer from '../components/Footer';

export default class Lesson6 extends Component<any, any> {
  [key: string]: any;
  state: { u: Record<number, Record<number, boolean>>; tidy: boolean; fixed: Record<number, boolean>; tried: Record<number, boolean>; req: number } = {
    u: {},
    tidy: false,
    fixed: {},
    tried: {},
    req: 0,
  };
  renderVals() {
    const s = this.state,
      on = (b) => (b ? 'true' : 'false');
    const U: [string, string, string, string[]][] = [
      [
        'Engagement',
        'fa-heart',
        'The “why” of learning: how will you motivate and sustain interest?',
        ['Link the topic to a real case or career', 'Offer a choice of seminar question', 'Break the task into weekly checkpoints'],
      ],
      [
        'Representation',
        'fa-eye',
        'The “what”: how will you present information?',
        ['Captioned recording plus a Moodle Page summary', 'Key terms defined in a glossary', 'A diagram with a text description'],
      ],
      [
        'Action & expression',
        'fa-pen-nib',
        'The “how”: how can students show what they know?',
        ['Choice of essay or recorded presentation', 'A formative quiz with unlimited attempts', 'Templates and worked examples'],
      ],
    ];
    let total = 0,
      cats = 0;
    const udl = U.map((u, i) => {
      const sel = s.u[i] || {};
      const n = Object.values(sel).filter(Boolean).length;
      total += n;
      if (n) cats++;
      return {
        name: u[0],
        icon: u[1],
        q: u[2],
        line: n ? 'var(--accent)' : 'var(--line)',
        opts: u[3].map((t, j) => {
          const o = !!sel[j];
          return {
            t,
            on: o,
            bg: o ? 'var(--accent-soft)' : 'transparent',
            toggle: () =>
              this.setState((x) => {
                const c = Object.assign({}, x.u);
                c[i] = Object.assign({}, c[i] || {}, { [j]: !o });
                return { u: c };
              }),
          };
        }),
      };
    });
    const udlSummary =
      cats === 3
        ? 'Your week covers all three principles with ' +
          total +
          ' inclusive choices. That’s the anticipatory duty in practice — many students will never need to ask.'
        : total
          ? 'You’ve chosen ' + total + ' option' + (total > 1 ? 's' : '') + '. Add at least one under each principle.'
          : 'Choose options above to plan your week.';
    const seg = (b) => ({ bg: b ? 'var(--accent)' : 'transparent', ink: b ? 'var(--accent-ink)' : 'var(--ink)' });
    const MS = seg(!s.tidy),
      TD = seg(s.tidy);
    const W: [string, [string, string][]][] = s.tidy
      ? [
          [
            'Week 1: What is a contract?',
            [
              ['fa-bullseye', 'Learning outcomes'],
              ['fa-video', 'Lecture recording (captioned, 48 min)'],
              ['fa-book-open', 'Reading: Chapter 1 (Moodle Book)'],
              ['fa-comments', 'Seminar questions (Moodle Page)'],
              ['fa-circle-question', 'Check your understanding (quiz)'],
            ],
          ],
          [
            'Week 2: Offer and acceptance',
            [
              ['fa-bullseye', 'Learning outcomes'],
              ['fa-video', 'Lecture recording (captioned, 51 min)'],
              ['fa-book-open', 'Reading: Chapter 2 (Moodle Book)'],
              ['fa-comments', 'Seminar questions (Moodle Page)'],
              ['fa-circle-question', 'Check your understanding (quiz)'],
            ],
          ],
          [
            'Week 3: Consideration',
            [
              ['fa-bullseye', 'Learning outcomes'],
              ['fa-video', 'Lecture recording (captioned, 45 min)'],
              ['fa-book-open', 'Reading: Chapter 3 (Moodle Book)'],
              ['fa-comments', 'Seminar questions (Moodle Page)'],
              ['fa-circle-question', 'Check your understanding (quiz)'],
            ],
          ],
        ]
      : [
          [
            'Topic 1',
            [
              ['fa-file', 'intro slides.pptx'],
              ['fa-link', 'Click here'],
              ['fa-video', 'recording'],
            ],
          ],
          [
            'Week 2 - IMPORTANT!!',
            [
              ['fa-comments', 'Forum: read this first'],
              ['fa-file-pdf', 'scan0034.pdf'],
              ['fa-file', 'Week2_final_FINAL.docx'],
              ['fa-link', 'https://tinyurl.com/x8f2'],
            ],
          ],
          [
            'Consideration',
            [
              ['fa-video', 'Lecture'],
              ['fa-file-pdf', 'handout.pdf'],
              ['fa-circle-question', 'Quiz'],
            ],
          ],
        ];
    const weeks = W.map((w) => ({ title: w[0], items: w[1].map((i) => ({ icon: i[0], t: i[1] })) }));
    const IT = [
      ['fa-link', 'Click here', 'Link', 'Week 4 seminar questions (Moodle Page)', 'Link'],
      ['fa-file-pdf', 'lec4_FINAL_v3.pdf', 'File', 'Lecture 4 slides (PDF, 2 MB, tagged)', 'File · 2 MB'],
      ['fa-image', 'IMG_2034.jpg', 'Image, no alt text', 'Carlill v Carbolic Smoke Ball advert, 1892', 'Image · alt text added'],
      ['fa-video', 'Lecture 4 recording', 'Video · automatic captions', 'Lecture 4 recording (48 min)', 'Video · edited captions'],
      ['fa-font', 'Essay due Friday', 'Text in red only', 'Deadline: essay due 12 noon, Friday 14 March', 'Text · bold, labelled'],
      ['fa-file-pdf', 'reading.pdf', 'Scanned image, no text', 'Reading: Treitel ch. 2 (accessible copy)', 'PDF · OCR, from the library'],
    ];
    const items = IT.map((it, i) => {
      const f = !!s.fixed[i];
      return {
        icon: it[0],
        label: f ? it[3] : it[1],
        meta: f ? it[4] : it[2],
        bg: f ? 'var(--ok-soft)' : 'transparent',
        iconInk: f ? 'var(--ok)' : 'var(--muted)',
        ink: f ? 'var(--ink)' : i === 4 ? '#c4271b' : i === 0 ? 'var(--accent)' : 'var(--ink)',
        deco: i === 0 && !f ? 'underline' : 'none',
        tag: f ? 'Fixed' : 'Issue',
        tagBg: f ? 'var(--ok)' : 'var(--bad-soft)',
        tagInk: f ? '#fff' : 'var(--bad)',
      };
    });
    const FX: [number, string, string | null][] = [
      [0, 'Rename the link to describe where it goes', null],
      [7, 'Change the course theme to the university’s brand colours', 'This doesn’t remove any barrier.'],
      [1, 'Rename the file and include type and size — and check it’s tagged', null],
      [2, 'Add alt text describing the advert’s relevance', null],
      [8, 'Add a banner saying “This course is accessible”', 'Claims don’t fix barriers — and may mislead.'],
      [3, 'Review and edit the automatic captions', null],
      [4, 'Add the word “Deadline:” and make the date bold', null],
      [5, 'Request an accessible digitised copy from the library', null],
    ];
    const fixes = FX.map((f, j) => {
      const real = f[2] == null;
      const done = real ? !!s.fixed[f[0]] : !!s.tried[j];
      return {
        t: f[1],
        done,
        pick: () => {
          if (real) this.setState((x) => ({ fixed: Object.assign({}, x.fixed, { [f[0]]: true }) }));
          else this.setState((x) => ({ tried: Object.assign({}, x.tried, { [j]: true }) }));
        },
        line: done ? (real ? 'var(--ok)' : 'var(--warn)') : 'var(--line)',
        bg: done ? (real ? 'var(--ok-soft)' : 'var(--warn-soft)') : 'var(--surface)',
        dotBg: done ? (real ? 'var(--ok)' : 'var(--warn)') : 'var(--accent-soft)',
        dotInk: done ? '#fff' : 'var(--accent)',
        arrowDisp: done ? 'none' : 'inline',
        stateDisp: done ? 'inline' : 'none',
        stateIcon: real ? 'fa-check' : 'fa-xmark',
        fbDisp: done ? 'inline' : 'none',
        fbInk: real ? 'var(--ok)' : 'var(--warn)',
        fb: real ? 'Applied to the section.' : f[2],
      };
    });
    const nf = Object.keys(s.fixed).length;
    const R = [
      [
        'Accessible slides',
        'fa-person-chalkboard',
        '“I use a screen reader. The lecture slides are image-only PDFs — can I get a version I can read?”',
        [
          'Reply the same day to acknowledge the request.',
          'Share the original PowerPoint, which is usually more accessible than the PDF.',
          'Fix the source (titles, alt text, reading order), then export a tagged PDF.',
          'Upload the fixed version for everyone — not just this student.',
        ],
      ],
      [
        'Extra time on a quiz',
        'fa-stopwatch',
        '“My support plan says I get 25% extra time. The Week 6 quiz is timed.”',
        [
          'Check your institution’s process: many use a Moodle group for everyone with extra time.',
          'In the quiz, open More › Overrides and add a group or user override for the time limit.',
          'Apply it once, for every timed quiz in the module, so the student doesn’t have to ask again.',
          'Keep a note in the module’s handover so next year’s team applies it too.',
        ],
      ],
      [
        'Captions on a recording',
        'fa-closed-captioning',
        '“The captions on last week’s lecture are really inaccurate. I’m deaf and can’t follow it.”',
        [
          'Apologise and fix it — pre-recorded media must have accurate captions under PSBAR.',
          'Edit the automatic captions in your lecture capture tool, focusing on technical terms.',
          'Tell the student when it’s done, and check future recordings before release.',
          'If you can’t edit in time, ask your digital or disability team about captioning support.',
        ],
      ],
      [
        'Reading in another format',
        'fa-book',
        '“Is there an e-book or accessible version of the core textbook chapter?”',
        [
          'Pass the request to your library’s accessibility or alternative formats service.',
          'Check whether the publisher offers an accessible e-book, or request one via RNIB Bookshare where eligible.',
          'If you scanned it yourself, run OCR — or ask the library to digitise it properly.',
          'Add the accessible version to the reading list for everyone.',
        ],
      ],
    ];
    const reqs = R.map((r, i) => {
      const sel = i === s.req;
      return {
        id: 'req-tab-' + i,
        name: r[0],
        icon: r[1],
        sel: on(sel),
        ti: sel ? 0 : -1,
        pick: () => this.setState({ req: i }),
        line: sel ? 'var(--accent)' : 'var(--line)',
        bg: sel ? 'var(--accent-soft)' : 'var(--surface)',
      };
    });
    return {
      udl,
      udlSummary,
      udlBg: cats === 3 ? 'var(--ok-soft)' : 'var(--surface-2)',
      messySel: on(!s.tidy),
      tidySel: on(s.tidy),
      messyBg: MS.bg,
      messyInk: MS.ink,
      tidyBg: TD.bg,
      tidyInk: TD.ink,
      showMessy: () => this.setState({ tidy: false }),
      showTidy: () => this.setState({ tidy: true }),
      weeks,
      weeksNote: s.tidy
        ? 'Every week: descriptive title, the same five items in the same order, formats and durations in the link text.'
        : 'Vague titles, a different structure each week, meaningless file names and raw links. Everyone has to hunt.',
      items,
      fixes,
      auditScore: nf === 6 ? 'All six barriers fixed. Start with quick wins like these — they help everyone.' : 'Barriers fixed: ' + nf + ' of 6',
      resetAudit: () => this.setState({ fixed: {}, tried: {} }),
      reqs,
      reqTab: 'req-tab-' + s.req,
      req: { quote: R[s.req][2], steps: R[s.req][3] },
      reqKey: (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const nx = (s.req + (e.key === 'ArrowRight' ? 1 : 3)) % 4;
        this.setState({ req: nx }, () => {
          const b = document.getElementById('req-tab-' + nx);
          b && b.focus();
        });
      },
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="min-h-[100vh] flex flex-col" data-lesson="6">
        <Topbar active="course" />
        <div className="ae-lesson-layout flex-1">
          <Sidebar current={6} />
          <main className="min-w-0 [outline:none]" id="main" data-read-root="" tabIndex={-1}>
            <LessonIntro lesson={6} />
            <div className="max-w-[var(--measure)] my-0 mx-auto pt-0 px-5 pb-8">
              <section className="py-10 px-0 mt-8 border-t border-t-line" id="udl" aria-labelledby="h-udl">
                <h2 className="text-[1.75rem] mb-2" id="h-udl">
                  Universal Design for Learning
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  UDL is the anticipatory duty turned into a teaching method: design for the range of students you’ll actually have, so fewer need individual
                  adjustments. Plan one week of your module — choose at least one option under each principle.
                </p>
                <div className="ae-3col gap-[.9rem]">
                  {v.udl?.map((u: any, i: number) => (
                    <fieldset
                      key={i}
                      className="m-0 flex flex-col gap-[.6rem] p-[1.1rem] rounded-[1.1rem] bg-surface min-w-0"
                      style={{ border: `1px solid ${u.line ?? ''}` }}
                    >
                      <legend className="sr-only">{u.name}</legend>
                      <span className="w-10 h-10 rounded-[.75rem] bg-accent-soft text-accent grid place-items-center" aria-hidden="true">
                        <i className={`fa-solid ${u.icon ?? ''}`}></i>
                      </span>
                      <h3 className="font-ui text-[1.0625rem] font-bold">{u.name}</h3>
                      <p className="m-0 text-[.875rem] text-muted">{u.q}</p>
                      <div className="flex flex-col gap-[.35rem]">
                        {u.opts?.map((o: any, j: number) => (
                          <label
                            key={j}
                            className="flex gap-[.6rem] items-start py-2 px-[.6rem] rounded-[.6rem] cursor-pointer text-[.9375rem]"
                            style={{ background: o.bg }}
                          >
                            <input
                              className="accent-accent w-[1.05rem] h-[1.05rem] mt-[.2rem] mx-0 mb-0 flex-none"
                              type="checkbox"
                              checked={!!o.on}
                              onChange={o.toggle}
                            />
                            {o.t}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
                <p className="mt-4 mx-0 mb-0 py-[.9rem] px-4 rounded-[.75rem] font-semibold" aria-live="polite" style={{ background: v.udlBg }}>
                  {v.udlSummary}
                </p>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="moodle" aria-labelledby="h-moodle">
                <h2 className="text-[1.75rem] mb-2" id="h-moodle">
                  A predictable Moodle course
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Consistency is an accessibility feature (WCAG 3.2.3–3.2.6). When every week follows the same pattern, screen reader users, students with ADHD
                  or anxiety, and anyone short on time can find things fast.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] [box-shadow:var(--shadow)] overflow-hidden">
                  <div className="flex justify-between items-center gap-4 py-4 px-5 border-b border-b-line flex-wrap">
                    <p className="m-0 font-bold">Course index</p>
                    <div className="flex p-1 rounded-full bg-surface-2 border border-line" role="radiogroup" aria-label="Version">
                      <button
                        className="min-h-10 py-[.4rem] px-4 rounded-full border-0 font-bold cursor-pointer"
                        type="button"
                        role="radio"
                        aria-checked={v.messySel}
                        onClick={v.showMessy}
                        style={{ background: v.messyBg, color: v.messyInk }}
                      >
                        Ad hoc
                      </button>
                      <button
                        className="min-h-10 py-[.4rem] px-4 rounded-full border-0 font-bold cursor-pointer"
                        type="button"
                        role="radio"
                        aria-checked={v.tidySel}
                        onClick={v.showTidy}
                        style={{ background: v.tidyBg, color: v.tidyInk }}
                      >
                        Consistent
                      </button>
                    </div>
                  </div>
                  <div className="ae-3col gap-3 p-5">
                    {v.weeks?.map((w: any, i: number) => (
                      <div key={i} className="border border-line rounded-[.875rem] overflow-hidden bg-surface-2">
                        <p className="m-0 py-[.6rem] px-[.8rem] font-bold bg-surface border-b border-b-line">{w.title}</p>
                        <ul className="list-none m-0 pt-2 px-[.8rem] pb-3 flex flex-col gap-[.4rem] text-[.875rem]">
                          {w.items?.map((i: any, j: number) => (
                            <li key={j} className="flex gap-2 items-start">
                              <i className={`fa-solid ${i.icon ?? ''} text-muted mt-[.2rem] w-4 text-center`} aria-hidden="true"></i>
                              <span>{i.t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="m-0 pt-0 px-5 pb-5 text-[.9375rem] text-muted" aria-live="polite">
                    {v.weeksNote}
                  </p>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="audit" aria-labelledby="h-audit">
                <h2 className="text-[1.75rem] mb-2" id="h-audit">
                  Audit this section
                </h2>
                <p className="mt-0 mx-0 mb-[.4rem] text-[1.0625rem]">
                  Here’s a real-looking Week 4 section. Choose the fixes that remove barriers — each one updates the section. Some options won’t help.
                </p>
                <p className="mt-0 mx-0 mb-4 font-bold text-accent-text" aria-live="polite">
                  {v.auditScore}
                </p>
                <div className="ae-2col gap-4 [align-items:start]">
                  <div className="bg-surface border border-line rounded-[1.25rem] [box-shadow:var(--shadow)] overflow-hidden">
                    <div className="py-[.85rem] px-[1.1rem] border-b border-b-line bg-surface-2 flex items-center gap-2">
                      <i className="fa-solid fa-graduation-cap text-accent" aria-hidden="true"></i>
                      <span className="font-bold">LAW2203 · Week 4: Contract formation</span>
                    </div>
                    <ul className="list-none m-0 p-2 flex flex-col gap-1">
                      {v.items?.map((i: any, idx1: number) => (
                        <li
                          key={idx1}
                          className="flex gap-3 items-start py-[.65rem] px-[.7rem] rounded-[.65rem] [transition:background_.3s]"
                          style={{ background: i.bg }}
                        >
                          <i className={`fa-solid ${i.icon ?? ''} mt-1 w-[1.1rem] text-center`} aria-hidden="true" style={{ color: i.iconInk }}></i>
                          <span className="flex-1 flex flex-col gap-[.1rem] min-w-0">
                            <span className="font-semibold wrap-anywhere" style={{ color: i.ink, textDecoration: i.deco }}>
                              {i.label}
                            </span>
                            <span className="text-[.8125rem] text-muted">{i.meta}</span>
                          </span>
                          <span
                            className="flex-none text-[.75rem] font-extrabold py-[.15rem] px-2 rounded-full"
                            style={{ background: i.tagBg, color: i.tagInk }}
                          >
                            {i.tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="mt-0 mx-0 mb-1 font-bold">Fixes</p>
                    {v.fixes?.map((f: any, i: number) => (
                      <button
                        key={i}
                        className="flex gap-[.7rem] items-start py-3 px-[.85rem] rounded-[.75rem] cursor-pointer text-left text-ink text-[.9375rem]"
                        type="button"
                        onClick={f.pick}
                        disabled={f.done}
                        style={{ border: `1px solid ${f.line ?? ''}`, background: f.bg }}
                      >
                        <span
                          className="flex-none w-[1.9rem] h-[1.9rem] rounded-[50%] grid place-items-center text-[.8rem]"
                          aria-hidden="true"
                          style={{ background: f.dotBg, color: f.dotInk }}
                        >
                          <i className="fa-solid fa-arrow-left ae-desk-s" style={{ display: f.arrowDisp }}></i>
                          <i className="fa-solid fa-arrow-up ae-mob-s" style={{ display: f.arrowDisp }}></i>
                          <i className={`fa-solid ${f.stateIcon ?? ''}`} style={{ display: f.stateDisp }}></i>
                        </span>
                        <span className="flex flex-col gap-[.15rem]">
                          <span className="font-semibold">{f.t}</span>
                          <span className="text-[.8125rem]" style={{ color: f.fbInk, display: f.fbDisp }}>
                            {f.fb}
                          </span>
                        </span>
                      </button>
                    ))}
                    <button
                      className="self-start [background:none] border-0 text-accent font-bold cursor-pointer underline py-2 px-0"
                      type="button"
                      onClick={v.resetAudit}
                    >
                      Start again
                    </button>
                  </div>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="requests" aria-labelledby="h-requests">
                <h2 className="text-[1.75rem] mb-2" id="h-requests">
                  Responding to requests
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Even a well-designed module will get individual requests. Choose one to see a good response. Throughout: act promptly, don’t ask the student
                  to justify their need, and keep a record so it carries forward.
                </p>
                <div
                  className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-2 mb-[.9rem]"
                  role="tablist"
                  aria-label="Request type"
                  onKeyDown={v.reqKey}
                >
                  {v.reqs?.map((r: any, i: number) => (
                    <button
                      key={i}
                      className="flex items-center gap-[.6rem] min-h-13 py-[.6rem] px-[.8rem] rounded-[.75rem] cursor-pointer text-left text-ink font-bold text-[.9375rem]"
                      type="button"
                      role="tab"
                      id={r.id}
                      aria-selected={r.sel}
                      aria-controls="req-panel"
                      tabIndex={r.ti}
                      onClick={r.pick}
                      style={{ border: `2px solid ${r.line ?? ''}`, background: r.bg }}
                    >
                      <i className={`fa-solid ${r.icon ?? ''} text-accent`} aria-hidden="true"></i>
                      {r.name}
                    </button>
                  ))}
                </div>
                <div
                  className="p-5 rounded-[1rem] bg-surface border border-line [box-shadow:var(--shadow)]"
                  role="tabpanel"
                  id="req-panel"
                  aria-labelledby={v.reqTab}
                >
                  <p className="mt-0 mx-0 mb-3 italic text-muted">{v.req.quote}</p>
                  <ol className="m-0 pl-5 flex flex-col gap-2">
                    {v.req.steps?.map((s: any, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              </section>
              <DosDonts lesson={6} />
              <KnowledgeCheck lesson={6} />
              <LessonEnd lesson={6} />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}
