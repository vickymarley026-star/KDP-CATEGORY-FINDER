import { ComplianceViolation, ComplianceScanResult, CategoryAuditResult, BookInput } from '../types/kdp';
import { AMAZON_BROWSE_NODES } from '../data/categoriesDb';

// Amazon A+ Content Forbidden Patterns
const FORBIDDEN_PATTERNS: Array<{
  regex: RegExp;
  rule: string;
  severity: 'critical' | 'warning';
  explanation: string;
  suggestedFix: string;
}> = [
  {
    regex: /\b(bestseller|best seller|#1 seller|top seller|bestselling)\b/i,
    rule: 'Unsubstantiated Bestseller Claims',
    severity: 'critical',
    explanation: 'Amazon prohibits unverified bestseller claims (#1, bestseller) inside A+ Content as they violate permanent listing guidelines.',
    suggestedFix: 'Replace with reader-focused acclaim, e.g. "Critically acclaimed romantic suspense" or "Loved by thousands of readers".'
  },
  {
    regex: /\b(free|discount|sale|save \$\d+|cheap|money-back|guarantee|warranty|refund)\b/i,
    rule: 'Pricing & Promotional Claims',
    severity: 'critical',
    explanation: 'A+ Content must never mention price, discounts, free bonuses, or money-back guarantees.',
    suggestedFix: 'Focus purely on story or educational benefits (e.g. "Includes bonus companion reader guide").'
  },
  {
    regex: /\b(https?:\/\/|[a-z0-9_-]+\.(com|org|net|io|co|us|uk|ca)|www\.)/i,
    rule: 'External URLs / Web Addresses',
    severity: 'critical',
    explanation: 'Amazon strictly rejects all external links, website domains, and off-site URLs.',
    suggestedFix: 'Remove all domain names. Reference your author bio or catalog on Amazon.'
  },
  {
    regex: /(@[a-zA-Z0-9_]+|instagram|tiktok|facebook|twitter|threads|youtube|substack)/i,
    rule: 'Social Media Handles & Platform Mentions',
    severity: 'critical',
    explanation: 'Mentioning social platforms or @handles triggers instant bot rejection.',
    suggestedFix: 'Refer to your readership generally: "Connect with the author\'s reader community".'
  },
  {
    regex: /\b(5[- ]star|five[- ]star|★★★★★|customer review|amazon reviewer)\b/i,
    rule: 'Customer Review Citations & Star Ratings',
    severity: 'critical',
    explanation: 'You cannot cite customer reviews or star ratings. Only accredited editorial reviews from known publications or authors are permitted.',
    suggestedFix: 'Use editorial quotes with named authors (e.g., "— Sarah J. Maas, Author").'
  },
  {
    regex: /\b(new release|coming soon|pre-?order|out now in 202[0-9]|limited time)\b/i,
    rule: 'Time-Sensitive Claims',
    severity: 'warning',
    explanation: 'Time-sensitive statements (e.g. "Coming soon", "New release") become stale and cause rejection.',
    suggestedFix: 'Use evergreen phrasing: "The thrilling kickoff to the trilogy".'
  },
  {
    regex: /([🔥⭐❤️✨🚨💥🎉📚👑⚡💎]{1,})/u,
    rule: 'Emojis and Disallowed Symbols',
    severity: 'warning',
    explanation: 'Amazon\'s A+ moderation bot flags non-standard unicode emojis and ornamental symbols in text.',
    suggestedFix: 'Remove emojis. Use visual layout, bold typography, and images instead.'
  },
  {
    regex: /\b([A-Z]{4,}\s+){2,}[A-Z]{4,}\b/,
    rule: 'Excessive Capitalization (Shouting)',
    severity: 'warning',
    explanation: 'Amazon guidelines prohibit all-caps sentences or shouty headlines in A+ modules.',
    suggestedFix: 'Use Title Case or Sentence case for headings.'
  },
  {
    regex: /(!{2,}|\?{2,})/,
    rule: 'Repetitive Punctuation (!! or ??)',
    severity: 'warning',
    explanation: 'Multiple exclamation points or question marks look spammy and fail Amazon review.',
    suggestedFix: 'Use a single punctuation mark.'
  }
];

export function scanAPlusCompliance(text: string): ComplianceScanResult {
  if (!text || text.trim() === '') {
    return {
      score: 100,
      status: 'COMPLIANT',
      violations: [],
      summary: 'No text provided for analysis.'
    };
  }

  const violations: ComplianceViolation[] = [];

  for (const pattern of FORBIDDEN_PATTERNS) {
    const match = text.match(pattern.regex);
    if (match) {
      violations.push({
        id: Math.random().toString(36).substring(2, 9),
        rule: pattern.rule,
        severity: pattern.severity,
        textMatch: match[0],
        explanation: pattern.explanation,
        suggestedFix: pattern.suggestedFix
      });
    }
  }

  // Calculate score
  let score = 100;
  for (const v of violations) {
    if (v.severity === 'critical') score -= 30;
    if (v.severity === 'warning') score -= 15;
  }
  score = Math.max(0, score);

  const status = score >= 90 ? 'COMPLIANT' : score >= 60 ? 'WARNINGS' : 'CRITICAL_RISK';
  
  let summary = 'Your text passes Amazon A+ Content guidelines with flying colors!';
  if (status === 'WARNINGS') {
    summary = 'Found minor warning triggers that could delay Amazon moderation approval. Review suggestions.';
  } else if (status === 'CRITICAL_RISK') {
    summary = 'High probability of immediate rejection by Amazon\'s automated moderation bots. Fix critical flags.';
  }

  return {
    score,
    status,
    violations,
    summary
  };
}

export function autoSanitizeAPlusText(rawText: string): string {
  let cleaned = rawText;

  // Replacements
  cleaned = cleaned
    .replace(/\b#1\s+bestseller\b/gi, 'critically acclaimed title')
    .replace(/\bbestseller\b/gi, 'fan favorite')
    .replace(/\bbestselling author\b/gi, 'esteemed author')
    .replace(/\b5[- ]star review\b/gi, 'rave reception')
    .replace(/\b★★★★★\b/g, '')
    .replace(/\bfree bonus\b/gi, 'exclusive companion material')
    .replace(/\bfree\b/gi, 'complimentary')
    .replace(/\bdiscount\b/gi, 'special edition')
    .replace(/\bmoney-back guarantee\b/gi, 'quality guaranteed')
    .replace(/\bpre-?order now\b/gi, 'order your copy')
    .replace(/\bnew release\b/gi, 'essential reading')
    .replace(/\bcoming soon\b/gi, 'available now')
    .replace(/@\w+/g, 'our reader group')
    .replace(/https?:\/\/\S+/gi, 'the official author catalog')
    .replace(/[🔥⭐❤️✨🚨💥🎉📚👑⚡💎]/gu, '')
    .replace(/!{2,}/g, '!')
    .replace(/\?{2,}/g, '?');

  return cleaned.trim();
}

/**
 * Calculates estimated daily and monthly sales from an Amazon BSR (Best Seller Rank)
 * Uses standard industry empirical regression curves for Amazon Books & Kindle Store
 */
export function calculateSalesFromBSR(bsr: number): {
  dailySales: number;
  monthlySales: number;
  royaltyEstimatePerMonth: number;
  difficultyTier: string;
} {
  const safeBsr = Math.max(1, Math.min(1000000, bsr));
  let daily = 0;

  if (safeBsr <= 5) {
    daily = 4000 - safeBsr * 400;
  } else if (safeBsr <= 50) {
    daily = 1000 - (safeBsr - 5) * 16;
  } else if (safeBsr <= 200) {
    daily = 350 - (safeBsr - 50) * 1.5;
  } else if (safeBsr <= 1000) {
    daily = 150 - (safeBsr - 200) * 0.12;
  } else if (safeBsr <= 5000) {
    daily = 50 - (safeBsr - 1000) * 0.008;
  } else if (safeBsr <= 20000) {
    daily = 18 - (safeBsr - 5000) * 0.0008;
  } else if (safeBsr <= 50000) {
    daily = 6 - (safeBsr - 20000) * 0.00013;
  } else if (safeBsr <= 100000) {
    daily = 2 - (safeBsr - 50000) * 0.00002;
  } else {
    daily = Math.max(0.2, 1 - (safeBsr - 100000) * 0.0000009);
  }

  const roundedDaily = Math.round(daily * 10) / 10;
  const monthly = Math.round(roundedDaily * 30);
  const estimatedRoyalty = Math.round(monthly * 2.80); // Avg $3.99 ebook 70% royalty = $2.80

  let difficultyTier = 'Very Low Competition';
  if (safeBsr < 1000) difficultyTier = 'Ultra Competitive (Major Trad Pubs)';
  else if (safeBsr < 5000) difficultyTier = 'High Competition (Full-time Indie Pro)';
  else if (safeBsr < 25000) difficultyTier = 'Moderate Competition (Healthy Readership)';
  else if (safeBsr < 75000) difficultyTier = 'Low Competition (Easy #1 Target)';

  return {
    dailySales: Math.max(0.5, roundedDaily),
    monthlySales: monthly,
    royaltyEstimatePerMonth: estimatedRoyalty,
    difficultyTier
  };
}

/**
 * Intelligent algorithmic category audit & matching fallback
 */
export function generateHeuristicCategoryAudit(input: BookInput): CategoryAuditResult {
  const genreLower = (input.primaryGenre + ' ' + input.subgenreTropes + ' ' + input.title + ' ' + input.blurb).toLowerCase();

  // Find best matched browse nodes
  const matchedNodes = AMAZON_BROWSE_NODES.filter(node => {
    const nodeText = (node.genre + ' ' + node.fullPath + ' ' + node.notes).toLowerCase();
    const words = input.primaryGenre.toLowerCase().split(' ');
    return words.some(w => w.length > 3 && nodeText.includes(w)) || 
           nodeText.includes(input.primaryGenre.toLowerCase().trim());
  });

  const candidates = matchedNodes.length > 0 ? matchedNodes : AMAZON_BROWSE_NODES;

  // Primary recommendations
  const primaryRecommendations = candidates.slice(0, 3).map((node, idx) => ({
    path: node.fullPath,
    nodeId: node.id,
    competitionLevel: node.difficulty,
    estimatedBSRForTop1: node.estBSRTop1,
    dailySalesNeeded: node.estSalesPerDay,
    relevanceScore: 95 - idx * 4,
    whyRecommended: `Matches your primary genre (${input.primaryGenre}) with ${node.difficulty.toLowerCase()} competition barrier. ${node.notes}`,
    bisacMatch: `${input.primaryGenre.toUpperCase()} / ${node.genre}`
  }));

  // Ghost micro-niches
  const ghostCategories = candidates.slice(3, 6).concat(AMAZON_BROWSE_NODES.slice(0, 3)).slice(0, 3).map(node => ({
    path: node.fullPath,
    estimatedBSRForTop1: node.estBSRTop1,
    dailySalesNeeded: node.estSalesPerDay,
    whyOpportunity: `Hidden micro-node with low sales threshold. You need roughly ~${node.estSalesPerDay} sales/day to reach #1.`,
    howToRequest: 'Submit a category change ticket through KDP Support requesting addition of this exact browse node path.'
  }));

  // Identify issues
  const identifiedIssues = [];
  if (input.currentCategories.length < 3) {
    identifiedIssues.push({
      severity: 'warning' as const,
      title: 'Under-utilized Category Slots (Less than 3 Selected)',
      description: `You only have ${input.currentCategories.length} category active. Amazon now allows up to 3 official categories directly in the KDP Bookshelf.`,
      fixAction: 'Add a 3rd high-relevance niche category to gain extra visibility in Amazon browse nodes.'
    });
  }

  const hasGeneric = input.currentCategories.some(c => c.toLowerCase().includes('general'));
  if (hasGeneric) {
    identifiedIssues.push({
      severity: 'danger' as const,
      title: 'High-Competition "General" Category Trap Detected',
      description: 'One or more of your active categories is a top-level General category where you compete against thousands of established titles.',
      fixAction: 'Swap out "General" for deep subcategories where top rank requires under 25 daily sales.'
    });
  }

  // Check backend keywords for risky keywords
  const keywordAudit = (input.backendKeywords.length > 0 ? input.backendKeywords : [
    'bestselling fiction', 'kindle unlimited romance', 'page turner thriller',
    'must read books', 'free ebooks', 'new release 2024', 'top rated'
  ]).map((kw, i) => {
    const kwLower = kw.toLowerCase();
    if (kwLower.includes('free') || kwLower.includes('bestseller') || kwLower.includes('new release') || kwLower.includes('kindle unlimited')) {
      return {
        original: kw,
        status: 'Risk' as const,
        recommendedKeyword: `${input.primaryGenre.toLowerCase()} ${input.subgenreTropes.split(',')[0] || 'novel'} series`,
        reason: 'Amazon terms of service explicitly ban keywords like "free", "bestseller", or "kindle unlimited" in backend slots. It wastes index capacity.'
      };
    }
    if (kwLower.split(' ').length < 2) {
      return {
        original: kw,
        status: 'Replace' as const,
        recommendedKeyword: `${kw} for readers of ${input.primaryGenre}`,
        reason: 'Single-word keywords are too broad. Use multi-word long-tail reader phrases.'
      };
    }
    return {
      original: kw,
      status: 'Keep' as const,
      recommendedKeyword: kw,
      reason: 'Strong long-tail keyword with clear buyer search intent.'
    };
  });

  // Ticket Generator
  const supportTicket = {
    subject: `KDP Category Update Request - ASIN: ${input.asinOrIsbn || 'Pending'}`,
    body: `Hello KDP Author Support Team,

I would like to update the category assignments for my title to ensure it appears in the most relevant browse nodes for readers.

Title: ${input.title}${input.subtitle ? ': ' + input.subtitle : ''}
Author: ${input.authorName || 'Author'}
ASIN / ISBN: ${input.asinOrIsbn || '[ENTER YOUR ASIN/ISBN HERE]'}
Marketplace: Amazon.com (US)
Format: ${input.format === 'ebook' ? 'Kindle eBook' : input.format === 'paperback' ? 'Paperback' : 'Hardcover'}

Please REMOVE the following outdated / broad categories:
${input.currentCategories.map(c => `- ${c}`).join('\n')}

Please ADD the following 3 targeted categories:
1. ${primaryRecommendations[0]?.path || 'Books > Fiction'}
2. ${primaryRecommendations[1]?.path || 'Books > Genre Fiction'}
3. ${primaryRecommendations[2]?.path || 'Books > Literature'}

Thank you for your assistance with updating my book's catalog placement.

Warm regards,
${input.authorName || 'Author'}`
  };

  return {
    identifiedIssues,
    primaryRecommendations,
    ghostCategories,
    keywordAudit,
    supportTicket,
    summaryVerdict: `Audited ${input.title}: Identified key opportunities to transition from crowded general categories into targeted micro-niches with realistic #1 BSR targets.`
  };
}
