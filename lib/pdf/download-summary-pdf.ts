export function downloadSummaryPdf(summary: string) {
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

  const rawLines = trimmedSummary.split(/\r?\n/);
  const bodyLines = rawLines.flatMap((line) => (line.trim() ? wrapLine(line, 88) : [""]));
  const allLines = [`AI Summary - ${new Date().toLocaleString()}`, "", ...bodyLines];
  const linesPerPage = 46;
  const pages: string[][] = [];
  for (let i = 0; i < allLines.length; i += linesPerPage) {
    pages.push(allLines.slice(i, i + linesPerPage));
  }

  const pageCount = Math.max(1, pages.length);
  const pageObjectIds = Array.from({ length: pageCount }, (_, i) => 3 + i);
  const contentObjectIds = Array.from({ length: pageCount }, (_, i) => 3 + pageCount + i);
  const fontObjectId = 3 + pageCount * 2;

  const objects = new Map<number, string>();
  objects.set(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objects.set(
    2,
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`
  );

  for (let i = 0; i < pageCount; i += 1) {
    const pageId = pageObjectIds[i];
    const contentId = contentObjectIds[i];
    const pageLines = pages[i] ?? [""];
    const textOps = ["BT", "/F1 12 Tf", "16 TL", "50 760 Td"];
    for (const line of pageLines) {
      textOps.push(`(${escapePdfText(line)}) Tj`);
      textOps.push("T*");
    }
    textOps.push("ET");
    const stream = textOps.join("\n");
    const contentBody = `<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`;
    objects.set(contentId, contentBody);

    const pageBody = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects.set(pageId, pageBody);
  }

  objects.set(fontObjectId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const maxObjectId = fontObjectId;
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
  link.download = `teachify-summary-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
