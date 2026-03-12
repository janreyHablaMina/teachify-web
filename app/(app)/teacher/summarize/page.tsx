"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function SummarizePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{ id: number; topic: string; content: Record<string, string> } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setSummary(null);

    try {
      const response = await api.post("/api/summaries/generate", { topic });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      alert("Failed to generate summary. Please check your AI service configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (id: number) => {
    try {
      const response = await api.get(`/api/summaries/${id}/export-pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${topic.toLowerCase().replace(/\s+/g, "-")}-summary.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Failed to export PDF.");
    }
  };

  return (
    <div className="summarize-container">
      <div className="summary-card main-notebook">
        <header className="card-header">
          <h2 className="title-sketch">AI Topic Summarizer</h2>
          <p className="subtitle-sketch">Quickly generate high-quality summaries and lesson points for any topic.</p>
        </header>

        <form onSubmit={handleGenerate} className="generate-form">
          <div className="input-group">
            <label htmlFor="topic">What topic do you want to summarize?</label>
            <input
              type="text"
              id="topic"
              placeholder="e.g. Life of Jose Rizal, Photosynthesis, Industrial Revolution..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="topic-input"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn-sketch btn-pink" disabled={loading || !topic}>
            {loading ? "Generating Summary..." : "Generate AI Summary"}
          </button>
        </form>

        {summary && (
          <div className="result-area fade-in">
            <div className="result-header">
              <h3 className="result-title">Comparison for: {summary.topic}</h3>
              <button 
                onClick={() => handleExport(summary.id)} 
                className="btn-sketch btn-outline"
              >
                Export Both as PDF
              </button>
            </div>
            
            <div className="comparison-grid">
              {Object.entries(summary.content).map(([provider, text]) => (
                <div key={provider} className={`provider-card provider-${provider}`}>
                  <div className="provider-badge">
                    {provider === 'chatgpt' ? '🤖 ChatGPT' : '✨ Gemini'}
                  </div>
                  <div className="result-content notebook-lines">
                    {text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .summarize-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }
        .main-notebook {
          background: #fff;
          border: 2px solid #333;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.1);
          border-radius: 4px;
          padding: 2.5rem;
          position: relative;
        }
        .title-sketch {
          font-family: inherit;
          font-weight: 800;
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }
        .subtitle-sketch {
          color: #666;
          margin-bottom: 2rem;
        }
        .generate-form {
          margin-bottom: 3rem;
          background: #fdf6ff;
          padding: 1.5rem;
          border: 2px dashed #d19fe8;
          border-radius: 8px;
        }
        .input-group label {
          display: block;
          font-weight: 700;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }
        .topic-input {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          border: 2px solid #333;
          border-radius: 4px;
          background: #fff;
          outline: none;
          margin-bottom: 1rem;
        }
        .btn-sketch {
          padding: 0.75rem 1.5rem;
          font-weight: 700;
          border: 2px solid #333;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .btn-sketch:active { transform: translate(2px, 2px); }
        .btn-pink { background: #ff7eb9; color: #000; box-shadow: 4px 4px 0 #000; }
        .btn-outline { background: #fff; box-shadow: 4px 4px 0 #000; }
        
        .result-area {
          margin-top: 2rem;
          border-top: 2px solid #eee;
          padding-top: 2rem;
        }
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .result-title {
          font-size: 1.5rem;
          text-decoration: underline wavy #ff7eb9;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .comparison-grid { grid-template-columns: 1fr; }
        }
        .provider-card {
          border: 2px solid #333;
          border-radius: 8px;
          background: #fff;
          position: relative;
          padding-top: 1rem;
          box-shadow: 4px 4px 0 #333;
        }
        .provider-chatgpt { border-color: #10a37f; }
        .provider-gemini { border-color: #4285f4; }
        .provider-badge {
          position: absolute;
          top: -12px;
          left: 20px;
          background: #333;
          color: #fff;
          padding: 2px 10px;
          font-size: 0.8rem;
          font-weight: 700;
          border-radius: 4px;
        }
        .provider-chatgpt .provider-badge { background: #10a37f; }
        .provider-gemini .provider-badge { background: #4285f4; }
        .result-content {
          white-space: pre-wrap;
          line-height: 1.8;
          font-size: 1rem;
          padding: 1.5rem;
          max-height: 500px;
          overflow-y: auto;
        }
        .notebook-lines {
          background-image: linear-gradient(#f1f1f1 1px, transparent 1px);
          background-size: 100% 2rem;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
