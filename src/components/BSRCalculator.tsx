import React, { useState } from 'react';
import { BarChart3, DollarSign, TrendingUp, Sparkles, Award, Zap, HelpCircle } from 'lucide-react';
import { calculateSalesFromBSR } from '../utils/kdpRules';

export const BSRCalculator: React.FC = () => {
  const [bsr, setBsr] = useState<number>(12500);
  const [bookPrice, setBookPrice] = useState<number>(4.99);
  const [royaltyRate, setRoyaltyRate] = useState<number>(0.70); // 70% standard KDP royalty

  const result = calculateSalesFromBSR(bsr);
  const estimatedMonthlyRoyalty = Math.round(result.monthlySales * bookPrice * royaltyRate);

  const presets = [
    { label: 'Top 100 Overall (Viral Bestseller)', bsr: 80, notes: 'Requires 300+ sales/day' },
    { label: 'Top 1,000 (Major Subgenre #1)', bsr: 950, notes: 'Requires ~110 sales/day' },
    { label: 'Top 5,000 (Healthy Indie Midlist)', bsr: 4800, notes: 'Requires ~30 sales/day' },
    { label: 'Top 25,000 (Micro-Niche #1 Target)', bsr: 22000, notes: 'Requires ~6 sales/day' },
    { label: 'Top 80,000 (Ghost Category #1)', bsr: 75000, notes: 'Requires ~2 sales/day' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5" /> BSR Empirical Regression Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel']">
            Amazon BSR to Daily Sales & #1 Ribbon Calculator
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed font-['Plus_Jakarta_Sans']">
            Calculate exactly how many daily paid sales or Kindle Unlimited page-read equivalents you need to conquer any Amazon category and secure the orange "#1 Best Seller" badge.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Inputs (6 cols) */}
        <div className="md:col-span-6 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Target Amazon BSR (Best Seller Rank)</h3>
            <p className="text-xs text-slate-400">Lower rank number = higher sales volume</p>
          </div>

          {/* Direct BSR Input & Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Current or Goal BSR
              </label>
              <div className="font-mono text-xl font-extrabold text-amber-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                #{bsr.toLocaleString()}
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="200000"
              step="50"
              value={bsr}
              onChange={(e) => setBsr(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>#1 (Mega Bestseller)</span>
              <span>#50,000</span>
              <span>#200,000 (Low volume)</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Quick Industry Milestones:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setBsr(p.bsr)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    bsr === p.bsr
                      ? 'bg-amber-500/15 border-amber-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">{p.label}</span>
                  <span className="text-[11px] text-amber-400 font-mono">#{p.bsr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Royalty settings */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Royalty & Pricing Variables
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Book List Price ($)</span>
                <input
                  type="number"
                  step="0.50"
                  value={bookPrice}
                  onChange={(e) => setBookPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">KDP Royalty Tier</span>
                <select
                  value={royaltyRate}
                  onChange={(e) => setRoyaltyRate(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value={0.70}>70% (Price $2.99 - $9.99)</option>
                  <option value={0.35}>35% (Price under $2.99 or over $9.99)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Output Metrics & Strategy (6 cols) */}
        <div className="md:col-span-6 space-y-6">
          
          {/* Main Sales Metrics Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sales Volume Projections
              </span>
              <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Kindle Store Empirical Data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimated Daily Sales</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                  {result.dailySales}
                </div>
                <span className="text-[11px] text-slate-400">books / day</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Monthly Sales Volume</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  {result.monthlySales.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400">books / month</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimated Monthly Royalties</span>
                <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
                  ${estimatedMonthlyRoyalty.toLocaleString()}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-400 shrink-0 opacity-80" />
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Category Barrier Analysis:</strong>
                <span className="text-slate-300">
                  {result.difficultyTier}. At this rank, you easily maintain the #1 Best Seller ribbon in narrow micro-niches and compete for top 5 in standard subcategories.
                </span>
              </div>
            </div>
          </div>

          {/* Strategic Advice */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              How the #1 Best Seller Badge Actually Works:
            </h4>
            <p className="leading-relaxed">
              Amazon awards the orange <strong>#1 Best Seller ribbon</strong> to the book with the lowest BSR inside that specific category browse node. 
              If the top book in a hidden micro-niche has a BSR of #25,000, selling just <strong>7 books in a 24-hour window</strong> pushes your title past them to steal the #1 ribbon!
            </p>
            <p className="leading-relaxed text-slate-400">
              This is why selecting 3 ultra-targeted micro-niches in your KDP Bookshelf gives you 10x higher organic click-through rates than staying buried in general categories.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
