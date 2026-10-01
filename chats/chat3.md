# Hero parallax removal

_Started 2026-09-30 00:30 UTC_

---

## User

Continuing from "Accessibility widget animation".

## Assistant

We've been building **Accessibility Essentials**, a 90-minute training course on UK digital accessibility law for higher education staff. The React app has 6 lessons plus glossary and badge pages, embedded in Moodle via iframe.

**What's complete:**
All 9 pages exist and are fully styled. Mobile has a pill-shaped floating bar with Display button; on desktop the Display button sits in the clear see-through top menu. The accessibility panel opens as a bottom sheet on mobile/tablet (sliding from bottom with grab handle and dimmed overlay) and as a side panel on desktop. Clicking outside closes it. The panel includes text scaling, line-height/letter-spacing, light/dark/high-contrast/sepia themes, focus outlines, motion toggles, text-to-speech with word highlighting, reading ruler, plain-text reader, downloadable alternates, and font picker (System font is now default; headings use Source Serif 4, body uses system fonts). All interactive elements built: alt-text picker, contrast checker with live WCAG display, colour-blindness simulator, knowledge checks with MCQ and scenario questions. Each lesson awards a badge; completion unlocks a downloadable digital badge. Homepage has cover image behind hero (desktop only, 58% black opacity layer, see-through menu that switches to #424A52 at 80% opacity with blur on scroll), parallax text effect on scroll, simplified course outline as bordered list, and Learning Outcomes with #dddddd outline buttons. Keyboard shortcuts simplified to single light row in footer. Lesson 1 "PSBAR 2018 in practice" is now a vertical timeline. Mobile floating bar has no white outline in dark mode. Footer says "Display preferences are saved to your browser."

**Current state:**
Homepage, all 6 lessons, Glossary, and Badge pages visually complete. Desktop and mobile layouts verified. Overlapping "Legal target ⟷ AA" text in Lesson 2 still unfixed.

**Next steps:**
- Fix overlapping text in Lesson 2
- Full visual check across all pages and screen sizes
- Legal content (Northbridge University) needs institutional replacement before release

**Files:** 20+ .dc.html/.js/.css files covering all pages, components, styles and support functions.

## User

Remove the parallax effect from the hero of the homepage

## Assistant

## User

Remove the parallax effect from the hero of the homepage

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I've removed the parallax from the homepage hero. The hero text no longer moves or fades as you scroll. The menu still changes to its solid background once you scroll past the hero. The page loads with no errors.

## User

Remove all timers from the knowledge checks and the assessment & pacing options from the accessibility widget

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: run_script]_

_[tool: grep]_

_[tool: ready_for_verification]_

I've taken the timers out of the knowledge checks and removed the "Assessment & pacing" section from the accessibility panel.

- **Knowledge checks:** the countdown, pause button and "Change" link are gone.
- **Auto-advance:** this was one of the options in that section, so it's gone too. After a correct answer, people now always move to the next question themselves.
- **Quick settings:** the "Fewer distractions" preset no longer turns auto-advance off, since that setting no longer exists.

A final check on Lesson 1 is still running in the background.

## User

Improve the 'Badge' screen by creating a 'Course Progress Summary' dashboard section on the  that displays a progress bar showing the percentage of total lessons completed, calculated from the existing localStorage data.

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I've added a "Course progress summary" section at the top of the Badge page. It reads the progress already saved in the browser. A final check is still running in the background.

- **Headline:** a large percentage of lessons completed, with a progress bar that screen readers can read.
- **Counts line:** how many lessons are complete, in progress and not started.
- **Lesson list:** all six lessons, each marked Complete, In progress or Not started, and each linking to its lesson.
- **Next step button:** "Continue lesson N" or "Start lesson N", pointing to the first lesson not yet finished. It disappears once all six are done.

"In progress" means someone has opened the lesson or answered a knowledge-check question but hasn't finished it.

## User

Create a 'Course Progress Summary' dashboard section on the Home page that displays a progress bar showing the percentage of total lessons completed, calculated from the existing localStorage data.

## Assistant

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I've added a "Course progress summary" section to the Home page, just above the Course outline. It reads the progress already saved in the browser. A final check is still running in the background.

- **Headline:** a large percentage of lessons completed, with a progress bar that screen readers can read.
- **Summary line:** how many of the 6 lessons are complete, plus roughly how many minutes are left, worked out from each lesson's length.
- **Counts:** three tiles showing Complete, In progress and Not started.

The section is hidden whenever the hero's small progress bar is hidden, because both are tied to the same setting.

## User

Create a 'Course Progress Summary' dashboard section on the Home page that displays a progress bar showing the percentage of total lessons completed, calculated from the existing localStorage data.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: eval_js_user_view]_

_[tool: screenshot_user_view]_

The Course progress summary section from my last reply is already on the Home page. It sits directly below the hero, above the Course outline, and your preview is showing it now.

It includes:
- a large percentage with a progress bar
- how many of the 6 lessons are complete, plus roughly how many minutes are left
- three tiles counting lessons Complete, In progress and Not started

I didn't make any changes this time. If you want it different, tell me what — for example move it into the hero, replace the small bar that's already in the hero, or add links to each lesson.

## User

can you make it more whizzy like in the attached screenshot?

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I've rebuilt the progress summary to match your screenshot, with added motion. A final check is still running in the background.

- **Layout:** a status pill (Not started, In progress or Complete) with "Saved to this browser"; a large percentage; a thick progress bar marked at 0%, 25%, 50%, 75% and 100%, with a trophy at the end; three cards for lessons completed, estimated time and digital badge status; a card for each of the six lessons with its status; and a "Next up" line with a Start or Resume button.
- **Motion:** when the section scrolls into view, the percentage counts up and the bar fills to match. Each milestone label lights up as the bar passes it. The cards fade and slide in one after another, then a light sweeps across the filled bar twice.
- **Reduced motion:** all of this is skipped if someone has reduced motion on in the panel or their device, and the sweep is also off in high contrast. The motion stops after a few seconds, so the course still meets the WCAG rule on moving content.

I left out the screenshot's "quick status toggle" and "Mark all complete". They would let people earn the badge without passing the knowledge checks. I can add them if you want them anyway, for example for testing.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

I've fixed the spacing on the lesson cards. "Lesson 1", "Lesson 2" and so on now stay together on the left, with the status icon on the right. The page loads with no errors.

## User

can you merge with the 'Badge' screen and change 'Badge' to 'Progress' in the floating bar and in the page itself

## Assistant

_[tool: grep]_

_[tool: list_files]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I've moved the progress summary onto the Badge page and renamed that page Progress. A final check is still running in the background.

- **Renamed:** the page is now titled "Your progress", in the browser tab title, the breadcrumb, the heading and the intro text. In the floating bar and top menu, "Badge" / "My badge" now reads "Progress", with a chart icon instead of the shield.
- **Merged:** the page now starts with the progress summary: the large percentage, the progress bar and the three stat cards. The six lesson cards now show each lesson's badge, with the date it was earned or the lesson's length. They replace the separate "Lesson badges" list, so lessons aren't listed twice.
- **Removed:** the small progress bar inside the digital badge section, since the summary above covers it. Once all six lessons are done, the "Next up" button links to the digital badge section below.
- **Home page:** the summary section is gone, so it's back to how it was. The small progress bar in the hero is still there.

The file is still called `Badge.dc.html`, so existing links, including any in Moodle, keep working.

## User

Implement a search bar on the Home page that allows users to quickly find specific lessons or keywords within the course content.

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: list_files]_

_[tool: grep]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I've added a "Search the course" section on the Home page, just above the Course outline. A final check is still running in the background.

- **What it searches:** lesson titles and summaries, section headings, learning outcomes, Do's and Don'ts, checklist items, and glossary terms and definitions, including a term's other names.
- **Results:** they update as you type. Each one shows its type, for example "Lesson 4 · Section", with the matching words highlighted. Clicking a result goes straight to that part of the lesson or glossary. The top 8 results show first, with a "Show all" button for the rest.
- **Keyboard:** Enter opens the top result. The Down arrow moves into the results and the arrow keys move through them. Escape clears the search or takes you back to the box. The number of results is announced to screen readers.
- **Starting points:** when the box is empty, six "Popular" buttons (Alt text, Captions, Contrast and so on) fill in a search with one click. If nothing matches, it suggests trying a different word or the glossary.

The search only covers the headings and short text listed above, not the full wording of each lesson. It can be extended to the full text if you want that.

## User

Remove the search box from the homepage and make it appear as modal window when a user uses a keyboard shortcut ctrl or cmd + K. Include this in the keyboard shortcuts in the footer as well.

Also, in the 'Progress' screen, below the badge section, create a new 'Course Completion Certificate' component that renders when all lessons are marked as 'done' in localStorage, allowing users to download a PDF summary of their progress.

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: dc_write]_

_[tool: run_script]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I've made both changes. A final check is still running in the background.

**Search pop-up**
- **Removed from Home:** the search box no longer sits on the homepage.
- **Opening it:** pressing Ctrl + K, or ⌘ + K on a Mac, opens search in a pop-up window on every page. The shortcut is also listed in the footer's keyboard shortcuts row.
- **Using it:** it searches the same content as before, with the same Popular buttons and highlighted results. Enter or clicking a result goes to it. Escape, clicking outside or pressing Ctrl/⌘ + K again closes it. The keyboard stays inside the pop-up while it's open, and returns to where you were when it closes.

**Course completion certificate (Progress page)**
- **When it shows:** it appears below the badge section only once all six lessons are done.
- **On the page:** a small preview of the certificate, a "Download PDF certificate" button, and a reminder if no name has been entered in the badge section.
- **The PDF:** one A4 page showing the name, completion date, 6 of 6 lessons and 90 minutes. A table lists each lesson with its badge, completion date and how many knowledge-check questions were right first time, plus an overall total. A note says it's a record of self-directed CPD, not a verified credential.
- **Accessible:** the PDF is tagged for screen readers, with a heading, a proper table and the document language set. It downloads straight away with no print dialog.

**Worth deciding:** the search can only be opened from the keyboard. Touch and mouse users have no way to reach it. I'd suggest adding a Search button to the top menu and the mobile floating bar that opens the same pop-up.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I've fixed both problems in the search pop-up. A final check is still running in the background.

- **Results list:** all results can now be reached. Only the results area scrolls, and the "Show all" button no longer gets squashed.
- **Keyboard focus:** the cursor now goes straight into the search box when the pop-up opens, so people can type right away.

The certificate section still hasn't been checked on screen, because it only appears once all six lessons are done. To see it, complete every lesson's knowledge check, then open the Progress page.

## User

Save this design as a PDF: `Home.dc.html`

## Assistant

_[tool: read_file]_

_[tool: copy_starter_component]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: show_pdf_export_dialog]_

The export dialog is open, but nothing has printed yet. Click "Print or save as PDF" there and pick your page size.

The PDF is a printable copy of the Home page (`Home-print.dc.html`). It has the hero, the 90 minutes / 6 lessons / badge / audio details, and your progress bar. The course outline follows, with every lesson's learning outcomes shown in full. It leaves out the menus, footer, buttons and links, since they don't work on paper. The original Home page is unchanged.

