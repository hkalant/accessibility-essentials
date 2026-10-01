# Accessibility Essentials

A 90-minute CPD course on UK digital accessibility law and practice (PSBAR 2018, the Equality Act 2010 and WCAG 2.2) for teaching staff in UK higher education.

Built with React 19, TypeScript, Tailwind CSS v4 and Vite, from the Claude Design prototype in [`project/`](project/). The design conversations are in [`chats/`](chats/).

## Run it

```sh
npm install
npm run dev        # local dev server
npm run build      # type-check, then build static files into dist/
npm run preview    # serve the production build
```

The build is plain static HTML, CSS and JS with relative URLs, so `dist/` can be hosted from any folder: a web server, SharePoint, or a Moodle File/Folder resource or iframe. No requests go to third-party servers. Fonts and icons are bundled.

## Pages

Each page is its own HTML file, so you can deep-link to any lesson from Moodle.

| URL | Page |
| --- | --- |
| `index.html` | Course home: hero, progress and course outline |
| `lesson-1.html` … `lesson-6.html` | The six lessons |
| `glossary.html` | Searchable A–Z glossary |
| `progress.html` | Progress summary, digital badge and completion certificate |
| `home-print.html` | Printable course outline |

## Code map

- `src/lib/data.ts`: course content. Lessons, outcomes, glossary, do's and don'ts, resources and knowledge-check questions.
- `src/lib/ae.ts`: runtime. Progress and display preferences (stored in `localStorage`), text-to-speech with word highlighting, reading ruler, downloads (plain text, EPUB, print to PDF), glossary look-up on selected text, and keyboard shortcuts. Components keep in sync through `ae:*` window events.
- `src/components/`: shared chrome. Top bar, floating bar (mobile), sidebar, footer, Display panel, search (Ctrl/⌘ + K), lesson intro and end, do's and don'ts, and the knowledge check.
- `src/pages/`: one component per page. `src/entries/` mounts each page into its HTML file.
- `src/styles/course.css`: design tokens, themes (light, dark, high contrast, sepia), preference hooks (`html[data-*]`) and responsive layout rules. Tailwind runs **without preflight**, because the design relies on browser defaults for lists, paragraphs and form controls.

## Before release

- Review the legal content. "Northbridge University" is a fictional institution; replace it with your own.
- Progress and settings are stored per browser, not per account.
