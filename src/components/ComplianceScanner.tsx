import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, 
  Sparkles, Copy, RefreshCw, FileText, BookOpen, ArrowRight, Zap 
} from 'lucide-react';
import { scanAPlusCompliance, autoSanitizeAPlusText } from '../utils/kdpRules';
import { A_PLUS_RESTRICTIONS } from '../data/categoriesDb';
import { ComplianceScanResult } from '../types/kdp';
import confetti from 'canvas-confetti';

interface ComplianceScannerProps {
  initialText?: string;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ComplianceScanner: React.FC<ComplianceScannerProps> = ({
  initialText = '',
  onNotify,
}) => {
  const [text, setText] = useState<string>(
    initialText ||
      `🔥 #1 BESTSELLER! OVER 100,000 COPIES SOLD! 🔥\n\n"The best romantic thriller of 2024! 5-star review from an Amazon customer!"\n\nPre-order now to get a FREE bonus companion novellas and limited edition bookmarks! Visit our website at www.myauthorpage.com or follow @author_aria on Instagram for exclusive giveaways.\n\nMONEY-BACK GUARANTEE if you don't fall in love with Dante Vitiello! BUY YOUR COPY TODAY!!!`
  );

  const [scanResult, setScanResult] = useState<ComplianceScanResult>(() => scanAPlusCompliance(text));
  const [loading, setLoading] = useState(false);

  // Deep scan via server endpoint
  const runDeepScan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/check-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Compliance scan failed');

      const data: ComplianceScanResult = await response.json();
      setScanResult(data);
      onNotify('Compliance audit complete!', 'success');
    } catch {
      // Fallback local
      const local = scanAPlusCompliance(text);
      setScanResult(local);
      onNotify('Local rule scan completed.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFix = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auto-fix-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      const fixed = data.fixedText || autoSanitizeAPlusText(text);
      setText(fixed);
      setScanResult(scanAPlusCompliance(fixed));
      onNotify('All Amazon rejection triggers successfully sanitized!', 'success');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch {
      const fixed = autoSanitizeAPlusText(text);
      setText(fixed);
      setScanResult(scanAPlusCompliance(fixed));
      onNotify('Sanitized copy using rule engine.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    onNotify(`Copied ${label} to clipboard!`, 'success');
  };

  const loadCleanSample = () => {
    const clean = `Step into the shadows of Chicago's elite underworld.\n\nWhen loyalties collide with forbidden desire, survival demands the ultimate sacrifice. Crafted with intricate pacing, dual points of view, and high-tension character arcs.\n\nIncludes reader group discussion guide and exclusive character profile artwork in the back matter. Complete your reading collection today.`;
    setText(clean);
    setScanResult(scanAPlusCompliance(clean));
  };

  const loadRiskySample = () => {
    const risky = `🔥 #1 BESTSELLER! OVER 100,000 COPIES SOLD! 🔥\n\n"The best romantic thriller of 2024! 5-star review from an Amazon customer!"\n\nPre-order now to get a FREE bonus companion novella! Visit www.myauthorpage.com or follow @author_aria on Instagram.\n\n100% MONEY-BACK GUARANTEE! BUY YOUR COPY TODAY!!!`;
    setText(risky);
    setScanResult(scanAPlusCompliance(risky));
  };

  // Score color
  const scoreColor =
    scanResult.score >= 90
      ? 'text-emerald-400'
      : scanResult.score >= 60
      ? 'text-amber-400'
      : 'text-rose-400';

  const scoreBadgeBg =
    scanResult.score >= 90
      ? 'bg-emerald-500/10 border-emerald-500/30'
      : scanResult.score >= 60
      ? 'bg-amber-500/10 border-amber-500/30'
      : 'bg-rose-500/10 border-rose-500/30';

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Amazon KDP Rejection Guard
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel']">
            Amazon A+ Content Moderation & Compliance Shield
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed font-['Plus_Jakarta_Sans']">
            Amazon rejects over 35% of indie author A+ submissions due to automated bot flags (unverified "#1 bestseller" claims, pricing words like "free" or "discount", social handles, emojis, and unverified customer reviews). 
            Scan your text below to pre-emptively fix violations before submission.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Copy Scanner & Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Paste Proposed A+ Copy</h3>
                <span className="text-xs text-slate-400">Scan headlines, subheads, and body text</span>
              </div>

              {/* Sample loader buttons */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={loadRiskySample}
                  className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg transition-colors font-medium"
                >
                  Load Risky Draft
                </button>
                <button
                  type="button"
                  onClick={loadCleanSample}
                  className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors font-medium"
                >
                  Load Clean Draft
                </button>
              </div>
            </div>

            {/* Input Text Area */}
            <div>
              <textarea
                rows={9}
                value={text}
                onChange={(e) => {
                  const val = e.target.value;
                  setText(val);
                  setScanResult(scanAPlusCompliance(val));
                }}
                placeholder="Paste your Amazon A+ Content headlines or body text here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400 transition-colors leading-relaxed"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
                <span>{text.length} characters</span>
                <span className="text-amber-400 font-mono">Live Bot Filter Active</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={runDeepScan}
                disabled={loading || !text.trim()}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                Run Full Moderation Scan
              </button>

              <button
                onClick={handleAutoFix}
                disabled={loading || !text.trim()}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                1-Click Auto-Sanitize Copy
              </button>
            </div>

            {/* Copy Result */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => copyToClipboard(text, 'Cleaned Copy')}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" /> Copy Current Text
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Score & Violations Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Score Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Amazon Approval Probability
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreBadgeBg} ${scoreColor}`}
              >
                {scanResult.status === 'COMPLIANT'
                  ? 'Ready for Submission'
                  : scanResult.status === 'WARNINGS'
                  ? 'Minor Warning Flags'
                  : 'High Rejection Risk'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border font-mono font-extrabold text-3xl shadow-lg shrink-0 ${scoreBadgeBg} ${scoreColor}`}
              >
                {scanResult.score}
                <span className="text-[10px] font-sans text-slate-400 font-normal">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-['Plus_Jakarta_Sans']">
                {scanResult.summary}
              </p>
            </div>
          </div>

          {/* Violations List */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm">
                Detected Rejection Triggers ({scanResult.violations.length})
              </h4>
              <span className="text-xs text-slate-400 font-mono">Amazon TOS Check</span>
            </div>

            {scanResult.violations.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h5 className="font-bold text-white text-sm">Zero Amazon Moderation Flags Found</h5>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Your text strictly complies with Amazon KDP A+ Content policies and is safe to submit to KDP Author Central.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
                {scanResult.violations.map((v) => (
                  <div
                    key={v.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      v.severity === 'critical'
                        ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                        : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <AlertTriangle
                          className={`w-3.5 h-3.5 ${
                            v.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'
                          }`}
                        />
                        {v.rule}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          v.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {v.severity}
                      </span>
                    </div>

                    <div className="bg-slate-950/80 p-2 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
                      Flagged Phrase: <span className="text-rose-400 font-bold">"{v.textMatch}"</span>
                    </div>

                    <p className="text-slate-300 leading-snug">{v.explanation}</p>

                    <div className="pt-1 border-t border-slate-800/80 flex items-start gap-1 text-emerald-400">
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Fix:</strong> {v.suggestedFix}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guidelines Reference Cheat Sheet */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Amazon's Top 5 A+ Rejection Rules</span>
            </div>
            <div className="space-y-2 text-xs">
              {A_PLUS_RESTRICTIONS.slice(0, 4).map((rule, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-200">{rule.rule}</div>
                  <div className="text-[11px] text-slate-400">{rule.tip}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
