import { Component, createElement, createRef } from 'react';
import { AE } from '../lib/ae';
import { on } from '../lib/events';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

export default class ProgressPage extends Component<any, any> {
  [key: string]: any;
  state = { preview: false, confirm: false, shown: 0, inView: false, settled: false };
  sumRef = createRef<HTMLElement>();
  reduce() {
    return AE.prefs.reducedMotion();
  }
  target() {
    return Math.round((AE.progress.doneCount() / AE.lessons.length) * 100);
  }
  animateTo(to) {
    cancelAnimationFrame(this._raf);
    const from = this.state.shown;
    if (this.reduce() || from === to) {
      if (from !== to) this.setState({ shown: to });
      return;
    }
    const t0 = performance.now(),
      dur = 1100,
      step = (now) => {
        const p = Math.min(1, (now - t0) / dur),
          e = 1 - Math.pow(1 - p, 3);
        this.setState({ shown: Math.round(from + (to - from) * e) });
        if (p < 1) this._raf = requestAnimationFrame(step);
      };
    this._raf = requestAnimationFrame(step);
  }
  reveal() {
    if (this.state.inView) return;
    const r = this.reduce();
    this.setState({ inView: true, settled: r });
    this.animateTo(this.target());
    if (!r) this._st = setTimeout(() => this.setState({ settled: true }), 1400);
  }
  observe() {
    const el = this.sumRef.current;
    // No animation to wait for: show it straight away.
    if (this.reduce()) return this.reveal();
    if (el && 'IntersectionObserver' in window) {
      this._io = new IntersectionObserver(
        (es) => {
          if (es.some((x) => x.isIntersecting)) {
            this._io.disconnect();
            this.reveal();
          }
        },
        // Trigger on entering the viewport, not on a share of the section's height:
        // a tall section on a small or zoomed screen may never be 20% visible.
        { rootMargin: '0px 0px -15% 0px' },
      );
      this._io.observe(el);
    } else this.reveal();
  }
  componentDidMount() {
    this._u = () => {
      this.forceUpdate();
      if (this.state.inView) this.animateTo(this.target());
    };
    this._off = on(['ae:progress', 'ae:prefs'], this._u);
    this.observe();
  }
  componentWillUnmount() {
    this._off();
    this._io && this._io.disconnect();
    cancelAnimationFrame(this._raf);
    clearTimeout(this._st);
  }
  esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  svg(name, date, preview) {
    const nm = this.esc(name || 'Your name');
    const fs = nm.length > 26 ? 22 : nm.length > 18 ? 27 : 32;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="Accessibility Essentials digital badge">
<title>Accessibility Essentials — awarded to ${nm}</title>
<defs><path id="ring" d="M300,300 m-242,0 a242,242 0 1,1 484,0 a242,242 0 1,1 -484,0"/></defs>
<circle cx="300" cy="300" r="296" fill="#D10373"/>
<circle cx="300" cy="300" r="282" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
<text font-family="Helvetica, Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="5" fill="#fff"><textPath href="#ring" startOffset="0">ACCESSIBILITY ESSENTIALS · UK HIGHER EDUCATION · CPD · INCLUSIVE BY DESIGN ·</textPath></text>
<circle cx="300" cy="300" r="212" fill="#fff"/>
<circle cx="300" cy="300" r="202" fill="none" stroke="#D10373" stroke-opacity=".25" stroke-width="2"/>
<g stroke="#D10373" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none">
<line x1="228" y1="212" x2="372" y2="212"/><line x1="300" y1="212" x2="300" y2="282"/><line x1="300" y1="282" x2="266" y2="348"/><line x1="300" y1="282" x2="334" y2="348"/></g>
<circle cx="300" cy="160" r="24" fill="#D10373"/>
<text x="300" y="398" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="3" fill="#6b6870">AWARDED TO</text>
<text x="300" y="${432}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fs}" font-weight="700" fill="#1c1b1f">${nm}</text>
<text x="300" y="460" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#55535a">${this.esc(date)}</text>
<path d="M112,478 L488,478 L470,500 L488,522 L112,522 L130,500 Z" fill="#1c1b1f"/>
<text x="300" y="506" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5" fill="#fff">PSBAR 2018 · EQUALITY ACT 2010 · WCAG 2.2</text>
${preview ? '<text x="300" y="300" text-anchor="middle" transform="rotate(-24 300 300)" font-family="Helvetica, Arial, sans-serif" font-size="84" font-weight="800" fill="#1c1b1f" fill-opacity=".14" letter-spacing="8">PREVIEW</text>' : ''}
</svg>`;
  }
  certData() {
    const pr = AE.progress.get(),
      fmt = (s) => (s ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
    const rows = AE.lessons.map((l) => {
      const st = pr.lessons[l.n] || {},
        qs = (AE.kc && AE.kc[l.n]) || [],
        ans = (st.kc && st.kc.ans) || {};
      const first = qs.filter((_, k) => ans[k] && ans[k].correct && ans[k].tries === 1).length;
      return { n: l.n, title: l.title, badge: l.badge, date: fmt(st.date), first, total: qs.length, mins: l.mins };
    });
    const dates = AE.lessons
      .map((l) => pr.lessons[l.n] && pr.lessons[l.n].date)
      .filter(Boolean)
      .sort() as string[];
    const last = dates.length ? new Date(dates[dates.length - 1]) : new Date();
    return {
      name: (pr.name || '').trim(),
      rows,
      completed: last.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      mins: rows.reduce((a, r) => a + (Number(r.mins) || 0), 0),
    };
  }
  buildPdf() {
    const D = this.certData(),
      W = 595.28,
      H = 841.89,
      M = 56;
    const cv = document.createElement('canvas').getContext('2d')!;
    const F: Record<string, [string, string, string]> = {
      R: ['F1', 'Helvetica', '12px Arial'],
      B: ['F2', 'Helvetica-Bold', 'bold 12px Arial'],
      T: ['F3', 'Times-Bold', 'bold 12px "Times New Roman"'],
      I: ['F4', 'Times-Italic', 'italic 12px "Times New Roman"'],
    };
    const WIN: Record<number, number> = { 0x2018: 145, 0x2019: 146, 0x201c: 147, 0x201d: 148, 0x2013: 150, 0x2014: 151, 0x2022: 149, 0x2026: 133, 0x20ac: 128 };
    const enc = (s) => {
      let o = '';
      for (const ch of String(s)) {
        const c = ch.codePointAt(0)!,
          b = WIN[c] != null ? WIN[c] : c < 256 ? c : 63;
        if (b === 40 || b === 41 || b === 92) o += '\\' + String.fromCharCode(b);
        else if (b < 32 || b > 126) o += '\\' + b.toString(8).padStart(3, '0');
        else o += String.fromCharCode(b);
      }
      return o;
    };
    const tw = (s, f, sz, tc = 0) => {
      cv.font = F[f][2];
      return (cv.measureText(s).width * sz) / 12 + tc * Math.max(0, [...s].length - 1);
    };
    const INK = '0.11 0.106 0.122',
      MUTED = '0.333 0.325 0.353',
      ACC = '0.82 0.012 0.451',
      RULE = '0.867 0.867 0.867';
    let ops = '',
      mcid = 0;
    const top: any[] = [],
      owner: any[] = [];
    const node = (S: string, parent?: any, attrs?: string) => {
      const n: any = { S, K: [], attrs };
      (parent ? parent.K : top).push(n);
      return n;
    };
    const art = (s) => {
      ops += '/Artifact BMC\n' + s + 'EMC\n';
    };
    const rect = (x, y, w, h, c) => art(`${c} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f\n`);
    const frame = (x, y, w, h, c, lw) => art(`${c} RG ${lw} w ${x} ${y} ${w.toFixed(2)} ${h.toFixed(2)} re S\n`);
    const line = (x1, y1, x2, y2, c, lw = 0.75) => art(`${c} RG ${lw} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S\n`);
    const text = (n, s, x, y, f, sz, c = INK, align?: string | null, tc = 0) => {
      if (align === 'c') x -= tw(s, f, sz, tc) / 2;
      if (align === 'r') x -= tw(s, f, sz, tc);
      ops += `/${n.S} <</MCID ${mcid}>> BDC\nBT /${F[f][0]} ${sz} Tf ${tc} Tc ${c} rg ${x.toFixed(2)} ${y.toFixed(2)} Td (${enc(s)}) Tj ET\nEMC\n`;
      n.K.push(mcid);
      owner[mcid] = n;
      mcid++;
    };
    const wrap = (s, f, sz, maxW) => {
      const out: string[] = [];
      let cur = '';
      s.split(' ').forEach((w) => {
        const t = cur ? cur + ' ' + w : w;
        if (tw(t, f, sz) > maxW && cur) {
          out.push(cur);
          cur = w;
        } else cur = t;
      });
      if (cur) out.push(cur);
      return out;
    };
    rect(0, H - 14, W, 14, ACC);
    frame(28, 28, W - 56, H - 70, RULE, 1);
    text(node('P'), 'CERTIFICATE OF COMPLETION', W / 2, H - 88, 'B', 10, ACC, 'c', 2);
    text(node('H1'), 'Accessibility Essentials', W / 2, H - 130, 'T', 34, INK, 'c');
    text(node('P'), 'CPD for teaching staff in UK higher education', W / 2, H - 152, 'R', 11, MUTED, 'c');
    line(W / 2 - 28, H - 174, W / 2 + 28, H - 174, ACC, 2);
    text(node('P'), 'This certifies that', W / 2, H - 206, 'I', 14, MUTED, 'c');
    const nm = D.name || 'Name not provided';
    text(node('P'), nm, W / 2, H - 244, 'T', nm.length > 34 ? 22 : 28, INK, 'c');
    line(W / 2 - 150, H - 256, W / 2 + 150, H - 256, RULE, 0.75);
    const para = node('P');
    wrap(
      'has completed all six lessons and knowledge checks of Accessibility Essentials, covering the Public Sector Bodies Accessibility Regulations 2018, the Equality Act 2010 and WCAG 2.2.',
      'R',
      11.5,
      400,
    ).forEach((l, i) => text(para, l, W / 2, H - 284 - i * 16, 'R', 11.5, INK, 'c'));
    const sy = H - 392;
    rect(M, sy, W - 2 * M, 58, '0.973 0.969 0.976');
    const firstAll = D.rows.reduce((a, r) => a + r.first, 0),
      qAll = D.rows.reduce((a, r) => a + r.total, 0);
    [
      ['COMPLETED', D.completed],
      ['LESSONS', '6 of 6'],
      ['LEARNING TIME', D.mins + ' minutes'],
    ].forEach((s, i) => {
      const cx = M + ((W - 2 * M) * (i + 0.5)) / 3,
        p = node('P');
      text(p, s[0], cx, sy + 38, 'B', 7.5, MUTED, 'c', 1.2);
      text(p, s[1], cx, sy + 17, 'T', 15, INK, 'c');
    });
    text(node('H2'), 'Progress summary', M, H - 432, 'B', 12.5, INK);
    const cols = [
      { x: M, w: 22, h: '#' },
      { x: M + 22, h: 'Lesson' },
      { x: M + 232, h: 'Badge earned' },
      { x: M + 352, h: 'Completed' },
      { x: W - M, h: 'Correct first time', r: 1 },
    ];
    const tbl = node('Table'),
      hr = node('TR', tbl);
    let y = H - 458;
    cols.forEach((c) => text(node('TH', hr, '/A << /O /Table /Scope /Column >>'), c.h.toUpperCase(), c.x, y, 'B', 7.5, MUTED, c.r ? 'r' : null, 0.8));
    line(M, y - 8, W - M, y - 8, INK, 0.9);
    y -= 26;
    D.rows.forEach((r) => {
      const tr = node('TR', tbl);
      const v = [String(r.n), r.title, r.badge, r.date, r.first + ' of ' + r.total];
      v.forEach((s, i) => text(node('TD', tr), s, cols[i].x, y, i === 1 ? 'B' : 'R', 10, i === 0 ? MUTED : INK, cols[i].r ? 'r' : null));
      line(M, y - 11, W - M, y - 11, RULE, 0.6);
      y -= 29;
    });
    const tr = node('TR', tbl);
    text(node('TD', tr), 'Overall', M + 22, y, 'B', 10, INK);
    text(node('TD', tr), firstAll + ' of ' + qAll, W - M, y, 'B', 10, INK, 'r');
    const foot = node('P');
    wrap(
      'Generated on ' +
        new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) +
        ' from progress saved in the learner’s browser. This is a record of self-directed CPD, not a verified credential. Course content reflects UK law as at September 2026 and is guidance, not legal advice.',
      'R',
      8,
      440,
    ).forEach((l, i) => text(foot, l, W / 2, 96 - i * 11, 'R', 8, MUTED, 'c'));
    text(node('P'), 'Accessibility Essentials  ·  Digital accessibility for UK higher education', W / 2, 52, 'B', 8, ACC, 'c', 0.4);
    // objects
    const objs: string[] = [];
    let next = 13;
    const assign = (n) => {
      n.id = next++;
      n.K.forEach((k) => typeof k === 'object' && assign(k));
    };
    top.forEach(assign);
    const ref = (n) => n.id + ' 0 R';
    const emit = (n, parentRef) => {
      objs[n.id] =
        `<< /Type /StructElem /S /${n.S} /P ${parentRef} /Pg 3 0 R${n.attrs ? ' ' + n.attrs : ''} /K [${n.K.map((k) => (typeof k === 'object' ? ref(k) : k)).join(' ')}] >>`;
      n.K.forEach((k) => typeof k === 'object' && emit(k, ref(n)));
    };
    top.forEach((n) => emit(n, '12 0 R'));
    const title = 'Accessibility Essentials – Course completion certificate' + (D.name ? ' – ' + D.name : '');
    objs[1] =
      '<< /Type /Catalog /Pages 2 0 R /Lang (en-GB) /MarkInfo << /Marked true >> /StructTreeRoot 10 0 R /ViewerPreferences << /DisplayDocTitle true >> >>';
    objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    objs[3] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /StructParents 0 /Tabs /S /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R /F4 8 0 R >> >> /Contents 4 0 R >>`;
    objs[4] = `<< /Length ${ops.length} >>\nstream\n${ops}endstream`;
    ['R', 'B', 'T', 'I'].forEach((k, i) => (objs[5 + i] = `<< /Type /Font /Subtype /Type1 /BaseFont /${F[k][1]} /Encoding /WinAnsiEncoding >>`));
    objs[9] = `<< /Title (${enc(title)}) /Author (${enc(D.name || 'Learner')}) /Subject (Course completion summary) /Creator (Accessibility Essentials) /CreationDate (D:${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}Z) >>`;
    objs[10] = '<< /Type /StructTreeRoot /K 12 0 R /ParentTree 11 0 R /ParentTreeNextKey 1 >>';
    objs[11] = `<< /Nums [0 [${owner.map(ref).join(' ')}]] >>`;
    objs[12] = `<< /Type /StructElem /S /Document /P 10 0 R /K [${top.map(ref).join(' ')}] >>`;
    let out = '%PDF-1.7\n%\xE2\xE3\xCF\xD3\n';
    const off: number[] = [];
    for (let i = 1; i < objs.length; i++) {
      off[i] = out.length;
      out += i + ' 0 obj\n' + objs[i] + '\nendobj\n';
    }
    const xref = out.length;
    out +=
      'xref\n0 ' +
      objs.length +
      '\n0000000000 65535 f \n' +
      off
        .slice(1)
        .map((o) => String(o).padStart(10, '0') + ' 00000 n \n')
        .join('') +
      'trailer\n<< /Size ' +
      objs.length +
      ' /Root 1 0 R /Info 9 0 R >>\nstartxref\n' +
      xref +
      '\n%%EOF';
    const bytes = new Uint8Array(out.length);
    for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
    return new Blob([bytes], { type: 'application/pdf' });
  }
  save(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
  }
  renderVals() {
    const pr = AE.progress.get(),
      done = AE.progress.doneCount(),
      all = done === 6;
    const dates = AE.lessons
      .map((l) => pr.lessons[l.n] && pr.lessons[l.n].date)
      .filter(Boolean)
      .sort() as string[];
    const d = all && dates.length ? new Date(dates[dates.length - 1]) : new Date();
    const dateStr = 'Awarded ' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const showFull = all || this.state.preview;
    const svg = this.svg(pr.name, dateStr, !all && this.state.preview);
    const svgEl = createElement('div', {
      style: { width: '100%', height: '100%' },
      'aria-hidden': 'true',
      dangerouslySetInnerHTML: { __html: svg.replace('<svg ', '<svg style="width:100%;height:100%" ') },
    });
    const total = AE.lessons.length,
      pctNum = Math.round((done / total) * 100),
      sh = this.state.shown,
      inV = this.state.inView;
    const isDone = (l) => !!(pr.lessons[l.n] && pr.lessons[l.n].done),
      visited = (l) => !!(pr.lessons[l.n] && pr.lessons[l.n].visited);
    const wip = AE.lessons.filter((l) => !isDone(l) && visited(l)).length;
    const mins = (l) => Number(l.mins) || 0,
      totalMins = AE.lessons.reduce((x, l) => x + mins(l), 0),
      doneMins = AE.lessons.filter(isDone).reduce((x, l) => x + mins(l), 0),
      left = totalMins - doneMins;
    const nextL = all ? null : AE.lessons.find((l) => !isDone(l) && pr.last && l.n >= pr.last) || AE.lessons.find((l) => !isDone(l));
    const enter = (t) => ({
      op: inV ? 1 : 0,
      tf: inV ? 'none' : 'translateY(.75rem)',
      trans: 'opacity .5s ease ' + t + 's, transform .6s cubic-bezier(.22,.9,.24,1) ' + t + 's',
    });
    const stats = [
      {
        label: 'Lessons completed',
        value: done + ' / ' + total,
        sub: all ? 'Every lesson complete' : total - done + ' lesson' + (total - done === 1 ? '' : 's') + ' remaining',
      },
      { label: 'Estimated time', value: doneMins + ' / ' + totalMins + ' min', sub: left ? '~' + left + ' min estimated left' : 'All done' },
      {
        label: 'Digital badge',
        value: all ? 'Unlocked' : done + '/' + total + ' towards badge',
        sub: all ? 'Ready to download below' : 'Complete all ' + total + ' lessons to claim',
      },
    ].map((s, i) => Object.assign(s, enter((0.1 + i * 0.08).toFixed(2))));
    const fmt = (s) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const lessonCards = AE.lessons.map((l, i) => {
      const st = pr.lessons[l.n] || {},
        ok = !!st.done,
        nx = !!nextL && nextL.n === l.n,
        w = !ok && !!st.visited;
      return Object.assign(
        {
          n: l.n,
          file: l.file,
          title: l.title,
          bIcon: l.icon,
          status: ok ? 'Complete' : nx ? (w ? 'Resume here' : 'Up next') : w ? 'In progress' : 'Not started',
          meta: ok ? l.badge + ' badge · earned ' + (st.date ? fmt(st.date) : '') : l.badge + ' badge · ' + l.mins + ' min',
          icon: ok ? 'fa-solid fa-circle-check' : w ? 'fa-solid fa-circle-half-stroke' : 'fa-regular fa-circle',
          labelInk: ok ? 'var(--ok)' : nx ? 'var(--accent-text)' : 'var(--muted)',
          badgeBg: ok ? 'var(--accent)' : 'var(--surface-2)',
          badgeInk: ok ? 'var(--accent-ink)' : 'var(--muted)',
          ring: ok ? '0 0 0 3px var(--surface),0 0 0 5px var(--accent)' : 'none',
          bg: nx ? 'var(--accent-soft)' : 'var(--surface)',
          line: nx ? 'var(--accent)' : ok ? 'var(--accent-line)' : 'var(--line)',
        },
        enter((0.3 + i * 0.06).toFixed(2)),
      );
    });
    const pill = all
      ? ['Complete', 'var(--ok-soft)', 'var(--ok)', 'var(--ok)']
      : done || wip
        ? ['In progress', 'var(--accent-soft)', 'var(--accent-text)', 'var(--accent-line)']
        : ['Not started', 'var(--accent-soft)', 'var(--accent-text)', 'var(--accent-line)'];
    const tick = (m) => (sh > 0 && sh >= m ? 'var(--accent-text)' : 'var(--muted)');
    const sheen =
      this.state.settled && pctNum > 0 && !this.reduce() && AE.prefs.get().theme !== 'hc'
        ? createElement('span', {
            'aria-hidden': 'true',
            style: {
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(100deg,transparent 25%,rgba(255,255,255,.55) 50%,transparent 75%)',
              animation: 'ae-sheen 1.3s cubic-bezier(.4,0,.2,1) .15s 2 both',
            },
          })
        : null;
    const dash = {
      sumRef: this.sumRef,
      pillLabel: pill[0],
      pillBg: pill[1],
      pillInk: pill[2],
      pillLine: pill[3],
      shownPct: sh + '%',
      fillW: sh + '%',
      sheen,
      pctNum,
      pctText: pctNum + '% — ' + done + ' of ' + total + ' lessons complete',
      doneCaption: done + ' of ' + total + ' lessons completed',
      t0: tick(1),
      t25: tick(25),
      t50: tick(50),
      t75: tick(75),
      t100: tick(100),
      trophy: sh >= 100 ? 'var(--accent)' : 'var(--muted)',
      stats,
      lessonCards,
      hasNext: !!nextL,
      allDone: all,
      nextName: nextL ? 'Lesson ' + nextL.n + ' (' + nextL.title + ')' : '',
      nextHref: nextL ? nextL.file : '#final-title',
      nextCta: nextL ? (visited(nextL) ? 'Resume' : 'Start') + ' Lesson ' + nextL.n : 'Get your digital badge',
    };
    const li =
      'https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=' +
      encodeURIComponent('Accessibility Essentials (PSBAR 2018, Equality Act 2010, WCAG 2.2)') +
      '&issueYear=' +
      d.getFullYear() +
      '&issueMonth=' +
      (d.getMonth() + 1);
    const base = 'accessibility-essentials-badge';
    const cd = all ? this.certData() : null;
    const cert = cd
      ? {
          certName: cd.name || 'Your name',
          noName: !cd.name,
          certDate: 'Completed ' + cd.completed,
          certRows: cd.rows.map((r) => ({ n: r.n, title: r.title, date: r.date })),
          dlPdf: () => {
            this.save(this.buildPdf(), 'accessibility-essentials-certificate' + (cd.name ? '-' + AE.slug(cd.name) : '') + '.pdf');
            AE.toast('Certificate downloaded', 'fa-file-pdf');
          },
        }
      : { certRows: [] };
    return {
      ...dash,
      ...cert,
      svgEl,
      locked: !all,
      lockFilter: showFull ? 'none' : 'grayscale(1)',
      lockOp: showFull ? 1 : 0.55,
      badgeAlt: all
        ? 'Accessibility Essentials digital badge awarded to ' + (pr.name || 'you') + '. ' + dateStr + '.'
        : 'Accessibility Essentials badge, locked. ' + done + ' of 6 lessons complete.',
      eyebrow: all ? 'Course complete' : 'Locked · ' + done + ' of 6 lessons complete',
      finalText: all
        ? 'Congratulations — you’ve completed every lesson and knowledge check. Add your name, then download your badge or add it to your LinkedIn profile under Licences & certifications.'
        : 'Complete the knowledge check at the end of each lesson to unlock this badge.',
      done,
      pct: Math.round((done / 6) * 100) + '%',
      name: pr.name || '',
      setName: (e) => AE.progress.setName(e.target.value),
      cantDl: !all,
      dlOp: all ? 1 : 0.45,
      liDisabled: all ? undefined : 'true',
      liPe: all ? 'auto' : 'none',
      linkedIn: li,
      dlSvg: () => this.save(new Blob([svg], { type: 'image/svg+xml' }), base + '.svg'),
      dlPng: () => {
        const img = new Image();
        const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = 1200;
          c.height = 1200;
          const x = c.getContext('2d')!;
          x.drawImage(img, 0, 0, 1200, 1200);
          URL.revokeObjectURL(url);
          c.toBlob((b) => b && this.save(b, base + '.png'), 'image/png');
        };
        img.src = url;
      },
      previewSel: this.state.preview ? 'true' : 'false',
      previewLabel: this.state.preview ? 'Hide preview' : 'Preview the badge',
      togglePreview: () => this.setState({ preview: !this.state.preview }),
      resetLabel: this.state.confirm ? 'Yes, clear everything' : 'Reset progress',
      reset: () => {
        if (!this.state.confirm) {
          this.setState({ confirm: true });
          return;
        }
        AE.progress.reset();
        this.setState({ confirm: false, preview: false });
      },
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="min-h-[100vh] flex flex-col">
        <Topbar active="badge" />
        <main className="flex-1 [outline:none]" id="main" data-read-root="" tabIndex={-1}>
          <header className="bg-surface border-b border-b-line">
            <div className="max-w-[64rem] my-0 mx-auto pt-12 px-5 pb-9 flex flex-col gap-[.9rem]">
              <nav className="text-[.875rem]" aria-label="Breadcrumb">
                <a href="index.html">Accessibility Essentials</a> <i className="fa-solid fa-chevron-right text-[.7rem] text-muted" aria-hidden="true"></i>{' '}
                <span className="text-muted">Progress</span>
              </nav>
              <h1 className="text-[length:clamp(2.25rem,1.6rem_+_2.5vw,3.5rem)]">Your progress</h1>
              <p className="m-0 text-[1.1875rem] text-muted max-w-[42rem]">
                Track your progress through all six lessons. Complete each knowledge check to earn a lesson badge, then finish all six to unlock your
                Accessibility Essentials digital badge — ready for LinkedIn, your CV or a teaching portfolio.
              </p>
            </div>
          </header>
          <div className="max-w-[64rem] my-0 mx-auto pt-10 px-5 pb-12 flex flex-col gap-10">
            <section
              className="flex flex-col gap-7 p-[clamp(1.25rem,.9rem_+_1.6vw,2.5rem)] rounded-[1.5rem] bg-surface border border-line [box-shadow:var(--shadow)]"
              ref={v.sumRef}
              aria-labelledby="sum-title"
              data-gamify=""
            >
              <div className="flex flex-col gap-[.6rem]">
                <div className="flex flex-wrap items-center gap-[.5rem_1rem]">
                  <span
                    className="inline-flex items-center gap-[.45rem] py-[.3rem] px-[.8rem] rounded-full text-[.75rem] font-extrabold tracking-[.08em] uppercase"
                    style={{ background: v.pillBg, color: v.pillInk, border: `1px solid ${v.pillLine ?? ''}` }}
                  >
                    <span className="w-[.45rem] h-[.45rem] rounded-[50%] [background:currentColor]" aria-hidden="true"></span>
                    {v.pillLabel}
                  </span>
                  <span className="text-[.875rem] text-muted">Saved in your&nbsp;browser</span>
                </div>
                <h2 className="text-[2rem]" id="sum-title">
                  Course progress summary
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-[.4rem]">
                  <p
                    className="m-0 font-display text-[length:clamp(3.25rem,2.6rem_+_2.8vw,4.75rem)] font-bold leading-[.95] tracking-[-.02em] text-accent-text tabular-nums"
                    aria-hidden="true"
                  >
                    {v.shownPct}
                  </p>
                  <p className="m-0 text-[.8125rem] font-extrabold tracking-[.08em] uppercase text-muted">{v.doneCaption}</p>
                </div>
                <div
                  className="relative h-5 rounded-full bg-line overflow-hidden"
                  role="progressbar"
                  aria-label="Course completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={v.pctNum}
                  aria-valuetext={v.pctText}
                >
                  <div className="absolute top-0 bottom-0 left-0 bg-accent rounded-full overflow-hidden" style={{ width: v.fillW }}>
                    {v.sheen}
                  </div>
                  <span className="absolute top-0 bottom-0 left-[25%] w-[2px] ml-[-1px] bg-surface" aria-hidden="true"></span>{' '}
                  <span className="absolute top-0 bottom-0 left-1/2 w-[2px] ml-[-1px] bg-surface" aria-hidden="true"></span>{' '}
                  <span className="absolute top-0 bottom-0 left-[75%] w-[2px] ml-[-1px] bg-surface" aria-hidden="true"></span>
                </div>
                <div className="relative h-5 text-[.8125rem] font-bold tabular-nums" aria-hidden="true">
                  <span className="absolute left-0" style={{ color: v.t0 }}>
                    0%
                  </span>{' '}
                  <span className="absolute left-[25%] [transform:translateX(-50%)]" style={{ color: v.t25 }}>
                    25%
                  </span>{' '}
                  <span className="absolute left-1/2 [transform:translateX(-50%)]" style={{ color: v.t50 }}>
                    50%
                  </span>{' '}
                  <span className="absolute left-[75%] [transform:translateX(-50%)]" style={{ color: v.t75 }}>
                    75%
                  </span>{' '}
                  <span className="absolute right-0 inline-flex items-center gap-[.35rem]" style={{ color: v.t100 }}>
                    100%<i className="fa-solid fa-trophy" style={{ color: v.trophy }}></i>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4">
                {v.stats?.map((s: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-[.3rem] py-[1.1rem] px-5 rounded-[1rem] bg-surface-2 border border-line"
                    style={{ opacity: s.op, transform: s.tf, transition: s.trans }}
                  >
                    <p className="m-0 text-[.75rem] font-extrabold tracking-[.08em] uppercase text-muted">{s.label}</p>
                    <p className="m-0 font-display text-[1.625rem] font-bold leading-[1.15]">{s.value}</p>
                    <p className="m-0 text-[.9375rem] text-muted">{s.sub}</p>
                  </div>
                ))}
              </div>
              <hr className="m-0 border-0 border-t border-t-line" />
              <div className="flex flex-col gap-4">
                <h3 className="font-ui text-[1.0625rem] font-bold">Lessons and badges</h3>
                <ol className="ae-3col list-none m-0 p-0 gap-3">
                  {v.lessonCards?.map((c: any, i: number) => (
                    <li key={i} className="flex" style={{ opacity: c.op, transform: c.tf, transition: c.trans }}>
                      <a
                        className="flex-1 flex gap-[.9rem] items-start py-4 px-[1.1rem] rounded-[1rem] text-ink no-underline [transition:border-color_.2s,box-shadow_.2s] hover:border-accent! hover:[box-shadow:var(--shadow)]!"
                        href={c.file}
                        style={{ border: `1px solid ${c.line ?? ''}`, background: c.bg }}
                      >
                        <span
                          className="flex-none w-12 h-12 rounded-[50%] grid place-items-center text-[1.15rem]"
                          aria-hidden="true"
                          style={{ background: c.badgeBg, color: c.badgeInk, boxShadow: c.ring }}
                        >
                          <i className={`fa-solid ${c.bIcon ?? ''}`}></i>
                        </span>
                        <span className="flex flex-col gap-[.2rem] min-w-0">
                          <span className="flex items-center gap-[.4rem] text-[.8125rem] font-extrabold" style={{ color: c.labelInk }}>
                            <i className={`${c.icon ?? ''}`} aria-hidden="true"></i>
                            <span>
                              Lesson {c.n} · {c.status}
                            </span>
                          </span>
                          <span className="font-bold leading-[1.3]">{c.title}</span>
                          <span className="text-[.8125rem] text-muted">{c.meta}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
              <hr className="m-0 border-0 border-t border-t-line" />
              <div className="flex flex-wrap items-center justify-between gap-[1rem_1.5rem]">
                {v.hasNext ? (
                  <>
                    <p className="m-0">
                      Next up: <strong>{v.nextName}</strong>
                    </p>
                  </>
                ) : null}
                {v.allDone ? (
                  <>
                    <p className="m-0">
                      <strong>All six lessons complete.</strong> Your digital badge is ready.
                    </p>
                  </>
                ) : null}
                <a
                  className="inline-flex items-center gap-[.6rem] min-h-13 py-3 px-[1.4rem] rounded-[.75rem] bg-accent text-accent-ink font-bold text-[1.0625rem] no-underline [box-shadow:var(--shadow)] [transition:transform_.2s,filter_.2s] hover:[filter:brightness(.92)]! hover:[transform:translateY(-2px)]!"
                  href={v.nextHref}
                >
                  {v.nextCta}
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </section>
            <section
              className="ae-split gap-6 items-center p-6 rounded-[1.5rem] bg-surface border border-line [box-shadow:var(--shadow)]"
              aria-labelledby="final-title"
            >
              <div className="flex justify-center">
                <div className="relative w-[min(100%,22rem)] aspect-[1]">
                  <div
                    className="w-full h-full [transition:filter_.5s,opacity_.5s]"
                    role="img"
                    aria-label={v.badgeAlt}
                    style={{ filter: v.lockFilter, opacity: v.lockOp }}
                  >
                    {v.svgEl}
                  </div>
                  {v.locked ? (
                    <>
                      <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
                        <span className="w-18 h-18 rounded-[50%] bg-ink text-surface grid place-items-center text-[1.6rem] [box-shadow:var(--shadow)]">
                          <i className="fa-solid fa-lock"></i>
                        </span>
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="m-0 text-[.8125rem] font-extrabold tracking-[.08em] uppercase text-accent-text">{v.eyebrow}</p>
                <h2 className="text-[2rem]" id="final-title">
                  Accessibility Essentials
                </h2>
                <p className="m-0">{v.finalText}</p>
                <label className="flex flex-col gap-[.35rem] font-bold text-[.9375rem]">
                  Name on your badge{' '}
                  <input
                    className="min-h-12 py-0 px-[.9rem] rounded-[.65rem] border border-line bg-surface font-normal text-[1rem]"
                    type="text"
                    value={v.name ?? ''}
                    onChange={v.setName}
                    placeholder="e.g. Dr Alex Morgan"
                    autoComplete="name"
                    maxLength={40}
                  />{' '}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 min-h-11 py-[.55rem] px-4 rounded-[.65rem] border-0 bg-accent text-accent-ink font-bold cursor-pointer"
                    type="button"
                    onClick={v.dlPng}
                    disabled={v.cantDl}
                    style={{ opacity: v.dlOp }}
                  >
                    <i className="fa-solid fa-download" aria-hidden="true"></i>Download PNG
                  </button>
                  <button
                    className="inline-flex items-center gap-2 min-h-11 py-[.55rem] px-4 rounded-[.65rem] border border-line bg-surface text-ink font-bold cursor-pointer"
                    type="button"
                    onClick={v.dlSvg}
                    disabled={v.cantDl}
                    style={{ opacity: v.dlOp }}
                  >
                    <i className="fa-solid fa-file-code" aria-hidden="true"></i>Download SVG
                  </button>
                  <a
                    className="inline-flex items-center gap-2 min-h-11 py-[.55rem] px-4 rounded-[.65rem] border border-line bg-surface text-ink font-bold no-underline"
                    href={v.linkedIn}
                    target="_blank"
                    rel="noopener"
                    aria-disabled={v.liDisabled}
                    style={{ opacity: v.dlOp, pointerEvents: v.liPe }}
                  >
                    <i className="fa-brands fa-linkedin text-[#0a66c2]" aria-hidden="true"></i>Add to LinkedIn
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
                {v.locked ? (
                  <>
                    <p className="m-0 text-[.875rem] text-muted">
                      <button
                        className="[background:none] border-0 p-0 text-accent font-bold underline cursor-pointer"
                        type="button"
                        onClick={v.togglePreview}
                        aria-pressed={v.previewSel}
                      >
                        {v.previewLabel}
                      </button>{' '}
                      — see what you’re working towards.
                    </p>
                  </>
                ) : null}
              </div>
            </section>
            {v.allDone ? (
              <>
                <section
                  className="ae-split gap-8 items-center p-[clamp(1.25rem,.9rem_+_1.6vw,2.5rem)] rounded-[1.5rem] bg-surface border border-line [box-shadow:var(--shadow)]"
                  aria-labelledby="cert-title"
                >
                  <div className="flex justify-center" aria-hidden="true">
                    <div className="w-[min(100%,20rem)] aspect-[1/1.414] bg-white text-[#1c1b1f] border border-[#dddddd] rounded-[.35rem] [box-shadow:var(--shadow)] flex flex-col overflow-hidden">
                      <div className="h-[.45rem] bg-[#D10373]"></div>
                      <div className="flex-1 m-[.6rem] border border-[#dddddd] py-4 px-[.9rem] flex flex-col items-center gap-[.3rem] text-center">
                        <span className="text-[.5rem] font-extrabold tracking-[.14em] text-[#D10373]">CERTIFICATE OF COMPLETION</span>
                        <span className="font-display text-[1.15rem] font-bold leading-[1.1]">Accessibility Essentials</span>
                        <span className="w-6 h-[2px] bg-[#D10373] my-1 mx-0"></span>
                        <span className="font-display italic text-[.55rem] text-[#55535a]">This certifies that</span>
                        <span className="font-display text-[.95rem] font-bold border-b border-b-[#dddddd] pt-0 px-2 pb-[.15rem] max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {v.certName}
                        </span>
                        <span className="text-[.45rem] text-[#55535a] leading-[1.4] max-w-[12rem]">has completed all six lessons and knowledge checks</span>
                        <div className="w-full mt-2 flex flex-col gap-[.28rem]">
                          {v.certRows?.map((r: any, i: number) => (
                            <div key={i} className="flex justify-between gap-2 pb-[.22rem] border-b border-b-[#eeeeee] text-[.42rem] text-left">
                              <span className="font-bold">
                                {r.n}. {r.title}
                              </span>
                              <span className="text-[#55535a] whitespace-nowrap">{r.date}</span>
                            </div>
                          ))}
                        </div>
                        <span className="mt-[auto] text-[.42rem] text-[#55535a]">{v.certDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="m-0 text-[.8125rem] font-extrabold tracking-[.08em] uppercase text-accent-text">For your CPD record</p>
                    <h2 className="text-[2rem]" id="cert-title">
                      Course completion certificate
                    </h2>
                    <p className="m-0">
                      A one-page A4 PDF summary of your progress: your name, completion date, and each lesson with its badge, completion date and
                      knowledge-check result. It’s a tagged, screen-reader-friendly PDF — ready for appraisal, your HEA fellowship portfolio or a CPD log.
                    </p>
                    {v.noName ? (
                      <>
                        <p className="m-0 py-3 px-4 rounded-[.75rem] bg-accent-soft text-[.9375rem] flex gap-[.6rem] items-baseline">
                          <i className="fa-solid fa-circle-info text-accent-text" aria-hidden="true"></i>
                          <span>Add your name in the badge section above so it appears on your certificate.</span>
                        </p>
                      </>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="inline-flex items-center gap-[.6rem] min-h-13 py-3 px-[1.4rem] rounded-[.75rem] border-0 bg-accent text-accent-ink font-bold text-[1.0625rem] cursor-pointer [box-shadow:var(--shadow)] hover:[filter:brightness(.92)]!"
                        type="button"
                        onClick={v.dlPdf}
                      >
                        <i className="fa-solid fa-file-pdf" aria-hidden="true"></i>Download PDF certificate
                      </button>
                    </div>
                    <p className="m-0 text-[.875rem] text-muted">
                      Generated from the progress saved in this browser. It records self-directed CPD and isn’t a verified credential.
                    </p>
                  </div>
                </section>
              </>
            ) : null}
            <section
              className="flex flex-wrap gap-4 items-center justify-between py-[1.1rem] px-5 rounded-[1rem] border border-dashed border-line"
              aria-labelledby="reset-title"
            >
              <div>
                <h2 className="font-ui text-[1rem] font-bold" id="reset-title">
                  Start over
                </h2>
                <p className="m-0 text-[.9rem] text-muted">Clears your progress, answers and badges on this device. Display settings are kept.</p>
              </div>
              <button
                className="inline-flex items-center gap-2 min-h-11 py-2 px-4 rounded-[.65rem] border border-bad bg-surface text-bad font-bold cursor-pointer"
                type="button"
                onClick={v.reset}
              >
                <i className="fa-solid fa-rotate-left" aria-hidden="true"></i>
                {v.resetLabel}
              </button>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
