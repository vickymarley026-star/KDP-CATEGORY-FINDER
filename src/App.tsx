import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategoryAuditor } from './components/CategoryAuditor';
import { APlusBuilder } from './components/APlusBuilder';
import { ComplianceScanner } from './components/ComplianceScanner';
import { BSRCalculator } from './components/BSRCalculator';
import { CategoryBrowser } from './components/CategoryBrowser';
import { Toast, ToastMessage } from './components/Toast';
import { SAMPLE_BOOKS } from './data/sampleBooks';
import { BookInput, CategoryAuditResult, APlusCampaign } from './types/kdp';
import { generateHeuristicCategoryAudit } from './utils/kdpRules';

export default function App() {
  const [activeTab, setActiveTab] = useState<'categories' | 'aplus' | 'compliance' | 'bsr' | 'directory'>('categories');
  const [currentBook, setCurrentBook] = useState<BookInput>(SAMPLE_BOOKS.darkRomance);
  
  // Pre-seed with heuristic audit so the user sees results immediately
  const [auditResult, setAuditResult] = useState<CategoryAuditResult | null>(() =>
    generateHeuristicCategoryAudit(SAMPLE_BOOKS.darkRomance)
  );

  // Pre-seed with high quality A+ content campaign
  const [campaign, setCampaign] = useState<APlusCampaign | null>({
    id: 'camp-default',
    bookTitle: SAMPLE_BOOKS.darkRomance.title,
    campaignTitle: `${SAMPLE_BOOKS.darkRomance.title} - High Conversion Launch Stack`,
    campaignTheme: 'Atmospheric Dark Mafia Romance',
    targetAudience: 'Readers of Dark Romance & Enemies to Lovers',
    modules: [
      {
        id: 'mod-1',
        type: 'header-image-text',
        moduleName: 'Standard Header with Text',
        headline: 'He Was Supposed to Be Her Captor. Instead, He Became Her Darkest Obsession.',
        subhead: 'The Vitiello Syndicate Series — Book 1',
        bodyText: 'Witnessing an execution in the Chicago shadows was never part of Mia\'s plan. Neither was falling under the intoxicating spell of Dante Vitiello—the ruthless heir to the syndicate throne who forces her into an arranged marriage of silence.',
        dimensions: '970 x 600 px',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
        imagePrompt: 'Cinematic wide horizontal book banner for "Shadow & Seduction". Dramatic candlelight, opulent Italian ballroom architecture, silhouette of brooding billionaire mafia boss in black tuxedo beside elegant woman in emerald gown. Moody chiaroscuro lighting, luxury dark romance aesthetic, hyper-detailed. 970 x 600 px.'
      },
      {
        id: 'mod-2',
        type: 'three-image-text',
        moduleName: 'Standard 3 Images & Text (Character Dossiers)',
        headline: 'Meet the Key Figures of the Syndicate',
        dimensions: '300 x 300 px (3 Cards)',
        imagePrompt: 'Three square character portraits in consistent dark romantic aesthetic, 300 x 300 px each.',
        items: [
          {
            id: 'it-1',
            title: 'Dante Vitiello',
            subtitle: 'The Cold-Blooded Heir',
            text: 'Feared across five boroughs. Ruthless with enemies, possessive behind closed doors.',
            imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            imagePrompt: 'Square portrait of intense man with sharp jawline, tailored black suit, stormy grey eyes, cinematic dark luxury lighting. 300 x 300 px.'
          },
          {
            id: 'it-2',
            title: 'Mia Ross',
            subtitle: 'The Defiant Captive',
            text: 'She refuses to break under his gaze, uncovering secrets that could dismantle the empire.',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            imagePrompt: 'Square portrait of elegant dark-haired heroine with defiant green eyes, emerald silk dress, soft candlelight. 300 x 300 px.'
          },
          {
            id: 'it-3',
            title: 'The Blood Vow',
            subtitle: 'Forced Proximity & Loyalty',
            text: 'An arranged wedding of convenience that sparks an uncontrollable wildfire.',
            imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            imagePrompt: 'Close up of hands entwined wearing platinum signet ring and antique diamond ring, gothic romance mood. 300 x 300 px.'
          }
        ]
      },
      {
        id: 'mod-3',
        type: 'single-image-highlights',
        moduleName: 'Standard Single Image & Highlights',
        headline: 'Why Romance Readers Devour This Series',
        subhead: 'Everything You Crave in Dark Romantic Fiction',
        dimensions: '300 x 300 px',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
        imagePrompt: 'Artistic 3D book mockup on dark marble surface with velvet ribbons, antique dagger, and single red rose. 300 x 300 px.',
        bulletPoints: [
          'High-heat banter with an intense "touch her and die" protective alpha hero.',
          'Dual POV perspective revealing both sides of the psychological cat-and-mouse game.',
          'Intricate underworld politics and high-stakes family drama.',
          'Satisfying happily-ever-after with emotional payoff and zero cliffhangers.'
        ]
      },
      {
        id: 'mod-4',
        type: 'comparison-table',
        moduleName: 'Standard Comparison Table (Series Reading Order)',
        headline: 'The Vitiello Syndicate Universe',
        dimensions: '150 x 300 px per column',
        imagePrompt: '4 vertical book spine covers with dark mafia aesthetics, 150 x 300 px.',
        tableColumns: [
          { title: 'Shadow & Seduction', subtitle: 'Book 1 (Dante & Mia)', isCurrentBook: true },
          { title: 'Vows of Deception', subtitle: 'Book 2 (Matteo & Elena)', isCurrentBook: false },
          { title: 'Sins of the Father', subtitle: 'Book 3 (Luca & Sofia)', isCurrentBook: false },
          { title: 'Silent Retribution', subtitle: 'Prequel Novella', isCurrentBook: false }
        ],
        tableRows: [
          { featureName: 'Trope Core', values: ['Enemies to Lovers', 'Fake Engagement', 'Second Chance', 'Forbidden Bodyguard'] },
          { featureName: 'Heat Level', values: ['Steamy & Dark', 'Slow Burn Spiced', 'High Heat', 'Tense & Gritty'] },
          { featureName: 'Page Count', values: ['392 Pages', '420 Pages', '440 Pages', '180 Pages'] },
          { featureName: 'Audiobook', values: ['Available Now', 'Available Now', 'In Production', 'Available Now'] }
        ]
      }
    ]
  });

  const [complianceInitialText, setComplianceInitialText] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Preset book change
  const handleSelectPreset = (key: string) => {
    const selected = SAMPLE_BOOKS[key];
    if (selected) {
      setCurrentBook(selected);
      // Auto-update audit result
      const newAudit = generateHeuristicCategoryAudit(selected);
      setAuditResult(newAudit);
      showToast(`Loaded "${selected.title}" preset!`, 'success');
    }
  };

  const handleResetCustom = () => {
    const empty: BookInput = {
      title: '',
      subtitle: '',
      authorName: '',
      asinOrIsbn: '',
      format: 'ebook',
      primaryGenre: 'Fiction',
      subgenreTropes: '',
      blurb: '',
      currentCategories: [],
      backendKeywords: ['', '', '', '', '', '', '']
    };
    setCurrentBook(empty);
    setAuditResult(null);
    setCampaign(null);
    showToast('Started new custom book project.', 'info');
  };

  const handleAddCategoryFromDirectory = (path: string) => {
    if (currentBook.currentCategories.length >= 3) {
      showToast('Maximum of 3 categories already assigned. Remove one first.', 'info');
      return;
    }
    if (currentBook.currentCategories.includes(path)) {
      showToast('Category already in your book list.', 'info');
      return;
    }
    const updated = { ...currentBook, currentCategories: [...currentBook.currentCategories, path] };
    setCurrentBook(updated);
    setAuditResult(generateHeuristicCategoryAudit(updated));
    showToast(`Added category to ${currentBook.title || 'your book'}!`, 'success');
  };

  const handleOpenComplianceWithText = (txt: string) => {
    setComplianceInitialText(txt);
    setActiveTab('compliance');
    showToast('Loaded text into Compliance Shield.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans'] flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentBook={currentBook}
        onSelectPresetBook={handleSelectPreset}
        onResetCustomBook={handleResetCustom}
      />

      {/* Main Tab Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {activeTab === 'categories' && (
          <CategoryAuditor
            book={currentBook}
            setBook={setCurrentBook}
            auditResult={auditResult}
            setAuditResult={setAuditResult}
            onNotify={showToast}
            onJumpToAPlus={() => setActiveTab('aplus')}
          />
        )}

        {activeTab === 'aplus' && (
          <APlusBuilder
            book={currentBook}
            campaign={campaign}
            setCampaign={setCampaign}
            onNotify={showToast}
            onOpenComplianceWithText={handleOpenComplianceWithText}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceScanner
            initialText={complianceInitialText}
            onNotify={showToast}
          />
        )}

        {activeTab === 'bsr' && (
          <BSRCalculator />
        )}

        {activeTab === 'directory' && (
          <CategoryBrowser
            onAddCategoryToBook={handleAddCategoryFromDirectory}
            onNotify={showToast}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400 font-['Cinzel']">KDP Mastermind</span>
            <span>•</span>
            <span>Category Solver & A+ Content Studio for Indie Authors</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Compliant with official Amazon KDP Publishing & A+ Content Guidelines (2024–2026)
          </div>
        </div>
      </footer>

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
      
    </div>
  );
}
