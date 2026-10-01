// Course runtime: progress, display preferences, reading ruler, text-to-speech,
// downloads, toasts, glossary look-up and keyboard shortcuts. Components talk to
// each other through `ae:*` window events, so every page stays in sync.
import { dosdonts, glossary, kc, lessons, resources, slug } from './data';
import type { GlossaryTerm, Lesson } from './data';

export type { GlossaryTerm, Lesson, Question } from './data';

const LS = {
  get<T>(k: string, d: T): T {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch {
      return d;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* storage unavailable */
    }
  },
};

export function emit(n: string, d?: unknown) {
  window.dispatchEvent(new CustomEvent(n, { detail: d }));
}

// ---------- Progress ----------
export interface LessonProgress {
  done?: boolean;
  date?: string;
  visited?: boolean;
  checklist?: Record<number, boolean>;
  kc?: { ans: Record<number, KcAnswer>; i: number };
}
export interface KcAnswer {
  sel?: number;
  place?: Record<number, number>;
  checked?: boolean;
  correct?: boolean;
  tries?: number;
}
export interface Progress {
  lessons: Record<number, LessonProgress>;
  last: number | null;
  name: string;
}

const PK = 'ae:progress:v1';
const progress = {
  get(): Progress {
    return LS.get<Progress>(PK, { lessons: {}, last: null, name: '' });
  },
  save(p: Progress) {
    LS.set(PK, p);
    emit('ae:progress', p);
  },
  lesson(n: number): LessonProgress {
    return this.get().lessons[n] || {};
  },
  update(n: number, patch: Partial<LessonProgress>) {
    const p = this.get();
    p.lessons[n] = Object.assign({}, p.lessons[n] || {}, patch);
    this.save(p);
  },
  markDone(n: number): boolean {
    const p = this.get();
    const l = p.lessons[n] || {};
    if (l.done) return false;
    l.done = true;
    l.date = new Date().toISOString();
    p.lessons[n] = l;
    this.save(p);
    return true;
  },
  setLast(n: number) {
    const p = this.get();
    p.last = n;
    p.lessons[n] = Object.assign({ visited: true }, p.lessons[n] || {});
    LS.set(PK, p);
  },
  doneCount(): number {
    const p = this.get();
    return lessons.filter((l) => p.lessons[l.n] && p.lessons[l.n].done).length;
  },
  allDone(): boolean {
    return this.doneCount() === lessons.length;
  },
  setName(s: string) {
    const p = this.get();
    p.name = s;
    this.save(p);
  },
  reset() {
    LS.set(PK, { lessons: {}, last: null, name: '' });
    emit('ae:progress', this.get());
  },
};

// ---------- Preferences ----------
export interface Prefs {
  scale: number;
  lh: string;
  ls: string;
  ws: string;
  font: string;
  alignLeft: boolean;
  measure: string;
  theme: string;
  focusStrong: boolean;
  underline: boolean;
  bigCursor: boolean;
  motion: string;
  focusMode: boolean;
  ruler: string;
  ttsRate: number;
  ttsHighlight: boolean;
  reader: boolean;
  lookup: boolean;
  capSize: string;
  capFont: string;
  capBg: number;
  capPos: string;
  transcriptScroll: boolean;
  ad: boolean;
  speed: number;
  dock: string;
}
const PREF = 'ae:prefs:v1';
const defaults: Prefs = {
  scale: 1,
  lh: 'normal',
  ls: 'normal',
  ws: 'normal',
  font: 'default',
  alignLeft: true,
  measure: 'standard',
  theme: 'auto',
  focusStrong: false,
  underline: false,
  bigCursor: false,
  motion: 'auto',
  focusMode: false,
  ruler: 'off',
  ttsRate: 1,
  ttsHighlight: true,
  reader: false,
  lookup: true,
  capSize: 'm',
  capFont: 'default',
  capBg: 80,
  capPos: 'bottom',
  transcriptScroll: true,
  ad: false,
  speed: 1,
  dock: 'right',
};
// Presets are named by their effect, not by a diagnosis.
const presets: { id: string; label: string; icon: string; set: Partial<Prefs> }[] = [
  {
    id: 'spacing',
    label: 'Larger text and wider spacing',
    icon: 'fa-text-height',
    set: { scale: 1.3, lh: 'loose', ls: 'wide', ws: 'wide', font: 'atkinson', measure: 'narrow' },
  },
  { id: 'calm', label: 'Fewer distractions', icon: 'fa-eye-slash', set: { motion: 'reduce', focusMode: true } },
  { id: 'contrast', label: 'Maximum contrast', icon: 'fa-circle-half-stroke', set: { theme: 'hc', focusStrong: true, underline: true } },
  { id: 'warm', label: 'Warmer, softer colours', icon: 'fa-sun', set: { theme: 'sepia' } },
  { id: 'line', label: 'One line at a time', icon: 'fa-grip-lines', set: { ruler: 'mask', reader: true, lh: 'loose' } },
];
const SYS = 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
const SERIF = '"Source Serif 4 Variable","Source Serif 4",Georgia,serif';
const FONTS: Record<string, [string, string]> = {
  default: [SYS, SERIF],
  public: ['"Public Sans",' + SYS, SERIF],
  atkinson: ['"Atkinson Hyperlegible",' + SYS, '"Atkinson Hyperlegible",' + SYS],
  serif: [SERIF, SERIF],
};
const CAPFONTS: Record<string, string> = {
  default: SYS,
  public: '"Public Sans",' + SYS,
  atkinson: '"Atkinson Hyperlegible",' + SYS,
  serif: SERIF,
  mono: 'ui-monospace,Menlo,monospace',
};
// Optional fonts are only fetched (from this site, not a third party) when someone picks them.
const FONT_LOADERS: Record<string, () => Promise<unknown>> = {
  public: () => Promise.all([import('@fontsource/public-sans/400.css'), import('@fontsource/public-sans/600.css'), import('@fontsource/public-sans/700.css')]),
  atkinson: () => Promise.all([import('@fontsource/atkinson-hyperlegible/400.css'), import('@fontsource/atkinson-hyperlegible/700.css')]),
};
const loadedFonts = new Set<string>();
function loadFont(k: string) {
  const load = FONT_LOADERS[k];
  if (!load || loadedFonts.has(k)) return;
  loadedFonts.add(k);
  load();
}

const prefs = {
  defaults,
  presets,
  get(): Prefs {
    return Object.assign({}, defaults, LS.get<Partial<Prefs>>(PREF, {}));
  },
  set(patch: Partial<Prefs>) {
    const p = Object.assign(this.get(), patch);
    LS.set(PREF, p);
    this.apply();
    emit('ae:prefs', p);
  },
  reset() {
    LS.set(PREF, {});
    this.apply();
    emit('ae:prefs', this.get());
  },
  applyPreset(id: string) {
    const ps = presets.find((x) => x.id === id);
    if (ps) this.set(ps.set);
  },
  isPreset(id: string): boolean {
    const ps = presets.find((x) => x.id === id);
    if (!ps) return false;
    const p = this.get() as unknown as Record<string, unknown>;
    return Object.entries(ps.set).every(([k, v]) => p[k] === v);
  },
  reducedMotion(): boolean {
    const p = this.get();
    return p.motion === 'reduce' || (p.motion === 'auto' && !!window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  },
  apply() {
    const h = document.documentElement;
    const p = this.get();
    const s = h.style;
    s.setProperty('--scale', String(p.scale));
    s.setProperty('--lh', String(({ normal: 1.6, loose: 1.9, xloose: 2.2 } as Record<string, number>)[p.lh] || 1.6));
    s.setProperty('--ls', ({ normal: '0', wide: '0.06em', xwide: '0.12em' } as Record<string, string>)[p.ls] || '0');
    s.setProperty('--ws', ({ normal: '0', wide: '0.16em', xwide: '0.3em' } as Record<string, string>)[p.ws] || '0');
    s.setProperty('--measure', ({ narrow: '40rem', standard: '52rem', wide: '68rem' } as Record<string, string>)[p.measure] || '52rem');
    if (p.font === 'system') p.font = 'default';
    loadFont(p.font);
    loadFont(p.capFont);
    const f = FONTS[p.font] || FONTS.default;
    s.setProperty('--font-body', f[0]);
    s.setProperty('--font-head', f[1]);
    s.setProperty('--cap-size', ({ s: '0.95rem', m: '1.15rem', l: '1.45rem', xl: '1.8rem' } as Record<string, string>)[p.capSize] || '1.15rem');
    s.setProperty('--cap-font', CAPFONTS[p.capFont] || CAPFONTS.default);
    s.setProperty('--cap-bg', 'rgba(0,0,0,' + p.capBg / 100 + ')');
    h.setAttribute('data-theme', p.theme);
    h.setAttribute('data-motion', p.motion);
    (
      [
        ['data-focus-strong', p.focusStrong],
        ['data-underline', p.underline],
        ['data-cursor', p.bigCursor],
        ['data-focusmode', p.focusMode],
        ['data-reader', p.reader],
        ['data-align-left', p.alignLeft],
      ] as [string, boolean][]
    ).forEach(([a, on]) => (on ? h.setAttribute(a, '') : h.removeAttribute(a)));
    if (!h.getAttribute('lang')) h.setAttribute('lang', 'en-GB');
    ruler.set(p.ruler);
  },
};

// ---------- Reading ruler / line mask ----------
const ruler = {
  mode: 'off',
  els: [] as HTMLElement[],
  y: 200,
  set(m: string) {
    if (m === this.mode) return;
    this.mode = m;
    this.els.forEach((e) => e.remove());
    this.els = [];
    if (m === 'off' || !document.body) return;
    const band = 2.4;
    if (m === 'ruler') {
      const r = document.createElement('div');
      r.setAttribute('aria-hidden', 'true');
      r.setAttribute('data-chrome', 'ruler');
      r.style.cssText =
        'position:fixed;left:0;right:0;height:' +
        band +
        'em;pointer-events:none;z-index:9998;border-top:2px solid var(--accent);border-bottom:2px solid var(--accent);background:rgba(209,3,115,.07);transform:translateY(-50%)';
      document.body.appendChild(r);
      this.els = [r];
    } else {
      const t = document.createElement('div');
      const b = document.createElement('div');
      [t, b].forEach((e) => {
        e.setAttribute('aria-hidden', 'true');
        e.setAttribute('data-chrome', 'ruler');
        e.style.cssText = 'position:fixed;left:0;right:0;pointer-events:none;z-index:9998;background:rgba(10,5,10,.55)';
        document.body.appendChild(e);
      });
      t.style.top = '0';
      b.style.bottom = '0';
      this.els = [t, b];
    }
    this.move(this.y);
  },
  move(y: number) {
    this.y = y;
    if (this.mode === 'ruler' && this.els[0]) this.els[0].style.top = y + 'px';
    else if (this.mode === 'mask' && this.els[1]) {
      const half = parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.4;
      this.els[0].style.height = Math.max(0, y - half) + 'px';
      this.els[1].style.height = Math.max(0, innerHeight - y - half) + 'px';
    }
  },
};
document.addEventListener(
  'mousemove',
  (e) => {
    if (ruler.mode !== 'off') ruler.move(e.clientY);
  },
  { passive: true },
);
document.addEventListener('focusin', (e) => {
  const t = e.target as Element | null;
  if (ruler.mode !== 'off' && t && t.getBoundingClientRect) {
    const r = t.getBoundingClientRect();
    ruler.move(r.top + r.height / 2);
  }
});

// ---------- Text-to-speech with word highlighting ----------
const tts = {
  status: 'idle' as 'idle' | 'playing' | 'paused',
  blocks: [] as HTMLElement[],
  i: 0,
  token: 0,
  supported: 'speechSynthesis' in window,
  _emit() {
    emit('ae:tts', { status: this.status, i: this.i, total: this.blocks.length });
  },
  collect(root: Element): HTMLElement[] {
    const sel = 'h1,h2,h3,h4,p,li,dt,dd,figcaption,blockquote,th,td,summary,legend,[data-read-block]';
    return Array.prototype.filter.call(root.querySelectorAll(sel), (el: HTMLElement) => {
      if (el.closest('[data-noread],[aria-hidden="true"],[hidden],[data-chrome]')) return false;
      if (el.querySelector(sel)) return false;
      if (!el.getClientRects().length) return false;
      return (el.textContent || '').trim().length > 1;
    }) as HTMLElement[];
  },
  voice(): SpeechSynthesisVoice | null {
    const v = speechSynthesis.getVoices();
    return v.filter((x) => /en-GB/i.test(x.lang))[0] || v.filter((x) => /^en/i.test(x.lang))[0] || null;
  },
  play(root?: Element | null) {
    if (!this.supported) return;
    root = root || document.querySelector('[data-read-root]') || document.querySelector('main');
    if (!root) return;
    speechSynthesis.cancel();
    this.blocks = this.collect(root);
    this.i = 0;
    this.status = 'playing';
    this.speak();
  },
  speak() {
    if (this.i >= this.blocks.length) {
      this.stop();
      return;
    }
    const el = this.blocks[this.i];
    const text = el.textContent || '';
    const tok = ++this.token;
    const p = prefs.get();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = p.ttsRate;
    const v = this.voice();
    if (v) u.voice = v;
    this.hlBlock(el);
    this.scrollTo(el);
    u.onboundary = (e) => {
      if (tok !== this.token || (e.name && e.name !== 'word')) return;
      if (!prefs.get().ttsHighlight) return;
      const len = e.charLength || (text.slice(e.charIndex).match(/^\S+/) || [''])[0].length;
      this.hlWord(el, e.charIndex, len);
    };
    u.onend = () => {
      if (tok !== this.token || this.status !== 'playing') return;
      this.i++;
      this.speak();
    };
    speechSynthesis.speak(u);
    this._emit();
  },
  pause() {
    if (this.status !== 'playing') return;
    speechSynthesis.pause();
    this.status = 'paused';
    this._emit();
  },
  resume() {
    if (this.status !== 'paused') return;
    speechSynthesis.resume();
    this.status = 'playing';
    this._emit();
  },
  toggle() {
    if (this.status === 'playing') this.pause();
    else if (this.status === 'paused') this.resume();
    else this.play();
  },
  restartBlock() {
    if (this.status === 'idle') return;
    this.token++;
    speechSynthesis.cancel();
    this.status = 'playing';
    this.speak();
  },
  skip(d: number) {
    if (this.status === 'idle') return;
    this.i = Math.max(0, Math.min(this.blocks.length - 1, this.i + d));
    this.restartBlock();
  },
  stop() {
    this.token++;
    if (this.supported) speechSynthesis.cancel();
    this.status = 'idle';
    this.clearHl();
    this._emit();
  },
  clearHl() {
    if (window.CSS && CSS.highlights) {
      CSS.highlights.delete('ae-word');
      CSS.highlights.delete('ae-block');
    }
  },
  hlBlock(el: HTMLElement) {
    if (!(window.CSS && CSS.highlights && window.Highlight)) return;
    const r = document.createRange();
    r.selectNodeContents(el);
    CSS.highlights.set('ae-block', new Highlight(r));
    CSS.highlights.delete('ae-word');
  },
  hlWord(el: HTMLElement, start: number, len: number) {
    if (!(window.CSS && CSS.highlights && window.Highlight)) return;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const r = document.createRange();
    let n: Node | null;
    let pos = 0;
    let s = false;
    while ((n = w.nextNode())) {
      const L = (n.textContent || '').length;
      if (!s && start < pos + L) {
        r.setStart(n, start - pos);
        s = true;
      }
      if (s && start + len <= pos + L) {
        r.setEnd(n, start + len - pos);
        CSS.highlights.set('ae-word', new Highlight(r));
        return;
      }
      pos += L;
    }
  },
  scrollTo(el: HTMLElement) {
    const r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > innerHeight - 100)
      window.scrollTo({ top: scrollY + r.top - innerHeight / 3, behavior: prefs.reducedMotion() ? 'auto' : 'smooth' });
  },
};
window.addEventListener('beforeunload', () => {
  if (tts.supported) speechSynthesis.cancel();
});
window.addEventListener('ae:prefs', () => {
  if (tts.status === 'playing') tts.restartBlock();
});

// ---------- Downloads ----------
function crc32(u: Uint8Array): number {
  let c: number;
  let crc = 0xffffffff;
  for (let n = 0; n < u.length; n++) {
    c = (crc ^ u[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
// Minimal "stored" (uncompressed) zip writer, enough for an EPUB container.
function zip(files: { name: string; data: string }[], type: string): Blob {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let off = 0;
  files.forEach((f) => {
    const name = enc.encode(f.name);
    const data = enc.encode(f.data);
    const crc = crc32(data);
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true);
    lh.setUint16(4, 20, true);
    lh.setUint16(12, 0x21, true);
    lh.setUint32(14, crc, true);
    lh.setUint32(18, data.length, true);
    lh.setUint32(22, data.length, true);
    lh.setUint16(26, name.length, true);
    parts.push(new Uint8Array(lh.buffer), name, data);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 20, true);
    ch.setUint16(6, 20, true);
    ch.setUint16(14, 0x21, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, data.length, true);
    ch.setUint32(24, data.length, true);
    ch.setUint16(28, name.length, true);
    ch.setUint32(42, off, true);
    central.push(new Uint8Array(ch.buffer), name);
    off += 30 + name.length + data.length;
  });
  const cs = central.reduce((a, b) => a + b.length, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true);
  e.setUint16(8, files.length, true);
  e.setUint16(10, files.length, true);
  e.setUint32(12, cs, true);
  e.setUint32(16, off, true);
  return new Blob([...parts, ...central, new Uint8Array(e.buffer)] as BlobPart[], { type });
}
export function saveBlob(blob: Blob, name: string) {
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
function currentLesson(): Lesson | null {
  const el = document.querySelector('[data-lesson]');
  return el ? lessons[Number(el.getAttribute('data-lesson')) - 1] : null;
}
function cleanClone(): HTMLElement | null {
  const root = document.querySelector('[data-read-root]') || document.querySelector('main');
  if (!root) return null;
  const c = root.cloneNode(true) as HTMLElement;
  c.querySelectorAll('[data-noread],[data-chrome],[data-gamify],button,input,select,textarea,svg,script,style,[aria-hidden="true"],[hidden]').forEach((e) =>
    e.remove(),
  );
  c.querySelectorAll('*').forEach((e) => {
    e.removeAttribute('style');
    e.removeAttribute('class');
    Array.prototype.slice.call(e.attributes).forEach((a: Attr) => {
      if (/^(on|data-|aria-|role|tabindex|draggable)/.test(a.name)) e.removeAttribute(a.name);
    });
  });
  return c;
}
const xmlEsc = (s: string) => s.replace(/&/g, '&amp;');
function download(kind: 'text' | 'epub' | 'pdf' | 'large') {
  const l = currentLesson();
  const base = l ? 'accessibility-essentials-lesson-' + l.n : 'accessibility-essentials';
  const title = l ? 'Lesson ' + l.n + ': ' + l.title : 'Accessibility Essentials';
  if (kind === 'text') {
    const c = cleanClone();
    if (!c) return;
    const tmp = document.createElement('div');
    tmp.style.cssText = 'position:absolute;left:-9999px;white-space:pre-wrap';
    tmp.appendChild(c);
    document.body.appendChild(tmp);
    const txt = tmp.innerText.replace(/\n{3,}/g, '\n\n');
    tmp.remove();
    saveBlob(new Blob(['Accessibility Essentials\n' + title + '\n\n' + txt], { type: 'text/plain;charset=utf-8' }), base + '.txt');
    return;
  }
  if (kind === 'epub') {
    const body = cleanClone();
    if (!body) return;
    const xs = new XMLSerializer();
    const inner = Array.prototype.map.call(body.childNodes, (n: Node) => xs.serializeToString(n)).join('\n');
    const uid = 'urn:uuid:ae-' + (l ? l.n : 0);
    const x =
      '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en-GB" lang="en-GB"><head><title>' +
      xmlEsc(title) +
      '</title><style>body{font-family:sans-serif;line-height:1.6}</style></head><body>' +
      inner +
      '</body></html>';
    const nav =
      '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en-GB"><head><title>Contents</title></head><body><nav epub:type="toc"><h1>Contents</h1><ol><li><a href="lesson.xhtml">' +
      xmlEsc(title) +
      '</a></li></ol></nav></body></html>';
    const opf =
      '<?xml version="1.0" encoding="UTF-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="en-GB"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">' +
      uid +
      '</dc:identifier><dc:title>' +
      xmlEsc(title) +
      '</dc:title><dc:language>en-GB</dc:language><meta property="dcterms:modified">' +
      new Date().toISOString().slice(0, 19) +
      'Z</meta><meta property="schema:accessMode">textual</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="c1" href="lesson.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="c1"/></spine></package>';
    saveBlob(
      zip(
        [
          { name: 'mimetype', data: 'application/epub+zip' },
          {
            name: 'META-INF/container.xml',
            data: '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
          },
          { name: 'OEBPS/content.opf', data: opf },
          { name: 'OEBPS/nav.xhtml', data: nav },
          { name: 'OEBPS/lesson.xhtml', data: x },
        ],
        'application/epub+zip',
      ),
      base + '.epub',
    );
    return;
  }
  if (kind === 'pdf') {
    toast('In the print dialog choose “Save as PDF”. Chromium browsers and Edge produce a tagged PDF.', 'fa-file-pdf', true);
    setTimeout(() => window.print(), 400);
    return;
  }
  if (kind === 'large') {
    const h = document.documentElement;
    h.setAttribute('data-largeprint', '');
    const off = () => {
      h.removeAttribute('data-largeprint');
      window.removeEventListener('afterprint', off);
    };
    window.addEventListener('afterprint', off);
    setTimeout(() => window.print(), 100);
  }
}

// ---------- Toasts ----------
function toast(msg: string, icon?: string, important?: boolean) {
  if (!important && prefs.get().focusMode) return;
  let box = document.getElementById('ae-toasts');
  if (!box) {
    box = document.createElement('div');
    box.id = 'ae-toasts';
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('data-chrome', 'toast');
    box.style.cssText =
      'position:fixed;left:1rem;bottom:1rem;z-index:10000;display:flex;flex-direction:column;gap:.5rem;max-width:min(24rem,calc(100vw - 2rem))';
    document.body.appendChild(box);
  }
  const t = document.createElement('div');
  t.style.cssText =
    'background:var(--ink);color:var(--surface);padding:.85rem 1rem;border-radius:.75rem;box-shadow:var(--shadow);display:flex;gap:.75rem;align-items:flex-start;font-size:.95rem;line-height:1.45';
  t.innerHTML = '<i class="fa-solid ' + (icon || 'fa-circle-info') + '" aria-hidden="true" style="margin-top:.2rem;color:var(--accent-line)"></i><span></span>';
  t.querySelector('span')!.textContent = msg;
  box.appendChild(t);
  setTimeout(() => t.remove(), 6000);
}

// ---------- Glossary look-up on selected text ----------
function findTerm(s: string): GlossaryTerm | null {
  s = s
    .trim()
    .toLowerCase()
    .replace(/[.,;:!?()"“”‘’]+$/, '');
  if (s.length < 2 || s.length > 60) return null;
  const names = (g: GlossaryTerm) => [g.term, ...g.alias].map((x) => x.toLowerCase());
  const exact = glossary.find((g) => names(g).includes(s));
  if (exact) return exact;
  if (s.length < 4) return null;
  return glossary.find((g) => names(g).some((n) => n.length > 3 && (s.includes(n) || n.includes(s)))) || null;
}
let pop: HTMLElement | null = null;
function closePop() {
  if (pop) {
    pop.remove();
    pop = null;
  }
}
function showPop(g: GlossaryTerm, rect: DOMRect) {
  closePop();
  const el = document.createElement('div');
  pop = el;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Glossary: ' + g.term);
  el.setAttribute('data-chrome', 'glossary-pop');
  el.style.cssText =
    'position:fixed;z-index:10001;max-width:min(22rem,calc(100vw - 2rem));background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:.875rem;box-shadow:var(--shadow);padding:1rem 1.1rem;font-size:.95rem;line-height:1.5';
  el.innerHTML =
    '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem"><i class="fa-solid fa-book" aria-hidden="true" style="color:var(--accent)"></i><strong style="font-family:var(--font-head);font-size:1.05rem"></strong><button type="button" aria-label="Close definition" style="margin-left:auto;background:none;border:0;cursor:pointer;color:var(--muted);font-size:1.1rem;padding:.25rem .4rem;border-radius:.4rem"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div><p style="margin:0 0 .5rem"></p><a style="font-weight:600">Open in glossary</a>';
  el.querySelector('strong')!.textContent = g.term;
  el.querySelector('p')!.textContent = g.def;
  el.querySelector('a')!.href = 'glossary.html#' + g.id;
  el.querySelector('button')!.onclick = closePop;
  document.body.appendChild(el);
  let top = rect.bottom + 8;
  if (top + el.offsetHeight > innerHeight - 8) top = Math.max(8, rect.top - el.offsetHeight - 8);
  el.style.top = top + 'px';
  el.style.left = Math.max(8, Math.min(innerWidth - el.offsetWidth - 8, rect.left)) + 'px';
}
function checkSel() {
  if (!prefs.get().lookup) return;
  const s = window.getSelection();
  if (!s || s.isCollapsed) return;
  const a = document.activeElement;
  if (a && /INPUT|TEXTAREA/.test(a.tagName)) return;
  if (s.anchorNode && s.anchorNode.parentElement && s.anchorNode.parentElement.closest('[data-chrome=glossary-pop]')) return;
  const g = findTerm(s.toString());
  if (!g) return;
  showPop(g, s.getRangeAt(0).getBoundingClientRect());
}
document.addEventListener('mouseup', (e) => {
  if (pop && pop.contains(e.target as Node)) return;
  setTimeout(checkSel, 10);
});
document.addEventListener('keyup', (e) => {
  if (e.shiftKey && /Arrow|Home|End/.test(e.key)) checkSel();
});
document.addEventListener('mousedown', (e) => {
  if (pop && !pop.contains(e.target as Node)) closePop();
});

// ---------- Keyboard shortcuts ----------
const shortcuts: [string, string, string, string][] = [
  ['Alt', 'Shift', 'N', 'Next lesson'],
  ['Alt', 'Shift', 'P', 'Previous lesson'],
  ['Alt', 'Shift', 'G', 'Open the glossary'],
  ['Alt', 'Shift', 'H', 'Course home'],
  ['Alt', 'Shift', 'L', 'Listen / pause audio'],
  ['Alt', 'Shift', 'A', 'Accessibility settings'],
  ['Esc', '', '', 'Close menus and panels'],
];
const go = (f: string) => {
  location.href = f;
};
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePop();
  if (!(e.altKey && e.shiftKey)) return;
  const l = currentLesson();
  switch (e.code) {
    case 'KeyN':
      e.preventDefault();
      if (l && l.n < 6) go(lessons[l.n].file);
      else if (!l) go(lessons[0].file);
      else go('progress.html');
      break;
    case 'KeyP':
      e.preventDefault();
      if (l && l.n > 1) go(lessons[l.n - 2].file);
      else go('index.html');
      break;
    case 'KeyG':
      e.preventDefault();
      go('glossary.html');
      break;
    case 'KeyH':
      e.preventDefault();
      go('index.html');
      break;
    case 'KeyB':
      e.preventDefault();
      go('progress.html');
      break;
    case 'KeyL':
      e.preventDefault();
      tts.toggle();
      break;
    case 'KeyA':
      e.preventDefault();
      emit('ae:panel', { toggle: true });
      break;
  }
});
window.addEventListener('storage', (e) => {
  if (e.key === PREF) {
    prefs.apply();
    emit('ae:prefs', prefs.get());
  }
  if (e.key === PK) emit('ae:progress', progress.get());
});

// WCAG relative-luminance contrast ratio between two hex colours.
function contrast(a: string, b: string): number {
  function lum(h: string) {
    h = h.replace('#', '');
    if (h.length === 3)
      h = h
        .split('')
        .map((c) => c + c)
        .join('');
    const rgb = [0, 2, 4].map((i) => {
      const v = parseInt(h.substr(i, 2), 16) / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }
  const l1 = lum(a);
  const l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export const AE = {
  lessons,
  glossary,
  dosdonts,
  resources,
  kc,
  progress,
  prefs,
  tts,
  download,
  toast,
  shortcuts,
  contrast,
  slug,
  findTerm,
  currentLesson,
  openPanel() {
    emit('ae:panel', { open: true });
  },
};

prefs.apply();
['(prefers-reduced-motion: reduce)', '(prefers-color-scheme: dark)'].forEach((q) => {
  matchMedia(q).addEventListener('change', () => emit('ae:prefs', prefs.get()));
});
