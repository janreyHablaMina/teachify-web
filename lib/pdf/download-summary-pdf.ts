type DownloadPdfOptions = {
  fileNamePrefix?: string;
  title?: string;
  subtitle?: string;
};

export function downloadSummaryPdf(summary: string, options?: DownloadPdfOptions) {
  const trimmedSummary = summary.trim();
  if (!trimmedSummary) return;

  const encoder = new TextEncoder();
  const byteLength = (value: string) => encoder.encode(value).length;
  const escapePdfText = (value: string) =>
    value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const sanitize = (value: string) => value.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
  const wrapLine = (line: string, maxChars: number) => {
    const words = sanitize(line).split(" ").filter(Boolean);
    if (words.length === 0) return [""];
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length <= maxChars) {
        current = next;
        continue;
      }
      if (current) lines.push(current);
      current = word;
    }
    if (current) lines.push(current);
    return lines;
  };

  const PAGE_WIDTH = 612;
  const PAGE_HEIGHT = 792;
  const LEFT = 50;
  const RIGHT = 562;
  const CONTENT_TOP = 708;
  const CONTENT_BOTTOM = 54;
  const AVG_CHAR_FACTOR = 0.52;

  type Style = {
    font: "F1" | "F2";
    size: number;
    leading: number;
    x: number;
    color: string;
    extraAfter?: number;
  };

  type RenderElement =
    | { kind: "text"; text: string; style: Style }
    | { kind: "rule" }
    | { kind: "gap"; height: number };

  const styleForLine = (line: string): Style => {
    if (/^Q\d+\s*-/i.test(line)) {
      return { font: "F2", size: 12, leading: 16, x: LEFT, color: "0 g", extraAfter: 2 };
    }
    if (/^(Difficulty:|Total Questions:)/i.test(line)) {
      return { font: "F2", size: 10, leading: 14, x: LEFT, color: "0.15 g" };
    }
    if (/^Answer:/i.test(line)) {
      return { font: "F2", size: 10.5, leading: 15, x: LEFT, color: "0.1 g" };
    }
    if (/^Explanation:/i.test(line)) {
      return { font: "F1", size: 10.5, leading: 15, x: LEFT, color: "0.1 g", extraAfter: 2 };
    }
    if (/^[A-H][\.\)]\s+/i.test(line)) {
      return { font: "F1", size: 10.5, leading: 14, x: LEFT + 14, color: "0 g" };
    }
    if (/^-\s+/.test(line)) {
      return { font: "F1", size: 10.5, leading: 14, x: LEFT + 14, color: "0 g" };
    }
    return { font: "F1", size: 11, leading: 15, x: LEFT, color: "0 g" };
  };

  const maxCharsFor = (style: Style) => {
    const width = RIGHT - style.x;
    return Math.max(14, Math.floor(width / (style.size * AVG_CHAR_FACTOR)));
  };

  const rawLines = trimmedSummary.split(/\r?\n/);
  const elements: RenderElement[] = [];
  for (const rawLine of rawLines) {
    const line = sanitize(rawLine);
    if (!line) {
      elements.push({ kind: "gap", height: 8 });
      continue;
    }
    if (/^-{6,}$/.test(line)) {
      elements.push({ kind: "gap", height: 4 });
      elements.push({ kind: "rule" });
      elements.push({ kind: "gap", height: 6 });
      continue;
    }

    const style = styleForLine(line);
    const wrapped = wrapLine(line, maxCharsFor(style));
    wrapped.forEach((segment, index) => {
      elements.push({ kind: "text", text: segment, style });
      if (index === wrapped.length - 1 && style.extraAfter) {
        elements.push({ kind: "gap", height: style.extraAfter });
      }
    });
  }

  const header = options?.title?.trim() || "AI Summary";
  const subtitle = options?.subtitle?.trim() || `Generated ${new Date().toLocaleString()}`;
  const pages: string[] = [];
  let y = CONTENT_TOP;
  let stream: string[] = [];
  let hasBodyContentOnPage = false;

  const startPage = () => {
    const subtitleWidthEstimate = Math.max(40, subtitle.length * 10 * AVG_CHAR_FACTOR);
    const subtitleX = Math.max(LEFT + 120, RIGHT - subtitleWidthEstimate - 12);
    stream = [
      "0 g",
      "BT",
      "/F2 17 Tf",
      `${LEFT} 757 Td`,
      `(${escapePdfText(header)}) Tj`,
      "ET",
      "BT",
      "/F1 10 Tf",
      `${subtitleX} 757 Td`,
      `(${escapePdfText(subtitle)}) Tj`,
      "ET",
      "0.75 G",
      "0.8 w",
      `${LEFT} 734 m ${RIGHT} 734 l S`,
      "0 g",
    ];
    y = CONTENT_TOP;
    hasBodyContentOnPage = false;
  };

  const finishPage = () => {
    pages.push(stream.join("\n"));
  };

  startPage();

  for (const element of elements) {
    if (element.kind === "gap") {
      if (!hasBodyContentOnPage) {
        continue;
      }
      y -= element.height;
      if (y < CONTENT_BOTTOM) {
        finishPage();
        startPage();
      }
      continue;
    }

    if (element.kind === "rule") {
      if (!hasBodyContentOnPage) {
        continue;
      }
      if (y < CONTENT_BOTTOM + 12) {
        finishPage();
        startPage();
      }
      stream.push("0.85 G");
      stream.push("0.5 w");
      stream.push(`${LEFT} ${y} m ${RIGHT} ${y} l S`);
      stream.push("0 g");
      y -= 10;
      continue;
    }

    const { text, style } = element;
    if (y < CONTENT_BOTTOM + style.leading) {
      finishPage();
      startPage();
    }
    stream.push(style.color);
    stream.push("BT");
    stream.push(`/${style.font} ${style.size} Tf`);
    stream.push(`${style.x} ${y} Td`);
    stream.push(`(${escapePdfText(text)}) Tj`);
    stream.push("ET");
    stream.push("0 g");
    y -= style.leading;
    hasBodyContentOnPage = true;
  }
  finishPage();

  const pageCount = Math.max(1, pages.length);
  const pageObjectIds = Array.from({ length: pageCount }, (_, i) => 3 + i);
  const contentObjectIds = Array.from({ length: pageCount }, (_, i) => 3 + pageCount + i);
  const regularFontObjectId = 3 + pageCount * 2;
  const boldFontObjectId = regularFontObjectId + 1;

  const objects = new Map<number, string>();
  objects.set(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objects.set(
    2,
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`
  );

  for (let i = 0; i < pageCount; i += 1) {
    const pageId = pageObjectIds[i];
    const contentId = contentObjectIds[i];
    const footer = [
      "0.45 g",
      "BT",
      "/F1 9 Tf",
      `${PAGE_WIDTH / 2 - 30} 28 Td`,
      `(Page ${i + 1} of ${pageCount}) Tj`,
      "ET",
      "0 g",
    ].join("\n");
    const pageStream = `${pages[i] ?? ""}\n${footer}`;
    const contentBody = `<< /Length ${byteLength(pageStream)} >>\nstream\n${pageStream}\nendstream`;
    objects.set(contentId, contentBody);

    const pageBody = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${regularFontObjectId} 0 R /F2 ${boldFontObjectId} 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects.set(pageId, pageBody);
  }

  objects.set(regularFontObjectId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.set(boldFontObjectId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  const maxObjectId = boldFontObjectId;
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = Array(maxObjectId + 1).fill(0);

  for (let id = 1; id <= maxObjectId; id += 1) {
    const body = objects.get(id) ?? "";
    offsets[id] = byteLength(pdf);
    pdf += `${id} 0 obj\n${body}\nendobj\n`;
  }

  const xrefOffset = byteLength(pdf);
  pdf += `xref\n0 ${maxObjectId + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let id = 1; id <= maxObjectId; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${maxObjectId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([encoder.encode(pdf)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${options?.fileNamePrefix ?? "teachify-summary"}-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
