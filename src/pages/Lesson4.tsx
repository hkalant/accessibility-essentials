import { Component } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import LessonIntro from '../components/LessonIntro';
import DosDonts from '../components/DosDonts';
import KnowledgeCheck from '../components/KnowledgeCheck';
import LessonEnd from '../components/LessonEnd';
import Footer from '../components/Footer';

export default class Lesson4 extends Component<any, any> {
  [key: string]: any;
  state = { si: 0, sp: {}, fg: '#D10373', bg: '#FFFFFF', fgText: '#D10373', bgText: '#FFFFFF', cb: 'none', fix: false, after: false };
  lum(h) {
    h = h.replace('#', '');
    const v = [0, 2, 4].map((i) => {
      const c = parseInt(h.substr(i, 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  ratio(a, b) {
    const x = this.lum(a),
      y = this.lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  norm(v) {
    v = String(v || '').trim();
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9a-f]{3}$/i.test(v))
      v =
        '#' +
        v
          .slice(1)
          .split('')
          .map((c) => c + c)
          .join('');
    return /^#[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : null;
  }
  renderVals() {
    const s = this.state,
      on = (b) => (b ? 'true' : 'false');
    const types = [
      { icon: 'fa-circle-info', name: 'Informative', what: 'Conveys a fact or idea.', ex: '“Correct PPE: goggles, lab coat and gloves.”' },
      { icon: 'fa-feather', name: 'Decorative', what: 'Adds no information.', ex: 'Empty (alt="") or “Mark as decorative”.' },
      { icon: 'fa-link', name: 'Functional', what: 'A link or button.', ex: 'Describe the action: “Search”.' },
      { icon: 'fa-chart-column', name: 'Complex', what: 'Charts, diagrams, maps.', ex: 'Short summary, with full detail nearby.' },
    ];
    const SC = [
      {
        kind: 'Photograph',
        glyph: 'fa-flask',
        isPhoto: true,
        shows: 'A student in safety goggles, a white lab coat and blue nitrile gloves, pipetting at a fume cupboard.',
        context: 'On a slide titled “Before you start: what to wear in the lab”.',
        opts: [
          [
            'Image of a student in a lab',
            1,
            'Too vague — and “image of” is redundant.',
            'It misses the whole point of the slide: what the student is wearing.',
            '“Image, Image of a student in a lab”',
          ],
          [
            'Student wearing safety goggles, a lab coat and nitrile gloves while working at a fume cupboard',
            0,
            'Spot on.',
            'It captures exactly what the slide is teaching — the PPE — in one sentence.',
            '“Image, Student wearing safety goggles, a lab coat and nitrile gloves while working at a fume cupboard”',
          ],
          [
            '(empty — mark as decorative)',
            2,
            'This image carries the key information.',
            'Marking it decorative hides the PPE list from screen reader users.',
            '(image skipped — nothing announced)',
          ],
          ['IMG_4471.jpg', 2, 'Never use a file name.', 'It tells the listener nothing and sounds broken.', '“Image, I M G underscore 4 4 7 1 dot jpg”'],
        ],
      },
      {
        kind: 'Stock photo',
        glyph: 'fa-mug-hot',
        isPhoto: true,
        shows: 'A mug of coffee next to an open laptop on a wooden desk.',
        context: 'At the top of a “Welcome to the module” page. The photo is there for atmosphere; the welcome text is below.',
        opts: [
          [
            'A white ceramic mug of black coffee on a light oak desk beside a silver laptop with the screen open',
            1,
            'Accurate, but unnecessary.',
            'The photo adds no information. Describing it just makes people listen to filler.',
            '“Image, A white ceramic mug of black coffee on a light oak desk…”',
          ],
          [
            '(empty — mark as decorative)',
            0,
            'Right — it’s decorative.',
            'It’s purely for mood, so screen readers should skip it.',
            '(image skipped — nothing announced)',
          ],
          ['Coffee', 1, 'Short, but still noise.', 'If the image adds nothing, it’s better to skip it altogether.', '“Image, Coffee”'],
          ['Welcome image', 2, 'Meaningless.', 'This tells the listener nothing they need.', '“Image, Welcome image”'],
        ],
      },
      {
        kind: 'Bar chart',
        isChart: true,
        shows: 'A bar chart of average marks: Essay 62%, Exam 58%, Lab report 71%.',
        context: 'On a feedback slide. You ask the class: “Which assessment did the cohort do best in — and why?”',
        opts: [
          ['Bar chart', 2, 'Not enough.', 'It says what the image is, not what it shows.', '“Image, Bar chart”'],
          [
            'Bar chart of average marks: lab report highest at 71%, essay 62%, exam lowest at 58%',
            0,
            'Excellent.',
            'It gives the key comparison your question relies on. For bigger charts, add a data table too.',
            '“Image, Bar chart of average marks: lab report highest at 71%, essay 62%, exam lowest at 58%”',
          ],
          [
            'A blue bar chart with a white background, a vertical axis from 0 to 100 in steps of 10, three bars of different heights, labels underneath…',
            1,
            'Too much about appearance.',
            'Colours and axis ticks aren’t the point — the results are.',
            '“Image, A blue bar chart with a white background, a vertical axis…”',
          ],
          [
            'Chart showing results — see lecture',
            2,
            'Excludes the reader.',
            'It assumes the person can see the lecture slide.',
            '“Image, Chart showing results — see lecture”',
          ],
        ],
      },
      {
        kind: 'Linked logo',
        isLogo: true,
        shows: 'The Northbridge University crest and name. It sits in the page header and links to the university homepage.',
        context: 'In the header of your department’s Moodle landing page. Selecting it opens the university homepage.',
        opts: [
          [
            'Northbridge University logo',
            1,
            'Close, but it describes the picture.',
            'For a link, the alt text is the link’s name — describe where it goes.',
            '“Link, image, Northbridge University logo”',
          ],
          [
            'Northbridge University homepage',
            0,
            'Right — describe the destination.',
            'A functional image needs alt text that says what happens when you select it.',
            '“Link, Northbridge University homepage”',
          ],
          [
            '(empty — mark as decorative)',
            2,
            'This breaks the link.',
            'A link with an empty image has no name. Some screen readers read the URL instead.',
            '“Link, h t t p s colon slash slash www dot…”',
          ],
          [
            'Blue shield with an open book and a gold border',
            2,
            'Describes appearance, not purpose.',
            'The user needs to know where the link goes.',
            '“Link, image, Blue shield with an open book…”',
          ],
        ],
      },
      {
        kind: 'Diagram',
        glyph: 'fa-arrows-spin',
        isPhoto: true,
        shows: 'A negative feedback loop: body temperature rises, sensors detect it, the brain triggers sweating, temperature falls.',
        context: 'In a physiology Moodle page. The paragraph above the diagram doesn’t explain the loop.',
        opts: [
          ['Diagram', 2, 'Not enough.', 'A complex image needs a summary and a full description.', '“Image, Diagram”'],
          [
            'Negative feedback loop for body temperature. Described in full below the diagram.',
            0,
            'Best approach.',
            'Short alt text plus a full text description nearby — useful for everyone, not only screen reader users.',
            '“Image, Negative feedback loop for body temperature. Described in full below the diagram.”',
          ],
          [
            'Temperature rises above 37°C, thermoreceptors in the skin and hypothalamus detect the change, the hypothalamus signals sweat glands and dilates blood vessels, heat is lost…',
            1,
            'Right content, wrong place.',
            'Very long alt text can’t be navigated or paused easily. Put it in the page text instead.',
            '(a long, un-navigable announcement)',
          ],
          [
            '(empty — mark as decorative)',
            2,
            'This removes key teaching content.',
            'The diagram carries information that isn’t in the text.',
            '(image skipped — nothing announced)',
          ],
        ],
      },
    ];
    const k = s.si,
      sc = SC[k],
      pk = s.sp[k];
    const simOpts = sc.opts.map((o, j) => {
      const sel = pk === j;
      const grade = o[1];
      const col = sel ? (grade === 0 ? 'var(--ok)' : grade === 1 ? 'var(--warn)' : 'var(--bad)') : 'var(--line)';
      return {
        label: o[0],
        checked: sel,
        pick: () => this.setState((x) => ({ sp: Object.assign({}, x.sp, { [k]: j }) })),
        line: col,
        bg: sel ? (grade === 0 ? 'var(--ok-soft)' : grade === 1 ? 'var(--warn-soft)' : 'var(--bad-soft)') : 'var(--surface)',
      };
    });
    let simFb: any = { show: false };
    if (pk != null) {
      const o = sc.opts[pk];
      const g = o[1];
      simFb = {
        show: true,
        title: o[2],
        text: o[3],
        sr: o[4],
        icon: g === 0 ? 'fa-circle-check' : g === 1 ? 'fa-circle-exclamation' : 'fa-circle-xmark',
        ink: g === 0 ? 'var(--ok)' : g === 1 ? 'var(--warn)' : 'var(--bad)',
        bg: g === 0 ? 'var(--ok-soft)' : g === 1 ? 'var(--warn-soft)' : 'var(--bad-soft)',
        line: g === 0 ? 'var(--ok)' : g === 1 ? 'var(--warn)' : 'var(--bad)',
      };
    }
    const best = Object.keys(s.sp).filter((i) => SC[i].opts[s.sp[i]][1] === 0).length;
    const r = this.ratio(s.fg, s.bg),
      rr = Math.floor(r * 100) / 100;
    const T: [string, string, string, number][] = [
      ['Normal text', 'AA', '4.5:1', 4.5],
      ['Normal text', 'AAA', '7:1', 7],
      ['Large text', 'AA', '3:1', 3],
      ['Large text', 'AAA', '4.5:1', 4.5],
      ['UI components & graphics', 'AA', '3:1', 3],
    ];
    const tests = T.map((t) => {
      const ok = r >= t[3];
      return {
        name: t[0] + ' (' + t[1] + ')',
        need: 'needs ' + t[2],
        result: ok ? 'Pass' : 'Fail',
        icon: ok ? 'fa-circle-check' : 'fa-circle-xmark',
        ink: ok ? 'var(--ok)' : 'var(--bad)',
        bg: ok ? 'var(--ok-soft)' : 'var(--bad-soft)',
      };
    });
    const PR = [
      ['Pink on white', '#D10373', '#FFFFFF'],
      ['Mid grey on white', '#767676', '#FFFFFF'],
      ['Light grey on white', '#AAAAAA', '#FFFFFF'],
      ['White on pink', '#FFFFFF', '#D10373'],
      ['Yellow on white', '#FFD400', '#FFFFFF'],
      ['Off-white on charcoal', '#F2F2F2', '#1C1B1F'],
      ['Navy on pale blue', '#1B3A6B', '#DCE9F7'],
    ];
    const presets = PR.map((p) => {
      const sel = p[1] === s.fg && p[2] === s.bg;
      return {
        name: p[0],
        fg: p[1],
        bg: p[2],
        pressed: on(sel),
        line: sel ? 'var(--accent)' : 'var(--line)',
        pick: () => this.setState({ fg: p[1], bg: p[2], fgText: p[1], bgText: p[2] }),
      };
    });
    const setC = (key, v) => {
      const n = this.norm(v);
      this.setState(n ? { [key]: n, [key + 'Text']: n } : { [key + 'Text']: v });
    };
    const M = [
      ['none', 'Typical vision', 'none', 'Typical colour vision.'],
      ['protan', 'Protanopia', 'url(#cb-protan)', 'Reduced sensitivity to red. Red and green bars look almost the same muddy yellow.'],
      ['deutan', 'Deuteranopia', 'url(#cb-deutan)', 'The most common type. Pass and fail are very hard to tell apart.'],
      ['tritan', 'Tritanopia', 'url(#cb-tritan)', 'Rare: blue and yellow are affected. Red and green remain distinct.'],
      ['achroma', 'Monochrome', 'url(#cb-achroma)', 'No colour at all — the same as printing in greyscale.'],
    ];
    const mode = M.find((m) => m[0] === s.cb) || M[0];
    const cbModes = M.map((m) => {
      const sel = m[0] === s.cb;
      return {
        label: m[1],
        sel: on(sel),
        pick: () => this.setState({ cb: m[0] }),
        line: sel ? 'var(--accent)' : 'var(--line)',
        bg: sel ? 'var(--accent)' : 'var(--surface)',
        ink: sel ? 'var(--accent-ink)' : 'var(--ink)',
      };
    });
    const D = [
      [70, 30],
      [62, 38],
      [81, 19],
      [55, 45],
    ];
    const bars = D.map((d) => ({ pass: d[0] + '%', fail: d[1] + '%', passN: d[0], failN: d[1] }));
    const pv = (b, a) => ({ bg: b ? a : 'transparent', ink: b ? '#fff' : 'var(--ink)', sel: on(b) });
    const BF = pv(!s.after, 'var(--bad)'),
      AF = pv(s.after, 'var(--ok)');
    return {
      types,
      sc,
      simOpts,
      simFb,
      simName: 'alt-sim-' + k,
      simLabel: 'Scenario ' + (k + 1) + ' of ' + SC.length,
      simScore: best ? best + ' best answer' + (best > 1 ? 's' : '') + ' so far' : '',
      simFirst: k === 0,
      simLast: k === SC.length - 1,
      simPrevOp: k === 0 ? 0.45 : 1,
      simNextOp: k === SC.length - 1 ? 0.45 : 1,
      simPrev: () => this.setState({ si: Math.max(0, k - 1) }),
      simNext: () => this.setState({ si: Math.min(SC.length - 1, k + 1) }),
      fg: s.fg,
      bg: s.bg,
      fgText: s.fgText,
      bgText: s.bgText,
      ratio: rr.toFixed(2) + ':1',
      verdict:
        r >= 7
          ? 'Excellent — passes every test'
          : r >= 4.5
            ? 'Good — passes AA for all text'
            : r >= 3
              ? 'Large text and UI only'
              : 'Fails — too low for any text',
      verdictInk: r >= 4.5 ? 'var(--ok)' : r >= 3 ? 'var(--warn)' : 'var(--bad)',
      tests,
      presets,
      setFgPick: (e) => setC('fg', e.target.value),
      setBgPick: (e) => setC('bg', e.target.value),
      setFgText: (e) => setC('fg', e.target.value),
      setBgText: (e) => setC('bg', e.target.value),
      swap: () => this.setState({ fg: s.bg, bg: s.fg, fgText: s.bg, bgText: s.fg }),
      cbModes,
      cbFilter: mode[2],
      cbNote: mode[3] + (s.fix ? ' With labels and patterns, the chart still works.' : ''),
      cbAlt: 'Bar chart of weekly quiz results, pass versus fail, simulated as ' + mode[1],
      bars,
      passFill: s.fix ? 'repeating-linear-gradient(45deg,#2e9e3f 0 5px,#1f7a2e 5px 8px)' : '#2e9e3f',
      failFill: s.fix ? '#d63a2f' : '#d63a2f',
      labelDisp: s.fix ? 'inline' : 'none',
      passKey: s.fix ? 'Pass (striped)' : 'Pass',
      failKey: s.fix ? 'Fail (solid)' : 'Fail',
      statusA: s.fix ? 'Complete' : '',
      statusB: s.fix ? 'In progress' : '',
      statusC: s.fix ? 'Not started' : '',
      fixSel: on(s.fix),
      fixIcon: s.fix ? 'fa-rotate-left' : 'fa-wand-magic-sparkles',
      fixLabel: s.fix ? 'Remove the fix' : 'Apply the fix: labels and patterns',
      toggleFix: () => this.setState({ fix: !s.fix }),
      beforeSel: BF.sel,
      afterSel: AF.sel,
      beforeBg: BF.bg,
      beforeInk: BF.ink,
      afterBg: AF.bg,
      afterInk: AF.ink,
      hideBefore: s.after,
      hideAfter: !s.after,
      showBefore: () => this.setState({ after: false }),
      showAfter: () => this.setState({ after: true }),
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="min-h-[100vh] flex flex-col" data-lesson="4">
        <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
          <filter id="cb-protan" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"></feColorMatrix>
          </filter>{' '}
          <filter id="cb-deutan" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"></feColorMatrix>
          </filter>{' '}
          <filter id="cb-tritan" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"></feColorMatrix>
          </filter>{' '}
          <filter id="cb-achroma" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0"></feColorMatrix>
          </filter>
        </svg>
        <Topbar active="course" />
        <div className="ae-lesson-layout flex-1">
          <Sidebar current={4} />
          <main className="min-w-0 [outline:none]" id="main" data-read-root="" tabIndex={-1}>
            <LessonIntro lesson={4} />
            <div className="max-w-[var(--measure)] my-0 mx-auto pt-0 px-5 pb-8">
              <section className="py-10 px-0 mt-8 border-t border-t-line" id="alt-text" aria-labelledby="h-alt">
                <h2 className="text-[1.75rem] mb-2" id="h-alt">
                  Alt text essentials
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Alt text is read aloud in place of an image. Good alt text isn’t a description of the picture — it’s the{' '}
                  <strong>information or function the image provides in that context</strong>. The same photo can need different alt text on different pages.
                </p>
                <div className="ae-4col gap-3">
                  {v.types?.map((t: any, i: number) => (
                    <article key={i} className="flex flex-col gap-2 p-[1.1rem] rounded-[1rem] bg-surface border border-line">
                      <i className={`fa-solid ${t.icon ?? ''} text-accent text-[1.3rem]`} aria-hidden="true"></i>
                      <h3 className="font-ui text-[1.0625rem] font-bold">{t.name}</h3>
                      <p className="m-0 text-[.9375rem] text-muted">{t.what}</p>
                      <p className="mt-auto mx-0 mb-0 text-[.875rem] py-2 px-[.6rem] rounded-[.5rem] bg-accent-soft">
                        <strong>Alt:</strong> {t.ex}
                      </p>
                    </article>
                  ))}
                </div>
                <ul className="mt-5 mx-0 mb-0 pl-5 flex flex-col gap-[.35rem]">
                  <li>Keep it concise — usually a sentence. Screen readers already say “image”, so skip “image of”.</li>
                  <li>Put complex detail (like a chart’s data) in the text or a table, with short alt text pointing to it.</li>
                  <li>Never put important information only in an image of text.</li>
                </ul>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="alt-sim" aria-labelledby="h-altsim">
                <h2 className="text-[1.75rem] mb-2" id="h-altsim">
                  Alt text simulator
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Read the scenario, then pick the alt text you’d write. You’ll hear what a screen reader user would get.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] [box-shadow:var(--shadow)] overflow-hidden">
                  <div className="flex justify-between items-center gap-4 py-[.9rem] px-5 border-b border-b-line flex-wrap">
                    <p className="m-0 font-bold text-muted">{v.simLabel}</p>
                    <p className="m-0 font-bold text-accent-text" aria-live="polite">
                      {v.simScore}
                    </p>
                  </div>
                  <div className="ae-2col gap-0">
                    <div className="p-5 flex flex-col gap-4 border-r border-r-line">
                      <figure className="m-0 rounded-[.875rem] overflow-hidden border border-line bg-surface-2">
                        <div className="aspect-[4/3] flex items-center justify-center bg-[#eef1f4] text-[#34495e] relative" aria-hidden="true">
                          {v.sc.isPhoto ? (
                            <>
                              <div className="flex flex-col items-center gap-[.6rem] p-4 text-center">
                                <i className={`fa-solid ${v.sc.glyph ?? ''} text-[3.25rem] text-[#50657a]`}></i>
                                <span className="text-[.8125rem] font-bold tracking-[.06em] uppercase text-[#50657a]">{v.sc.kind}</span>
                              </div>
                            </>
                          ) : null}
                          {v.sc.isChart ? (
                            <>
                              <div className="w-[80%] h-[72%] flex items-end gap-[10%] border-l-2 border-l-[#50657a] border-b-2 border-b-[#50657a] py-0 px-[8%]">
                                <div className="flex-1 flex flex-col items-center gap-[.3rem] h-full justify-end">
                                  <span className="text-[.75rem] font-bold">62%</span>
                                  <div className="w-full h-[62%] bg-[#3b6ea5] rounded-[.25rem_.25rem_0_0]"></div>
                                  <span className="text-[.7rem] absolute bottom-[.4rem]"></span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-[.3rem] h-full justify-end">
                                  <span className="text-[.75rem] font-bold">58%</span>
                                  <div className="w-full h-[58%] bg-[#3b6ea5] rounded-[.25rem_.25rem_0_0]"></div>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-[.3rem] h-full justify-end">
                                  <span className="text-[.75rem] font-bold">71%</span>
                                  <div className="w-full h-[71%] bg-[#3b6ea5] rounded-[.25rem_.25rem_0_0]"></div>
                                </div>
                              </div>
                            </>
                          ) : null}
                          {v.sc.isLogo ? (
                            <>
                              <div className="flex items-center gap-3 py-[.9rem] px-[1.2rem] rounded-[.6rem] bg-white [box-shadow:0_1px_4px_rgba(0,0,0,.12)]">
                                <span className="w-12 h-[3.4rem] rounded-[.4rem_.4rem_1.5rem_1.5rem] bg-[#1b3a6b] text-[#f5c542] grid place-items-center text-[1.2rem]">
                                  <i className="fa-solid fa-book-open"></i>
                                </span>
                                <span className="[font-family:Georgia,serif] font-bold text-[1.2rem] text-[#1b3a6b] leading-[1.1]">
                                  Northbridge
                                  <br />
                                  University
                                </span>
                              </div>
                            </>
                          ) : null}
                        </div>
                        <figcaption className="py-3 px-[.9rem] text-[.875rem] border-t border-t-line">
                          <strong>What the image shows:</strong> {v.sc.shows}
                        </figcaption>
                      </figure>
                      <div className="py-[.9rem] px-4 rounded-[.75rem] bg-accent-soft border border-accent-line">
                        <p className="mt-0 mx-0 mb-[.2rem] text-[.75rem] font-extrabold tracking-[.06em] uppercase text-accent-text">Scenario</p>
                        <p className="m-0">{v.sc.context}</p>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-[.9rem]">
                      <fieldset className="border-0 m-0 p-0 flex flex-col gap-2">
                        <legend className="font-bold mb-2 p-0">Which alt text would you write?</legend>
                        {v.simOpts?.map((o: any, i: number) => (
                          <label
                            key={i}
                            className="flex gap-3 items-start py-[.8rem] px-[.9rem] rounded-[.75rem] cursor-pointer"
                            style={{ border: `2px solid ${o.line ?? ''}`, background: o.bg }}
                          >
                            <input
                              className="accent-accent w-[1.1rem] h-[1.1rem] mt-[.2rem] mx-0 mb-0 flex-none"
                              type="radio"
                              name={v.simName}
                              checked={!!o.checked}
                              onChange={o.pick}
                            />
                            <span className="[font-family:ui-monospace,Menlo,monospace] text-[.875rem] leading-[1.5]">{o.label}</span>
                          </label>
                        ))}
                      </fieldset>
                      <div aria-live="polite">
                        {v.simFb.show ? (
                          <>
                            <div
                              className="py-[.9rem] px-4 rounded-[.75rem] flex flex-col gap-2"
                              style={{ background: v.simFb.bg, border: `1px solid ${v.simFb.line ?? ''}` }}
                            >
                              <p className="m-0 font-bold" style={{ color: v.simFb.ink }}>
                                <i className={`fa-solid ${v.simFb.icon ?? ''}`} aria-hidden="true"></i> {v.simFb.title}
                              </p>
                              <p className="m-0">{v.simFb.text}</p>
                              <p className="m-0 text-[.875rem] py-2 px-[.65rem] rounded-[.5rem] bg-surface flex gap-2 items-start">
                                <i className="fa-solid fa-volume-high text-accent mt-[.2rem]" aria-hidden="true"></i>
                                <span>
                                  <strong>Screen reader:</strong> {v.simFb.sr}
                                </span>
                              </p>
                            </div>
                          </>
                        ) : null}
                      </div>
                      <div className="flex justify-between gap-2 mt-[auto] pt-2">
                        <button
                          className="inline-flex items-center gap-2 min-h-11 py-2 px-4 rounded-[.65rem] border border-line bg-surface text-ink font-bold cursor-pointer"
                          type="button"
                          onClick={v.simPrev}
                          disabled={v.simFirst}
                          style={{ opacity: v.simPrevOp }}
                        >
                          <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>Previous
                        </button>
                        <button
                          className="inline-flex items-center gap-2 min-h-11 py-2 px-4 rounded-[.65rem] border-0 bg-accent text-accent-ink font-bold cursor-pointer"
                          type="button"
                          onClick={v.simNext}
                          disabled={v.simLast}
                          style={{ opacity: v.simNextOp }}
                        >
                          Next scenario<i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="contrast" aria-labelledby="h-contrast">
                <h2 className="text-[1.75rem] mb-2" id="h-contrast">
                  Colour contrast checker
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Low contrast is the most common accessibility failure on the web. Pick two colours, or try a preset, and see which WCAG tests they pass.
                </p>
                <div className="ae-split gap-4 items-stretch">
                  <div
                    className="rounded-[1.25rem] border border-line overflow-hidden flex flex-col min-h-88 [transition:background_.2s,color_.2s]"
                    aria-label="Preview"
                    role="region"
                    style={{ background: v.bg, color: v.fg }}
                  >
                    <div className="p-6 flex flex-col gap-[.9rem] flex-1">
                      <p className="m-0 text-[.75rem] font-extrabold tracking-[.08em] uppercase">Preview</p>
                      <p className="m-0 font-display text-[1.75rem] font-bold leading-[1.2]">Week 5: Research methods</p>
                      <p className="m-0 text-[1rem]">
                        This week we compare qualitative and quantitative approaches. Read the chapter before Tuesday’s seminar and bring one example from your
                        own discipline.
                      </p>
                      <p className="m-0 text-[1rem]">
                        Reading: <span className="underline font-semibold">Bryman, Social Research Methods, chapter 2</span>
                      </p>
                      <div className="flex gap-[.6rem] items-center flex-wrap mt-[auto]">
                        <span
                          className="inline-flex items-center gap-[.4rem] py-[.55rem] px-4 rounded-[.6rem] font-bold"
                          style={{ border: `2px solid ${v.fg ?? ''}` }}
                        >
                          <i className="fa-solid fa-upload" aria-hidden="true"></i>Submit essay
                        </span>
                        <span className="text-[.8125rem]">Small print: due 12 noon, Friday</span>
                      </div>
                    </div>
                  </div>
                  <div className="ae-first-s rounded-[1.25rem] border border-line bg-surface p-5 flex flex-col gap-4 [box-shadow:var(--shadow)]">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-[.6rem] [align-items:end]">
                      <div className="flex flex-col gap-[.35rem]">
                        <label className="font-bold text-[.875rem]" htmlFor="fg-hex">
                          Text colour
                        </label>
                        <div className="flex gap-[.4rem] items-center">
                          <input
                            className="w-11 h-11 p-0 border border-line rounded-[.5rem] [background:none] cursor-pointer flex-none"
                            type="color"
                            value={v.fg ?? ''}
                            onChange={v.setFgPick}
                            aria-label="Text colour picker"
                          />
                          <input
                            className="w-full min-w-0 min-h-11 py-0 px-[.6rem] rounded-[.5rem] border border-line bg-surface [font-family:ui-monospace,Menlo,monospace] uppercase"
                            id="fg-hex"
                            type="text"
                            value={v.fgText ?? ''}
                            onChange={v.setFgText}
                            spellCheck="false"
                          />
                        </div>
                      </div>
                      <button
                        className="w-11 h-11 rounded-[50%] border border-line bg-surface-2 cursor-pointer text-ink"
                        type="button"
                        onClick={v.swap}
                        aria-label="Swap text and background colours"
                      >
                        <i className="fa-solid fa-right-left" aria-hidden="true"></i>
                      </button>
                      <div className="flex flex-col gap-[.35rem]">
                        <label className="font-bold text-[.875rem]" htmlFor="bg-hex">
                          Background
                        </label>
                        <div className="flex gap-[.4rem] items-center">
                          <input
                            className="w-11 h-11 p-0 border border-line rounded-[.5rem] [background:none] cursor-pointer flex-none"
                            type="color"
                            value={v.bg ?? ''}
                            onChange={v.setBgPick}
                            aria-label="Background colour picker"
                          />
                          <input
                            className="w-full min-w-0 min-h-11 py-0 px-[.6rem] rounded-[.5rem] border border-line bg-surface [font-family:ui-monospace,Menlo,monospace] uppercase"
                            id="bg-hex"
                            type="text"
                            value={v.bgText ?? ''}
                            onChange={v.setBgText}
                            spellCheck="false"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-3 flex-wrap py-[.9rem] px-4 rounded-[.875rem] bg-surface-2" aria-live="polite">
                      <span className="font-display text-[2.5rem] font-bold tabular-nums">{v.ratio}</span>
                      <span className="font-bold" style={{ color: v.verdictInk }}>
                        {v.verdict}
                      </span>
                    </div>
                    <ul className="list-none m-0 p-0 flex flex-col gap-[.35rem]" aria-label="WCAG tests">
                      {v.tests?.map((t: any, i: number) => (
                        <li key={i} className="flex items-center gap-[.65rem] py-2 px-[.7rem] rounded-[.6rem]" style={{ background: t.bg }}>
                          <i className={`fa-solid ${t.icon ?? ''}`} aria-hidden="true" style={{ color: t.ink }}></i>
                          <span className="flex-1">
                            <strong>{t.name}</strong> <span className="text-muted text-[.875rem]">{t.need}</span>
                          </span>
                          <span className="font-extrabold text-[.8125rem]" style={{ color: t.ink }}>
                            {t.result}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div>
                      <p className="mt-0 mx-0 mb-2 font-bold text-[.875rem]">Presets</p>
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-[.4rem]">
                        {v.presets?.map((p: any, i: number) => (
                          <button
                            key={i}
                            className="flex items-center gap-2 min-h-11 py-[.4rem] px-[.55rem] rounded-[.6rem] bg-surface cursor-pointer text-left text-ink text-[.8125rem] font-semibold"
                            type="button"
                            onClick={p.pick}
                            aria-pressed={p.pressed}
                            style={{ border: `2px solid ${p.line ?? ''}` }}
                          >
                            <span
                              className="flex-none w-[1.9rem] h-[1.9rem] rounded-[.4rem] grid place-items-center font-extrabold text-[.85rem] border border-[rgba(0,0,0,.12)]"
                              aria-hidden="true"
                              style={{ background: p.bg, color: p.fg }}
                            >
                              Aa
                            </span>
                            <span className="leading-[1.25]">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="colour-blind" aria-labelledby="h-cb">
                <h2 className="text-[1.75rem] mb-2" id="h-cb">
                  Colour vision simulator
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  About 1 in 12 men and 1 in 200 women have a colour vision deficiency — in a lecture of 150 students, several are likely to be affected. See
                  how a red/green progress chart looks to them, then apply the fix.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] [box-shadow:var(--shadow)] overflow-hidden">
                  <div className="flex flex-wrap gap-[.4rem] py-4 px-5 border-b border-b-line" role="radiogroup" aria-label="Simulate colour vision">
                    {v.cbModes?.map((m: any, i: number) => (
                      <button
                        key={i}
                        className="min-h-10 py-[.4rem] px-[.85rem] rounded-full font-bold text-[.875rem] cursor-pointer"
                        type="button"
                        role="radio"
                        aria-checked={m.sel}
                        onClick={m.pick}
                        style={{ border: `1px solid ${m.line ?? ''}`, background: m.bg, color: m.ink }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <div className="p-5">
                    <div
                      className="bg-white text-[#1c1b1f] rounded-[.875rem] border border-[#e3e1e6] p-[1.1rem] flex flex-col gap-4 [transition:filter_.3s]"
                      aria-label={v.cbAlt}
                      role="img"
                      style={{ filter: v.cbFilter }}
                    >
                      <p className="m-0 font-bold">Weekly quiz results — pass vs fail</p>
                      <div className="flex items-end gap-4 h-36 border-b-2 border-b-[#555] py-0 px-2">
                        {v.bars?.map((b: any, i: number) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-[.3rem] h-full justify-end">
                            <div className="flex gap-[3px] items-end h-full w-full justify-center">
                              <div className="w-[42%] rounded-[.2rem_.2rem_0_0] relative" style={{ height: b.pass, background: v.passFill }}>
                                <span className="absolute top-[-1.2rem] left-0 right-0 text-center text-[.7rem] font-bold" style={{ display: v.labelDisp }}>
                                  {b.passN}
                                </span>
                              </div>
                              <div className="w-[42%] rounded-[.2rem_.2rem_0_0] relative" style={{ height: b.fail, background: v.failFill }}>
                                <span className="absolute top-[-1.2rem] left-0 right-0 text-center text-[.7rem] font-bold" style={{ display: v.labelDisp }}>
                                  {b.failN}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-around text-[.8rem] mt-[-.6rem]">
                        <span>Wk 1</span>
                        <span>Wk 2</span>
                        <span>Wk 3</span>
                        <span>Wk 4</span>
                      </div>
                      <div className="flex gap-5 flex-wrap text-[.875rem]">
                        <span className="flex gap-[.4rem] items-center">
                          <span className="w-4 h-4 rounded-[.2rem]" style={{ background: v.passFill }}></span>
                          {v.passKey}
                        </span>
                        <span className="flex gap-[.4rem] items-center">
                          <span className="w-4 h-4 rounded-[.2rem]" style={{ background: v.failFill }}></span>
                          {v.failKey}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-[.4rem] py-[.35rem] px-[.7rem] rounded-full bg-[#2e9e3f] text-white text-[.8125rem] font-bold">
                          <i className="fa-solid fa-check" style={{ display: v.labelDisp }}></i>
                          {v.statusA}
                        </span>
                        <span className="inline-flex items-center gap-[.4rem] py-[.35rem] px-[.7rem] rounded-full bg-[#e0a800] text-[#1c1b1f] text-[.8125rem] font-bold">
                          <i className="fa-solid fa-hourglass-half" style={{ display: v.labelDisp }}></i>
                          {v.statusB}
                        </span>
                        <span className="inline-flex items-center gap-[.4rem] py-[.35rem] px-[.7rem] rounded-full bg-[#d63a2f] text-white text-[.8125rem] font-bold">
                          <i className="fa-solid fa-xmark" style={{ display: v.labelDisp }}></i>
                          {v.statusC}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center justify-between mt-4">
                      <p className="m-0 [flex:1_1_18rem] text-[.9375rem]" aria-live="polite">
                        {v.cbNote}
                      </p>
                      <button
                        className="inline-flex items-center gap-2 min-h-11 py-2 px-4 rounded-[.65rem] border-0 bg-accent text-accent-ink font-bold cursor-pointer"
                        type="button"
                        role="switch"
                        aria-checked={v.fixSel}
                        onClick={v.toggleFix}
                      >
                        <i className={`fa-solid ${v.fixIcon ?? ''}`} aria-hidden="true"></i>
                        {v.fixLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <section className="py-10 px-0 border-t border-t-line" id="visual" aria-labelledby="h-visual">
                <h2 className="text-[1.75rem] mb-2" id="h-visual">
                  Visual design choices
                </h2>
                <p className="mt-0 mx-0 mb-5 text-[1.0625rem]">
                  Small layout decisions change how easy text is to read — especially for people with dyslexia, low vision or visual stress. Flip between the
                  two versions.
                </p>
                <div className="bg-surface border border-line rounded-[1.25rem] [box-shadow:var(--shadow)] overflow-hidden">
                  <div className="flex justify-between items-center gap-4 py-4 px-5 border-b border-b-line flex-wrap">
                    <p className="m-0 font-bold">Assessment brief</p>
                    <div className="flex p-1 rounded-full bg-surface-2 border border-line" role="radiogroup" aria-label="Version">
                      <button
                        className="min-h-10 py-[.4rem] px-4 rounded-full border-0 font-bold cursor-pointer"
                        type="button"
                        role="radio"
                        aria-checked={v.beforeSel}
                        onClick={v.showBefore}
                        style={{ background: v.beforeBg, color: v.beforeInk }}
                      >
                        Before
                      </button>
                      <button
                        className="min-h-10 py-[.4rem] px-4 rounded-full border-0 font-bold cursor-pointer"
                        type="button"
                        role="radio"
                        aria-checked={v.afterSel}
                        onClick={v.showAfter}
                        style={{ background: v.afterBg, color: v.afterInk }}
                      >
                        After
                      </button>
                    </div>
                  </div>
                  <div className="p-5 bg-white text-[#1c1b1f]">
                    <p
                      className="m-0 [text-align:justify] text-[.8rem] leading-[1.25] uppercase italic tracking-[0] [font-family:Georgia,serif]"
                      hidden={v.hideBefore}
                    >
                      IMPORTANT: YOUR ESSAY MUST CRITICALLY EVALUATE TWO THEORETICAL FRAMEWORKS DISCUSSED IN LECTURES 3–6, DRAWING ON AT LEAST SIX PEER-REVIEWED
                      SOURCES, AND SHOULD BE SUBMITTED THROUGH TURNITIN BY 12 NOON ON FRIDAY 14 MARCH. LATE SUBMISSIONS WITHOUT AN EXTENSION WILL BE CAPPED AT
                      THE PASS MARK IN LINE WITH UNIVERSITY POLICY.
                    </p>
                    <div className="max-w-[36rem] text-[1.0625rem] leading-[1.6]" hidden={v.hideAfter}>
                      <p className="mt-0 mx-0 mb-[.6rem] font-bold">Deadline: 12 noon, Friday 14 March (via Turnitin)</p>
                      <p className="mt-0 mx-0 mb-[.4rem]">Your essay should:</p>
                      <ul className="mt-0 mx-0 mb-[.6rem] pl-5">
                        <li>critically evaluate two frameworks from lectures 3–6</li>
                        <li>draw on at least six peer-reviewed sources</li>
                      </ul>
                      <p className="m-0">Late work without an extension is capped at the pass mark.</p>
                    </div>
                  </div>
                  <ul className="m-0 pt-4 pr-5 pb-5 pl-10 border-t border-t-line flex flex-col gap-[.3rem] text-[.9375rem]">
                    <li>Left-aligned, not justified — no uneven “rivers” of white space</li>
                    <li>Sentence case, not capitals — word shapes stay recognisable</li>
                    <li>No long italic runs; bold used sparingly for the key fact</li>
                    <li>Short lines (about 70 characters), generous line height, and a list for the requirements</li>
                  </ul>
                </div>
                <p className="mt-4 mx-0 mb-0 flex gap-2 text-[.9375rem]">
                  <i className="fa-solid fa-triangle-exclamation text-warn mt-1" aria-hidden="true"></i>
                  <span>Avoid anything that flashes more than three times a second, including GIFs in slides. It can trigger seizures (WCAG 2.3.1).</span>
                </p>
              </section>
              <DosDonts lesson={4} />
              <KnowledgeCheck lesson={4} />
              <LessonEnd lesson={4} />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}
