import React, { useState } from 'react';
import { Search, Filter, Copy, CheckCircle2, BookOpen, Sparkles, Plus, ExternalLink } from 'lucide-react';
import { AMAZON_BROWSE_NODES } from '../data/categoriesDb';
import { AmazonBrowseNode } from '../types/kdp';

interface CategoryBrowserProps {
  onAddCategoryToBook: (path: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CategoryBrowser: React.FC<CategoryBrowserProps> = ({
  onAddCategoryToBook,
  onNotify,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const genres = ['All', 'Romance', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Self-Help', 'Business', 'Health & Wellness', "Children's", 'Young Adult'];
  const difficulties = ['All', 'Very Low', 'Low', 'Moderate', 'High', 'Ultra High'];

  const filteredNodes = AMAZON_BROWSE_NODES.filter((node) => {
    const matchesSearch =
      node.fullPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.genre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = selectedGenre === 'All' || node.genre === selectedGenre;
    const matchesDiff = selectedDifficulty === 'All' || node.difficulty === selectedDifficulty;

    return matchesSearch && matchesGenre && matchesDiff;
  });

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    onNotify('Copied Amazon browse node path!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Curated Browse Node Database
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cinzel']">
            Amazon KDP Category & Browse Node Directory
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed font-['Plus_Jakarta_Sans']">
            Explore authentic Amazon browse node hierarchies with verified competition ratings and estimated sales required for #1 BSR. Copy paths directly into your KDP Bookshelf or support ticket.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords, subgenres, or tropes (e.g. ghosts, hockey, culinary, habits)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Genre Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  Genre: {g}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  Competition: {d}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          <span>Showing {filteredNodes.length} curated categories</span>
          <span className="text-amber-400 font-mono text-[11px]">Click "Use Category" to add to your book</span>
        </div>
      </div>

      {/* Grid of Browse Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                  {node.department}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    node.difficulty === 'Very Low' || node.difficulty === 'Low'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : node.difficulty === 'Moderate'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                  }`}
                >
                  {node.difficulty} Competition
                </span>
              </div>

              {/* Full Breadcrumb Path */}
              <div className="font-mono text-xs font-semibold text-amber-300 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 select-all break-all">
                {node.fullPath}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-['Plus_Jakarta_Sans']">
                {node.notes}
              </p>
            </div>

            {/* Metrics & Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-slate-500 text-[10px] block">Top 1 Target BSR</span>
                  <span className="font-mono font-bold text-slate-200">~#{node.estBSRTop1.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Sales Needed</span>
                  <span className="font-mono font-bold text-emerald-400">~{node.estSalesPerDay}/day</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyPath(node.fullPath)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-950 rounded-lg border border-slate-800 transition-colors"
                  title="Copy path"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onAddCategoryToBook(node.fullPath)}
                  className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/30 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3 h-3" /> Use Category
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
