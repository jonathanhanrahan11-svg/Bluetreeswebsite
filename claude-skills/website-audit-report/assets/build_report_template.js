/**
 * Website Audit -> Client Report — docx-js build template.
 *
 * HOW TO USE THIS FILE:
 * 1. Copy it into your working directory (don't edit the bundled skill copy).
 * 2. Fill in the `reportData` object below with your synthesized content
 *    (see references/synthesis-guide.md for how to select/rewrite that content).
 * 3. Run: node build_report.js  (requires `docx` — npm install docx if require() fails)
 * 4. Render to PDF and look at every page before delivering:
 *      python3 <docx-skill>/scripts/office/soffice.py --headless --convert-to pdf <file>.docx
 *      pdftoppm -jpeg -r 100 <file>.pdf page
 *    Then actually view the page-*.jpg images.
 *
 * The functions below (h1, bullet, table builders, etc.) are deliberately generic —
 * you normally only need to edit `reportData` and the two config values right below it.
 * Colors are a neutral professional default (slate/navy + a single blue accent);
 * change ACCENT/INK below if the user has brand colors to match (e.g. from prior work
 * with this client).
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, VerticalAlign, Footer,
} = require("docx");
const fs = require("fs");

// =========================================================
// CONFIG — adjust colors/fonts here if needed, not in the functions below
// =========================================================
const INK = "1F2937";      // near-black body/heading text
const ACCENT = "2453B0";   // single accent color — section rules, priority tags, links
const MUTED = "5B6472";    // secondary/muted text
const LINE = "DDE1E6";     // table borders / hairlines
const PANEL = "F5F7FA";    // light shaded panel / alt table row
const FONT = "Calibri";
const OUTPUT_FILENAME = "Website Audit & Recommendations.docx"; // rename per client before final save

// =========================================================
// CONTENT — this is what you actually fill in per report
// =========================================================
const reportData = {
  title: "Website Audit & Recommendations",
  clientName: "[Client / Business Name]",
  preparedBy: "[Your Name / Agency]",
  date: "[Date]",

  // 3-6 sentences of prose. No bullets here — see synthesis-guide.md.
  executiveSummary:
    "[One short paragraph: overall state of the site, the single most important thing to know, " +
    "and the shape of the opportunity ahead. Written for a busy business owner who may only read this section.]",

  // 3-6 items. Each a short bolded title + 1-2 sentence explanation.
  whatsWorking: [
    { title: "[Strength title]", body: "[1-2 sentences on why this is a real strength worth protecting.]" },
  ],

  // 3-5 bigger strategic themes, framed as upside.
  keyOpportunities: [
    { title: "[Opportunity title]", body: "[1-3 sentences framing the business upside, not just the problem.]" },
  ],

  // 5-10 items. `tier` should be one of: "Do first", "Do next", "Worth planning".
  // Order the array itself in priority order — the table renders in array order.
  recommendations: [
    { tier: "Do first", text: "[Concrete recommendation]", why: "[One line on why it matters]" },
  ],

  // 3-5 short, sequenced steps — not a repeat of the recommendations list.
  nextSteps: [
    "[First concrete step, roughly what/why]",
  ],

  // Optional short closing line inviting the next conversation. Keep it low-key, not salesy.
  closingLine:
    "Happy to talk through any of the above, or help implement it — reach out any time.",
};

// =========================================================
// Helpers
// =========================================================
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    border: { bottom: { color: ACCENT, space: 4, style: BorderStyle.SINGLE, size: 8 } },
    children: [new TextRun({ text, bold: true, color: INK, size: 30, font: FONT })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160, line: 300 },
    children: [new TextRun({ text, color: INK, size: 22, font: FONT, ...opts })],
  });
}

function itemBlock(titleText, bodyText) {
  return [
    new Paragraph({
      spacing: { before: 180, after: 40 },
      children: [new TextRun({ text: titleText, bold: true, color: INK, size: 22, font: FONT })],
    }),
    new Paragraph({
      spacing: { after: 60, line: 300 },
      children: [new TextRun({ text: bodyText, color: MUTED, size: 21, font: FONT })],
    }),
  ];
}

function numberedStep(n, text) {
  return new Paragraph({
    spacing: { after: 140, line: 300 },
    indent: { left: 200, hanging: 200 },
    children: [
      new TextRun({ text: `${n}.  `, bold: true, color: ACCENT, size: 22, font: FONT }),
      new TextRun({ text, color: INK, size: 22, font: FONT }),
    ],
  });
}

function cell(children, { width, shade, valign = VerticalAlign.TOP, bold = false } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: shade ? { type: ShadingType.CLEAR, fill: shade, color: "auto" } : undefined,
    verticalAlign: valign,
    margins: { top: 140, bottom: 140, left: 160, right: 160 },
    children,
  });
}

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: LINE },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE },
  left: { style: BorderStyle.SINGLE, size: 4, color: LINE },
  right: { style: BorderStyle.SINGLE, size: 4, color: LINE },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: LINE },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: LINE },
};

// tier -> display color (subtle, not traffic-light red/amber/green — keep it calm/professional)
function tierColor(tier) {
  if (/do first/i.test(tier)) return ACCENT;
  if (/do next/i.test(tier)) return "3F7D5C";
  return MUTED;
}

function buildRecommendationsTable(items) {
  const colW = [1700, 5300, 2800]; // Priority | Recommendation | Why it matters
  const header = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      cell([new Paragraph({ children: [new TextRun({ text: "Priority", bold: true, color: "FFFFFF", size: 19, font: FONT })] })], { width: colW[0], shade: INK }),
      cell([new Paragraph({ children: [new TextRun({ text: "Recommendation", bold: true, color: "FFFFFF", size: 19, font: FONT })] })], { width: colW[1], shade: INK }),
      cell([new Paragraph({ children: [new TextRun({ text: "Why it matters", bold: true, color: "FFFFFF", size: 19, font: FONT })] })], { width: colW[2], shade: INK }),
    ],
  });
  const rows = items.map((item, i) => {
    const shade = i % 2 === 0 ? "FFFFFF" : PANEL;
    return new TableRow({
      cantSplit: true,
      children: [
        cell([new Paragraph({ children: [new TextRun({ text: item.tier, bold: true, color: tierColor(item.tier), size: 18, font: FONT })] })], { width: colW[0], shade }),
        cell([new Paragraph({ children: [new TextRun({ text: item.text, color: INK, size: 19, font: FONT })] })], { width: colW[1], shade }),
        cell([new Paragraph({ children: [new TextRun({ text: item.why, color: MUTED, size: 18, font: FONT, italics: true })] })], { width: colW[2], shade }),
      ],
    });
  });
  return new Table({
    width: { size: colW.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: colW,
    borders: tableBorders,
    rows: [header, ...rows],
  });
}

// =========================================================
// Cover page
// =========================================================
// NOTE: no manual page break at the end of the cover section's children — the second
// `sections` entry below already starts on a new page automatically. Adding a manual
// break here as well is the most common cause of an orphaned blank page 2.
const coverChildren = [
  new Paragraph({ spacing: { before: 2400 }, children: [] }),
  new Paragraph({
    children: [new TextRun({ text: reportData.title, bold: true, color: INK, size: 52, font: FONT })],
  }),
  new Paragraph({
    spacing: { before: 200, after: 600 },
    children: [new TextRun({ text: "Findings and recommendations to help turn more visitors into customers.", italics: true, color: MUTED, size: 24, font: FONT })],
  }),
  new Paragraph({
    spacing: { before: 3200 },
    border: { top: { color: LINE, space: 8, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text: "Prepared for", color: MUTED, size: 20, font: FONT })],
  }),
  new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: reportData.clientName, bold: true, color: INK, size: 26, font: FONT })] }),
  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `Prepared by · ${reportData.preparedBy}`, color: MUTED, size: 20, font: FONT })] }),
  new Paragraph({ children: [new TextRun({ text: reportData.date, color: MUTED, size: 20, font: FONT })] }),
];

// =========================================================
// Body sections
// =========================================================
const execSummary = [h1("Executive Summary"), body(reportData.executiveSummary)];

const whatsWorking = [h1("What's Working")];
reportData.whatsWorking.forEach((item) => whatsWorking.push(...itemBlock(item.title, item.body)));

const keyOpportunities = [h1("Key Opportunities")];
reportData.keyOpportunities.forEach((item) => keyOpportunities.push(...itemBlock(item.title, item.body)));

const recommendations = [
  h1("Prioritized Recommendations"),
  body("Ordered by what matters most to the business first — not by how the issue was originally found."),
  buildRecommendationsTable(reportData.recommendations),
];

const nextSteps = [h1("Recommended Next Steps")];
reportData.nextSteps.forEach((step, i) => nextSteps.push(numberedStep(i + 1, step)));
if (reportData.closingLine) {
  nextSteps.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: reportData.closingLine, italics: true, color: MUTED, size: 21, font: FONT })] }));
}

// =========================================================
// Document assembly
// =========================================================
const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22, color: INK } } },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 }, // US Letter, in DXA
          margin: { top: 1000, bottom: 1000, left: 1080, right: 1080 },
        },
      },
      children: coverChildren,
    },
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1000, bottom: 1000, left: 1080, right: 1080 },
        },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `${reportData.clientName} · ${reportData.title}`, color: "9AA3AD", size: 15, font: FONT })],
          })],
        }),
      },
      // Each section starts with h1() which itself carries top spacing — no manual
      // page breaks are used between sections here on purpose. If a section
      // absolutely must start on a fresh page, add ONE
      // `new Paragraph({ pageBreakBefore: true, children: [] })` immediately before
      // that section's h1 — never add a page break AND rely on a following automatic
      // section/page break, or you'll get a blank page (see cover page note above).
      children: [
        ...execSummary,
        ...whatsWorking,
        ...keyOpportunities,
        ...recommendations,
        ...nextSteps,
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT_FILENAME, buffer);
  console.log("done:", OUTPUT_FILENAME);
});
