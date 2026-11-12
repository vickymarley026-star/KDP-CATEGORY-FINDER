import { AmazonBrowseNode } from '../types/kdp';

export const AMAZON_BROWSE_NODES: AmazonBrowseNode[] = [
  // Romance & Subgenres
  {
    id: 'rom-holiday-novella',
    department: 'Kindle eBooks',
    genre: 'Romance',
    fullPath: 'Kindle Store > Kindle eBooks > Romance > Holiday',
    difficulty: 'Low',
    estBSRTop1: 18500,
    estSalesPerDay: 8,
    notes: 'Seasonal spike in Q4. Very attainable bestseller ribbon outside holiday months.'
  },
  {
    id: 'rom-paranormal-ghosts',
    department: 'Kindle eBooks',
    genre: 'Romance',
    fullPath: 'Kindle Store > Kindle eBooks > Romance > Paranormal > Ghosts',
    difficulty: 'Low',
    estBSRTop1: 22000,
    estSalesPerDay: 6,
    notes: 'Micro-niche with loyal Kindle Unlimited readers. Great for cozy or dark ghost romances.'
  },
  {
    id: 'rom-western-clean',
    department: 'Kindle eBooks',
    genre: 'Romance',
    fullPath: 'Kindle Store > Kindle eBooks > Romance > Westerns > Clean & Wholesome',
    difficulty: 'Moderate',
    estBSRTop1: 7200,
    estSalesPerDay: 22,
    notes: 'High-readership audience that values series binge-reading.'
  },
  {
    id: 'rom-dark-mafia',
    department: 'Kindle eBooks',
    genre: 'Romance',
    fullPath: 'Kindle Store > Kindle eBooks > Romance > Romantic Suspense > Mafia & Organized Crime',
    difficulty: 'High',
    estBSRTop1: 1200,
    estSalesPerDay: 130,
    notes: 'Massive organic readership on BookTok. Requires rapid releases or strong newsletter swap.'
  },
  {
    id: 'rom-sports-hockey',
    department: 'Kindle eBooks',
    genre: 'Romance',
    fullPath: 'Kindle Store > Kindle eBooks > Romance > Sports > Hockey',
    difficulty: 'High',
    estBSRTop1: 850,
    estSalesPerDay: 190,
    notes: 'Extremely viral niche. Fast-growing readership with ravenous KU page-reads.'
  },

  // Fantasy & Sci-Fi
  {
    id: 'sci-space-opera-empire',
    department: 'Kindle eBooks',
    genre: 'Science Fiction',
    fullPath: 'Kindle Store > Kindle eBooks > Science Fiction & Fantasy > Science Fiction > Space Opera > Galactic Empire',
    difficulty: 'Moderate',
    estBSRTop1: 8400,
    estSalesPerDay: 19,
    notes: 'Dedicated subgenre. Great for military sci-fi and sweeping interstellar epics.'
  },
  {
    id: 'sci-litrpg-gamelit',
    department: 'Kindle eBooks',
    genre: 'Science Fiction',
    fullPath: 'Kindle Store > Kindle eBooks > Science Fiction & Fantasy > Science Fiction > Cyberpunk & LitRPG',
    difficulty: 'High',
    estBSRTop1: 2100,
    estSalesPerDay: 75,
    notes: 'Passionate fanbase. Audiobooks and print editions also carry high secondary revenue.'
  },
  {
    id: 'fan-urban-shifters',
    department: 'Kindle eBooks',
    genre: 'Fantasy',
    fullPath: 'Kindle Store > Kindle eBooks > Science Fiction & Fantasy > Fantasy > Paranormal & Urban > Werewolves & Shifters',
    difficulty: 'High',
    estBSRTop1: 1800,
    estSalesPerDay: 90,
    notes: 'Consistent bestseller category. Requires clear trope signaling on cover and blurb.'
  },
  {
    id: 'fan-sword-sorcery',
    department: 'Kindle eBooks',
    genre: 'Fantasy',
    fullPath: 'Kindle Store > Kindle eBooks > Science Fiction & Fantasy > Fantasy > Sword & Sorcery',
    difficulty: 'Moderate',
    estBSRTop1: 6500,
    estSalesPerDay: 26,
    notes: 'Classic fantasy tropes. Lower competition than generic Epic Fantasy.'
  },
  {
    id: 'fan-gothic-dark',
    department: 'Kindle eBooks',
    genre: 'Fantasy',
    fullPath: 'Kindle Store > Kindle eBooks > Science Fiction & Fantasy > Fantasy > Dark Fantasy > Gothic',
    difficulty: 'Low',
    estBSRTop1: 16000,
    estSalesPerDay: 10,
    notes: 'Excellent hidden node. High conversion for atmospheric, slow-burn fantasy.'
  },

  // Mystery, Thriller & Suspense
  {
    id: 'mys-cozy-animal',
    department: 'Kindle eBooks',
    genre: 'Mystery',
    fullPath: 'Kindle Store > Kindle eBooks > Mystery, Thriller & Suspense > Mystery > Cozy > Animals',
    difficulty: 'Moderate',
    estBSRTop1: 5400,
    estSalesPerDay: 32,
    notes: 'One of the most rabid reader bases on Amazon. Cat and dog sleuths perform exceptionally.'
  },
  {
    id: 'mys-cozy-culinary',
    department: 'Kindle eBooks',
    genre: 'Mystery',
    fullPath: 'Kindle Store > Kindle eBooks > Mystery, Thriller & Suspense > Mystery > Cozy > Culinary',
    difficulty: 'Low',
    estBSRTop1: 14000,
    estSalesPerDay: 12,
    notes: 'Include recipes in back matter and A+ content to dramatically increase review sentiment.'
  },
  {
    id: 'thr-financial-legal',
    department: 'Kindle eBooks',
    genre: 'Thriller',
    fullPath: 'Kindle Store > Kindle eBooks > Mystery, Thriller & Suspense > Thrillers > Financial',
    difficulty: 'Very Low',
    estBSRTop1: 34000,
    estSalesPerDay: 4,
    notes: 'Hidden gem! Only 3 to 5 sales per day can capture the #1 Best Seller badge.'
  },
  {
    id: 'thr-psychological-domestic',
    department: 'Kindle eBooks',
    genre: 'Thriller',
    fullPath: 'Kindle Store > Kindle eBooks > Mystery, Thriller & Suspense > Thrillers > Psychological',
    difficulty: 'Ultra High',
    estBSRTop1: 450,
    estSalesPerDay: 380,
    notes: 'Dominated by major trad publishers (Freida McFadden, Gillian Flynn). Target sub-nodes instead.'
  },

  // Non-Fiction / Self-Help / Business
  {
    id: 'self-habit-focus',
    department: 'Kindle eBooks',
    genre: 'Self-Help',
    fullPath: 'Kindle Store > Kindle eBooks > Self-Help > Personal Transformation > Habits & Self-Discipline',
    difficulty: 'High',
    estBSRTop1: 1900,
    estSalesPerDay: 85,
    notes: 'Huge evergreen demand. Visual A+ content showing step-by-step frameworks is vital.'
  },
  {
    id: 'self-mindfulness-journaling',
    department: 'Kindle eBooks',
    genre: 'Self-Help',
    fullPath: 'Kindle Store > Kindle eBooks > Self-Help > Creativity > Journaling & Guided Prompts',
    difficulty: 'Low',
    estBSRTop1: 19500,
    estSalesPerDay: 7,
    notes: 'High conversion for paperbacks, workbooks, and spiral/hardcover editions.'
  },
  {
    id: 'bus-freelance-solopreneur',
    department: 'Kindle eBooks',
    genre: 'Business',
    fullPath: 'Kindle Store > Kindle eBooks > Business & Money > Entrepreneurship > Home-Based & Solopreneurship',
    difficulty: 'Low',
    estBSRTop1: 16500,
    estSalesPerDay: 9,
    notes: 'Attainable #1 rank. Readers search for actionable toolkits and templates.'
  },
  {
    id: 'bus-time-management',
    department: 'Kindle eBooks',
    genre: 'Business',
    fullPath: 'Kindle Store > Kindle eBooks > Business & Money > Management & Leadership > Time Management',
    difficulty: 'Moderate',
    estBSRTop1: 4800,
    estSalesPerDay: 36,
    notes: 'Strong overlap between Self-Help and Business. Compare your framework to Eisenhower Matrix.'
  },
  {
    id: 'health-adhd-neurodiversity',
    department: 'Kindle eBooks',
    genre: 'Health & Wellness',
    fullPath: 'Kindle Store > Kindle eBooks > Health, Fitness & Dieting > Mental Health > Attention Deficit Disorder',
    difficulty: 'Moderate',
    estBSRTop1: 6200,
    estSalesPerDay: 28,
    notes: 'Booming category on TikTok and Pinterest. High paperback purchase rate.'
  },

  // Children's & Young Adult
  {
    id: 'kid-social-emotional',
    department: 'Books (Print)',
    genre: "Children's",
    fullPath: "Books > Children's Books > Growing Up & Facts of Life > Friendship, Social Skills & School Life > Emotions & Feelings",
    difficulty: 'Moderate',
    estBSRTop1: 3900,
    estSalesPerDay: 44,
    notes: 'A+ Content is mandatory here: parents and teachers buy based on inside-page illustrations.'
  },
  {
    id: 'kid-early-readers-animals',
    department: 'Books (Print)',
    genre: "Children's",
    fullPath: "Books > Children's Books > Animals > Bears",
    difficulty: 'Very Low',
    estBSRTop1: 28000,
    estSalesPerDay: 5,
    notes: 'Extremely specific animal categories allow indie authors to earn #1 ribbon with 5 sales/day.'
  },
  {
    id: 'ya-dystopian-survival',
    department: 'Kindle eBooks',
    genre: 'Young Adult',
    fullPath: 'Kindle Store > Kindle eBooks > Teen & Young Adult > Science Fiction & Fantasy > Dystopian',
    difficulty: 'High',
    estBSRTop1: 2500,
    estSalesPerDay: 65,
    notes: 'Strong cross-over with New Adult readers. Blurb hooks around high-stakes trials excel.'
  }
];

export const COMMON_CATEGORY_PITFALLS = [
  {
    title: 'The "General / Miscellaneous" Trap',
    description: 'Picking broad top-level categories like "Romance > General" or "Literature & Fiction > Contemporary". You compete against Colleen Hoover and Stephen King where #1 BSR is sub-100.',
    solution: 'Drill down 3 to 4 levels deep into exact micro-genres where you can realistically reach #1 BSR and earn the Amazon Best Seller badge.'
  },
  {
    title: 'Erotica / 18+ Shadow Filter Trigger',
    description: 'Using keywords like "erotic", "taboo", "steamy sex", or selecting adult categories accidentally. Amazon strips the book from search suggestions, hides it behind adult filters, and removes advertising eligibility.',
    solution: 'Use subgenre tropes ("Dark Romance", "Enemies to Lovers", "Slow Burn") instead of explicit anatomy or 18+ explicit keywords in backend metadata.'
  },
  {
    title: 'Mismatch Between Kindle & Paperback Nodes',
    description: 'Kindle eBook categories do not mirror Amazon Print (Paperback/Hardcover) categories 1-to-1. Authors often assume one setting fixes both.',
    solution: 'Verify categories independently for both your Kindle edition and Print edition in KDP Bookshelf.'
  },
  {
    title: 'Missing Out on Ghost / Request-Only Categories',
    description: 'Amazon has over 10,000 browse nodes, but only a subset appear in the KDP Bookshelf dropdown. Authors leave huge sales on the table by not requesting specific hidden nodes via KDP Support.',
    solution: 'Use our 1-click KDP Support ticket to formally request up to 3 exact category browse node paths.'
  }
];

export const A_PLUS_RESTRICTIONS = [
  {
    rule: 'No Pricing, Promotional Claims, or Discounts',
    forbiddenWords: ['free', 'cheap', 'discount', 'save', 'affordable', 'sale', 'bonus gift', 'money-back guarantee'],
    explanation: 'Amazon prohibits references to price, value, or off-Amazon promotions inside A+ Content.',
    tip: 'Highlight content value (e.g., "Includes 50+ guided exercises", "Features 12 full-color maps").'
  },
  {
    rule: 'No Unsubstantiated Bestseller / Ranking Claims',
    forbiddenWords: ['#1 bestseller', 'bestselling author', 'top rated book', 'award winning', 'famous author'],
    explanation: 'Amazon strictly rejects claims of being "#1", "bestseller", or "award-winning" unless the exact verified award name and award year are included (e.g. "Hugo Award Winner 2023").',
    tip: 'Use reader-focused editorial copy (e.g., "Beloved by over 10,000 readers", "A sweeping romantic adventure").'
  },
  {
    rule: 'No External Contact, URLs, or Social Media',
    forbiddenWords: ['www.', '.com', '.org', '@', 'instagram', 'tiktok', 'facebook', 'twitter', 'substack', 'visit my website', 'newsletter sign-up'],
    explanation: 'Amazon keeps customers within the Amazon ecosystem. All web addresses, emails, and social handles cause immediate automated rejection.',
    tip: 'Direct reader interest to the book series, author bio, or your other titles on Amazon.'
  },
  {
    rule: 'No Customer Review Quotes / Star Ratings',
    forbiddenWords: ['5 stars', '5-star review', 'amazon reviewer says', 'readers are saying', 'customer review', '★★★★★'],
    explanation: 'You cannot quote unverified customer reviews or mention 5-star ratings in A+ content. You may only quote recognized publications or verified public figures with attribution.',
    tip: 'Attribute quotes to named authors or recognized book blogs (e.g., "— Jane Doe, author of The Silent Woods").'
  },
  {
    rule: 'No Time-Sensitive Statements',
    forbiddenWords: ['new release', 'coming soon', 'pre-order now', 'recently published', 'out now in 2024'],
    explanation: 'A+ content is permanent. Claims like "brand new release" or "pre-order" will outdate the listing and are rejected.',
    tip: 'Use timeless hooks (e.g., "The gripping first installment in the Starfall series").'
  },
  {
    rule: 'No Disallowed Formatting or Emojis',
    forbiddenWords: ['🔥', '⭐', '❤️', '✨', '🚨', '💥', '!!!', 'ALL CAPS SHOUTING'],
    explanation: 'Amazon rejection bots flag emojis, non-standard symbols, and blocks of capital letters.',
    tip: 'Keep typography clean and professional. Let visual graphics convey emotion.'
  }
];
