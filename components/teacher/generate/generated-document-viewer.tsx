"use client";

import ReactMarkdown from "react-markdown";

interface GeneratedDocumentViewerProps {
  content: string;
}

export function GeneratedDocumentViewer({ content }: GeneratedDocumentViewerProps) {
  // Simple filter for empty AI fragments
  const cleanContent = content.trim();
  if (!cleanContent) return null;

  return (
    <div className="prose prose-slate max-w-none text-left
      prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
      prose-h1:text-[28px] prose-h2:text-[22px] prose-h3:text-[18px]
      prose-p:text-[15px] prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600
      prose-strong:font-black prose-strong:text-slate-900
      prose-ul:list-disc prose-li:text-slate-600
      prose-hr:border-slate-200"
    >
      <ReactMarkdown>{cleanContent}</ReactMarkdown>
    </div>
  );
}
