import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, BarChart3, Layers, Compass, ChevronDown, Check } from 'lucide-react';
import { SAMPLE_BOOKS } from '../data/sampleBooks';
import { BookInput } from '../types/kdp';

interface HeaderProps {
  activeTab: 'categories' | 'aplus' | 'compliance' | 'bsr' | 'directory';
  setActiveTab: (tab: 'categories' | 'aplus' | 'compliance' | 'bsr' | 'directory') => void;
  currentBook: BookInput;
  onSelectPresetBook: (bookKey: string) => void;
  onResetCustomBook: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentBook,
  onSelectPresetBook,
  onResetCustomBook,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const presets = [
    { key: 'darkRomance', label: 'Dark Romance (Chicago Mafia)', sub: 'Shadow & Seduction' },
    { key: 'sciFiLitRPG', label: 'Sci-Fi LitRPG (Cyberpunk)', sub: 'Neon Overdrive' },
    { key: 'selfHelpProductivity', label: 'Non-Fiction / Self-Help', sub: 'The Deep Focus Blueprint' },
    { key: 'cozyMystery', label: 'Cozy Mystery (Amateur Sleuth)', sub: 'Whiskers, Tea & Poisoned Scones' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white font-['Cinzel'] sm:text-xl">
                  KDP <span className="text-amber-400">Mastermind</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Categories & A+ Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate max-w-xs md:max-w-sm">
                Amazon KDP 2024–2026 Category Solver & A+ Designer
              </p>
            </div>
          </div>

          {/* Book Preset Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/40 text-xs sm:text-sm font-medium text-slate-200 transition-all shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="text-left max-w-[130px] sm:max-w-[200px] truncate">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Active Title</span>
                <span className="truncate block font-semibold text-white">{currentBook.title || 'Untitled Book'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-40 animate-fade-in text-xs sm:text-sm">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Sample Bestseller
                  </div>
                  {presets.map((p) => {
                    const isSelected = currentBook.title === SAMPLE_BOOKS[p.key]?.title;
                    return (
                      <button
                        key={p.key}
                        onClick={() => {
                          onSelectPresetBook(p.key);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                          isSelected ? 'bg-amber-500/10 text-amber-300' : 'text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white">{p.label}</div>
                          <div className="text-xs text-slate-400 truncate">{p.sub}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        onResetCustomBook();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-amber-400 hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Start With Blank Custom Book
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-none py-2 gap-1.5 sm:gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Compass className="w-4 h-4" />
            Category Auditor & Solver
          </button>

          <button
            onClick={() => setActiveTab('aplus')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'aplus'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
            A+ Content Studio & Preview
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'compliance'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Compliance Shield
          </button>

          <button
            onClick={() => setActiveTab('bsr')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'bsr'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            BSR & Sales Calculator
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'directory'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Browse Nodes Explorer
          </button>
        </div>
      </div>
    </header>
  );
};
