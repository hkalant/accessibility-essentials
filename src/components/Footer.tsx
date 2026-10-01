import { AE } from '../lib/ae';
import SearchModal from './SearchModal';

export default function Footer() {
  const keys = AE.shortcuts.filter((k) => k[1]).map((k) => ({ c: k[2], label: k[3] }));
  return (
    <footer className="border-t border-t-line bg-surface mt-12" data-noprint="">
      <div className="max-w-[72rem] my-0 mx-auto pt-8 px-5 pb-10 flex flex-col gap-6">
        <section className="flex flex-wrap items-center gap-[.6rem_1.5rem] pb-6 border-b border-b-line text-[.9375rem]" aria-labelledby="kbd-title">
          <h2 className="font-ui text-[.9375rem] font-bold m-0 flex items-center gap-2" id="kbd-title">
            <i className="fa-solid fa-keyboard text-accent" aria-hidden="true"></i>Keyboard shortcuts
          </h2>
          <p className="m-0 text-muted">
            Hold <kbd>Alt</kbd> + <kbd>Shift</kbd> (Mac: <kbd>Option</kbd> + <kbd>Shift</kbd>), then press:
          </p>
          <ul className="list-none m-0 p-0 flex flex-wrap gap-[.5rem_1.25rem]">
            {keys.map((k: any, i: number) => (
              <li key={i} className="flex items-center gap-[.4rem]">
                <kbd>{k.c}</kbd>
                <span>{k.label}</span>
              </li>
            ))}
            <li className="flex items-center gap-[.4rem]">
              <kbd>Esc</kbd>
              <span>Close panels (on its own)</span>
            </li>
            <li className="flex items-center gap-[.4rem]">
              <kbd>Ctrl</kbd>+<kbd>K</kbd>
              <span>
                (Mac: <kbd>⌘</kbd>+<kbd>K</kbd>) Search the course
              </span>
            </li>
          </ul>
        </section>
        <div className="flex flex-wrap gap-[.5rem_1.5rem] justify-between text-muted text-[.875rem]">
          <p className="m-0">Accessibility Essentials · CPD for teaching staff in UK higher education</p>
          <p className="m-0">Reflects PSBAR 2018 and the Equality Act 2010 as at September 2026. This course is guidance, not legal advice.</p>
        </div>
      </div>
      <SearchModal />
    </footer>
  );
}
