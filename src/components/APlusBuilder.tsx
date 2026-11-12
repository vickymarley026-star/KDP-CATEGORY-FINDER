import React, { useState } from 'react';
import { 
  Sparkles, Monitor, Smartphone, Plus, Trash2, ArrowUp, ArrowDown, 
  Copy, CheckCircle2, AlertTriangle, Image as ImageIcon, Download, 
  ExternalLink, Layers, RefreshCw, Edit3, Eye, ShieldAlert, BookOpen
} from 'lucide-react';
import { BookInput, APlusCampaign, APlusModule, APlusModuleType } from '../types/kdp';
import { scanAPlusCompliance } from '../utils/kdpRules';
import confetti from 'canvas-confetti';

interface APlusBuilderProps {
  book: BookInput;
  campaign: APlusCampaign | null;
  setCampaign: React.Dispatch<React.SetStateAction<APlusCampaign | null>>;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenComplianceWithText: (text: string) => void;
}

export const APlusBuilder: React.FC<APlusBuilderProps> = ({
  book,
  campaign,
  setCampaign,
  onNotify,
  onOpenComplianceWithText,
}) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'editor' | 'specs'>('preview');
  const [generating, setGenerating] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Generate full campaign with AI or server fallback
  const handleGenerateCampaign = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-aplus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book,
          campaignGoal: 'Maximize Kindle Unlimited page reads and detail page conversion',
          targetAudience: `Readers of ${book.primaryGenre} & ${book.subgenreTropes}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate A+ campaign');
      }

      const data: APlusCampaign = await response.json();
      setCampaign(data);
      if (data.modules?.length > 0) {
        setSelectedModuleId(data.modules[0].id);
      }
      onNotify('High-converting A+ Content campaign generated!', 'success');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    } catch (err: any) {
      onNotify('Could not generate campaign with AI, loaded standard template.', 'info');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onNotify(`Copied ${label} to clipboard!`, 'success');
  };

  // Add module
  const addModule = (type: APlusModuleType) => {
    if (!campaign) return;
    if (campaign.modules.length >= 7) {
      onNotify('Amazon permits a maximum of 5 to 7 modules per A+ content project.', 'info');
      return;
    }

    const newId = 'mod-' + Date.now();
    let newMod: APlusModule;

    switch (type) {
      case 'header-image-text':
        newMod = {
          id: newId,
          type,
          moduleName: 'Standard Header with Text',
          headline: `Discover the World of ${book.title}`,
          subhead: 'An Unforgettable Reading Experience',
          bodyText: book.blurb.slice(0, 200) + '...',
          dimensions: '970 x 600 px',
          imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
          imagePrompt: `Cinematic wide horizontal banner for "${book.title}". Moody, evocative lighting representing ${book.primaryGenre}. 970 x 600 px.`
        };
        break;
      case 'three-image-text':
        newMod = {
          id: newId,
          type,
          moduleName: 'Standard 3 Images & Text',
          headline: 'Meet the Key Characters',
          dimensions: '300 x 300 px (3 Cards)',
          imagePrompt: '3 square character portraits or thematic story elements, 300 x 300 px each.',
          items: [
            { id: '1', title: 'The Protagonist', subtitle: 'Relentless & Determined', text: 'Driven by an unyielding mission.', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80', imagePrompt: 'Square character portrait 300x300' },
            { id: '2', title: 'The Enigma', subtitle: 'Friend or Foe?', text: 'Motives hidden beneath layers of secrets.', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', imagePrompt: 'Square character portrait 300x300' },
            { id: '3', title: 'The Threat', subtitle: 'Lurking in Shadows', text: 'A conspiracy that threatens everything.', imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', imagePrompt: 'Square atmospheric object 300x300' },
          ]
        };
        break;
      case 'single-image-highlights':
        newMod = {
          id: newId,
          type,
          moduleName: 'Standard Single Image & Highlights',
          headline: "Inside the Book: Why You'll Love It",
          subhead: 'Praise & Reader Highlights',
          dimensions: '300 x 300 px',
          imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
          imagePrompt: `Book cover 3D mockup with reading accessories, 300 x 300 px.`,
          bulletPoints: [
            'Bingeable chapter cliffhangers that will keep you awake past 2 AM.',
            'Electrifying chemistry and multi-layered character arcs.',
            'Rich, intricate world-building with authentic historical or fantasy depth.',
            'Includes bonus character art and discussion questions.'
          ]
        };
        break;
      case 'company-logo':
        newMod = {
          id: newId,
          type,
          moduleName: 'Standard Company / Author Logo',
          headline: `${book.authorName} Books`,
          dimensions: '600 x 180 px',
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
          imagePrompt: `Author brand logo or series title banner on dark textured parchment, 600 x 180 px.`
        };
        break;
      default:
        newMod = {
          id: newId,
          type: 'header-image-text',
          moduleName: 'Standard Header with Text',
          headline: book.title,
          dimensions: '970 x 600 px',
          imagePrompt: 'Visual banner 970 x 600 px'
        };
    }

    setCampaign({
      ...campaign,
      modules: [...campaign.modules, newMod],
    });
    setSelectedModuleId(newId);
    onNotify(`Added ${newMod.moduleName} module!`, 'success');
  };

  const removeModule = (id: string) => {
    if (!campaign) return;
    const filtered = campaign.modules.filter(m => m.id !== id);
    setCampaign({ ...campaign, modules: filtered });
    if (selectedModuleId === id) {
      setSelectedModuleId(filtered[0]?.id || null);
    }
  };

  const moveModule = (index: number, direction: 'up' | 'down') => {
    if (!campaign) return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= campaign.modules.length) return;

    const list = [...campaign.modules];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    setCampaign({ ...campaign, modules: list });
  };

  const updateModuleField = (id: string, field: keyof APlusModule, val: any) => {
    if (!campaign) return;
    const updated = campaign.modules.map(m => m.id === id ? { ...m, [field]: val } : m);
    setCampaign({ ...campaign, modules: updated });
  };

  // Export full brief
  const exportFullBrief = () => {
    if (!campaign) return;
    let brief = `# Amazon KDP A+ Content Production Brief\n`;
    brief += `**Book:** ${campaign.bookTitle}\n`;
    brief += `**Campaign Theme:** ${campaign.campaignTheme}\n`;
    brief += `**Target Audience:** ${campaign.targetAudience}\n\n`;
    brief += `---\n\n`;

    campaign.modules.forEach((mod, idx) => {
      brief += `## Module ${idx + 1}: ${mod.moduleName} (${mod.dimensions})\n`;
      if (mod.headline) brief += `**Headline:** ${mod.headline}\n`;
      if (mod.subhead) brief += `**Subhead:** ${mod.subhead}\n`;
      if (mod.bodyText) brief += `**Body Copy:**\n${mod.bodyText}\n\n`;
      if (mod.bulletPoints?.length) {
        brief += `**Bullet Points:**\n`;
        mod.bulletPoints.forEach(bp => brief += `- ${bp}\n`);
        brief += `\n`;
      }
      if (mod.items?.length) {
        brief += `**Cards / Columns:**\n`;
        mod.items.forEach(it => {
          brief += `### ${it.title} (${it.subtitle || ''})\n${it.text || ''}\n*Image Prompt:* ${it.imagePrompt || ''}\n\n`;
        });
      }
      brief += `**Artwork Resolution:** ${mod.dimensions}\n`;
      brief += `**Design / AI Image Prompt:** ${mod.imagePrompt || 'N/A'}\n\n`;
      brief += `--------------------------------------------------\n\n`;
    });

    const blob = new Blob([brief], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.bookTitle.replace(/\s+/g, '_')}_APlus_Brief.md`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Downloaded A+ Content Production Brief!', 'success');
  };

  const selectedModule = campaign?.modules.find(m => m.id === selectedModuleId);
  const currentCompliance = selectedModule ? scanAPlusCompliance((selectedModule.headline || '') + ' ' + (selectedModule.bodyText || '')) : null;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-['Cinzel']">Amazon A+ Content Studio</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Design compliant, high-converting Amazon detail page modules with live mobile/desktop preview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleGenerateCampaign}
            disabled={generating}
            className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Crafting Storyboard...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI Generate Campaign
              </>
            )}
          </button>

          {campaign && (
            <button
              onClick={exportFullBrief}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Download Markdown brief"
            >
              <Download className="w-3.5 h-3.5" /> Export Spec Brief
            </button>
          )}
        </div>
      </div>

      {campaign ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Module Stack & Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* View Mode Switcher */}
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 pl-1">Live Simulator:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    previewMode === 'desktop'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    previewMode === 'mobile'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile App
                </button>
              </div>
            </div>

            {/* Campaign Summary & Module List */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Modules ({campaign.modules.length}/7)
                </span>
                <span className="text-[11px] text-amber-400 font-mono">From the Publisher</span>
              </div>

              {/* Module cards in order */}
              <div className="space-y-2">
                {campaign.modules.map((mod, idx) => {
                  const isSelected = mod.id === selectedModuleId;
                  const modScan = scanAPlusCompliance((mod.headline || '') + ' ' + (mod.bodyText || ''));
                  return (
                    <div
                      key={mod.id}
                      onClick={() => setSelectedModuleId(mod.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[11px] shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 truncate">
                          <div className="font-semibold truncate text-white">{mod.moduleName}</div>
                          <div className="text-[11px] text-slate-400 truncate">{mod.headline || mod.dimensions}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {modScan.status !== 'COMPLIANT' && (
                          <span
                            title="Compliance risk detected"
                            className="p-1 text-rose-400 bg-rose-500/10 rounded"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveModule(idx, 'up');
                          }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveModule(idx, 'down');
                          }}
                          disabled={idx === campaign.modules.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeModule(mod.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400"
                          title="Remove module"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Module Dropdown / Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Add Standard Amazon Module:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => addModule('header-image-text')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 text-left transition-colors truncate"
                  >
                    + Header (970x600)
                  </button>
                  <button
                    onClick={() => addModule('three-image-text')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 text-left transition-colors truncate"
                  >
                    + 3 Cards (300x300)
                  </button>
                  <button
                    onClick={() => addModule('single-image-highlights')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 text-left transition-colors truncate"
                  >
                    + Highlights & Image
                  </button>
                  <button
                    onClick={() => addModule('company-logo')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 text-left transition-colors truncate"
                  >
                    + Brand Logo (600x180)
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Module Editor */}
            {selectedModule && (
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs uppercase tracking-wider">
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Module #{campaign.modules.findIndex(m => m.id === selectedModule.id) + 1}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{selectedModule.dimensions}</span>
                </div>

                {/* Compliance Alert */}
                {currentCompliance && currentCompliance.status !== 'COMPLIANT' && (
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-300">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>Amazon Rejection Risk in this module!</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Found prohibited words. Amazon may reject this A+ submission.
                    </p>
                    <button
                      onClick={() => onOpenComplianceWithText((selectedModule.headline || '') + '\n' + (selectedModule.bodyText || ''))}
                      className="text-[11px] font-bold text-amber-300 hover:underline pt-0.5 block"
                    >
                      Audit & Fix in Compliance Shield &rarr;
                    </button>
                  </div>
                )}

                {/* Headline input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={selectedModule.headline || ''}
                    onChange={(e) => updateModuleField(selectedModule.id, 'headline', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Subhead input */}
                {selectedModule.subhead !== undefined && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Subhead
                    </label>
                    <input
                      type="text"
                      value={selectedModule.subhead || ''}
                      onChange={(e) => updateModuleField(selectedModule.id, 'subhead', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {/* Body Text */}
                {selectedModule.bodyText !== undefined && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Body Copy
                    </label>
                    <textarea
                      rows={3}
                      value={selectedModule.bodyText || ''}
                      onChange={(e) => updateModuleField(selectedModule.id, 'bodyText', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {/* Bullet Points */}
                {selectedModule.bulletPoints && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Highlight Bullet Points
                    </label>
                    {selectedModule.bulletPoints.map((bp, i) => (
                      <input
                        key={i}
                        type="text"
                        value={bp}
                        onChange={(e) => {
                          const updated = [...(selectedModule.bulletPoints || [])];
                          updated[i] = e.target.value;
                          updateModuleField(selectedModule.id, 'bulletPoints', updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    ))}
                  </div>
                )}

                {/* Image Prompt for Midjourney/Canva */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-amber-400" />
                      Canva / AI Image Prompt ({selectedModule.dimensions})
                    </label>
                    <button
                      onClick={() => copyToClipboard(selectedModule.imagePrompt || '', 'Image Prompt')}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
                    >
                      <Copy className="w-3 h-3" /> Copy Prompt
                    </button>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed select-all">
                    {selectedModule.imagePrompt || 'No prompt specified'}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Live Amazon Simulator (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Simulator Container */}
            {previewMode === 'desktop' ? (
              
              /* DESKTOP AMAZON DETAIL PAGE VIEW */
              <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                
                {/* Amazon Desktop Mockup Header Bar */}
                <div className="bg-[#232f3e] px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white tracking-wide">amazon</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-200">Product Detail Page Simulator (Desktop)</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-mono">amazon.com/dp/{book.asinOrIsbn || 'B0XXXXXXXX'}</span>
                </div>

                {/* Amazon A+ Content Section */}
                <div className="bg-white p-6 sm:p-8 text-slate-900 font-sans space-y-8 min-h-[500px]">
                  
                  {/* Section Title as it appears on Amazon */}
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                      From the Publisher
                    </h3>
                  </div>

                  {/* Render modules */}
                  <div className="space-y-10 max-w-[970px] mx-auto">
                    {campaign.modules.map((mod, idx) => (
                      <div key={mod.id} className="relative group">
                        
                        {/* Module 1: Header Image with Text */}
                        {mod.type === 'header-image-text' && (
                          <div className="space-y-4">
                            <div className="w-full bg-slate-900 rounded overflow-hidden aspect-[970/600] max-h-[460px] relative">
                              <img
                                src={mod.imageUrl}
                                alt={mod.headline || 'A+ Banner'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback graceful graphic
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                                <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-1">
                                  {mod.subhead}
                                </span>
                                <h4 className="text-2xl sm:text-3xl font-extrabold font-serif leading-tight">
                                  {mod.headline}
                                </h4>
                              </div>
                            </div>
                            {mod.bodyText && (
                              <p className="text-sm text-gray-700 leading-relaxed px-1">
                                {mod.bodyText}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Module 2: Three Images & Text */}
                        {mod.type === 'three-image-text' && (
                          <div className="space-y-4">
                            {mod.headline && (
                              <h4 className="text-xl font-bold text-gray-900 text-center font-serif">
                                {mod.headline}
                              </h4>
                            )}
                            <div className="grid grid-cols-3 gap-6">
                              {mod.items?.map((item) => (
                                <div key={item.id} className="text-center space-y-2">
                                  <div className="aspect-square bg-slate-100 rounded overflow-hidden shadow-sm">
                                    <img
                                      src={item.imageUrl}
                                      alt={item.title || 'A+ Card'}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <h5 className="font-bold text-sm text-gray-900 mt-2">{item.title}</h5>
                                  {item.subtitle && (
                                    <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                                      {item.subtitle}
                                    </div>
                                  )}
                                  <p className="text-xs text-gray-600 leading-normal">{item.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Module 3: Single Image & Highlights */}
                        {mod.type === 'single-image-highlights' && (
                          <div className="grid grid-cols-12 gap-6 items-center bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="col-span-5">
                              <div className="aspect-square bg-slate-200 rounded overflow-hidden shadow-md">
                                <img
                                  src={mod.imageUrl}
                                  alt={mod.headline || 'Highlight Image'}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="col-span-7 space-y-3">
                              <h4 className="text-xl font-bold text-gray-900 font-serif">{mod.headline}</h4>
                              {mod.subhead && (
                                <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider">{mod.subhead}</p>
                              )}
                              <ul className="space-y-2 text-xs text-gray-700">
                                {mod.bulletPoints?.map((bp, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Module 4: Comparison Table */}
                        {mod.type === 'comparison-table' && (
                          <div className="space-y-4">
                            <h4 className="text-xl font-bold text-gray-900 text-center font-serif">{mod.headline}</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border border-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="p-3 font-bold text-gray-700 border-r border-gray-200 w-1/4">Book Features</th>
                                    {mod.tableColumns?.map((col, i) => (
                                      <th
                                        key={i}
                                        className={`p-3 text-center border-r border-gray-200 ${
                                          col.isCurrentBook ? 'bg-amber-100/60 font-extrabold text-amber-950' : 'text-gray-800 font-bold'
                                        }`}
                                      >
                                        <div className="w-16 h-24 bg-slate-300 mx-auto rounded mb-2 shadow-inner flex items-center justify-center text-[10px] text-gray-600 font-bold">
                                          Spine
                                        </div>
                                        <div className="truncate max-w-[120px] mx-auto">{col.title}</div>
                                        <div className="text-[10px] text-gray-500 font-normal">{col.subtitle}</div>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {mod.tableRows?.map((row, i) => (
                                    <tr key={i}>
                                      <td className="p-2.5 font-semibold text-gray-800 border-r border-gray-200 bg-gray-50">{row.featureName}</td>
                                      {row.values.map((v, valIdx) => (
                                        <td key={valIdx} className="p-2.5 text-center text-gray-600 border-r border-gray-200">
                                          {v}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Module 5: Company / Author Logo */}
                        {mod.type === 'company-logo' && (
                          <div className="w-full bg-[#131921] text-center p-6 rounded flex flex-col items-center justify-center text-white space-y-1">
                            <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Author Catalog</span>
                            <h4 className="text-xl font-bold tracking-wider font-serif">{mod.headline}</h4>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                </div>
              </div>

            ) : (

              /* MOBILE PHONE AMAZON APP VIEW */
              <div className="max-w-sm mx-auto bg-slate-900 rounded-[40px] p-4 border-[6px] border-slate-700 shadow-2xl relative">
                
                {/* Phone Speaker & Notch */}
                <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-3"></div>

                {/* Mobile Screen */}
                <div className="bg-white rounded-[28px] overflow-hidden text-slate-900 font-sans shadow-inner max-h-[620px] overflow-y-auto scrollbar-thin">
                  
                  {/* Mobile Amazon App Bar */}
                  <div className="bg-[#232f3e] px-4 py-2 text-white flex items-center justify-between text-xs sticky top-0 z-20">
                    <span className="font-extrabold text-white text-sm">amazon</span>
                    <span className="text-[10px] text-slate-300">Deliver to New York 10001</span>
                  </div>

                  {/* Product Title Breadcrumb */}
                  <div className="p-3 bg-gray-50 border-b border-gray-200 text-[11px] text-gray-600 truncate">
                    Books &gt; {book.primaryGenre} &gt; {book.title}
                  </div>

                  {/* Mobile A+ Content Feed */}
                  <div className="p-4 space-y-6">
                    <div className="border-b border-gray-200 pb-1.5">
                      <h4 className="font-bold text-sm text-gray-900">From the Publisher</h4>
                    </div>

                    {campaign.modules.map((mod) => (
                      <div key={mod.id} className="space-y-3">
                        
                        {/* Header Image Mobile */}
                        {mod.type === 'header-image-text' && (
                          <div className="space-y-2">
                            <div className="w-full aspect-[16/10] bg-slate-900 rounded overflow-hidden relative">
                              <img src={mod.imageUrl} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end text-white">
                                <h5 className="font-bold text-sm leading-tight">{mod.headline}</h5>
                              </div>
                            </div>
                            {mod.bodyText && (
                              <p className="text-xs text-gray-700 leading-snug">{mod.bodyText.slice(0, 160)}...</p>
                            )}
                          </div>
                        )}

                        {/* Three Images Mobile: Stacks gracefully! */}
                        {mod.type === 'three-image-text' && (
                          <div className="space-y-2">
                            <h5 className="font-bold text-xs text-gray-900 text-center">{mod.headline}</h5>
                            <div className="grid grid-cols-3 gap-2">
                              {mod.items?.map((it) => (
                                <div key={it.id} className="text-center">
                                  <div className="aspect-square bg-slate-100 rounded overflow-hidden">
                                    <img src={it.imageUrl} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="font-bold text-[10px] mt-1 text-gray-900 truncate">{it.title}</div>
                                  <div className="text-[9px] text-gray-600 line-clamp-2">{it.text}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Single Image & Highlights Mobile */}
                        {mod.type === 'single-image-highlights' && (
                          <div className="space-y-2 bg-gray-50 p-3 rounded border border-gray-200">
                            <div className="aspect-[4/3] bg-slate-200 rounded overflow-hidden">
                              <img src={mod.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <h5 className="font-bold text-xs text-gray-900">{mod.headline}</h5>
                            <ul className="space-y-1 text-[11px] text-gray-700">
                              {mod.bulletPoints?.slice(0, 3).map((bp, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-amber-600 font-bold">•</span>
                                  <span>{bp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Company Logo Mobile */}
                        {mod.type === 'company-logo' && (
                          <div className="bg-[#131921] p-3 text-center rounded text-white text-xs font-bold">
                            {mod.headline}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                </div>

                {/* Bottom Home Indicator */}
                <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-3"></div>
              </div>

            )}

          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/60 rounded-3xl p-8 sm:p-14 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Cinzel']">No A+ Content Campaign Loaded Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Generate a full 4-module launch campaign tailored to <strong>{book.title}</strong>, complete with Amazon-compliant copy, reader hook pillars, and Midjourney image prompts.
          </p>
          <button
            onClick={handleGenerateCampaign}
            disabled={generating}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Generate A+ Campaign with AI
          </button>
        </div>
      )}

    </div>
  );
};
