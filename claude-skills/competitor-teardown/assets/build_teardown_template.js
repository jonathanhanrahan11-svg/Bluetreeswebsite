/**
 * Competitor Teardown -> Client Report — docx-js build template.
 * Sibling of the website-audit-report template — same visual language, same
 * verify-by-rendering discipline. See that skill for the general docx workflow.
 *
 * HOW TO USE:
 * 1. Copy into your working directory.
 * 2. Fill in `reportData` below with the real research (2-3 competitors).
 * 3. Run: node build_teardown_report.js (requires `docx` — npm install docx if needed)
 * 4. Render to PDF and look at every page before delivering (see docx skill).
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, VerticalAlign, Footer,
} = require("docx");
const fs = require("fs");

// =========================================================
// CONFIG — neutral professional palette, matches website-audit-report
// =========================================================
const INK = "1F2937";
const ACCENT = "2453B0";
const MUTED = "5B6472";
const LINE = "DDE1E6";
const PANEL = "F5F7FA";
const CALLOUT_BG = "FBEEE4"; // warm, distinct from the neutral panel color — assumptions section
const FONT = "Calibri";
const OUTPUT_FILENAME = "Competitor Landscape.docx"; // rename per client before final save

// =========================================================
// CONTENT — fill this in per report
// =========================================================
const reportData = {
  title: "Competitor Landscape & Positioning",
  clientName: "[Client / Business Name]",
  preparedBy: "[Your Name / Business]",
  date: "[Date]",

  executiveSummary:
    "[3-5 plain sentences: where the client stands next to the competitors reviewed, and the single biggest opportunity to stand out.]",

  competitors: [
    {
      name: "[Competitor 1 name]",
      summary: "[3-4 plain-language sentences: what they do well, where they're weak, whether their site was actually seen or just read.]",
    },
  ],

  // One row per dimension. `values` must have the same length as `competitors` above, in the same order.
  comparisonTable: {
    dimensions: [
      "How they stand out",
      "Range of services",
      "How trustworthy they look",
      "How clear their pricing is",
      "How easy they are to find online",
      "How the site looks",
      "How easy it is to contact them",
    ],
    rows: [
      // one array of strings per competitor, matching reportData.competitors order
    ],
  },

  // 3-5 items — concrete, framed as upside for the client.
  opportunities: [
    { title: "[Opportunity title]", body: "[1-3 plain sentences on the upside, tied to a real gap observed.]" },
  ],

  // 5-9 items. tier: "Do first" | "Do next" | "Worth planning"
  recommendations: [
    { tier: "Do first", text: "[Concrete recommendation]", why: "[One plain-language line on why it matters]" },
  ],

  nextSteps: [
    "[First concrete step]",
  ],

  closingLine: "Happy to talk through any of this, or help put it into action — just say the word.",

  // Things not directly confirmed — always shown in a visually distinct callout, never buried.
  assumptions: [
    "[e.g. \"We read [Competitor]'s pages but didn't see the site rendered, so we can't speak to how it actually looks.\"]",
  ],
};

// =========================================================
// Helpers (shared style with website-audit-report's template)
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
  return new Paragraph({ spacing: { after: 160, line: 300 }, children: [new TextRun({ text, color: INK, size: 22, font: FONT, ...opts })] });
}
function competitorBlock(name, summary) {
  return [
    new Paragraph({ spacing: { before: 200, after: 60 }, children: [new TextRun({ text: name, bold: true, color: INK, size: 23, font: FONT })] }),
    new Paragraph({ spacing: { after: 100, line: 300 }, children: [new TextRun({ text: summary, color: MUTED, size: 21, font: FONT })] }),
  ];
}
function itemBlock(titleText, bodyText) {
  return [
    new Paragraph({ spacing: { before: 180, after: 40 }, children: [new TextRun({ text: titleText, bold: true, color: INK, size: 22, font: FONT })] }),
    new Paragraph({ spacing: { after: 60, line: 300 }, children: [new TextRun({ text: bodyText, color: MUTED, size: 21, font: FONT })] }),
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
function cell(children, { width, shade, valign = VerticalAlign.TOP } = {}) {
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
function tierColor(tier) {
  if (/do first/i.test(tier)) return ACCENT;
  if (/do next/i.test(tier)) return "3F7D5C";
  return MUTED;
}

// ---- comparison table: dynamic column count, with the client's own column (index
// `highlightIndex`, typically 0) tinted so it's immediately visually distinct ----
function buildComparisonTable(comparisonTable, competitorNames, highlightIndex = -1) {
  const n = competitorNames.length;
  const firstColW = 2400;
  const restW = Math.floor((9800 - firstColW) / n);
  const colW = [firstColW, ...Array(n).fill(restW)];
  const HIGHLIGHT_BG = "EAF0FB"; // light accent tint for the client's own column

  const header = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      cell([new Paragraph({ children: [new TextRun({ text: "", bold: true, color: "FFFFFF", size: 19, font: FONT })] })], { width: colW[0], shade: INK }),
      ...competitorNames.map((name, i) => cell([new Paragraph({ children: [new TextRun({ text: name, bold: true, color: "FFFFFF", size: 18, font: FONT })] })], { width: colW[i + 1], shade: i === highlightIndex ? ACCENT : INK })),
    ],
  });

  const rows = comparisonTable.dimensions.map((dim, rowIdx) => {
    const baseShade = rowIdx % 2 === 0 ? "FFFFFF" : PANEL;
    return new TableRow({
      cantSplit: true,
      children: [
        cell([new Paragraph({ children: [new TextRun({ text: dim, bold: true, color: INK, size: 18, font: FONT })] })], { width: colW[0], shade: baseShade }),
        ...comparisonTable.rows[rowIdx].map((val, i) => cell([new Paragraph({ children: [new TextRun({ text: val, color: INK, size: 18, font: FONT, bold: i === highlightIndex })] })], { width: colW[i + 1], shade: i === highlightIndex ? HIGHLIGHT_BG : baseShade })),
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

function buildRecommendationsTable(items) {
  const colW = [1700, 5300, 2800];
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

// ---- assumptions callout: single shaded "box" via a 1-column table, so it visually pops ----
function buildAssumptionsCallout(items) {
  const width = 9800;
  const bulletParagraphs = [
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: "Assumptions & Things We Couldn't Confirm", bold: true, color: INK, size: 22, font: FONT })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: "Everything below wasn't directly verified — flagged clearly so nothing here gets mistaken for more certain than it is.", italics: true, color: MUTED, size: 19, font: FONT })],
    }),
    ...items.map((text) => new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 80 },
      children: [new TextRun({ text, color: INK, size: 20, font: FONT })],
    })),
  ];
  return new Table({
    width: { size: width, type: WidthType.DXA },
    columnWidths: [width],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: ACCENT },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT },
      left: { style: BorderStyle.SINGLE, size: 6, color: ACCENT },
      right: { style: BorderStyle.SINGLE, size: 6, color: ACCENT },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: ACCENT },
      insideVertical: { style: BorderStyle.SINGLE, size: 6, color: ACCENT },
    },
    rows: [
      new TableRow({
        children: [cell(bulletParagraphs, { width, shade: CALLOUT_BG, valign: VerticalAlign.TOP })],
      }),
    ],
  });
}

// =========================================================
// Cover page
// =========================================================
const coverChildren = [
  new Paragraph({ spacing: { before: 2400 }, children: [] }),
  new Paragraph({ children: [new TextRun({ text: reportData.title, bold: true, color: INK, size: 48, font: FONT })] }),
  new Paragraph({ spacing: { before: 200, after: 600 }, children: [new TextRun({ text: "A clear look at how you compare online, and where the real opportunities are.", italics: true, color: MUTED, size: 24, font: FONT })] }),
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

const competitorsSection = [h1("Competitors at a Glance")];
reportData.competitors.forEach((c) => competitorsSection.push(...competitorBlock(c.name, c.summary)));
competitorsSection.push(new Paragraph({ spacing: { before: 160 }, children: [] }));
competitorsSection.push(body(`The table below includes ${reportData.clientName} alongside each competitor, so you can see directly where you stand rather than just reading about it.`, { italics: true, color: MUTED, size: 19 }));
// Client's own column always comes first, so a reader immediately sees where they stand.
competitorsSection.push(buildComparisonTable(reportData.comparisonTable, [`${reportData.clientName} (you)`, ...reportData.competitors.map((c) => c.name)], 0));

const opportunities = [h1("Where You Can Win")];
reportData.opportunities.forEach((item) => opportunities.push(...itemBlock(item.title, item.body)));

const recommendations = [
  h1("Prioritized Recommendations"),
  body("Ordered by what would help you stand out against this specific competitive field first."),
  buildRecommendationsTable(reportData.recommendations),
];

const nextSteps = [h1("Recommended Next Steps")];
reportData.nextSteps.forEach((step, i) => nextSteps.push(numberedStep(i + 1, step)));
if (reportData.closingLine) {
  nextSteps.push(new Paragraph({ spacing: { before: 200, after: 300 }, children: [new TextRun({ text: reportData.closingLine, italics: true, color: MUTED, size: 21, font: FONT })] }));
}

const assumptionsSection = [
  new Paragraph({ pageBreakBefore: false, spacing: { before: 200 }, children: [] }),
  buildAssumptionsCallout(reportData.assumptions),
];

// =========================================================
// Document assembly
// =========================================================
const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 22, color: INK } } } },
  sections: [
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1000, bottom: 1000, left: 1080, right: 1080 } } },
      children: coverChildren,
    },
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1000, bottom: 1000, left: 1080, right: 1080 } } },
      footers: {
        default: new Footer({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${reportData.clientName} · ${reportData.title}`, color: "9AA3AD", size: 15, font: FONT })] })],
        }),
      },
      children: [...execSummary, ...competitorsSection, ...opportunities, ...recommendations, ...nextSteps, ...assumptionsSection],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT_FILENAME, buffer);
  console.log("done:", OUTPUT_FILENAME);
});
