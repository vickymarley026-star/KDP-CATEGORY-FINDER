export type BookFormat = 'ebook' | 'paperback' | 'hardcover';

export interface BookInput {
  title: string;
  subtitle: string;
  authorName: string;
  asinOrIsbn: string;
  format: BookFormat;
  primaryGenre: string;
  subgenreTropes: string;
  blurb: string;
  currentCategories: string[];
  backendKeywords: string[];
}

export interface CategoryRecommendation {
  path: string;
  nodeId?: string;
  competitionLevel: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Ultra High';
  estimatedBSRForTop1: number;
  dailySalesNeeded: number;
  relevanceScore: number; // 0-100
  whyRecommended: string;
  bisacMatch?: string;
}

export interface GhostCategoryOpportunity {
  path: string;
  estimatedBSRForTop1: number;
  dailySalesNeeded: number;
  whyOpportunity: string;
  howToRequest: string;
}

export interface KeywordAuditItem {
  original: string;
  status: 'Keep' | 'Replace' | 'Risk';
  recommendedKeyword: string;
  reason: string;
}

export interface CategoryAuditResult {
  identifiedIssues: Array<{
    severity: 'danger' | 'warning' | 'info';
    title: string;
    description: string;
    fixAction: string;
  }>;
  primaryRecommendations: CategoryRecommendation[];
  ghostCategories: GhostCategoryOpportunity[];
  keywordAudit: KeywordAuditItem[];
  supportTicket: {
    subject: string;
    body: string;
  };
  summaryVerdict: string;
}

export type APlusModuleType =
  | 'header-image-text'
  | 'three-image-text'
  | 'four-image-text'
  | 'comparison-table'
  | 'single-image-highlights'
  | 'company-logo'
  | 'image-text-overlay';

export interface APlusSubItem {
  id: string;
  title?: string;
  subtitle?: string;
  text?: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface ComparisonColumn {
  title: string;
  subtitle?: string;
  isCurrentBook?: boolean;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface ComparisonRow {
  featureName: string;
  values: string[];
}

export interface APlusModule {
  id: string;
  type: APlusModuleType;
  moduleName: string;
  headline?: string;
  subhead?: string;
  bodyText?: string;
  imageUrl?: string;
  imagePrompt?: string;
  dimensions: string;
  items?: APlusSubItem[];
  tableColumns?: ComparisonColumn[];
  tableRows?: ComparisonRow[];
  bulletPoints?: string[];
}

export interface APlusCampaign {
  id: string;
  bookTitle: string;
  campaignTitle: string;
  campaignTheme: string;
  targetAudience: string;
  modules: APlusModule[];
}

export interface ComplianceViolation {
  id: string;
  rule: string;
  severity: 'critical' | 'warning';
  textMatch: string;
  explanation: string;
  suggestedFix: string;
}

export interface ComplianceScanResult {
  score: number; // 0 to 100
  status: 'COMPLIANT' | 'WARNINGS' | 'CRITICAL_RISK';
  violations: ComplianceViolation[];
  autoFixedText?: string;
  summary: string;
}

export interface AmazonBrowseNode {
  id: string;
  department: 'Kindle eBooks' | 'Books (Print)' | 'Both';
  genre: string;
  fullPath: string;
  difficulty: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Ultra High';
  estBSRTop1: number;
  estSalesPerDay: number;
  notes: string;
}
