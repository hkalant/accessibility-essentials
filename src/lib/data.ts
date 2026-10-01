// Course content: lessons, glossary, do's & don'ts, resources and knowledge checks.

export interface Section {
  id: string;
  title: string;
}
export interface Lesson {
  n: number;
  file: string;
  title: string;
  mins: number;
  icon: string;
  badge: string;
  summary: string;
  outcomes: string[];
  sections: Section[];
}
export interface GlossaryTerm {
  term: string;
  def: string;
  alias: string[];
  id: string;
}
export interface ResourceLink {
  t: string;
  u: string;
  d: string;
}
export interface Scenario {
  who: string;
  text: string;
}
export type Question =
  | { type: 'mcq'; q: string; options: string[]; answer: number; explain: string; scenario?: Scenario }
  | { type: 'sort'; q: string; bins: string[]; items: { t: string; b: number }[]; explain?: string; scenario?: Scenario };

export function slug(s: string): string {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const lessons: Lesson[] = [
  {
    n: 1,
    file: 'lesson-1.html',
    title: 'The law & your duties',
    mins: 15,
    icon: 'fa-scale-balanced',
    badge: 'Legal Foundations',
    summary: 'PSBAR 2018, the Equality Act 2010, and what they expect of you.',
    outcomes: [
      'Explain what PSBAR 2018 requires of university websites, VLEs and the content you publish on them',
      'Describe the anticipatory duty to make reasonable adjustments under the Equality Act 2010',
      'Identify which teaching content is covered, exempt, or still subject to the Equality Act',
      'Know what to do when a student asks for an accessible alternative',
    ],
    sections: [
      { id: 'two-laws', title: 'Two laws, one goal' },
      { id: 'psbar', title: 'PSBAR 2018 in practice' },
      { id: 'covered', title: 'Covered or exempt?' },
      { id: 'equality-act', title: 'The Equality Act 2010' },
      { id: 'duties', title: 'What this means for you' },
    ],
  },
  {
    n: 2,
    file: 'lesson-2.html',
    title: 'WCAG 2.2 & the POUR principles',
    mins: 15,
    icon: 'fa-layer-group',
    badge: 'Standards Navigator',
    summary: 'The standard your teaching and learning content is measured against.',
    outcomes: [
      'Describe what WCAG 2.2 is and how it relates to PSBAR',
      'Explain the four POUR principles using teaching examples',
      'Distinguish between conformance levels A, AA and AAA',
      'Recognise the WCAG 2.2 criteria most relevant to teaching content',
    ],
    sections: [
      { id: 'what-is-wcag', title: 'What is WCAG 2.2?' },
      { id: 'pour', title: 'The POUR principles' },
      { id: 'levels', title: 'Conformance levels' },
      { id: 'new-in-22', title: 'New in WCAG 2.2' },
    ],
  },
  {
    n: 3,
    file: 'lesson-3.html',
    title: 'Accessible documents',
    mins: 15,
    icon: 'fa-file-lines',
    badge: 'Document Builder',
    summary: 'Create accessible Word documents, PowerPoint slides and PDFs.',
    outcomes: [
      'Use built-in heading styles, lists and tables to give documents real structure',
      'Build PowerPoint slides with unique titles and a logical reading order',
      'Export tagged PDFs and recognise when a PDF is inaccessible',
      'Run the Microsoft and Adobe accessibility checkers and act on the results',
    ],
    sections: [
      { id: 'headings', title: 'Why real headings matter' },
      { id: 'apps', title: 'Word, PowerPoint & PDF' },
      { id: 'spot', title: 'Spot the issues' },
      { id: 'checkers', title: 'Using the checkers' },
    ],
  },
  {
    n: 4,
    file: 'lesson-4.html',
    title: 'Images, colour & visual design',
    mins: 15,
    icon: 'fa-image',
    badge: 'Visual Clarity',
    summary: 'Alt text, contrast, and visual choices that include everyone.',
    outcomes: [
      'Write concise, context-aware alt text and recognise decorative images',
      'Check colour contrast against WCAG AA and AAA thresholds',
      'Avoid using colour as the only way to convey meaning',
      'Make visual design choices that support readability',
    ],
    sections: [
      { id: 'alt-text', title: 'Alt text essentials' },
      { id: 'alt-sim', title: 'Alt text simulator' },
      { id: 'contrast', title: 'Colour contrast checker' },
      { id: 'colour-blind', title: 'Colour vision simulator' },
      { id: 'visual', title: 'Visual design choices' },
    ],
  },
  {
    n: 5,
    file: 'lesson-5.html',
    title: 'Video, audio & STEM content',
    mins: 15,
    icon: 'fa-closed-captioning',
    badge: 'Media & Maths',
    summary: 'Captions, transcripts, audio description and accessible maths.',
    outcomes: [
      'Explain the difference between captions, subtitles, transcripts and audio description',
      'Edit automatic captions for accuracy, especially subject-specific terms',
      'Know when audio description is needed and how to describe as you teach',
      'Present mathematical and scientific notation in accessible formats',
    ],
    sections: [
      { id: 'media-types', title: 'Four media alternatives' },
      { id: 'captions', title: 'Auto vs edited captions' },
      { id: 'player', title: 'An accessible lecture player' },
      { id: 'maths', title: 'Accessible maths & STEM' },
    ],
  },
  {
    n: 6,
    file: 'lesson-6.html',
    title: 'Inclusive teaching & VLE practice',
    mins: 15,
    icon: 'fa-chalkboard-user',
    badge: 'Inclusive Practitioner',
    summary: 'Putting it all together in Moodle and your wider teaching practice.',
    outcomes: [
      'Structure a Moodle course so it is predictable and easy to navigate',
      'Audit a course section and prioritise accessibility fixes',
      'Apply Universal Design for Learning to reduce the need for individual adjustments',
      'Handle adjustment requests, including extra time, consistently',
    ],
    sections: [
      { id: 'udl', title: 'Universal Design for Learning' },
      { id: 'moodle', title: 'A predictable Moodle course' },
      { id: 'audit', title: 'Audit this section' },
      { id: 'requests', title: 'Responding to requests' },
    ],
  },
];
lessons.forEach((l) => {
  l.sections = l.sections.concat([
    { id: 'dos-donts', title: "Do's & don'ts" },
    { id: 'knowledge-check', title: 'Knowledge check' },
    { id: 'resources', title: 'Resources & checklist' },
  ]);
});

export const glossary: GlossaryTerm[] = (
  [
    [
      'Accessibility',
      'The degree to which content, services and environments can be used by as many people as possible, including disabled people, without needing adaptation.',
    ],
    [
      'Accessibility statement',
      'A page that public sector bodies must publish under PSBAR 2018. It states how accessible a website or app is, lists known problems and why, explains how to request an accessible alternative, and describes the enforcement procedure.',
      ['statement'],
    ],
    [
      'Accessible authentication',
      'WCAG 2.2 criterion 3.3.8 (AA): logging in must not rely on a cognitive test such as remembering or transcribing a password, unless an alternative or assistance (like paste or a password manager) is available.',
    ],
    [
      'Accessibility checker',
      'A built-in tool in Word, PowerPoint, Outlook, Acrobat and many VLE editors that flags common accessibility problems. It catches some issues automatically, but not all — human judgement is still needed.',
      ['check accessibility'],
    ],
    [
      'Alt text',
      'Short for alternative text: a text description attached to an image so that people who cannot see it — including screen reader users — get the same information or function. Decorative images should have empty alt text.',
      ['alternative text', 'alt'],
    ],
    [
      'Anticipatory duty',
      'The Equality Act 2010 requirement for education providers to think in advance about what disabled students may need and make adjustments before an individual asks.',
      ['anticipatory'],
    ],
    [
      'Assistive technology',
      'Hardware or software that helps disabled people use digital content, such as screen readers, screen magnifiers, speech recognition, switch access and refreshable braille displays.',
      ['AT'],
    ],
    [
      'Audio description',
      'An additional narration that describes important visual information in a video — actions, on-screen text, diagrams — that is not conveyed by the existing soundtrack. Required at WCAG level AA for pre-recorded video.',
      ['audio descriptions', 'AD'],
    ],
    ['Auxiliary aid', 'Under the Equality Act 2010, an aid or service (including information in an accessible format) provided as a reasonable adjustment.'],
    [
      'Captions',
      'Synchronised on-screen text of all speech and meaningful sound in a video, e.g. [laughter] or [alarm sounds]. Closed captions can be turned on and off; open captions are burned into the picture.',
      ['caption', 'closed captions'],
    ],
    [
      'Colour contrast ratio',
      'A measure from 1:1 to 21:1 of the difference in luminance between foreground and background colours. WCAG AA requires 4.5:1 for normal text and 3:1 for large text and interface components.',
      ['contrast ratio', 'contrast'],
    ],
    [
      'Colour vision deficiency',
      'Reduced ability to distinguish certain colours, most commonly red and green (protanopia, deuteranopia). Often called colour blindness. It affects around 1 in 12 men and 1 in 200 women.',
      ['colour blindness', 'color blindness'],
    ],
    [
      'Conformance level',
      'One of three levels — A, AA and AAA — that WCAG success criteria are grouped into. UK public sector bodies must meet level AA, which includes all level A criteria.',
      ['A, AA, AAA'],
    ],
    [
      'Decorative image',
      'An image that adds no information, such as a divider or mood photograph. It should have empty alt text (alt="") or be marked as decorative so screen readers skip it.',
      ['decorative'],
    ],
    [
      'Digital accessibility',
      'Designing and building websites, apps, documents and media so that disabled people can perceive, understand, navigate and interact with them.',
    ],
    [
      'Disability',
      'Under the Equality Act 2010, a physical or mental impairment that has a substantial and long-term adverse effect on a person’s ability to carry out normal day-to-day activities.',
    ],
    [
      'Disproportionate burden',
      'A PSBAR 2018 provision allowing a public sector body not to fix specific content if the cost would be excessive relative to its size and resources. It must be formally assessed and declared in the accessibility statement; it cannot be claimed simply because fixing is inconvenient.',
    ],
    [
      'EHRC',
      'The Equality and Human Rights Commission. It enforces the Equality Act 2010 and PSBAR 2018 in England, Scotland and Wales. In Northern Ireland, the Equality Commission for Northern Ireland (ECNI) has this role.',
      ['Equality and Human Rights Commission', 'ECNI'],
    ],
    ['EN 301 549', 'The European accessibility standard for ICT products and services referenced by PSBAR 2018. For web content it points to WCAG level AA.'],
    ['EPUB', 'An open e-book format that reflows text to fit any screen and works well with screen readers and text-to-speech.'],
    [
      'Equality Act 2010',
      'The UK Act of Parliament (applying in England, Scotland and Wales) that protects people from discrimination on the basis of nine protected characteristics, including disability. It requires education providers to make reasonable adjustments for disabled students.',
      ['Equality Act', 'EA 2010'],
    ],
    [
      'Focus indicator',
      'The visible outline or highlight that shows which element currently has keyboard focus. WCAG requires it to be visible (2.4.7) and, in 2.2, not hidden by other content (2.4.11).',
      ['focus', 'focus outline'],
    ],
    [
      'GDS',
      'The Government Digital Service. It monitors public sector websites and apps for compliance with PSBAR 2018 on behalf of the government.',
      ['Government Digital Service'],
    ],
    [
      'Heading structure',
      'Using real, nested heading levels (Heading 1, Heading 2, Heading 3) so that assistive technology users can see the outline of a page or document and jump between sections.',
      ['headings', 'heading styles'],
    ],
    [
      'Keyboard accessibility',
      'Being able to reach and use every interactive element with a keyboard alone, in a logical order and without getting trapped. Required by WCAG 2.1.1 (A).',
      ['keyboard'],
    ],
    ['LaTeX', 'A typesetting language widely used for mathematics and science. Moodle can render LaTeX notation accessibly via the MathJax filter.'],
    [
      'Link text',
      'The clickable words of a hyperlink. Good link text describes its destination (“Week 3 reading list”) rather than using “click here” or a raw URL.',
    ],
    [
      'Live media',
      'Audio or video broadcast in real time, such as a live-streamed lecture. It is exempt from PSBAR 2018, but the Equality Act 2010 still applies, so live captions may be a reasonable adjustment.',
      ['live stream', 'live-streamed'],
    ],
    [
      'Long description',
      'A fuller explanation of a complex image, such as a chart or diagram, provided in the surrounding text, a linked page or a data table, in addition to short alt text.',
    ],
    [
      'MathJax',
      'A JavaScript library that displays mathematical notation written in LaTeX or MathML in a way screen readers can read aloud and users can zoom. Available as a Moodle filter.',
    ],
    [
      'MathML',
      'Mathematical Markup Language: a web standard for writing maths as structured code, so that assistive technology can read equations aloud and navigate them.',
    ],
    ['Moodle', 'A widely used open-source virtual learning environment (VLE) in UK higher education.'],
    [
      'OCR',
      'Optical character recognition: software that converts an image of text, such as a scanned page, into real, selectable text. A scanned PDF without OCR is unreadable to screen readers.',
      ['optical character recognition'],
    ],
    [
      'Operable',
      'The second POUR principle: users must be able to operate the interface — by keyboard, with enough time, without seizure-inducing content, and with clear navigation.',
    ],
    [
      'Perceivable',
      'The first POUR principle: information must be presented in ways users can perceive, such as text alternatives, captions and sufficient contrast.',
    ],
    ['POUR principles', 'The four principles WCAG is organised around: Perceivable, Operable, Understandable and Robust.', ['POUR']],
    [
      'PSBAR 2018',
      'The Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018. They require UK public sector bodies, including most universities, to make websites, intranets, VLEs, apps and the documents and media on them meet WCAG AA, and to publish an accessibility statement.',
      ['PSBAR', 'Accessibility Regulations', 'public sector bodies accessibility regulations'],
    ],
    [
      'PSED',
      'The Public Sector Equality Duty (section 149 of the Equality Act 2010). Public bodies, including universities, must have due regard to eliminating discrimination and advancing equality of opportunity.',
      ['Public Sector Equality Duty'],
    ],
    [
      'Reading order',
      'The sequence in which assistive technology reads content. In PowerPoint and PDF it can differ from the visual layout and must be checked.',
    ],
    [
      'Reasonable adjustments',
      'Changes an organisation must make so that disabled people are not put at a substantial disadvantage. Under the Equality Act 2010 they cover practices, physical features and auxiliary aids, and cannot be charged for.',
      ['reasonable adjustment', 'adjustments'],
    ],
    ['Reflow', 'Content adapting to a narrow width or 400% zoom without horizontal scrolling or loss of information (WCAG 1.4.10, AA).'],
    ['Robust', 'The fourth POUR principle: content must work reliably with a wide range of browsers and assistive technologies, now and in the future.'],
    ['Screen magnifier', 'Assistive software that enlarges part of the screen, used by many people with low vision.', ['magnifier', 'ZoomText']],
    [
      'Screen reader',
      'Assistive software that reads on-screen content aloud or outputs it to braille, such as JAWS, NVDA, VoiceOver and TalkBack.',
      ['screen readers', 'NVDA', 'JAWS', 'VoiceOver'],
    ],
    [
      'Speech recognition',
      'Software that lets people control a computer and dictate text by voice, such as Dragon or Voice Access. Visible labels that match accessible names help it work.',
      ['voice control', 'Dragon'],
    ],
    [
      'Subtitles',
      'A text translation of dialogue into another language. Unlike captions, subtitles usually assume the viewer can hear and omit sound effects.',
    ],
    [
      'Success criterion',
      'A single testable requirement in WCAG, such as 1.4.3 Contrast (Minimum). WCAG 2.2 has 86 success criteria.',
      ['success criteria', 'SC'],
    ],
    [
      'Tagged PDF',
      'A PDF that contains a hidden structure of tags (headings, lists, tables, alt text, reading order) that assistive technology uses. Export from Word or PowerPoint with document structure tags turned on.',
      ['tags', 'tagged'],
    ],
    ['Target size', 'WCAG 2.2 criterion 2.5.8 (AA): interactive targets should be at least 24 by 24 CSS pixels, or have enough space around them.'],
    [
      'Text alternative',
      'Any text that serves the same purpose as non-text content: alt text, a long description, a transcript or a data table (WCAG 1.1.1, A).',
    ],
    [
      'Text-to-speech',
      'Technology that reads digital text aloud in a synthetic voice. Useful for many readers, not only screen reader users.',
      ['TTS', 'read aloud'],
    ],
    [
      'Transcript',
      'A full text version of audio or video content, including speech and relevant sounds, and ideally descriptions of key visuals. Required for audio-only content such as podcasts.',
      ['transcripts'],
    ],
    ['Understandable', 'The third POUR principle: content and interfaces must be clear and predictable, with plain language and helpful error messages.'],
    [
      'Universal Design for Learning',
      'A framework developed by CAST that designs teaching to offer multiple means of engagement, representation and action and expression, reducing the need for individual adjustments.',
      ['UDL'],
    ],
    [
      'VLE',
      'Virtual learning environment: a platform such as Moodle, Canvas or Blackboard where courses, materials and assessments are delivered online. VLEs are covered by PSBAR 2018.',
      ['virtual learning environment'],
    ],
    [
      'WCAG 2.2',
      'The Web Content Accessibility Guidelines version 2.2, published by the W3C in October 2023. It sets out testable success criteria at levels A, AA and AAA and is the benchmark for UK public sector accessibility.',
      ['WCAG', 'Web Content Accessibility Guidelines'],
    ],
  ] as [string, string, string[]?][]
).map((g) => ({ term: g[0], def: g[1], alias: g[2] || [], id: slug(g[0]) }));

export const dosdonts: Record<number, { dos: string[]; donts: string[] }> = {
  1: {
    dos: [
      'Build accessibility in from the start of module design',
      'Tell students how to request content in another format',
      'Keep a note of adjustments you make so they carry over year to year',
      'Report platform problems to your digital or accessibility team',
    ],
    donts: [
      'Wait for a student to disclose before making materials accessible',
      'Assume live or third-party content is “exempt” from all duties',
      'Ask students to justify or pay for an adjustment',
      'Rely on one student’s support plan to fix a whole module',
    ],
  },
  2: {
    dos: [
      'Aim for WCAG 2.2 level AA in everything you publish',
      'Use the POUR principles as a quick sense-check',
      'Test with a keyboard: can you reach and use everything?',
      'Look up the “Understanding” pages when a criterion is unclear',
    ],
    donts: [
      'Treat AAA as the legal minimum — it isn’t always achievable',
      'Assume an automated checker score means full conformance',
      'Use drag-and-drop activities with no alternative',
      'Hide focus outlines because they “look untidy”',
    ],
  },
  3: {
    dos: [
      'Use built-in Heading styles, not bold or larger text',
      'Give every slide a unique title using the layout placeholder',
      'Export to PDF with document structure tags switched on',
      'Run the accessibility checker before you upload',
    ],
    donts: [
      'Scan pages without running OCR',
      'Use text boxes for key content in Word',
      'Use colour or underlining as the only sign of importance',
      'Paste screenshots of tables or text',
    ],
  },
  4: {
    dos: [
      'Write alt text for the purpose of the image, in its context',
      'Mark purely decorative images as decorative',
      'Check contrast for text, icons and chart elements',
      'Add labels, patterns or shapes alongside colour',
    ],
    donts: [
      'Start alt text with “Image of” or “Picture of”',
      'Put important text inside images',
      'Use red and green alone to show right and wrong',
      'Justify body text or set long lines of small text',
    ],
  },
  5: {
    dos: [
      'Edit automatic captions before publishing',
      'Provide transcripts for podcasts and audio clips',
      'Describe visuals as you teach (“This graph shows…”)',
      'Write maths in LaTeX or the equation editor',
    ],
    donts: [
      'Publish auto captions unchecked, especially technical terms',
      'Rely on “see slide” or pointing without explaining',
      'Paste equations as images without a text alternative',
      'Autoplay video or audio',
    ],
  },
  6: {
    dos: [
      'Use the same structure every week in your Moodle course',
      'Prefer Moodle Pages and Books for core text over PDFs',
      'Set quiz extra time once via user or group overrides',
      'Give links descriptive names including file type',
    ],
    donts: [
      'Name files “final_v2.pdf” or links “click here”',
      'Hide key information only in announcements or forum posts',
      'Reset adjustments manually for every quiz',
      'Use colour alone to highlight deadlines',
    ],
  },
};

const rawResources: Record<number, { links: [string, string, string][]; checklist: string[] }> = {
  1: {
    links: [
      ['PSBAR 2018 on legislation.gov.uk', 'https://www.legislation.gov.uk/uksi/2018/952/contents', 'The regulations in full'],
      ['Equality Act 2010 on legislation.gov.uk', 'https://www.legislation.gov.uk/ukpga/2010/15/contents', 'See Part 6 and Schedule 13 for education'],
      [
        'Understanding accessibility requirements for public sector bodies',
        'https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps',
        'GOV.UK guidance',
      ],
      ['Sample accessibility statement', 'https://www.gov.uk/government/publications/sample-accessibility-statement', 'GOV.UK template'],
      ['Equality and Human Rights Commission', 'https://www.equalityhumanrights.com/', 'Guidance for further and higher education'],
    ],
    checklist: [
      'I know where my institution’s accessibility statement is',
      'I can explain the anticipatory duty in my own words',
      'I know who to contact for student adjustment requests',
      'I have told students how to ask for alternative formats',
    ],
  },
  2: {
    links: [
      ['WCAG 2.2 (W3C Recommendation)', 'https://www.w3.org/TR/WCAG22/', 'The full standard'],
      ['What’s new in WCAG 2.2', 'https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/', 'W3C WAI summary'],
      ['How to Meet WCAG 2.2 (Quick Reference)', 'https://www.w3.org/WAI/WCAG22/quickref/', 'Filterable checklist'],
      ['Understanding WCAG 2.2', 'https://www.w3.org/WAI/WCAG22/Understanding/', 'Plain-language explanations'],
    ],
    checklist: [
      'I can name the four POUR principles',
      'I know level AA is the target for UK public sector content',
      'I have tried navigating my Moodle course with a keyboard only',
      'I know where to look up a success criterion',
    ],
  },
  3: {
    links: [
      [
        'Make your Word documents accessible',
        'https://support.microsoft.com/en-us/office/make-your-word-documents-accessible-to-people-with-disabilities-d9bf3683-87ac-47ea-b91a-78dcacb3c66d',
        'Microsoft Support',
      ],
      [
        'Make your PowerPoint presentations accessible',
        'https://support.microsoft.com/en-us/office/make-your-powerpoint-presentations-accessible-to-people-with-disabilities-6f7772b2-2f33-4bd2-8ca7-dae3b2b3ef25',
        'Microsoft Support',
      ],
      ['Create and verify PDF accessibility', 'https://helpx.adobe.com/acrobat/using/create-verify-pdf-accessibility.html', 'Adobe Acrobat help'],
      ['Jisc: accessibility', 'https://www.jisc.ac.uk/accessibility', 'Guidance for UK education'],
    ],
    checklist: [
      'My documents use Heading styles in a logical order',
      'Every slide has a unique title',
      'Images have alt text or are marked decorative',
      'I export PDFs with structure tags and check them',
      'I have run the accessibility checker on my latest upload',
    ],
  },
  4: {
    links: [
      ['W3C images tutorial', 'https://www.w3.org/WAI/tutorials/images/', 'When and how to write alt text'],
      ['Alt text decision tree', 'https://www.w3.org/WAI/tutorials/images/decision-tree/', 'W3C WAI'],
      ['WebAIM contrast checker', 'https://webaim.org/resources/contrastchecker/', 'Check any two colours'],
      ['Understanding 1.4.1 Use of Color', 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', 'W3C WAI'],
    ],
    checklist: [
      'My images have purposeful alt text or are decorative',
      'My text colours pass 4.5:1 against their background',
      'My charts use labels or patterns as well as colour',
      'There is no important text trapped inside images',
    ],
  },
  5: {
    links: [
      ['Making audio and video media accessible', 'https://www.w3.org/WAI/media/av/', 'W3C WAI'],
      ['Captions, transcripts and audio description', 'https://www.w3.org/WAI/media/av/description/', 'W3C WAI'],
      ['MathJax filter in Moodle', 'https://docs.moodle.org/en/MathJax_filter', 'Moodle Docs'],
      [
        'Write an equation in Word',
        'https://support.microsoft.com/en-us/office/write-an-equation-or-formula-1d01cabc-ceb1-458d-bc70-7f9737722702',
        'Microsoft Support',
      ],
    ],
    checklist: [
      'My pre-recorded videos have edited captions',
      'My audio-only content has a transcript',
      'I describe key visuals as I present',
      'My equations are written as text, LaTeX or MathML — not images',
    ],
  },
  6: {
    links: [
      ['Moodle accessibility', 'https://docs.moodle.org/en/Accessibility', 'Moodle Docs'],
      ['Quiz user and group overrides', 'https://docs.moodle.org/en/Quiz_settings', 'Moodle Docs'],
      ['UDL Guidelines', 'https://udlguidelines.cast.org/', 'CAST'],
      ['Jisc: accessibility', 'https://www.jisc.ac.uk/accessibility', 'Guidance for UK education'],
    ],
    checklist: [
      'My course sections follow the same structure each week',
      'My links and file names are descriptive',
      'Core reading is available as a Moodle Page or accessible file',
      'Extra time is set once through overrides',
      'Students know how to report an accessibility barrier',
    ],
  },
};
export const resources: Record<number, { links: ResourceLink[]; checklist: string[] }> = Object.fromEntries(
  Object.entries(rawResources).map(([k, r]) => [k, { checklist: r.checklist, links: r.links.map((l) => ({ t: l[0], u: l[1], d: l[2] })) }]),
);

export const kc: Record<number, Question[]> = {
  1: [
    {
      type: 'mcq',
      q: 'Which level of WCAG must UK public sector websites, VLEs and the content on them meet?',
      options: ['Level A', 'Level AA', 'Level AAA', 'No specific level — just “best efforts”'],
      answer: 1,
      explain: 'PSBAR 2018 requires level AA. Level AA includes all level A criteria. AAA is aspirational and not required.',
    },
    {
      type: 'mcq',
      scenario: {
        who: 'Dr Priya Shah, Lecturer in Economics',
        text: 'Priya live-streams her Tuesday lecture on Microsoft Teams and posts the recording to Moodle afterwards. A deaf student emails asking for captions on the live stream.',
      },
      q: 'What should Priya do?',
      options: [
        'Nothing: live media is exempt from PSBAR, so there is no duty',
        'Arrange live captions (automatic or human) and make sure the recording has edited captions',
        'Only caption the recording, as that is all the law covers',
        'Ask the student to provide evidence of their disability first',
      ],
      answer: 1,
      explain:
        'Live media is exempt from PSBAR, but the Equality Act 2010 still applies. Live captioning is a reasonable adjustment, and the recording is pre-recorded media covered by PSBAR, so it needs accurate captions too.',
    },
    {
      type: 'mcq',
      q: 'In higher education, the Equality Act duty to make reasonable adjustments is “anticipatory”. What does that mean?',
      options: [
        'Adjustments only start once a student formally discloses a disability',
        'You must anticipate the needs of disabled students in general and plan for them in advance',
        'Adjustments can be delayed until the next academic year',
        'It only applies to physical buildings',
      ],
      answer: 1,
      explain:
        'The anticipatory duty means planning ahead for disabled students as a group, so that many barriers never arise. Individual adjustments are still needed on top.',
    },
    {
      type: 'sort',
      q: 'Sort each item: is it covered by PSBAR 2018, or exempt from PSBAR (where the Equality Act still applies)?',
      bins: ['Covered by PSBAR', 'Exempt from PSBAR'],
      items: [
        { t: 'A Moodle page you created this term', b: 0 },
        { t: 'A lecture recording posted last week', b: 0 },
        { t: 'A live-streamed seminar', b: 1 },
        { t: 'A publisher’s e-book you link to', b: 1 },
        { t: 'A Word handout uploaded this year', b: 0 },
      ],
    },
  ],
  2: [
    {
      type: 'sort',
      q: 'Match each teaching example to the POUR principle it most relates to.',
      bins: ['Perceivable', 'Operable', 'Understandable', 'Robust'],
      items: [
        { t: 'Captions on a lecture recording', b: 0 },
        { t: 'A quiz that works with the keyboard only', b: 1 },
        { t: 'Plain-language assessment instructions', b: 2 },
        { t: 'Content that works with any screen reader', b: 3 },
      ],
    },
    {
      type: 'mcq',
      q: 'Which statement about conformance levels is correct?',
      options: [
        'AA conformance means meeting all A and AA criteria',
        'AA conformance means meeting AA criteria only',
        'A is the highest level',
        'AAA is required for all university content',
      ],
      answer: 0,
      explain: 'Levels are cumulative. To conform at AA you must meet every level A and level AA success criterion.',
    },
    {
      type: 'mcq',
      scenario: {
        who: 'Tom Okafor, Senior Lecturer in Biology',
        text: 'Tom builds a Moodle activity where students must drag labels onto a diagram of a cell. There is no other way to answer. A student with a tremor who uses a trackball cannot complete it.',
      },
      q: 'Which WCAG 2.2 criterion is most directly at issue?',
      options: ['1.4.3 Contrast (Minimum)', '2.5.7 Dragging Movements', '3.1.1 Language of Page', '1.2.2 Captions (Prerecorded)'],
      answer: 1,
      explain:
        '2.5.7 Dragging Movements (AA, new in 2.2) requires a single-pointer alternative to dragging — for example, selecting a label then selecting a target, or using a drop-down.',
    },
    {
      type: 'mcq',
      q: 'WCAG 2.2 criterion 2.5.8 sets a minimum size for clickable targets. What is it?',
      options: ['16 × 16 CSS pixels', '24 × 24 CSS pixels', '44 × 44 CSS pixels', 'There is no minimum'],
      answer: 1,
      explain: '2.5.8 Target Size (Minimum) is 24 × 24 CSS pixels (or enough spacing). 44 × 44 is the enhanced AAA criterion 2.5.5.',
    },
  ],
  3: [
    {
      type: 'sort',
      q: 'Sort these document practices into accessible practice or barrier.',
      bins: ['Accessible practice', 'Barrier'],
      items: [
        { t: 'Heading 2 style for section titles', b: 0 },
        { t: 'Bold 16pt text used as headings', b: 1 },
        { t: 'A table with a repeated header row', b: 0 },
        { t: 'A scanned PDF with no OCR', b: 1 },
        { t: 'Link text “Module handbook (PDF, 2 MB)”', b: 0 },
        { t: 'Key instructions in a floating text box', b: 1 },
      ],
    },
    {
      type: 'mcq',
      q: 'What is the most reliable way to make a heading in Microsoft Word?',
      options: [
        'Make the text bold and larger',
        'Apply a built-in Heading style from the Styles gallery',
        'Underline it and add a blank line',
        'Put it in a text box',
      ],
      answer: 1,
      explain: 'Built-in Heading styles create real structure that screen readers, the navigation pane and exported PDFs all understand.',
    },
    {
      type: 'mcq',
      scenario: {
        who: 'Dr Aisha Rahman, Lecturer in History',
        text: 'Aisha wants to share a chapter from a 1970s monograph. She scans it on the department copier and uploads the PDF to Moodle. A student using a screen reader reports that it reads “blank page” for every page.',
      },
      q: 'What is the best next step?',
      options: [
        'Tell the student the scan is the only copy available',
        'Upload the scan again at a higher resolution',
        'Run OCR and check the tags, or ask the library for an accessible copy via your institution’s licence',
        'Convert the PDF to a JPEG',
      ],
      answer: 2,
      explain:
        'A scan without OCR is just a picture of text. Run OCR (for example, Acrobat’s Scan & OCR), then check reading order and tags — or ask the library, which can often source accessible digitised copies.',
    },
    {
      type: 'mcq',
      q: 'In PowerPoint, where can you check and fix the order a screen reader reads slide content?',
      options: ['View › Slide Sorter', 'Review › Check Accessibility › Reading Order pane', 'Design › Themes', 'Transitions › Timing'],
      answer: 1,
      explain:
        'The Reading Order pane (available from Check Accessibility) lists objects in the order a screen reader reads them, and you can drag to reorder.',
    },
  ],
  4: [
    {
      type: 'mcq',
      q: 'What is the minimum contrast ratio for normal-size body text at WCAG level AA?',
      options: ['3:1', '4.5:1', '7:1', '21:1'],
      answer: 1,
      explain: 'Normal text needs 4.5:1 at AA. Large text (at least 18pt, or 14pt bold) needs 3:1. AAA raises these to 7:1 and 4.5:1.',
    },
    {
      type: 'mcq',
      scenario: {
        who: 'Grace Liu, Module Leader in Nursing',
        text: 'Grace’s Moodle page shows each student’s placement status as a coloured dot: red for “not started”, amber for “in progress”, green for “complete”. No text accompanies the dots.',
      },
      q: 'What is the best fix?',
      options: [
        'Make the dots bigger',
        'Use brighter red and green',
        'Add a text label (and ideally a distinct shape) next to each status',
        'Add a key at the bottom of the page explaining the colours',
      ],
      answer: 2,
      explain:
        'WCAG 1.4.1 Use of Color: colour must not be the only way information is conveyed. A text label works for everyone — including colour-blind and screen reader users. A key alone still relies on colour.',
    },
    {
      type: 'sort',
      q: 'Sort these images: do they need descriptive alt text, or should they be marked decorative?',
      bins: ['Needs alt text', 'Decorative'],
      items: [
        { t: 'A graph of exam results used in a lecture', b: 0 },
        { t: 'A decorative swirl between sections', b: 1 },
        { t: 'A linked university logo in the page header', b: 0 },
        { t: 'A stock photo of a coffee cup on a welcome page', b: 1 },
        { t: 'A photo of the correct lab set-up', b: 0 },
      ],
    },
    {
      type: 'mcq',
      q: 'A university logo links to the homepage. What is the best alt text?',
      options: ['“Logo”', '“University logo, blue and gold crest”', '“Northbridge University homepage”', 'Leave it empty'],
      answer: 2,
      explain: 'For a functional image, the alt text should describe the destination or action — not the appearance.',
    },
  ],
  5: [
    {
      type: 'sort',
      q: 'Match each piece of content to the alternative it most needs.',
      bins: ['Captions', 'Transcript', 'Audio description'],
      items: [
        { t: 'A recorded lecture with speech', b: 0 },
        { t: 'A departmental podcast episode', b: 1 },
        { t: 'A silent lab demonstration video with music only', b: 2 },
        { t: 'A recorded seminar discussion', b: 0 },
        { t: 'An audio-only interview clip', b: 1 },
      ],
    },
    {
      type: 'mcq',
      scenario: {
        who: 'Dr Ben Hughes, Lecturer in Physics',
        text: 'Ben records a lecture on quantum mechanics. The platform generates automatic captions, which turn “Schrödinger equation” into “shrewd injure equation” and “eigenstate” into “I can state”.',
      },
      q: 'What should Ben do before publishing?',
      options: [
        'Publish as is — automatic captions satisfy the regulations',
        'Turn captions off to avoid confusing students',
        'Review and edit the captions, correcting technical terms and speaker changes',
        'Upload his slides instead of the video',
      ],
      answer: 2,
      explain:
        'Captions must be accurate to be accessible. Automatic captions are a starting point; subject-specific terms are where they fail most, so edit them before publishing.',
    },
    {
      type: 'mcq',
      q: 'What is the most accessible way to put an equation in a Moodle page?',
      options: [
        'A screenshot of the equation',
        'Write it in LaTeX so the MathJax filter renders it',
        'Describe it only in words',
        'Attach a scanned handwritten version',
      ],
      answer: 1,
      explain: 'LaTeX rendered by MathJax produces real maths that screen readers can read aloud and users can zoom without blurring.',
    },
    {
      type: 'mcq',
      q: 'What is audio description?',
      options: [
        'A text version of all the audio',
        'Extra narration describing important visual content not conveyed by the soundtrack',
        'A translation into another language',
        'Background music',
      ],
      answer: 1,
      explain:
        'Audio description narrates key visual information for blind and partially sighted viewers. Describing visuals as you teach can remove the need for a separate description track.',
    },
  ],
  6: [
    {
      type: 'mcq',
      scenario: {
        who: 'Sam Patel, Programme Lead in Law',
        text: 'Sam’s Week 4 Moodle section contains: a link called “Click here”, a file named “lec4_FINAL_v3.pdf”, an image with no alt text, and a deadline highlighted only in red.',
      },
      q: 'Which change will help the most students fastest?',
      options: [
        'Change the theme colour of the course',
        'Rename the link and file to describe their content and type, and add “Deadline:” text next to the red',
        'Delete the section and start again',
        'Move everything into a single ZIP file',
      ],
      answer: 1,
      explain:
        'Descriptive link and file names and not relying on colour are quick wins that help everyone, including screen reader and colour-blind users. Then add the alt text.',
    },
    {
      type: 'sort',
      q: 'Sort these Moodle practices into good practice or barrier.',
      bins: ['Good practice', 'Barrier'],
      items: [
        { t: 'The same section structure every week', b: 0 },
        { t: 'Key reading only in a forum post', b: 1 },
        { t: 'Core text as a Moodle Page', b: 0 },
        { t: 'Quiz extra time set per quiz, by hand, each time', b: 1 },
        { t: 'Links that say what they open and the file type', b: 0 },
      ],
    },
    {
      type: 'mcq',
      q: 'A student has 25% extra time in all assessments. What is the most reliable way to apply this in Moodle quizzes?',
      options: [
        'Tell the student to work faster',
        'Add a user or group override for time limit on each quiz — or better, use your institution’s group-based process',
        'Remove the time limit for everyone',
        'Email the student the questions',
      ],
      answer: 1,
      explain:
        'Quiz overrides let you set extra time for a user or a group. Many institutions use a group for all students with extra time so it is applied once, consistently.',
    },
    {
      type: 'mcq',
      q: 'Which Universal Design for Learning practice reduces the need for individual adjustments?',
      options: [
        'Offering the same content in more than one format, such as slides plus a Moodle Page summary',
        'Only providing materials on request',
        'Using a different structure every week to keep it interesting',
        'Sharing notes after the exam',
      ],
      answer: 0,
      explain: 'Multiple means of representation — for example, video with transcript plus an accessible text summary — anticipates a wide range of needs.',
    },
  ],
};
