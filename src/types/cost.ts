// Raw D1 row types

export interface ProjectRow {
  id: number;
  name: string;
}

export interface CostRecordRow {
  id: number;
  project_id: number;
  issue_number: number | null;
  model: string | null;
  provider: string | null;
  amount_usd: number;
  created_at: string;
}

export interface TokenUsageRow {
  id: number;
  cost_record_id: number;
  token_type: string;
  count: number;
}

// Aggregated view types

export interface TokenUsageSummary {
  tokenType: string;
  count: number;
}

export interface IssueCostDetail {
  issueNumber: number | null;
  totalCost: number;
  tokenUsage: TokenUsageSummary[];
}

export interface ModelProviderBreakdown {
  model: string | null;
  provider: string | null;
  totalCost: number;
}

export interface ProjectCostSummary {
  id: number;
  name: string;
  totalCost: number;
  modelProviderBreakdown: ModelProviderBreakdown[];
  issueCostDetails: IssueCostDetail[];
}
