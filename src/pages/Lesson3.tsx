import { Component } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import LessonIntro from '../components/LessonIntro';
import DosDonts from '../components/DosDonts';
import KnowledgeCheck from '../components/KnowledgeCheck';
import LessonEnd from '../components/LessonEnd';
import Footer from '../components/Footer';

export default class Lesson3 extends Component<any, any> {
  [key: string]: any;
  state = { docOpen: {}, tab: 0, ticks: {}, found: {}, cc: {} };
  renderVals() {
    const s = this.state,
      on = (b) => (b ? 'true' : 'false');
    const docs = [0, 1].map((i) => {
      const o = !!s.docOpen[i];
      const real = i === 1;
      return {
        label: real ? 'Handout B — Heading styles' : 'Handout A — bold, bigger text',
        how: real ? 'Titles use Heading 1, Heading 2 and Heading 3 from the Styles gallery.' : 'Titles were made bold and bigger with the font menu.',
        expanded: on(o),
        closed: !o,
        btn: o ? 'Close headings list' : 'Open headings list',
        toggle: () => this.setState((x) => ({ docOpen: Object.assign({}, x.docOpen, { [i]: !o }) })),
        resBg: real ? 'var(--ok-soft)' : 'var(--bad-soft)',
        resLine: real ? 'var(--ok)' : 'var(--bad)',
        resInk: real ? 'var(--ok)' : 'var(--bad)',
        resIcon: real ? 'fa-circle-check' : 'fa-circle-xmark',
        resTitle: real ? 'Headings list — 4 headings' : 'Headings list — no headings found',
        outline: real
          ? [
              { t: 'H1  Module handbook', pad: '0' },
              { t: 'H2  Assessment', pad: '1.25rem' },
              { t: 'H3  Essay deadline', pad: '2.5rem' },
              { t: 'H2  Reading list', pad: '1.25rem' },
            ]
          : [],
        resText: real
          ? 'A screen reader user can jump straight to “Essay deadline”. The navigation pane, tagged PDFs and Moodle all understand this structure too.'
          : 'To a screen reader this is one long run of text. The user has to listen from the top to find the deadline.',
      };
    });
    const APPS = [
      {
        label: 'Word',
        icon: 'fa-file-word',
        intro: 'Microsoft Word',
        steps: [
          ['Use Heading styles', 'Apply Heading 1 for the title, Heading 2 for sections, Heading 3 for sub-sections.', 'Home › Styles › Heading 1'],
          ['Use built-in lists', 'Real bullets and numbering are announced as lists, with the number of items.', 'Home › Bullets / Numbering'],
          ['Add alt text, or mark as decorative', 'Describe the purpose of the image in its context.', 'Right-click image › View Alt Text'],
          [
            'Write descriptive links',
            'Replace pasted URLs and “click here” with words that say where the link goes.',
            'Right-click link › Edit Hyperlink › Text to display',
          ],
          [
            'Mark table header rows',
            'Screen readers use header rows to announce each cell’s column.',
            'Table Design › Header Row · Layout › Repeat Header Rows',
          ],
          ['Set the title and language', 'The title is read out first; the language sets pronunciation.', 'File › Info › Properties · Review › Language'],
          ['Save as a tagged PDF', 'Keep the structure when you export.', 'File › Save As › PDF › Options › Document structure tags'],
        ],
      },
      {
        label: 'PowerPoint',
        icon: 'fa-file-powerpoint',
        intro: 'Microsoft PowerPoint',
        steps: [
          ['Build on slide layouts', 'Layouts give you real title and content placeholders.', 'Home › Layout'],
          [
            'Give every slide a unique title',
            'Titles are how people navigate a deck. “Continued” slides need their own titles too.',
            'Check Accessibility › Missing slide titles',
          ],
          ['Check the reading order', 'Objects are read in the order they were added, not how they look.', 'Review › Check Accessibility › Reading Order pane'],
          ['Add alt text, or mark as decorative', 'Include charts, SmartArt and icons.', 'Right-click object › View Alt Text'],
          ['Keep text large and high-contrast', 'Aim for 24pt or larger for body text and use a high-contrast theme.', 'Design › Variants › Colours'],
          ['Caption embedded video', 'Upload a WebVTT caption file for each video.', 'Playback › Insert Captions'],
          ['Export a tagged PDF', 'Keep the structure when you export.', 'File › Export › Create PDF › Options › Document structure tags'],
        ],
      },
      {
        label: 'PDF',
        icon: 'fa-file-pdf',
        intro: 'PDF and Adobe Acrobat',
        steps: [
          [
            'Start from an accessible source',
            'Fix headings, alt text and tables in Word or PowerPoint first — it’s far quicker.',
            'Your original .docx or .pptx',
          ],
          ['Export — don’t “print” to PDF', 'Printing to PDF throws away all the tags.', 'File › Save As / Export › PDF'],
          ['Scanned page? Run OCR', 'A scan is just a picture. OCR turns it into real text.', 'Acrobat › All tools › Scan & OCR › Recognise text'],
          [
            'Run the accessibility check',
            'Fix reading order, tags and missing alt text it reports.',
            'All tools › Prepare for accessibility › Check for accessibility',
          ],
          ['Set the title and language', 'Shown in the browser tab and read out first.', 'File › Properties › Description / Advanced'],
          [
            'Ask: does it need to be a PDF?',
            'A Moodle Page reflows on phones and works best with assistive technology.',
            'Moodle › Add an activity or resource › Page',
          ],
        ],
      },
    ];
    const A = APPS[s.tab];
    const tk = s.ticks[s.tab] || {};
    const tabs = APPS.map((a, i) => {
      const sel = i === s.tab;
      return {
        label: a.label,
        icon: a.icon,
        tid: 'app-tab-' + i,
        sel: on(sel),
        ti: sel ? 0 : -1,
        pick: () => this.setState({ tab: i }),
        line: sel ? 'var(--accent)' : 'transparent',
        ink: sel ? 'var(--accent-text)' : 'var(--muted)',
        iconInk: sel ? 'var(--accent)' : 'var(--muted)',
      };
    });
    const steps = A.steps.map((st, j) => {
      const o = !!tk[j];
      return {
        t: st[0],
        d: st[1],
        path: st[2],
        on: o,
        line: o ? 'var(--ok)' : 'var(--line)',
        bg: o ? 'var(--ok-soft)' : 'var(--surface)',
        toggle: () =>
          this.setState((x) => {
            const t = Object.assign({}, x.ticks);
            t[x.tab] = Object.assign({}, t[x.tab] || {}, { [j]: !o });
            return { ticks: t };
          }),
      };
    });
    const H = [
      {
        k: 'title',
        col: '1 / -1',
        row: '1',
        content: 'week 3: cell signalling',
        css: 'font-size:1.6rem;font-weight:700',
        issue: 'The title is a text box, not the title placeholder.',
        fix: 'Use a layout with a title placeholder, so the slide has a real title.',
      },
      {
        k: 'text',
        col: '1',
        row: '2',
        content: 'Receptors bind ligands and trigger an intracellular cascade. Key pathways covered this week: GPCR, RTK, JAK-STAT.',
        css: 'font-size:.95rem;color:#b5b5b5;line-height:1.45',
        issue: 'Light grey text on white fails contrast (about 2:1).',
        fix: 'Use dark text: at least 4.5:1 against the background.',
      },
      {
        k: 'img',
        col: '2',
        row: '2',
        content: '',
        css: 'display:grid;place-items:center;min-height:5rem;background:#e9eef3;border-radius:.4rem;color:#5b6b7a;font-size:1.8rem',
        issue: 'The micrograph has no alt text.',
        fix: 'Add alt text describing what students need to notice.',
      },
      {
        k: 'link',
        col: '1',
        row: '3',
        content: 'Click here for the paper',
        css: 'color:#0b57d0;text-decoration:underline;font-size:.95rem',
        issue: '“Click here” doesn’t say where the link goes.',
        fix: 'Use the paper’s title, e.g. “Smith et al. (2024), Nature Reviews”.',
      },
      {
        k: 'legend',
        col: '2',
        row: '3',
        content: '',
        css: 'display:flex;gap:.6rem;align-items:center;font-size:.85rem',
        issue: 'The key relies on red and green alone.',
        fix: 'Add text labels and distinct shapes or patterns.',
      },
    ];
    const order = Object.keys(s.found).sort((a, b) => s.found[a] - s.found[b]);
    const hot = H.map((h, i) => {
      const f = s.found[i] != null;
      const n = order.indexOf(String(i)) + 1;
      return Object.assign({}, h, {
        n,
        pressed: on(f),
        aria: 'Slide element: ' + (h.content || (h.k === 'img' ? 'micrograph image' : 'chart key')) + (f ? '. Issue found.' : ''),
        pick: () => {
          if (!f) this.setState((x) => ({ found: Object.assign({}, x.found, { [i]: Object.keys(x.found).length }) }));
        },
        line: f ? 'var(--accent)' : '#e3e1e6',
        bg: f ? 'rgba(209,3,115,.06)' : 'transparent',
        badge: f ? 'grid' : 'none',
        isTitle: h.k === 'title',
        isText: h.k === 'text',
        isImg: h.k === 'img',
        isLink: h.k === 'link',
        isLegend: h.k === 'legend',
      });
    });
    const foundList = order.map((k, j) => ({ n: j + 1, issue: H[k].issue, fix: H[k].fix }));
    const CC = [
      ['An image with no alt text at all', true, 'Yes — checkers reliably flag missing alt text.'],
      ['Alt text that just says “image1.png”', false, 'Usually not. The checker sees alt text exists; only a human can judge if it’s useful.'],
      ['A slide with no title', true, 'Yes — PowerPoint flags missing slide titles.'],
      ['Headings that skip from Heading 1 to Heading 4', true, 'Often yes — skipped levels are flagged in newer versions.'],
      ['Instructions that are confusing or full of jargon', false, 'No. Clear language needs human judgement.'],
      ['A chart that only uses colour to show meaning', false, 'No. Checkers can’t tell if colour carries meaning.'],
    ];
    const catches = CC.map((c, i) => {
      const pk = s.cc[i];
      const has = pk != null;
      const ok = pk === c[1];
      return {
        t: c[0],
        aria: 'Can the checker catch: ' + c[0],
        yes: () => this.setState((x) => ({ cc: Object.assign({}, x.cc, { [i]: true }) })),
        no: () => this.setState((x) => ({ cc: Object.assign({}, x.cc, { [i]: false }) })),
        pYes: on(pk === true),
        pNo: on(pk === false),
        bg: has ? (ok ? 'var(--ok-soft)' : 'var(--warn-soft)') : 'var(--surface-2)',
        line: has ? (ok ? 'var(--ok)' : 'var(--warn)') : 'var(--line)',
        noFb: !has,
        fbInk: ok ? 'var(--ok)' : 'var(--warn)',
        fb: (ok ? 'Right. ' : 'Not quite. ') + c[2],
      };
    });
    const nFound = order.length;
    return {
      docs,
      tabs,
      activeTid: 'app-tab-' + s.tab,
      appIntro: A.intro,
      steps,
      appCount: steps.filter((x) => x.on).length + ' of ' + steps.length + ' tried',
      tabKey: (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const nx = (s.tab + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
        this.setState({ tab: nx }, () => {
          const b = document.getElementById('app-tab-' + nx);
          b && b.focus();
        });
      },
      hot,
      foundList,
      foundText: nFound === 5 ? 'All five found — nice work.' : 'Found ' + nFound + ' of 5',
      revealAll: () => this.setState({ found: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 } }),
      catches,
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="min-h-[100vh] flex flex-col" data-lesson="3">
        <Topbar active="course" />
        <div className="ae-lesson-layout flex-1">
          <Sidebar current={3} />
          <main className="min-w-0 [outline:none]" id="main" data-read-root="" tabIndex={-1}>
            <LessonIntro lesson={3} />
            <div className="max-w-[var(--measure)] my-0 mx-auto pt-0 px-5 pb-8">
              <section className="py-10 px-0 mt-8 border-t border-t-line" id="headings" aria-labelledby="h-headings">
                <h2 className="text-[1.75rem] mb-2" id="h-headings">
                  Why real headings matter
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Screen reader users rarely read a document top to bottom. They pull up a list of headings and jump. These two handouts look identical — try
                  opening each one’s headings list.
                </p>
                <div className="ae-2col gap-4">
                  {v.docs?.map((d: any, i: number) => (
                    <div key={i} className="flex flex-col gap-[.9rem] p-[1.1rem] rounded-[1.25rem] bg-surface border border-line [box-shadow:var(--shadow)]">
                      <p className="m-0 text-[.8125rem] font-bold tracking-[.06em] uppercase text-muted">{d.label}</p>
                      <div
                        className="py-4 px-[1.1rem] rounded-[.75rem] border border-line bg-white text-[#1c1b1f] flex flex-col gap-[.45rem]"
                        aria-hidden="true"
                        style={{ fontFamily: "Calibri,Carlito,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif" }}
                      >
                        <span className="text-[1.35rem] font-bold">Module handbook</span>
                        <span className="text-[.8rem] text-[#555]">Welcome to BIO2004. This handbook explains how the module works…</span>
                        <span className="text-[1.05rem] font-bold">Assessment</span>
                        <span className="text-[.8rem] text-[#555]">There are two pieces of assessment…</span>
                        <span className="text-[.9rem] font-bold">Essay deadline</span>
                        <span className="text-[.8rem] text-[#555]">Submit via Turnitin by 12 noon…</span>
                        <span className="text-[1.05rem] font-bold">Reading list</span>
                      </div>
                      <p className="m-0 text-[.875rem] text-muted">{d.how}</p>
                      <button
                        className="flex items-center justify-center gap-2 min-h-11 py-2 px-4 rounded-[.65rem] border-0 bg-ink text-surface font-bold cursor-pointer"
                        type="button"
                        onClick={d.toggle}
                        aria-expanded={d.expanded}
                      >
                        <i className="fa-solid fa-list-ul" aria-hidden="true"></i>
                        {d.btn}
                      </button>
                      <div
                        className="py-[.9rem] px-4 rounded-[.75rem]"
                        hidden={d.closed}
                        aria-live="polite"
                        style={{ background: d.resBg, border: `1px solid ${d.resLine ?? ''}` }}
                      >
                        <p className="mt-0 mx-0 mb-[.4rem] font-bold" style={{ color: d.resInk }}>
                          <i className={`fa-solid ${d.resIcon ?? ''}`} aria-hidden="true"></i> {d.resTitle}
                        </p>
                        <ul className="list-none m-0 p-0 [font-family:ui-monospace,Menlo,monospace] text-[.875rem] flex flex-col gap-[.2rem]">
                          {d.outline?.map((o: any, j: number) => (
                            <li key={j} style={{ paddingLeft: o.pad }}>
                              {o.t}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-[.4rem] mx-0 mb-0 text-[.875rem]">{d.resText}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="apps" aria-labelledby="h-apps">
                <h2 className="text-[1.75rem] mb-2" id="h-apps">
                  Word, PowerPoint & PDF
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  The essential steps for each format, with where to find them in Microsoft 365. Tick them off as you try them on one of your own files.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] overflow-hidden [box-shadow:var(--shadow)]">
                  <div className="flex border-b border-b-line bg-surface-2 overflow-x-auto" role="tablist" aria-label="Application" onKeyDown={v.tabKey}>
                    {v.tabs?.map((t: any, i: number) => (
                      <button
                        key={i}
                        className="flex-1 min-h-13 py-3 px-4 border-0 bg-transparent font-bold cursor-pointer whitespace-nowrap"
                        type="button"
                        role="tab"
                        id={t.tid}
                        aria-controls="app-panel"
                        aria-selected={t.sel}
                        tabIndex={t.ti}
                        onClick={t.pick}
                        style={{ borderBottom: `3px solid ${t.line ?? ''}`, color: t.ink }}
                      >
                        <i className={`fa-solid ${t.icon ?? ''}`} aria-hidden="true" style={{ color: t.iconInk }}></i> {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="p-5" role="tabpanel" id="app-panel" aria-labelledby={v.activeTid}>
                    <div className="flex justify-between gap-4 items-center mb-[.9rem] flex-wrap">
                      <p className="m-0 font-bold">{v.appIntro}</p>
                      <span className="text-[.875rem] font-bold text-muted" aria-live="polite">
                        {v.appCount}
                      </span>
                    </div>
                    <ol className="list-none m-0 p-0 flex flex-col gap-2">
                      {v.steps?.map((s: any, i: number) => (
                        <li key={i}>
                          <label
                            className="flex gap-[.8rem] items-start py-[.8rem] px-[.9rem] rounded-[.75rem] cursor-pointer"
                            style={{ border: `1px solid ${s.line ?? ''}`, background: s.bg }}
                          >
                            <input
                              className="accent-accent w-[1.15rem] h-[1.15rem] mt-[.2rem] mx-0 mb-0 flex-none"
                              type="checkbox"
                              checked={!!s.on}
                              onChange={s.toggle}
                            />
                            <span className="flex flex-col gap-[.3rem] min-w-0">
                              <span className="font-bold">{s.t}</span>
                              <span className="text-[.9375rem] text-muted">{s.d}</span>
                              <span className="self-start text-[.8125rem] [font-family:ui-monospace,Menlo,monospace] py-[.15rem] px-2 rounded-[.4rem] bg-accent-soft text-accent-text">
                                {s.path}
                              </span>
                            </span>
                          </label>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="spot" aria-labelledby="h-spot">
                <h2 className="text-[1.75rem] mb-2" id="h-spot">
                  Spot the issues
                </h2>
                <p className="mt-0 mx-0 mb-[.4rem] text-[1.0625rem]">
                  This lecture slide has five accessibility problems. Select anything on the slide you think is a problem.
                </p>
                <p className="mt-0 mx-0 mb-4 font-bold text-accent-text" aria-live="polite">
                  {v.foundText}
                </p>
                <div
                  className="aspect-[16/9] min-h-72 max-[48em]:min-h-0 rounded-[1rem] bg-white text-[#1c1b1f] border border-line [box-shadow:var(--shadow)] p-[clamp(.9rem,3vw,1.75rem)] grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] grid-rows-[auto_1fr_auto] gap-[.75rem_1.25rem]"
                  style={{ fontFamily: "Calibri,Carlito,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif" }}
                >
                  {v.hot?.map((h: any, i: number) => (
                    <button
                      key={i}
                      className="relative text-left py-2 px-[.6rem] cursor-pointer text-inherit [font-family:inherit] flex flex-col justify-center gap-[.3rem] min-h-11 hover:border-accent!"
                      type="button"
                      onClick={h.pick}
                      aria-pressed={h.pressed}
                      aria-label={h.aria}
                      style={{ gridColumn: h.col, gridRow: h.row, border: `2px dashed ${h.line ?? ''}`, background: h.bg, borderRadius: '.6rem' }}
                    >
                      {h.isTitle ? (
                        <>
                          <span className="text-[1.6rem] font-bold">week 3: cell signalling</span>
                        </>
                      ) : null}
                      {h.isText ? (
                        <>
                          <span className="text-[.95rem] text-[#b5b5b5] leading-[1.45]">
                            Receptors bind ligands and trigger an intracellular cascade. Key pathways this week: GPCR, RTK, JAK-STAT.
                          </span>
                        </>
                      ) : null}
                      {h.isImg ? (
                        <>
                          <span className="grid place-items-center min-h-20 bg-[#e9eef3] rounded-[.4rem] text-[#5b6b7a] text-[1.8rem]">
                            <i className="fa-solid fa-microscope" aria-hidden="true"></i>
                          </span>
                        </>
                      ) : null}
                      {h.isLink ? (
                        <>
                          <span className="text-[#0b57d0] underline text-[.95rem]">Click here for the paper</span>
                        </>
                      ) : null}
                      {h.isLegend ? (
                        <>
                          <span className="flex flex-wrap gap-x-[.9rem] gap-y-[.2rem] items-center text-[.85rem]">
                            <span className="flex gap-[.3rem] items-center">
                              <span className="w-[.8rem] h-[.8rem] rounded-[50%] bg-[#2e9e3f]"></span>Normal
                            </span>
                            <span className="flex gap-[.3rem] items-center">
                              <span className="w-[.8rem] h-[.8rem] rounded-[50%] bg-[#d63a2f]"></span>Mutated
                            </span>
                          </span>
                        </>
                      ) : null}
                      <span
                        className="absolute top-[-.7rem] right-[-.7rem] w-[1.6rem] h-[1.6rem] rounded-[50%] bg-accent text-white font-extrabold text-[.8rem] place-items-center"
                        aria-hidden="true"
                        style={{ display: h.badge }}
                      >
                        {h.n}
                      </span>
                    </button>
                  ))}
                </div>
                <ol className="list-none mt-4 mx-0 mb-0 p-0 flex flex-col gap-2">
                  {v.foundList?.map((f: any, i: number) => (
                    <li key={i} className="flex gap-[.8rem] items-start py-[.85rem] px-4 rounded-[.75rem] bg-surface border border-line">
                      <span
                        className="flex-none w-[1.6rem] h-[1.6rem] rounded-[50%] bg-accent text-white font-extrabold text-[.8rem] grid place-items-center"
                        aria-hidden="true"
                      >
                        {f.n}
                      </span>
                      <span>
                        <strong>{f.issue}</strong> <span className="text-muted">Fix: {f.fix}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <button
                  className="mt-3 [background:none] border-0 text-accent font-bold cursor-pointer underline py-2 px-0"
                  type="button"
                  onClick={v.revealAll}
                >
                  Show me all five
                </button>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="checkers" aria-labelledby="h-checkers">
                <h2 className="text-[1.75rem] mb-2" id="h-checkers">
                  Using the checkers
                </h2>
                <p className="mt-0 mx-0 mb-4 text-[1.0625rem]">
                  Microsoft 365 and Adobe Acrobat Pro both have built-in accessibility checkers. Run them every time — then remember what they can’t judge.
                </p>
                <ul className="ae-3col list-none mt-0 mx-0 mb-6 p-0 gap-3">
                  <li className="p-4 rounded-[1rem] bg-surface border border-line flex flex-col gap-[.35rem]">
                    <i className="fa-solid fa-file-word text-accent text-[1.3rem]" aria-hidden="true"></i>
                    <strong>Word & PowerPoint</strong>
                    <span className="text-[.9375rem] text-muted">Review › Check Accessibility. Leave it open while you work.</span>
                  </li>
                  <li className="p-4 rounded-[1rem] bg-surface border border-line flex flex-col gap-[.35rem]">
                    <i className="fa-solid fa-file-pdf text-accent text-[1.3rem]" aria-hidden="true"></i>
                    <strong>Acrobat Pro</strong>
                    <span className="text-[.9375rem] text-muted">All tools › Prepare for accessibility › Check for accessibility.</span>
                  </li>
                  <li className="p-4 rounded-[1rem] bg-surface border border-line flex flex-col gap-[.35rem]">
                    <i className="fa-solid fa-graduation-cap text-accent text-[1.3rem]" aria-hidden="true"></i>
                    <strong>Moodle editor</strong>
                    <span className="text-[.9375rem] text-muted">The accessibility checker button in the text editor toolbar.</span>
                  </li>
                </ul>
                <div className="bg-surface border border-line rounded-[1.25rem] p-5 [box-shadow:var(--shadow)]">
                  <h3 className="font-ui text-[1.125rem] font-bold mb-[.9rem]">Can the checker catch it?</h3>
                  <ul className="list-none m-0 p-0 flex flex-col gap-2">
                    {v.catches?.map((c: any, i: number) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-center gap-[.5rem_1rem] py-[.7rem] px-[.85rem] rounded-[.75rem]"
                        style={{ background: c.bg, border: `1px solid ${c.line ?? ''}` }}
                      >
                        <span className="[flex:1_1_14rem]">{c.t}</span>
                        <span className="flex gap-[.35rem]" role="group" aria-label={c.aria}>
                          <button
                            className="min-w-[4rem] min-h-10 rounded-[.55rem] border border-line bg-surface font-bold cursor-pointer text-ink"
                            type="button"
                            onClick={c.yes}
                            aria-pressed={c.pYes}
                          >
                            Yes
                          </button>
                          <button
                            className="min-w-[4rem] min-h-10 rounded-[.55rem] border border-line bg-surface font-bold cursor-pointer text-ink"
                            type="button"
                            onClick={c.no}
                            aria-pressed={c.pNo}
                          >
                            No
                          </button>
                        </span>
                        <span className="basis-[100%] text-[.9rem]" hidden={c.noFb} style={{ color: c.fbInk }}>
                          {c.fb}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
              <DosDonts lesson={3} />
              <KnowledgeCheck lesson={3} />
              <LessonEnd lesson={3} />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}
