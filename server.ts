import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { AMAZON_BROWSE_NODES } from './src/data/categoriesDb.ts';
import { scanAPlusCompliance, autoSanitizeAPlusText, generateHeuristicCategoryAudit } from './src/utils/kdpRules.ts';
import { BookInput, APlusCampaign } from './src/types/kdp.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK (User-Agent header required by system instructions)
const rawKey = process.env.GEMINI_API_KEY;
const isRealApiKey = typeof rawKey === 'string' && rawKey.trim().length > 15 && rawKey !== 'MY_GEMINI_API_KEY';

let ai: GoogleGenAI | null = null;
if (isRealApiKey) {
  ai = new GoogleGenAI({
    apiKey: rawKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Timeout helper to avoid waiting if network is slow
async function callWithTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  let timer: any;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// API: Browse Nodes Directory
app.get('/api/browse-nodes', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const genre = (req.query.genre as string || '').toLowerCase().trim();

  let nodes = AMAZON_BROWSE_NODES;
  if (genre && genre !== 'all') {
    nodes = nodes.filter(n => n.genre.toLowerCase() === genre);
  }
  if (query) {
    nodes = nodes.filter(n =>
      n.fullPath.toLowerCase().includes(query) ||
      n.genre.toLowerCase().includes(query) ||
      n.notes.toLowerCase().includes(query)
    );
  }
  res.json({ nodes });
});

// API: Category Audit & Solver
app.post('/api/audit-categories', async (req, res) => {
  const safeInput: BookInput = {
    title: (req.body?.title || '').trim() || 'Untitled Book',
    subtitle: (req.body?.subtitle || '').trim(),
    authorName: (req.body?.authorName || '').trim() || 'Author',
    asinOrIsbn: (req.body?.asinOrIsbn || '').trim(),
    format: req.body?.format || 'ebook',
    primaryGenre: (req.body?.primaryGenre || '').trim() || 'Fiction',
    subgenreTropes: (req.body?.subgenreTropes || '').trim(),
    blurb: (req.body?.blurb || '').trim(),
    currentCategories: Array.isArray(req.body?.currentCategories) ? req.body.currentCategories : [],
    backendKeywords: Array.isArray(req.body?.backendKeywords) ? req.body.backendKeywords : [],
  };

  // If Gemini is available with real key, use gemini-3.8-flash with structured schema
  if (ai && isRealApiKey) {
    try {
      const prompt = `You are a world-class Amazon KDP Publishing Strategist, Amazon SEO Master, and Best Seller Category Consultant.
Audit the following book for Amazon Kindle Direct Publishing (KDP) category selection and backend keyword positioning.

Book Details:
- Title: ${safeInput.title}
- Subtitle: ${safeInput.subtitle || 'N/A'}
- Author: ${safeInput.authorName || 'N/A'}
- Format: ${safeInput.format || 'ebook'}
- Primary Genre: ${safeInput.primaryGenre || 'Fiction'}
- Subgenre & Tropes: ${safeInput.subgenreTropes || 'N/A'}
- Current Assigned Categories: ${JSON.stringify(safeInput.currentCategories || [])}
- 7 Backend Keywords: ${JSON.stringify(safeInput.backendKeywords || [])}
- Book Description / Blurb:
${safeInput.blurb || 'N/A'}

YOUR MISSION:
1. Identify 2-3 critical category & metadata issues (e.g. overcompetitive "General" categories, missing sub-nodes, keyword misplacements, or adult filter risks).
2. Recommend the EXACT TOP 3 PRIMARY Amazon KDP Categories with complete breadcrumb paths (e.g. "Kindle Store > Kindle eBooks > Romance > Romantic Suspense > Mafia & Organized Crime" or "Books > Children's Books > Animals > Bears").
3. Identify 3 "Ghost" or Low-Competition Micro-Niche Categories where a book can earn the orange "#1 Best Seller" badge with under 15 sales/day.
4. Audit the 7 backend keyword slots: classify each as Keep, Replace, or Risk, and supply high-intent replacement reader phrases (strictly adhering to KDP TOS - no "bestseller", no "free", no brand names).
5. Generate the official Amazon KDP Support Category Change Ticket text formatted for kdp.amazon.com/contact-us.`;

      const response = await callWithTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite Amazon KDP publishing software specialist. Always produce valid structured JSON strictly matching the requested schema.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summaryVerdict: { type: Type.STRING },
                identifiedIssues: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      severity: { type: Type.STRING, description: "'danger' | 'warning' | 'info'" },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      fixAction: { type: Type.STRING },
                    },
                    required: ['severity', 'title', 'description', 'fixAction'],
                  },
                },
                primaryRecommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      path: { type: Type.STRING },
                      competitionLevel: { type: Type.STRING, description: "'Very Low' | 'Low' | 'Moderate' | 'High' | 'Ultra High'" },
                      estimatedBSRForTop1: { type: Type.NUMBER },
                      dailySalesNeeded: { type: Type.NUMBER },
                      relevanceScore: { type: Type.NUMBER },
                      whyRecommended: { type: Type.STRING },
                      bisacMatch: { type: Type.STRING },
                    },
                    required: ['path', 'competitionLevel', 'estimatedBSRForTop1', 'dailySalesNeeded', 'relevanceScore', 'whyRecommended'],
                  },
                },
                ghostCategories: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      path: { type: Type.STRING },
                      estimatedBSRForTop1: { type: Type.NUMBER },
                      dailySalesNeeded: { type: Type.NUMBER },
                      whyOpportunity: { type: Type.STRING },
                      howToRequest: { type: Type.STRING },
                    },
                    required: ['path', 'estimatedBSRForTop1', 'dailySalesNeeded', 'whyOpportunity', 'howToRequest'],
                  },
                },
                keywordAudit: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      status: { type: Type.STRING, description: "'Keep' | 'Replace' | 'Risk'" },
                      recommendedKeyword: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    },
                    required: ['original', 'status', 'recommendedKeyword', 'reason'],
                  },
                },
                supportTicket: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    body: { type: Type.STRING },
                  },
                  required: ['subject', 'body'],
                },
              },
              required: ['summaryVerdict', 'identifiedIssues', 'primaryRecommendations', 'ghostCategories', 'keywordAudit', 'supportTicket'],
            },
          },
        })
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini category audit fallback triggered:', err?.message || err);
    }
  }

  // Algorithmic heuristic fallback
  const fallbackResult = generateHeuristicCategoryAudit(safeInput);
  res.json(fallbackResult);
});

// API: Generate Compliant A+ Content Campaign
app.post('/api/generate-aplus', async (req, res) => {
  const rawBook: BookInput = req.body?.book || {};
  const book: BookInput = {
    title: (rawBook.title || '').trim() || 'Untitled Book',
    subtitle: (rawBook.subtitle || '').trim(),
    authorName: (rawBook.authorName || '').trim() || 'Author',
    asinOrIsbn: (rawBook.asinOrIsbn || '').trim(),
    format: rawBook.format || 'ebook',
    primaryGenre: (rawBook.primaryGenre || '').trim() || 'Fiction',
    subgenreTropes: (rawBook.subgenreTropes || '').trim(),
    blurb: (rawBook.blurb || '').trim(),
    currentCategories: Array.isArray(rawBook.currentCategories) ? rawBook.currentCategories : [],
    backendKeywords: Array.isArray(rawBook.backendKeywords) ? rawBook.backendKeywords : [],
  };
  const campaignGoal = req.body?.campaignGoal;
  const targetAudience = req.body?.targetAudience;

  if (ai && isRealApiKey) {
    try {
      const prompt = `You are a master Amazon A+ Content Designer and High-Converting Book Copywriter.
Create an exceptional, 100% Amazon-TOS-compliant A+ Content Campaign for this book.

Book Title: ${book.title}
Subtitle: ${book.subtitle}
Genre: ${book.primaryGenre}
Tropes/Themes: ${book.subgenreTropes}
Author: ${book.authorName}
Target Audience: ${targetAudience || 'Avid genre readers'}
Campaign Goal: ${campaignGoal || 'Boost detail page conversion & highlight story hooks'}
Blurb:
${book.blurb}

CRITICAL AMAZON A+ COMPLIANCE RULES:
- NO pricing, NO "free", NO "discount", NO "#1 bestseller", NO "bestselling author" claims.
- NO external URLs (.com, www) or social handles (@instagram, tiktok).
- NO emojis or excessive exclamation marks.
- NO customer review quotes or star ratings. Use author praise or editorial hooks only.
- Module dimensions MUST match exact Amazon specs:
  1. 'header-image-text' (970 x 600 px or 970 x 300 px)
  2. 'three-image-text' (3 cards, each 300 x 300 px)
  3. 'single-image-highlights' (300 x 300 px image + 4 key hook bullets)
  4. 'comparison-table' (4 book/character cards, each 150 x 300 px + 3 feature comparison rows) OR 'four-image-text' (4 cards, each 220 x 220 px)
  5. 'company-logo' (600 x 180 px author brand/series logo banner)

For each module:
- Provide punchy, irresistible headline and copy.
- Provide a detailed visual prompt ('imagePrompt') that the author can copy into Midjourney/Canva or graphic software to generate the exact artwork.`;

      const response = await callWithTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an expert Amazon book merchandising designer. Output strictly JSON adhering to Amazon A+ Content specifications.',
            responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              bookTitle: { type: Type.STRING },
              campaignTitle: { type: Type.STRING },
              campaignTheme: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              modules: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING },
                    moduleName: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    subhead: { type: Type.STRING },
                    bodyText: { type: Type.STRING },
                    dimensions: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING },
                    imageUrl: { type: Type.STRING },
                    bulletPoints: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    items: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING },
                          subtitle: { type: Type.STRING },
                          text: { type: Type.STRING },
                          imagePrompt: { type: Type.STRING },
                          imageUrl: { type: Type.STRING },
                        },
                        required: ['id', 'title', 'text', 'imagePrompt'],
                      },
                    },
                    tableColumns: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          subtitle: { type: Type.STRING },
                          isCurrentBook: { type: Type.BOOLEAN },
                          imagePrompt: { type: Type.STRING },
                        },
                        required: ['title'],
                      },
                    },
                    tableRows: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          featureName: { type: Type.STRING },
                          values: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                          },
                        },
                        required: ['featureName', 'values'],
                      },
                    },
                  },
                  required: ['id', 'type', 'moduleName', 'headline', 'dimensions', 'imagePrompt'],
                },
              },
            },
            required: ['id', 'bookTitle', 'campaignTitle', 'campaignTheme', 'targetAudience', 'modules'],
          },
        },
      })
    );

      const parsed: APlusCampaign = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini A+ campaign generation failed, using rich template:', err?.message || err);
    }
  }

  // High-fidelity fallback A+ campaign
  const campaign: APlusCampaign = {
    id: 'camp-' + Date.now(),
    bookTitle: book.title,
    campaignTitle: `${book.title} - High Conversion Launch Stack`,
    campaignTheme: `${book.primaryGenre} Showcase & Reader Hook`,
    targetAudience: `Readers of ${book.primaryGenre} & ${book.subgenreTropes}`,
    modules: [
      {
        id: 'mod-1',
        type: 'header-image-text',
        moduleName: 'Standard Header with Text',
        headline: `Step Into the World of ${book.title}`,
        subhead: 'An Unforgettable Journey of High Stakes, Passion, and Intrigue',
        bodyText: book.blurb.slice(0, 260) + '...',
        dimensions: '970 x 600 px',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
        imagePrompt: `Cinematic wide horizontal book banner for "${book.title}". Moody atmospheric lighting, antique textures, elegant golden typography, evocative of ${book.primaryGenre} and ${book.subgenreTropes}. Dimensions: 970 x 600 px, high resolution, hyper-detailed.`
      },
      {
        id: 'mod-2',
        type: 'three-image-text',
        moduleName: 'Standard 3 Images & Text (Character / Core Themes)',
        headline: 'Key Pillars of the Story',
        dimensions: '300 x 300 px (3 Cards)',
        imagePrompt: 'Set of 3 cohesive square character or thematic portrait illustrations, dramatic lighting, fantasy/romance book art style. 300x300 px each.',
        items: [
          {
            id: 'item-1',
            title: 'The Reluctant Hero',
            subtitle: 'Driven by Honor & Duty',
            text: 'Bound by ancient oaths, facing impossible choices where loyalty demands the ultimate sacrifice.',
            imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            imagePrompt: 'Square portrait of intense character, dark leather armor or trench coat, subtle magical embers, cinematic lighting. 300 x 300 px.'
          },
          {
            id: 'item-2',
            title: 'Forbidden Alliances',
            subtitle: 'Enemies Forced Together',
            text: 'When survival is on the line, mortal rivals must forge a precarious truce in the shadows.',
            imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            imagePrompt: 'Two contrasting silhouettes standing back to back, illuminated by neon twilight or moonlight, high tension, 300 x 300 px.'
          },
          {
            id: 'item-3',
            title: 'Secrets in the Shadows',
            subtitle: 'Nothing is as it Seems',
            text: 'Every unlocked door exposes a deeper conspiracy that could bring down an entire empire.',
            imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            imagePrompt: 'Ancient sealed grimoire or glowing holographic datapad surrounded by mysterious artifacts, 300 x 300 px.'
          }
        ]
      },
      {
        id: 'mod-3',
        type: 'single-image-highlights',
        moduleName: 'Standard Single Image & Highlights',
        headline: "Why Readers Can't Put This Book Down",
        subhead: 'Crafted for Binge-Reading Enthusiasts',
        dimensions: '300 x 300 px',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
        imagePrompt: `Artistic 3D book cover mockup of "${book.title}" lying on weathered oak table beside a steaming mug of tea and candle. 300 x 300 px.`,
        bulletPoints: [
          'High-stakes narrative pacing designed to keep you turning pages late into the night.',
          'Complex, morally grey characters with distinct voices and compelling motives.',
          'Rich, immersive world-building backed by deep lore and unpredictable twists.',
          'Complete standalone experience or explosive entry point to an epic saga.'
        ]
      },
      {
        id: 'mod-4',
        type: 'comparison-table',
        moduleName: 'Standard Comparison Table (Series & Reading Guide)',
        headline: 'Explore the Universe',
        dimensions: '150 x 300 px per column',
        imagePrompt: 'Series reading comparison chart with 4 book spine covers, 150x300 px each, consistent branding.',
        tableColumns: [
          { title: book.title, subtitle: 'Book 1', isCurrentBook: true, imagePrompt: 'Book 1 cover art mockup 150x300 px' },
          { title: 'The Silver Dominion', subtitle: 'Book 2', isCurrentBook: false, imagePrompt: 'Book 2 cover art mockup 150x300 px' },
          { title: 'Crown of Embers', subtitle: 'Book 3', isCurrentBook: false, imagePrompt: 'Book 3 cover art mockup 150x300 px' },
          { title: 'Echoes of the Fall', subtitle: 'Prequel Novella', isCurrentBook: false, imagePrompt: 'Novella cover art mockup 150x300 px' }
        ],
        tableRows: [
          { featureName: 'POV Structure', values: ['Dual POV', 'Multi-POV', 'Multi-POV', 'Single POV'] },
          { featureName: 'Trope Core', values: ['Enemies to Lovers', 'Political Intrigue', 'War of Kings', 'Origin Legend'] },
          { featureName: 'Story Length', values: ['380 Pages', '420 Pages', '490 Pages', '160 Pages'] },
          { featureName: 'Audiobook Available', values: ['Yes', 'Yes', 'In Production', 'Yes'] }
        ]
      }
    ]
  };

  res.json(campaign);
});

// API: Check A+ Content Compliance
app.post('/api/check-compliance', async (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Text string is required.' });
  }

  // Run local heuristic scanner
  const localScan = scanAPlusCompliance(text);

  // If Gemini is available with real key, supplement with contextual AI verification
  if (ai && isRealApiKey && text.length > 20) {
    try {
      const prompt = `Perform an official Amazon KDP A+ Content Guidelines moderation scan on this proposed text:

TEXT TO SCAN:
"""
${text}
"""

Check for:
1. Bestseller, rank, or award claims (#1, bestseller, award-winning without verified accredited details).
2. Pricing, sales, free bonuses, or money-back guarantees.
3. External URLs, domains (.com, www), or social media handles (@).
4. Customer review quotes, star ratings (5 stars, ★★★★★).
5. Time-sensitive claims ("new release", "coming soon", "limited time").
6. Emojis, all-caps yelling, or repetitive punctuation.

Return:
- score (0 to 100)
- status ("COMPLIANT" | "WARNINGS" | "CRITICAL_RISK")
- violations: list of { id, rule, severity ("critical" | "warning"), textMatch, explanation, suggestedFix }
- summary
- autoFixedText: A fully compliant, elegant rewrite that retains 100% of sales persuasive power while eliminating all Amazon rejection triggers!`;

      const response = await callWithTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an Amazon KDP Compliance Inspector. Output strictly JSON matching the response schema.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                status: { type: Type.STRING },
                summary: { type: Type.STRING },
                violations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      rule: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      textMatch: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      suggestedFix: { type: Type.STRING },
                    },
                    required: ['id', 'rule', 'severity', 'textMatch', 'explanation', 'suggestedFix'],
                  },
                },
                autoFixedText: { type: Type.STRING },
              },
              required: ['score', 'status', 'summary', 'violations', 'autoFixedText'],
            },
          },
        })
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini compliance check fallback triggered:', err?.message || err);
    }
  }

  // Include auto-fixed text in fallback
  const autoFixed = autoSanitizeAPlusText(text);
  res.json({
    ...localScan,
    autoFixedText: autoFixed
  });
});

// API: Auto-Fix Compliance
app.post('/api/auto-fix-compliance', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.json({ fixedText: '' });
  }

  if (ai && isRealApiKey) {
    try {
      const response = await callWithTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Rewrite this Amazon KDP A+ Content text so that it 100% complies with Amazon's strict A+ Content guidelines.
- Remove all words like "bestseller", "#1", "free", "cheap", "guarantee", "discount", "pre-order", "new release".
- Remove all emojis, repetitive punctuation, all-caps words, and URL/social handles.
- Transform customer reviews into professional editorial hooks.
- Keep the writing persuasive, atmospheric, and punchy.
- Return ONLY the cleaned text.

Original text:
${text}`,
        })
      );

      return res.json({ fixedText: response.text?.trim() || autoSanitizeAPlusText(text) });
    } catch (err: any) {
      console.warn('Gemini auto-fix fallback triggered:', err?.message || err);
    }
  }

  res.json({ fixedText: autoSanitizeAPlusText(text) });
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KDP Mastermind Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
