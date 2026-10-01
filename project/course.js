(function(){
if(window.AE) return;
var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function emit(n,d){window.dispatchEvent(new CustomEvent(n,{detail:d}))}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}

var lessons=[
{n:1,file:'Lesson1.dc.html',title:'The law & your duties',mins:15,icon:'fa-scale-balanced',badge:'Legal Foundations',
 summary:'PSBAR 2018, the Equality Act 2010, and what they expect of you.',
 outcomes:['Explain what PSBAR 2018 requires of university websites, VLEs and the content you publish on them','Describe the anticipatory duty to make reasonable adjustments under the Equality Act 2010','Identify which teaching content is covered, exempt, or still subject to the Equality Act','Know what to do when a student asks for an accessible alternative'],
 sections:[{id:'two-laws',title:'Two laws, one goal'},{id:'psbar',title:'PSBAR 2018 in practice'},{id:'covered',title:'Covered or exempt?'},{id:'equality-act',title:'The Equality Act 2010'},{id:'duties',title:'What this means for you'}]},
{n:2,file:'Lesson2.dc.html',title:'WCAG 2.2 & the POUR principles',mins:15,icon:'fa-layer-group',badge:'Standards Navigator',
 summary:'The standard your teaching and learning content is measured against.',
 outcomes:['Describe what WCAG 2.2 is and how it relates to PSBAR','Explain the four POUR principles using teaching examples','Distinguish between conformance levels A, AA and AAA','Recognise the WCAG 2.2 criteria most relevant to teaching content'],
 sections:[{id:'what-is-wcag',title:'What is WCAG 2.2?'},{id:'pour',title:'The POUR principles'},{id:'levels',title:'Conformance levels'},{id:'new-in-22',title:'New in WCAG 2.2'}]},
{n:3,file:'Lesson3.dc.html',title:'Accessible documents',mins:15,icon:'fa-file-lines',badge:'Document Builder',
 summary:'Create accessible Word documents, PowerPoint slides and PDFs.',
 outcomes:['Use built-in heading styles, lists and tables to give documents real structure','Build PowerPoint slides with unique titles and a logical reading order','Export tagged PDFs and recognise when a PDF is inaccessible','Run the Microsoft and Adobe accessibility checkers and act on the results'],
 sections:[{id:'headings',title:'Why real headings matter'},{id:'apps',title:'Word, PowerPoint & PDF'},{id:'spot',title:'Spot the issues'},{id:'checkers',title:'Using the checkers'}]},
{n:4,file:'Lesson4.dc.html',title:'Images, colour & visual design',mins:15,icon:'fa-image',badge:'Visual Clarity',
 summary:'Alt text, contrast, and visual choices that include everyone.',
 outcomes:['Write concise, context-aware alt text and recognise decorative images','Check colour contrast against WCAG AA and AAA thresholds','Avoid using colour as the only way to convey meaning','Make visual design choices that support readability'],
 sections:[{id:'alt-text',title:'Alt text essentials'},{id:'alt-sim',title:'Alt text simulator'},{id:'contrast',title:'Colour contrast checker'},{id:'colour-blind',title:'Colour vision simulator'},{id:'visual',title:'Visual design choices'}]},
{n:5,file:'Lesson5.dc.html',title:'Video, audio & STEM content',mins:15,icon:'fa-closed-captioning',badge:'Media & Maths',
 summary:'Captions, transcripts, audio description and accessible maths.',
 outcomes:['Explain the difference between captions, subtitles, transcripts and audio description','Edit automatic captions for accuracy, especially subject-specific terms','Know when audio description is needed and how to describe as you teach','Present mathematical and scientific notation in accessible formats'],
 sections:[{id:'media-types',title:'Four media alternatives'},{id:'captions',title:'Auto vs edited captions'},{id:'player',title:'An accessible lecture player'},{id:'maths',title:'Accessible maths & STEM'}]},
{n:6,file:'Lesson6.dc.html',title:'Inclusive teaching & VLE practice',mins:15,icon:'fa-chalkboard-user',badge:'Inclusive Practitioner',
 summary:'Putting it all together in Moodle and your wider teaching practice.',
 outcomes:['Structure a Moodle course so it is predictable and easy to navigate','Audit a course section and prioritise accessibility fixes','Apply Universal Design for Learning to reduce the need for individual adjustments','Handle adjustment requests, including extra time, consistently'],
 sections:[{id:'udl',title:'Universal Design for Learning'},{id:'moodle',title:'A predictable Moodle course'},{id:'audit',title:'Audit this section'},{id:'requests',title:'Responding to requests'}]}
];
lessons.forEach(function(l){l.sections=l.sections.concat([{id:'dos-donts',title:"Do's & don'ts"},{id:'knowledge-check',title:'Knowledge check'},{id:'resources',title:'Resources & checklist'}])});

var glossary=[
['Accessibility','The degree to which content, services and environments can be used by as many people as possible, including disabled people, without needing adaptation.'],
['Accessibility statement','A page that public sector bodies must publish under PSBAR 2018. It states how accessible a website or app is, lists known problems and why, explains how to request an accessible alternative, and describes the enforcement procedure.',['statement']],
['Accessible authentication','WCAG 2.2 criterion 3.3.8 (AA): logging in must not rely on a cognitive test such as remembering or transcribing a password, unless an alternative or assistance (like paste or a password manager) is available.'],
['Accessibility checker','A built-in tool in Word, PowerPoint, Outlook, Acrobat and many VLE editors that flags common accessibility problems. It catches some issues automatically, but not all — human judgement is still needed.',['check accessibility']],
['Alt text','Short for alternative text: a text description attached to an image so that people who cannot see it — including screen reader users — get the same information or function. Decorative images should have empty alt text.',['alternative text','alt']],
['Anticipatory duty','The Equality Act 2010 requirement for education providers to think in advance about what disabled students may need and make adjustments before an individual asks.',['anticipatory']],
['Assistive technology','Hardware or software that helps disabled people use digital content, such as screen readers, screen magnifiers, speech recognition, switch access and refreshable braille displays.',['AT']],
['Audio description','An additional narration that describes important visual information in a video — actions, on-screen text, diagrams — that is not conveyed by the existing soundtrack. Required at WCAG level AA for pre-recorded video.',['audio descriptions','AD']],
['Auxiliary aid','Under the Equality Act 2010, an aid or service (including information in an accessible format) provided as a reasonable adjustment.'],
['Captions','Synchronised on-screen text of all speech and meaningful sound in a video, e.g. [laughter] or [alarm sounds]. Closed captions can be turned on and off; open captions are burned into the picture.',['caption','closed captions']],
['Colour contrast ratio','A measure from 1:1 to 21:1 of the difference in luminance between foreground and background colours. WCAG AA requires 4.5:1 for normal text and 3:1 for large text and interface components.',['contrast ratio','contrast']],
['Colour vision deficiency','Reduced ability to distinguish certain colours, most commonly red and green (protanopia, deuteranopia). Often called colour blindness. It affects around 1 in 12 men and 1 in 200 women.',['colour blindness','color blindness']],
['Conformance level','One of three levels — A, AA and AAA — that WCAG success criteria are grouped into. UK public sector bodies must meet level AA, which includes all level A criteria.',['A, AA, AAA']],
['Decorative image','An image that adds no information, such as a divider or mood photograph. It should have empty alt text (alt="") or be marked as decorative so screen readers skip it.',['decorative']],
['Digital accessibility','Designing and building websites, apps, documents and media so that disabled people can perceive, understand, navigate and interact with them.'],
['Disability','Under the Equality Act 2010, a physical or mental impairment that has a substantial and long-term adverse effect on a person’s ability to carry out normal day-to-day activities.'],
['Disproportionate burden','A PSBAR 2018 provision allowing a public sector body not to fix specific content if the cost would be excessive relative to its size and resources. It must be formally assessed and declared in the accessibility statement; it cannot be claimed simply because fixing is inconvenient.'],
['EHRC','The Equality and Human Rights Commission. It enforces the Equality Act 2010 and PSBAR 2018 in England, Scotland and Wales. In Northern Ireland, the Equality Commission for Northern Ireland (ECNI) has this role.',['Equality and Human Rights Commission','ECNI']],
['EN 301 549','The European accessibility standard for ICT products and services referenced by PSBAR 2018. For web content it points to WCAG level AA.'],
['EPUB','An open e-book format that reflows text to fit any screen and works well with screen readers and text-to-speech.'],
['Equality Act 2010','The UK Act of Parliament (applying in England, Scotland and Wales) that protects people from discrimination on the basis of nine protected characteristics, including disability. It requires education providers to make reasonable adjustments for disabled students.',['Equality Act','EA 2010']],
['Focus indicator','The visible outline or highlight that shows which element currently has keyboard focus. WCAG requires it to be visible (2.4.7) and, in 2.2, not hidden by other content (2.4.11).',['focus','focus outline']],
['GDS','The Government Digital Service. It monitors public sector websites and apps for compliance with PSBAR 2018 on behalf of the government.',['Government Digital Service']],
['Heading structure','Using real, nested heading levels (Heading 1, Heading 2, Heading 3) so that assistive technology users can see the outline of a page or document and jump between sections.',['headings','heading styles']],
['Keyboard accessibility','Being able to reach and use every interactive element with a keyboard alone, in a logical order and without getting trapped. Required by WCAG 2.1.1 (A).',['keyboard']],
['LaTeX','A typesetting language widely used for mathematics and science. Moodle can render LaTeX notation accessibly via the MathJax filter.'],
['Link text','The clickable words of a hyperlink. Good link text describes its destination (“Week 3 reading list”) rather than using “click here” or a raw URL.'],
['Live media','Audio or video broadcast in real time, such as a live-streamed lecture. It is exempt from PSBAR 2018, but the Equality Act 2010 still applies, so live captions may be a reasonable adjustment.',['live stream','live-streamed']],
['Long description','A fuller explanation of a complex image, such as a chart or diagram, provided in the surrounding text, a linked page or a data table, in addition to short alt text.'],
['MathJax','A JavaScript library that displays mathematical notation written in LaTeX or MathML in a way screen readers can read aloud and users can zoom. Available as a Moodle filter.'],
['MathML','Mathematical Markup Language: a web standard for writing maths as structured code, so that assistive technology can read equations aloud and navigate them.'],
['Moodle','A widely used open-source virtual learning environment (VLE) in UK higher education.'],
['OCR','Optical character recognition: software that converts an image of text, such as a scanned page, into real, selectable text. A scanned PDF without OCR is unreadable to screen readers.',['optical character recognition']],
['Operable','The second POUR principle: users must be able to operate the interface — by keyboard, with enough time, without seizure-inducing content, and with clear navigation.'],
['Perceivable','The first POUR principle: information must be presented in ways users can perceive, such as text alternatives, captions and sufficient contrast.'],
['POUR principles','The four principles WCAG is organised around: Perceivable, Operable, Understandable and Robust.',['POUR']],
['PSBAR 2018','The Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018. They require UK public sector bodies, including most universities, to make websites, intranets, VLEs, apps and the documents and media on them meet WCAG AA, and to publish an accessibility statement.',['PSBAR','Accessibility Regulations','public sector bodies accessibility regulations']],
['PSED','The Public Sector Equality Duty (section 149 of the Equality Act 2010). Public bodies, including universities, must have due regard to eliminating discrimination and advancing equality of opportunity.',['Public Sector Equality Duty']],
['Reading order','The sequence in which assistive technology reads content. In PowerPoint and PDF it can differ from the visual layout and must be checked.'],
['Reasonable adjustments','Changes an organisation must make so that disabled people are not put at a substantial disadvantage. Under the Equality Act 2010 they cover practices, physical features and auxiliary aids, and cannot be charged for.',['reasonable adjustment','adjustments']],
['Reflow','Content adapting to a narrow width or 400% zoom without horizontal scrolling or loss of information (WCAG 1.4.10, AA).'],
['Robust','The fourth POUR principle: content must work reliably with a wide range of browsers and assistive technologies, now and in the future.'],
['Screen magnifier','Assistive software that enlarges part of the screen, used by many people with low vision.',['magnifier','ZoomText']],
['Screen reader','Assistive software that reads on-screen content aloud or outputs it to braille, such as JAWS, NVDA, VoiceOver and TalkBack.',['screen readers','NVDA','JAWS','VoiceOver']],
['Speech recognition','Software that lets people control a computer and dictate text by voice, such as Dragon or Voice Access. Visible labels that match accessible names help it work.',['voice control','Dragon']],
['Subtitles','A text translation of dialogue into another language. Unlike captions, subtitles usually assume the viewer can hear and omit sound effects.'],
['Success criterion','A single testable requirement in WCAG, such as 1.4.3 Contrast (Minimum). WCAG 2.2 has 86 success criteria.',['success criteria','SC']],
['Tagged PDF','A PDF that contains a hidden structure of tags (headings, lists, tables, alt text, reading order) that assistive technology uses. Export from Word or PowerPoint with document structure tags turned on.',['tags','tagged']],
['Target size','WCAG 2.2 criterion 2.5.8 (AA): interactive targets should be at least 24 by 24 CSS pixels, or have enough space around them.'],
['Text alternative','Any text that serves the same purpose as non-text content: alt text, a long description, a transcript or a data table (WCAG 1.1.1, A).'],
['Text-to-speech','Technology that reads digital text aloud in a synthetic voice. Useful for many readers, not only screen reader users.',['TTS','read aloud']],
['Transcript','A full text version of audio or video content, including speech and relevant sounds, and ideally descriptions of key visuals. Required for audio-only content such as podcasts.',['transcripts']],
['Understandable','The third POUR principle: content and interfaces must be clear and predictable, with plain language and helpful error messages.'],
['Universal Design for Learning','A framework developed by CAST that designs teaching to offer multiple means of engagement, representation and action and expression, reducing the need for individual adjustments.',['UDL']],
['VLE','Virtual learning environment: a platform such as Moodle, Canvas or Blackboard where courses, materials and assessments are delivered online. VLEs are covered by PSBAR 2018.',['virtual learning environment']],
['WCAG 2.2','The Web Content Accessibility Guidelines version 2.2, published by the W3C in October 2023. It sets out testable success criteria at levels A, AA and AAA and is the benchmark for UK public sector accessibility.',['WCAG','Web Content Accessibility Guidelines']]
].map(function(g){return {term:g[0],def:g[1],alias:g[2]||[],id:slug(g[0])}});

var dosdonts={
1:{dos:['Build accessibility in from the start of module design','Tell students how to request content in another format','Keep a note of adjustments you make so they carry over year to year','Report platform problems to your digital or accessibility team'],donts:['Wait for a student to disclose before making materials accessible','Assume live or third-party content is “exempt” from all duties','Ask students to justify or pay for an adjustment','Rely on one student’s support plan to fix a whole module']},
2:{dos:['Aim for WCAG 2.2 level AA in everything you publish','Use the POUR principles as a quick sense-check','Test with a keyboard: can you reach and use everything?','Look up the “Understanding” pages when a criterion is unclear'],donts:['Treat AAA as the legal minimum — it isn’t always achievable','Assume an automated checker score means full conformance','Use drag-and-drop activities with no alternative','Hide focus outlines because they “look untidy”']},
3:{dos:['Use built-in Heading styles, not bold or larger text','Give every slide a unique title using the layout placeholder','Export to PDF with document structure tags switched on','Run the accessibility checker before you upload'],donts:['Scan pages without running OCR','Use text boxes for key content in Word','Use colour or underlining as the only sign of importance','Paste screenshots of tables or text']},
4:{dos:['Write alt text for the purpose of the image, in its context','Mark purely decorative images as decorative','Check contrast for text, icons and chart elements','Add labels, patterns or shapes alongside colour'],donts:['Start alt text with “Image of” or “Picture of”','Put important text inside images','Use red and green alone to show right and wrong','Justify body text or set long lines of small text']},
5:{dos:['Edit automatic captions before publishing','Provide transcripts for podcasts and audio clips','Describe visuals as you teach (“This graph shows…”)','Write maths in LaTeX or the equation editor'],donts:['Publish auto captions unchecked, especially technical terms','Rely on “see slide” or pointing without explaining','Paste equations as images without a text alternative','Autoplay video or audio']},
6:{dos:['Use the same structure every week in your Moodle course','Prefer Moodle Pages and Books for core text over PDFs','Set quiz extra time once via user or group overrides','Give links descriptive names including file type'],donts:['Name files “final_v2.pdf” or links “click here”','Hide key information only in announcements or forum posts','Reset adjustments manually for every quiz','Use colour alone to highlight deadlines']}
};

var resources={
1:{links:[['PSBAR 2018 on legislation.gov.uk','https://www.legislation.gov.uk/uksi/2018/952/contents','The regulations in full'],['Equality Act 2010 on legislation.gov.uk','https://www.legislation.gov.uk/ukpga/2010/15/contents','See Part 6 and Schedule 13 for education'],['Understanding accessibility requirements for public sector bodies','https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps','GOV.UK guidance'],['Sample accessibility statement','https://www.gov.uk/government/publications/sample-accessibility-statement','GOV.UK template'],['Equality and Human Rights Commission','https://www.equalityhumanrights.com/','Guidance for further and higher education']],
 checklist:['I know where my institution’s accessibility statement is','I can explain the anticipatory duty in my own words','I know who to contact for student adjustment requests','I have told students how to ask for alternative formats']},
2:{links:[['WCAG 2.2 (W3C Recommendation)','https://www.w3.org/TR/WCAG22/','The full standard'],['What’s new in WCAG 2.2','https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/','W3C WAI summary'],['How to Meet WCAG 2.2 (Quick Reference)','https://www.w3.org/WAI/WCAG22/quickref/','Filterable checklist'],['Understanding WCAG 2.2','https://www.w3.org/WAI/WCAG22/Understanding/','Plain-language explanations']],
 checklist:['I can name the four POUR principles','I know level AA is the target for UK public sector content','I have tried navigating my Moodle course with a keyboard only','I know where to look up a success criterion']},
3:{links:[['Make your Word documents accessible','https://support.microsoft.com/en-us/office/make-your-word-documents-accessible-to-people-with-disabilities-d9bf3683-87ac-47ea-b91a-78dcacb3c66d','Microsoft Support'],['Make your PowerPoint presentations accessible','https://support.microsoft.com/en-us/office/make-your-powerpoint-presentations-accessible-to-people-with-disabilities-6f7772b2-2f33-4bd2-8ca7-dae3b2b3ef25','Microsoft Support'],['Create and verify PDF accessibility','https://helpx.adobe.com/acrobat/using/create-verify-pdf-accessibility.html','Adobe Acrobat help'],['Jisc: accessibility','https://www.jisc.ac.uk/accessibility','Guidance for UK education']],
 checklist:['My documents use Heading styles in a logical order','Every slide has a unique title','Images have alt text or are marked decorative','I export PDFs with structure tags and check them','I have run the accessibility checker on my latest upload']},
4:{links:[['W3C images tutorial','https://www.w3.org/WAI/tutorials/images/','When and how to write alt text'],['Alt text decision tree','https://www.w3.org/WAI/tutorials/images/decision-tree/','W3C WAI'],['WebAIM contrast checker','https://webaim.org/resources/contrastchecker/','Check any two colours'],['Understanding 1.4.1 Use of Color','https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html','W3C WAI']],
 checklist:['My images have purposeful alt text or are decorative','My text colours pass 4.5:1 against their background','My charts use labels or patterns as well as colour','There is no important text trapped inside images']},
5:{links:[['Making audio and video media accessible','https://www.w3.org/WAI/media/av/','W3C WAI'],['Captions, transcripts and audio description','https://www.w3.org/WAI/media/av/description/','W3C WAI'],['MathJax filter in Moodle','https://docs.moodle.org/en/MathJax_filter','Moodle Docs'],['Write an equation in Word','https://support.microsoft.com/en-us/office/write-an-equation-or-formula-1d01cabc-ceb1-458d-bc70-7f9737722702','Microsoft Support']],
 checklist:['My pre-recorded videos have edited captions','My audio-only content has a transcript','I describe key visuals as I present','My equations are written as text, LaTeX or MathML — not images']},
6:{links:[['Moodle accessibility','https://docs.moodle.org/en/Accessibility','Moodle Docs'],['Quiz user and group overrides','https://docs.moodle.org/en/Quiz_settings','Moodle Docs'],['UDL Guidelines','https://udlguidelines.cast.org/','CAST'],['Jisc: accessibility','https://www.jisc.ac.uk/accessibility','Guidance for UK education']],
 checklist:['My course sections follow the same structure each week','My links and file names are descriptive','Core reading is available as a Moodle Page or accessible file','Extra time is set once through overrides','Students know how to report an accessibility barrier']}
};
Object.keys(resources).forEach(function(k){resources[k].links=resources[k].links.map(function(l){return {t:l[0],u:l[1],d:l[2]}})});

var kc={
1:[
 {type:'mcq',q:'Which level of WCAG must UK public sector websites, VLEs and the content on them meet?',options:['Level A','Level AA','Level AAA','No specific level — just “best efforts”'],answer:1,explain:'PSBAR 2018 requires level AA. Level AA includes all level A criteria. AAA is aspirational and not required.'},
 {type:'mcq',scenario:{who:'Dr Priya Shah, Lecturer in Economics',text:'Priya live-streams her Tuesday lecture on Microsoft Teams and posts the recording to Moodle afterwards. A deaf student emails asking for captions on the live stream.'},q:'What should Priya do?',options:['Nothing: live media is exempt from PSBAR, so there is no duty','Arrange live captions (automatic or human) and make sure the recording has edited captions','Only caption the recording, as that is all the law covers','Ask the student to provide evidence of their disability first'],answer:1,explain:'Live media is exempt from PSBAR, but the Equality Act 2010 still applies. Live captioning is a reasonable adjustment, and the recording is pre-recorded media covered by PSBAR, so it needs accurate captions too.'},
 {type:'mcq',q:'In higher education, the Equality Act duty to make reasonable adjustments is “anticipatory”. What does that mean?',options:['Adjustments only start once a student formally discloses a disability','You must anticipate the needs of disabled students in general and plan for them in advance','Adjustments can be delayed until the next academic year','It only applies to physical buildings'],answer:1,explain:'The anticipatory duty means planning ahead for disabled students as a group, so that many barriers never arise. Individual adjustments are still needed on top.'},
 {type:'sort',q:'Sort each item: is it covered by PSBAR 2018, or exempt from PSBAR (where the Equality Act still applies)?',bins:['Covered by PSBAR','Exempt from PSBAR'],items:[{t:'A Moodle page you created this term',b:0},{t:'A lecture recording posted last week',b:0},{t:'A live-streamed seminar',b:1},{t:'A publisher’s e-book you link to',b:1},{t:'A Word handout uploaded this year',b:0}]}
],
2:[
 {type:'sort',q:'Match each teaching example to the POUR principle it most relates to.',bins:['Perceivable','Operable','Understandable','Robust'],items:[{t:'Captions on a lecture recording',b:0},{t:'A quiz that works with the keyboard only',b:1},{t:'Plain-language assessment instructions',b:2},{t:'Content that works with any screen reader',b:3}]},
 {type:'mcq',q:'Which statement about conformance levels is correct?',options:['AA conformance means meeting all A and AA criteria','AA conformance means meeting AA criteria only','A is the highest level','AAA is required for all university content'],answer:0,explain:'Levels are cumulative. To conform at AA you must meet every level A and level AA success criterion.'},
 {type:'mcq',scenario:{who:'Tom Okafor, Senior Lecturer in Biology',text:'Tom builds a Moodle activity where students must drag labels onto a diagram of a cell. There is no other way to answer. A student with a tremor who uses a trackball cannot complete it.'},q:'Which WCAG 2.2 criterion is most directly at issue?',options:['1.4.3 Contrast (Minimum)','2.5.7 Dragging Movements','3.1.1 Language of Page','1.2.2 Captions (Prerecorded)'],answer:1,explain:'2.5.7 Dragging Movements (AA, new in 2.2) requires a single-pointer alternative to dragging — for example, selecting a label then selecting a target, or using a drop-down.'},
 {type:'mcq',q:'WCAG 2.2 criterion 2.5.8 sets a minimum size for clickable targets. What is it?',options:['16 × 16 CSS pixels','24 × 24 CSS pixels','44 × 44 CSS pixels','There is no minimum'],answer:1,explain:'2.5.8 Target Size (Minimum) is 24 × 24 CSS pixels (or enough spacing). 44 × 44 is the enhanced AAA criterion 2.5.5.'}
],
3:[
 {type:'sort',q:'Sort these document practices into accessible practice or barrier.',bins:['Accessible practice','Barrier'],items:[{t:'Heading 2 style for section titles',b:0},{t:'Bold 16pt text used as headings',b:1},{t:'A table with a repeated header row',b:0},{t:'A scanned PDF with no OCR',b:1},{t:'Link text “Module handbook (PDF, 2 MB)”',b:0},{t:'Key instructions in a floating text box',b:1}]},
 {type:'mcq',q:'What is the most reliable way to make a heading in Microsoft Word?',options:['Make the text bold and larger','Apply a built-in Heading style from the Styles gallery','Underline it and add a blank line','Put it in a text box'],answer:1,explain:'Built-in Heading styles create real structure that screen readers, the navigation pane and exported PDFs all understand.'},
 {type:'mcq',scenario:{who:'Dr Aisha Rahman, Lecturer in History',text:'Aisha wants to share a chapter from a 1970s monograph. She scans it on the department copier and uploads the PDF to Moodle. A student using a screen reader reports that it reads “blank page” for every page.'},q:'What is the best next step?',options:['Tell the student the scan is the only copy available','Upload the scan again at a higher resolution','Run OCR and check the tags, or ask the library for an accessible copy via your institution’s licence','Convert the PDF to a JPEG'],answer:2,explain:'A scan without OCR is just a picture of text. Run OCR (for example, Acrobat’s Scan & OCR), then check reading order and tags — or ask the library, which can often source accessible digitised copies.'},
 {type:'mcq',q:'In PowerPoint, where can you check and fix the order a screen reader reads slide content?',options:['View › Slide Sorter','Review › Check Accessibility › Reading Order pane','Design › Themes','Transitions › Timing'],answer:1,explain:'The Reading Order pane (available from Check Accessibility) lists objects in the order a screen reader reads them, and you can drag to reorder.'}
],
4:[
 {type:'mcq',q:'What is the minimum contrast ratio for normal-size body text at WCAG level AA?',options:['3:1','4.5:1','7:1','21:1'],answer:1,explain:'Normal text needs 4.5:1 at AA. Large text (at least 18pt, or 14pt bold) needs 3:1. AAA raises these to 7:1 and 4.5:1.'},
 {type:'mcq',scenario:{who:'Grace Liu, Module Leader in Nursing',text:'Grace’s Moodle page shows each student’s placement status as a coloured dot: red for “not started”, amber for “in progress”, green for “complete”. No text accompanies the dots.'},q:'What is the best fix?',options:['Make the dots bigger','Use brighter red and green','Add a text label (and ideally a distinct shape) next to each status','Add a key at the bottom of the page explaining the colours'],answer:2,explain:'WCAG 1.4.1 Use of Color: colour must not be the only way information is conveyed. A text label works for everyone — including colour-blind and screen reader users. A key alone still relies on colour.'},
 {type:'sort',q:'Sort these images: do they need descriptive alt text, or should they be marked decorative?',bins:['Needs alt text','Decorative'],items:[{t:'A graph of exam results used in a lecture',b:0},{t:'A decorative swirl between sections',b:1},{t:'A linked university logo in the page header',b:0},{t:'A stock photo of a coffee cup on a welcome page',b:1},{t:'A photo of the correct lab set-up',b:0}]},
 {type:'mcq',q:'A university logo links to the homepage. What is the best alt text?',options:['“Logo”','“University logo, blue and gold crest”','“Northbridge University homepage”','Leave it empty'],answer:2,explain:'For a functional image, the alt text should describe the destination or action — not the appearance.'}
],
5:[
 {type:'sort',q:'Match each piece of content to the alternative it most needs.',bins:['Captions','Transcript','Audio description'],items:[{t:'A recorded lecture with speech',b:0},{t:'A departmental podcast episode',b:1},{t:'A silent lab demonstration video with music only',b:2},{t:'A recorded seminar discussion',b:0},{t:'An audio-only interview clip',b:1}]},
 {type:'mcq',scenario:{who:'Dr Ben Hughes, Lecturer in Physics',text:'Ben records a lecture on quantum mechanics. The platform generates automatic captions, which turn “Schrödinger equation” into “shrewd injure equation” and “eigenstate” into “I can state”.'},q:'What should Ben do before publishing?',options:['Publish as is — automatic captions satisfy the regulations','Turn captions off to avoid confusing students','Review and edit the captions, correcting technical terms and speaker changes','Upload his slides instead of the video'],answer:2,explain:'Captions must be accurate to be accessible. Automatic captions are a starting point; subject-specific terms are where they fail most, so edit them before publishing.'},
 {type:'mcq',q:'What is the most accessible way to put an equation in a Moodle page?',options:['A screenshot of the equation','Write it in LaTeX so the MathJax filter renders it','Describe it only in words','Attach a scanned handwritten version'],answer:1,explain:'LaTeX rendered by MathJax produces real maths that screen readers can read aloud and users can zoom without blurring.'},
 {type:'mcq',q:'What is audio description?',options:['A text version of all the audio','Extra narration describing important visual content not conveyed by the soundtrack','A translation into another language','Background music'],answer:1,explain:'Audio description narrates key visual information for blind and partially sighted viewers. Describing visuals as you teach can remove the need for a separate description track.'}
],
6:[
 {type:'mcq',scenario:{who:'Sam Patel, Programme Lead in Law',text:'Sam’s Week 4 Moodle section contains: a link called “Click here”, a file named “lec4_FINAL_v3.pdf”, an image with no alt text, and a deadline highlighted only in red.'},q:'Which change will help the most students fastest?',options:['Change the theme colour of the course','Rename the link and file to describe their content and type, and add “Deadline:” text next to the red','Delete the section and start again','Move everything into a single ZIP file'],answer:1,explain:'Descriptive link and file names and not relying on colour are quick wins that help everyone, including screen reader and colour-blind users. Then add the alt text.'},
 {type:'sort',q:'Sort these Moodle practices into good practice or barrier.',bins:['Good practice','Barrier'],items:[{t:'The same section structure every week',b:0},{t:'Key reading only in a forum post',b:1},{t:'Core text as a Moodle Page',b:0},{t:'Quiz extra time set per quiz, by hand, each time',b:1},{t:'Links that say what they open and the file type',b:0}]},
 {type:'mcq',q:'A student has 25% extra time in all assessments. What is the most reliable way to apply this in Moodle quizzes?',options:['Tell the student to work faster','Add a user or group override for time limit on each quiz — or better, use your institution’s group-based process','Remove the time limit for everyone','Email the student the questions'],answer:1,explain:'Quiz overrides let you set extra time for a user or a group. Many institutions use a group for all students with extra time so it is applied once, consistently.'},
 {type:'mcq',q:'Which Universal Design for Learning practice reduces the need for individual adjustments?',options:['Offering the same content in more than one format, such as slides plus a Moodle Page summary','Only providing materials on request','Using a different structure every week to keep it interesting','Sharing notes after the exam'],answer:0,explain:'Multiple means of representation — for example, video with transcript plus an accessible text summary — anticipates a wide range of needs.'}
]
};

// Progress
var PK='ae:progress:v1';
var progress={
 get:function(){return LS.get(PK,{lessons:{},last:null,name:''})},
 save:function(p){LS.set(PK,p);emit('ae:progress',p)},
 lesson:function(n){var p=this.get();return p.lessons[n]||{}},
 update:function(n,patch){var p=this.get();p.lessons[n]=Object.assign({},p.lessons[n]||{},patch);this.save(p)},
 markDone:function(n){var p=this.get();var l=p.lessons[n]||{};if(!l.done){l.done=true;l.date=new Date().toISOString();p.lessons[n]=l;this.save(p);return true}return false},
 setLast:function(n){var p=this.get();p.last=n;p.lessons[n]=Object.assign({visited:true},p.lessons[n]||{});LS.set(PK,p)},
 doneCount:function(){var p=this.get();return lessons.filter(function(l){return p.lessons[l.n]&&p.lessons[l.n].done}).length},
 allDone:function(){return this.doneCount()===lessons.length},
 setName:function(s){var p=this.get();p.name=s;this.save(p)},
 reset:function(){LS.set(PK,{lessons:{},last:null,name:''});emit('ae:progress',this.get())}
};

// Preferences
var PREF='ae:prefs:v1';
var defaults={scale:1,lh:'normal',ls:'normal',ws:'normal',font:'default',alignLeft:true,measure:'standard',theme:'auto',focusStrong:false,underline:false,bigCursor:false,motion:'auto',focusMode:false,ruler:'off',ttsRate:1,ttsHighlight:true,reader:false,lookup:true,capSize:'m',capFont:'default',capBg:80,capPos:'bottom',transcriptScroll:true,ad:false,speed:1,timeLimit:'standard',autoAdvance:true,dock:'right'};
var presets=[
 {id:'spacing',label:'Larger text and wider spacing',icon:'fa-text-height',set:{scale:1.3,lh:'loose',ls:'wide',ws:'wide',font:'atkinson',measure:'narrow'}},
 {id:'calm',label:'Fewer distractions',icon:'fa-eye-slash',set:{motion:'reduce',focusMode:true}},
 {id:'contrast',label:'Maximum contrast',icon:'fa-circle-half-stroke',set:{theme:'hc',focusStrong:true,underline:true}},
 {id:'warm',label:'Warmer, softer colours',icon:'fa-sun',set:{theme:'sepia'}},
 {id:'line',label:'One line at a time',icon:'fa-grip-lines',set:{ruler:'mask',reader:true,lh:'loose'}}
];
var SYS='system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
var FONTS={default:[SYS,'"Source Serif 4",Georgia,serif'],system:[SYS,'"Source Serif 4",Georgia,serif'],public:['"Public Sans",'+SYS,'"Source Serif 4",Georgia,serif'],atkinson:['"Atkinson Hyperlegible",'+SYS,'"Atkinson Hyperlegible",'+SYS],serif:['"Source Serif 4",Georgia,serif','"Source Serif 4",Georgia,serif']};
var FONTURLS={public:'https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&display=swap',atkinson:'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap'};
function loadFont(k){var u=FONTURLS[k];if(!u||document.querySelector('link[data-ae-font="'+k+'"]'))return;var l=document.createElement('link');l.rel='stylesheet';l.href=u;l.setAttribute('data-ae-font',k);document.head.appendChild(l);}
var CAPFONTS={default:SYS,public:'"Public Sans",'+SYS,atkinson:'"Atkinson Hyperlegible",'+SYS,serif:'"Source Serif 4",Georgia,serif',mono:'ui-monospace,Menlo,monospace'};
var prefs={
 defaults:defaults,presets:presets,
 get:function(){return Object.assign({},defaults,LS.get(PREF,{}))},
 set:function(patch){var p=Object.assign(this.get(),patch);LS.set(PREF,p);this.apply();emit('ae:prefs',p)},
 reset:function(){LS.set(PREF,{});this.apply();emit('ae:prefs',this.get())},
 applyPreset:function(id){var ps=presets.filter(function(x){return x.id===id})[0];if(ps)this.set(ps.set)},
 isPreset:function(id){var ps=presets.filter(function(x){return x.id===id})[0];if(!ps)return false;var p=this.get();return Object.keys(ps.set).every(function(k){return p[k]===ps.set[k]})},
 reducedMotion:function(){var p=this.get();return p.motion==='reduce'||(p.motion==='auto'&&window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)},
 apply:function(){
  var h=document.documentElement,p=this.get(),s=h.style;
  s.setProperty('--scale',p.scale);
  s.setProperty('--lh',{normal:1.6,loose:1.9,xloose:2.2}[p.lh]||1.6);
  s.setProperty('--ls',{normal:'0',wide:'0.06em',xwide:'0.12em'}[p.ls]||'0');
  s.setProperty('--ws',{normal:'0',wide:'0.16em',xwide:'0.3em'}[p.ws]||'0');
  s.setProperty('--measure',{narrow:'40rem',standard:'52rem',wide:'68rem'}[p.measure]||'52rem');
  if(p.font==='system')p.font='default';loadFont(p.font);loadFont(p.capFont);var f=FONTS[p.font]||FONTS.default;s.setProperty('--font-body',f[0]);s.setProperty('--font-head',f[1]);
  s.setProperty('--cap-size',{s:'0.95rem',m:'1.15rem',l:'1.45rem',xl:'1.8rem'}[p.capSize]||'1.15rem');
  s.setProperty('--cap-font',CAPFONTS[p.capFont]||CAPFONTS.default);
  s.setProperty('--cap-bg','rgba(0,0,0,'+(p.capBg/100)+')');
  h.setAttribute('data-theme',p.theme);h.setAttribute('data-motion',p.motion);
  [['data-focus-strong',p.focusStrong],['data-underline',p.underline],['data-cursor',p.bigCursor],['data-focusmode',p.focusMode],['data-reader',p.reader],['data-align-left',p.alignLeft]].forEach(function(a){if(a[1])h.setAttribute(a[0],'');else h.removeAttribute(a[0])});
  if(!h.getAttribute('lang'))h.setAttribute('lang','en-GB');
  ruler.set(p.ruler);
 }
};

// Reading ruler / line mask
var ruler={mode:'off',els:[],y:200,
 set:function(m){if(m===this.mode)return;this.mode=m;this.els.forEach(function(e){e.remove()});this.els=[];if(m==='off'||!document.body)return;
  var band=2.4;
  if(m==='ruler'){var r=document.createElement('div');r.setAttribute('aria-hidden','true');r.setAttribute('data-chrome','ruler');r.style.cssText='position:fixed;left:0;right:0;height:'+band+'em;pointer-events:none;z-index:9998;border-top:2px solid var(--accent);border-bottom:2px solid var(--accent);background:rgba(209,3,115,.07);transform:translateY(-50%)';document.body.appendChild(r);this.els=[r]}
  else{var t=document.createElement('div'),b=document.createElement('div');[t,b].forEach(function(e){e.setAttribute('aria-hidden','true');e.setAttribute('data-chrome','ruler');e.style.cssText='position:fixed;left:0;right:0;pointer-events:none;z-index:9998;background:rgba(10,5,10,.55)';document.body.appendChild(e)});t.style.top='0';b.style.bottom='0';this.els=[t,b]}
  this.move(this.y)},
 move:function(y){this.y=y;if(this.mode==='ruler'&&this.els[0])this.els[0].style.top=y+'px';else if(this.mode==='mask'&&this.els[1]){var half=parseFloat(getComputedStyle(document.documentElement).fontSize)*1.4;this.els[0].style.height=Math.max(0,y-half)+'px';this.els[1].style.height=Math.max(0,innerHeight-y-half)+'px'}}
};
document.addEventListener('mousemove',function(e){if(ruler.mode!=='off')ruler.move(e.clientY)},{passive:true});
document.addEventListener('focusin',function(e){if(ruler.mode!=='off'&&e.target.getBoundingClientRect){var r=e.target.getBoundingClientRect();ruler.move(r.top+r.height/2)}});

// Text-to-speech with word highlighting
var tts={status:'idle',blocks:[],i:0,token:0,supported:'speechSynthesis' in window,
 _emit:function(){emit('ae:tts',{status:this.status,i:this.i,total:this.blocks.length})},
 collect:function(root){var sel='h1,h2,h3,h4,p,li,dt,dd,figcaption,blockquote,th,td,summary,legend,[data-read-block]';
  return Array.prototype.filter.call(root.querySelectorAll(sel),function(el){if(el.closest('[data-noread],[aria-hidden="true"],[hidden],[data-chrome]'))return false;if(el.querySelector(sel))return false;if(!el.getClientRects().length)return false;return el.textContent.trim().length>1})},
 voice:function(){var v=speechSynthesis.getVoices();return v.filter(function(x){return /en-GB/i.test(x.lang)})[0]||v.filter(function(x){return /^en/i.test(x.lang)})[0]||null},
 play:function(root){if(!this.supported)return;root=root||document.querySelector('[data-read-root]')||document.querySelector('main');if(!root)return;speechSynthesis.cancel();this.blocks=this.collect(root);this.i=0;this.status='playing';this.speak()},
 speak:function(){var self=this;if(this.i>=this.blocks.length){this.stop();return}
  var el=this.blocks[this.i],text=el.textContent,tok=++this.token,p=prefs.get();
  var u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=p.ttsRate;var v=this.voice();if(v)u.voice=v;
  this.hlBlock(el);this.scrollTo(el);
  u.onboundary=function(e){if(tok!==self.token||e.name&&e.name!=='word')return;if(!prefs.get().ttsHighlight)return;var len=e.charLength||((text.slice(e.charIndex).match(/^\S+/)||[''])[0].length);self.hlWord(el,e.charIndex,len)};
  u.onend=function(){if(tok!==self.token||self.status!=='playing')return;self.i++;self.speak()};
  u.onerror=function(){if(tok!==self.token)return;};
  speechSynthesis.speak(u);this._emit()},
 pause:function(){if(this.status!=='playing')return;speechSynthesis.pause();this.status='paused';this._emit()},
 resume:function(){if(this.status!=='paused')return;speechSynthesis.resume();this.status='playing';this._emit()},
 toggle:function(){if(this.status==='playing')this.pause();else if(this.status==='paused')this.resume();else this.play()},
 restartBlock:function(){if(this.status==='idle')return;this.token++;speechSynthesis.cancel();this.status='playing';this.speak()},
 skip:function(d){if(this.status==='idle')return;this.i=Math.max(0,Math.min(this.blocks.length-1,this.i+d));this.restartBlock()},
 stop:function(){this.token++;if(this.supported)speechSynthesis.cancel();this.status='idle';this.clearHl();this._emit()},
 clearHl:function(){if(window.CSS&&CSS.highlights){CSS.highlights.delete('ae-word');CSS.highlights.delete('ae-block')}},
 hlBlock:function(el){if(!(window.CSS&&CSS.highlights&&window.Highlight))return;var r=document.createRange();r.selectNodeContents(el);CSS.highlights.set('ae-block',new Highlight(r));CSS.highlights.delete('ae-word')},
 hlWord:function(el,start,len){if(!(window.CSS&&CSS.highlights&&window.Highlight))return;var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n,pos=0,r=document.createRange(),s=false;
  while((n=w.nextNode())){var L=n.textContent.length;if(!s&&start<pos+L){r.setStart(n,start-pos);s=true}if(s&&start+len<=pos+L){r.setEnd(n,start+len-pos);CSS.highlights.set('ae-word',new Highlight(r));return}pos+=L}},
 scrollTo:function(el){var r=el.getBoundingClientRect();if(r.top<80||r.bottom>innerHeight-100)window.scrollTo({top:scrollY+r.top-innerHeight/3,behavior:prefs.reducedMotion()?'auto':'smooth'})}
};
window.addEventListener('beforeunload',function(){if(tts.supported)speechSynthesis.cancel()});
window.addEventListener('ae:prefs',function(){if(tts.status==='playing')tts.restartBlock()});

// Downloads
function crc32(u){var c,crc=0xFFFFFFFF;for(var n=0;n<u.length;n++){c=(crc^u[n])&0xFF;for(var k=0;k<8;k++)c=c&1?(c>>>1)^0xEDB88320:c>>>1;crc=(crc>>>8)^c}return (crc^0xFFFFFFFF)>>>0}
function zip(files,type){var enc=new TextEncoder(),parts=[],central=[],off=0;
 files.forEach(function(f){var name=enc.encode(f.name),data=enc.encode(f.data),crc=crc32(data);
  var lh=new DataView(new ArrayBuffer(30));lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(12,0x21,true);lh.setUint32(14,crc,true);lh.setUint32(18,data.length,true);lh.setUint32(22,data.length,true);lh.setUint16(26,name.length,true);
  parts.push(new Uint8Array(lh.buffer),name,data);
  var ch=new DataView(new ArrayBuffer(46));ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(14,0x21,true);ch.setUint32(16,crc,true);ch.setUint32(20,data.length,true);ch.setUint32(24,data.length,true);ch.setUint16(28,name.length,true);ch.setUint32(42,off,true);
  central.push(new Uint8Array(ch.buffer),name);off+=30+name.length+data.length});
 var cs=central.reduce(function(a,b){return a+b.length},0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cs,true);e.setUint32(16,off,true);
 return new Blob(parts.concat(central,[new Uint8Array(e.buffer)]),{type:type})}
function saveBlob(blob,name){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function currentLesson(){var el=document.querySelector('[data-lesson]');return el?lessons[Number(el.getAttribute('data-lesson'))-1]:null}
function cleanClone(){var root=document.querySelector('[data-read-root]')||document.querySelector('main');if(!root)return null;var c=root.cloneNode(true);c.querySelectorAll('[data-noread],[data-chrome],[data-gamify],button,input,select,textarea,svg,script,style,[aria-hidden="true"],[hidden]').forEach(function(e){e.remove()});c.querySelectorAll('*').forEach(function(e){e.removeAttribute('style');e.removeAttribute('class');Array.prototype.slice.call(e.attributes).forEach(function(a){if(/^(on|data-|aria-|role|tabindex|draggable)/.test(a.name))e.removeAttribute(a.name)})});return c}
function download(kind){var l=currentLesson(),base=l?('accessibility-essentials-lesson-'+l.n):'accessibility-essentials',title=l?('Lesson '+l.n+': '+l.title):'Accessibility Essentials';
 if(kind==='text'){var root=document.querySelector('[data-read-root]')||document.querySelector('main');var c=cleanClone();var tmp=document.createElement('div');tmp.style.cssText='position:absolute;left:-9999px;white-space:pre-wrap';tmp.appendChild(c);document.body.appendChild(tmp);var txt=tmp.innerText.replace(/\n{3,}/g,'\n\n');tmp.remove();saveBlob(new Blob(['Accessibility Essentials\n'+title+'\n\n'+txt],{type:'text/plain;charset=utf-8'}),base+'.txt');return}
 if(kind==='epub'){var body=cleanClone();var xs=new XMLSerializer();var inner=Array.prototype.map.call(body.childNodes,function(n){return xs.serializeToString(n)}).join('\n');var uid='urn:uuid:ae-'+(l?l.n:0);
  var x='<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en-GB" lang="en-GB"><head><title>'+title.replace(/&/g,'&amp;')+'</title><style>body{font-family:sans-serif;line-height:1.6}</style></head><body>'+inner+'</body></html>';
  var nav='<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en-GB"><head><title>Contents</title></head><body><nav epub:type="toc"><h1>Contents</h1><ol><li><a href="lesson.xhtml">'+title.replace(/&/g,'&amp;')+'</a></li></ol></nav></body></html>';
  var opf='<?xml version="1.0" encoding="UTF-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="en-GB"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">'+uid+'</dc:identifier><dc:title>'+title.replace(/&/g,'&amp;')+'</dc:title><dc:language>en-GB</dc:language><meta property="dcterms:modified">'+new Date().toISOString().slice(0,19)+'Z</meta><meta property="schema:accessMode">textual</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="c1" href="lesson.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="c1"/></spine></package>';
  saveBlob(zip([{name:'mimetype',data:'application/epub+zip'},{name:'META-INF/container.xml',data:'<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'},{name:'OEBPS/content.opf',data:opf},{name:'OEBPS/nav.xhtml',data:nav},{name:'OEBPS/lesson.xhtml',data:x}],'application/epub+zip'),base+'.epub');return}
 if(kind==='pdf'){toast('In the print dialog choose “Save as PDF”. Chromium browsers and Edge produce a tagged PDF.','fa-file-pdf',true);setTimeout(function(){window.print()},400);return}
 if(kind==='large'){var h=document.documentElement;h.setAttribute('data-largeprint','');var off=function(){h.removeAttribute('data-largeprint');window.removeEventListener('afterprint',off)};window.addEventListener('afterprint',off);setTimeout(function(){window.print()},100);return}
}

// Toasts
function toast(msg,icon,important){if(!important&&prefs.get().focusMode)return;var box=document.getElementById('ae-toasts');if(!box){box=document.createElement('div');box.id='ae-toasts';box.setAttribute('role','status');box.setAttribute('aria-live','polite');box.setAttribute('data-chrome','toast');box.style.cssText='position:fixed;left:1rem;bottom:1rem;z-index:10000;display:flex;flex-direction:column;gap:.5rem;max-width:min(24rem,calc(100vw - 2rem))';document.body.appendChild(box)}
 var t=document.createElement('div');t.style.cssText='background:var(--ink);color:var(--surface);padding:.85rem 1rem;border-radius:.75rem;box-shadow:var(--shadow);display:flex;gap:.75rem;align-items:flex-start;font-size:.95rem;line-height:1.45';t.innerHTML='<i class="fa-solid '+(icon||'fa-circle-info')+'" aria-hidden="true" style="margin-top:.2rem;color:var(--accent-line)"></i><span></span>';t.querySelector('span').textContent=msg;box.appendChild(t);setTimeout(function(){t.remove()},6000)}

// Glossary lookup on selected text
function findTerm(s){s=s.trim().toLowerCase().replace(/[.,;:!?()"“”‘’]+$/,'');if(s.length<2||s.length>60)return null;var hit=null;glossary.some(function(g){var names=[g.term].concat(g.alias).map(function(x){return x.toLowerCase()});if(names.indexOf(s)>-1){hit=g;return true}return false});if(hit)return hit;if(s.length<4)return null;glossary.some(function(g){var names=[g.term].concat(g.alias).map(function(x){return x.toLowerCase()});if(names.some(function(n){return n.length>3&&(s.indexOf(n)>-1||n.indexOf(s)>-1)})){hit=g;return true}return false});return hit}
var pop=null;
function closePop(){if(pop){pop.remove();pop=null}}
function showPop(g,rect){closePop();pop=document.createElement('div');pop.setAttribute('role','dialog');pop.setAttribute('aria-label','Glossary: '+g.term);pop.setAttribute('data-chrome','glossary-pop');pop.style.cssText='position:fixed;z-index:10001;max-width:min(22rem,calc(100vw - 2rem));background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:.875rem;box-shadow:var(--shadow);padding:1rem 1.1rem;font-size:.95rem;line-height:1.5';
 pop.innerHTML='<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem"><i class="fa-solid fa-book" aria-hidden="true" style="color:var(--accent)"></i><strong style="font-family:var(--font-head);font-size:1.05rem"></strong><button type="button" aria-label="Close definition" style="margin-left:auto;background:none;border:0;cursor:pointer;color:var(--muted);font-size:1.1rem;padding:.25rem .4rem;border-radius:.4rem"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div><p style="margin:0 0 .5rem"></p><a style="font-weight:600">Open in glossary</a>';
 pop.querySelector('strong').textContent=g.term;pop.querySelector('p').textContent=g.def;pop.querySelector('a').href='Glossary.dc.html#'+g.id;pop.querySelector('button').onclick=closePop;document.body.appendChild(pop);
 var top=rect.bottom+8;if(top+pop.offsetHeight>innerHeight-8)top=Math.max(8,rect.top-pop.offsetHeight-8);pop.style.top=top+'px';pop.style.left=Math.max(8,Math.min(innerWidth-pop.offsetWidth-8,rect.left))+'px'}
function checkSel(){if(!prefs.get().lookup)return;var s=window.getSelection();if(!s||s.isCollapsed){return}var a=document.activeElement;if(a&&/INPUT|TEXTAREA/.test(a.tagName))return;if(s.anchorNode&&s.anchorNode.parentElement&&s.anchorNode.parentElement.closest('[data-chrome=glossary-pop]'))return;var g=findTerm(s.toString());if(!g)return;showPop(g,s.getRangeAt(0).getBoundingClientRect())}
document.addEventListener('mouseup',function(e){if(pop&&pop.contains(e.target))return;setTimeout(checkSel,10)});
document.addEventListener('keyup',function(e){if(e.shiftKey&&/Arrow|Home|End/.test(e.key))checkSel()});
document.addEventListener('mousedown',function(e){if(pop&&!pop.contains(e.target))closePop()});

// Keyboard shortcuts
var shortcuts=[['Alt','Shift','N','Next lesson'],['Alt','Shift','P','Previous lesson'],['Alt','Shift','G','Open the glossary'],['Alt','Shift','H','Course home'],['Alt','Shift','L','Listen / pause audio'],['Alt','Shift','A','Accessibility settings'],['Esc','','','Close menus and panels']];
function go(f){location.href=f}
document.addEventListener('keydown',function(e){
 if(e.key==='Escape'){closePop()}
 if(!(e.altKey&&e.shiftKey))return;var l=currentLesson();
 switch(e.code){
  case 'KeyN':e.preventDefault();if(l&&l.n<6)go(lessons[l.n].file);else if(!l)go(lessons[0].file);else go('Badge.dc.html');break;
  case 'KeyP':e.preventDefault();if(l&&l.n>1)go(lessons[l.n-2].file);else go('Home.dc.html');break;
  case 'KeyG':e.preventDefault();go('Glossary.dc.html');break;
  case 'KeyH':e.preventDefault();go('Home.dc.html');break;
  case 'KeyB':e.preventDefault();go('Badge.dc.html');break;
  case 'KeyL':e.preventDefault();tts.toggle();break;
  case 'KeyA':e.preventDefault();emit('ae:panel',{toggle:true});break;
 }
});
window.addEventListener('storage',function(e){if(e.key===PREF){prefs.apply();emit('ae:prefs',prefs.get())}if(e.key===PK)emit('ae:progress',progress.get())});

function contrast(a,b){function lum(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');var rgb=[0,2,4].map(function(i){var v=parseInt(h.substr(i,2),16)/255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4)});return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2]}var l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)}

window.AE={lessons:lessons,glossary:glossary,dosdonts:dosdonts,resources:resources,kc:kc,progress:progress,prefs:prefs,tts:tts,download:download,toast:toast,shortcuts:shortcuts,contrast:contrast,slug:slug,findTerm:findTerm,currentLesson:currentLesson,
 openPanel:function(){emit('ae:panel',{open:true})}};
prefs.apply();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){ruler.mode='__';prefs.apply()});
if(window.matchMedia){['(prefers-reduced-motion: reduce)','(prefers-color-scheme: dark)'].forEach(function(q){var m=matchMedia(q);m.addEventListener&&m.addEventListener('change',function(){emit('ae:prefs',prefs.get())})})}
emit('ae:ready');
})();
