import { Component } from 'react';
import { AE } from '../lib/ae';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

export default class GlossaryPage extends Component<any, any> {
  [key: string]: any;
  state: { q: string; flash: string | null } = { q: '', flash: null };
  componentDidMount() {
    this._h = () => this.jump();
    window.addEventListener('hashchange', this._h);
    this._jt = setTimeout(() => this.jump(), 300);
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this._h);
    clearTimeout(this._ft);
    clearTimeout(this._jt);
  }
  jump() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: 'auto' });
    this.setState({ flash: id });
    clearTimeout(this._ft);
    this._ft = setTimeout(() => this.setState({ flash: null }), 2500);
  }
  parts(text: string, q: string) {
    if (!q) return [{ s: text, bg: 'transparent', ink: 'inherit' }];
    const out: { s: string; bg: string; ink: string }[] = [];
    const low = text.toLowerCase();
    let i = 0;
    while (true) {
      const j = low.indexOf(q, i);
      if (j < 0) {
        out.push({ s: text.slice(i), bg: 'transparent', ink: 'inherit' });
        break;
      }
      if (j > i) out.push({ s: text.slice(i, j), bg: 'transparent', ink: 'inherit' });
      out.push({ s: text.slice(j, j + q.length), bg: 'var(--accent)', ink: '#fff' });
      i = j + q.length;
    }
    return out.filter((p) => p.s);
  }
  renderVals() {
    const q = this.state.q.trim().toLowerCase();
    const list = AE.glossary
      .filter((g) => !q || g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q) || g.alias.some((a) => a.toLowerCase().includes(q)))
      .sort((a, b) => {
        if (q) {
          const as = a.term.toLowerCase().includes(q) ? 0 : 1,
            bs = b.term.toLowerCase().includes(q) ? 0 : 1;
          if (as !== bs) return as - bs;
        }
        return a.term.localeCompare(b.term);
      });
    const by = {};
    list.forEach((g) => {
      const L = g.term[0].toUpperCase();
      (by[L] = by[L] || []).push(g);
    });
    const keys = q ? Object.keys(by) : Object.keys(by).sort();
    const groups = keys.map((L) => ({
      l: L,
      id: 'letter-' + L,
      hid: 'h-letter-' + L,
      items: by[L].map((g) => {
        const f = this.state.flash === g.id;
        return {
          id: g.id,
          tp: this.parts(g.term, q),
          dp: this.parts(g.def, q),
          hasAlias: g.alias.length > 0,
          alias: g.alias.join(', '),
          line: f ? 'var(--accent)' : 'var(--line)',
          shadow: f ? '0 0 0 4px var(--accent-soft)' : 'none',
        };
      }),
    }));
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => {
      const has = !!by[l];
      return {
        l,
        href: '#letter-' + l,
        disabled: has ? undefined : 'true',
        bg: has ? 'var(--accent-soft)' : 'transparent',
        ink: has ? 'var(--accent-text)' : 'var(--muted)',
        pe: has ? 'auto' : 'none',
        go: (e) => {
          e.preventDefault();
          const el = document.getElementById('letter-' + l);
          if (el) {
            window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: AE.prefs.reducedMotion() ? 'auto' : 'smooth' });
            const h = el.querySelector('h2');
            if (h) {
              h.setAttribute('tabindex', '-1');
              h.focus({ preventScroll: true });
            }
          }
        },
      };
    });
    const n = list.length;
    return {
      q: this.state.q,
      setQ: (e) => this.setState({ q: e.target.value }),
      clear: () => this.setState({ q: '' }),
      groups,
      letters,
      none: n === 0,
      countText: q ? n + ' term' + (n === 1 ? '' : 's') + ' found for “' + this.state.q.trim() + '”' : AE.glossary.length + ' terms',
    };
  }
  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <div className="min-h-[100vh] flex flex-col">
        <Topbar active="glossary" />
        <main className="flex-1 [outline:none]" id="main" data-read-root="" tabIndex={-1}>
          <header className="bg-surface border-b border-b-line">
            <div className="max-w-[56rem] my-0 mx-auto pt-12 px-5 pb-8 flex flex-col gap-4">
              <nav className="text-[.875rem]" aria-label="Breadcrumb">
                <a href="index.html">Accessibility Essentials</a> <i className="fa-solid fa-chevron-right text-[.7rem] text-muted" aria-hidden="true"></i>{' '}
                <span className="text-muted">Glossary</span>
              </nav>
              <h1 className="text-[length:clamp(2.25rem,1.6rem_+_2.5vw,3.5rem)]">Glossary</h1>
              <p className="m-0 text-[1.1875rem] text-muted max-w-[40rem]">
                Plain-English definitions of the laws, standards and accessibility terms used in this course. Tip: in any lesson, select a term to see its
                definition.
              </p>
              <div className="relative mt-2" role="search">
                <label className="sr-only" htmlFor="g-search">
                  Search the glossary
                </label>{' '}
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 [transform:translateY(-50%)] text-muted" aria-hidden="true"></i>{' '}
                <input
                  className="w-full min-h-14 py-0 pr-4 pl-11 rounded-[.875rem] border-2 border-line bg-surface text-[1.0625rem] focus:border-accent!"
                  id="g-search"
                  type="search"
                  value={v.q ?? ''}
                  onChange={v.setQ}
                  placeholder="Search terms and definitions, e.g. captions"
                  autoComplete="off"
                  aria-describedby="g-count"
                />
              </div>
              <p className="m-0 text-[.9375rem] font-semibold text-muted" id="g-count" role="status" aria-live="polite">
                {v.countText}
              </p>
              <nav aria-label="Jump to letter">
                <ul className="list-none m-0 p-0 flex flex-wrap gap-[.3rem]">
                  {v.letters?.map((L: any, i: number) => (
                    <li key={i}>
                      <a
                        className="grid place-items-center w-9 h-9 rounded-[.5rem] font-bold no-underline text-[.9375rem]"
                        href={L.href}
                        aria-disabled={L.disabled}
                        onClick={L.go}
                        style={{ background: L.bg, color: L.ink, pointerEvents: L.pe }}
                      >
                        {L.l}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </header>
          <div className="max-w-[56rem] my-0 mx-auto pt-8 px-5 pb-12 flex flex-col gap-8">
            {v.groups?.map((g: any, i: number) => (
              <section key={i} id={g.id} aria-labelledby={g.hid}>
                <h2 className="text-[1.75rem] text-accent mb-3 pb-[.4rem] border-b-2 border-b-accent-line" id={g.hid}>
                  {g.l}
                </h2>
                <dl className="m-0 flex flex-col gap-[.6rem]">
                  {g.items?.map((t: any, j: number) => (
                    <div
                      key={j}
                      className="py-4 px-[1.15rem] rounded-[1rem] bg-surface [transition:border-color_.4s,box-shadow_.4s]"
                      id={t.id}
                      style={{ border: `1px solid ${t.line ?? ''}`, boxShadow: t.shadow }}
                    >
                      <dt className="font-display font-bold text-[1.1875rem] mb-1">
                        {t.tp?.map((p: any, k: number) => (
                          <span key={k} className="rounded-[.2rem]" style={{ background: p.bg, color: p.ink }}>
                            {p.s}
                          </span>
                        ))}
                      </dt>
                      <dd className="m-0">
                        {t.dp?.map((p: any, k: number) => (
                          <span key={k} className="rounded-[.2rem]" style={{ background: p.bg, color: p.ink }}>
                            {p.s}
                          </span>
                        ))}
                      </dd>
                      {t.hasAlias ? (
                        <>
                          <p className="mt-[.4rem] mx-0 mb-0 text-[.8125rem] text-muted">Also: {t.alias}</p>
                        </>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </section>
            ))}
            {v.none ? (
              <>
                <div className="text-center py-12 px-4 rounded-[1rem] bg-surface border border-dashed border-line">
                  <i className="fa-solid fa-magnifying-glass text-[1.75rem] text-muted" aria-hidden="true"></i>
                  <p className="mt-3 mx-0 mb-1 font-bold text-[1.125rem]">No terms match “{v.q}”</p>
                  <p className="m-0 text-muted">
                    Try a shorter word, or{' '}
                    <button className="[background:none] border-0 p-0 text-accent font-bold underline cursor-pointer" type="button" onClick={v.clear}>
                      clear the search
                    </button>
                    .
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
