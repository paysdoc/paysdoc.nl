import type {
  ProjectRow,
  ModelProviderBreakdown,
  IssueCostDetail,
  TokenUsageSummary,
  ProjectCostSummary,
} from '@/types/cost';

type DB = CloudflareEnv['DB'];

export async function getProjectCostSummaries(db: DB): Promise<ProjectCostSummary[]> {
  const projects = await db
    .prepare('SELECT id, name FROM projects ORDER BY name ASC')
    .all<ProjectRow>();

  const summaries: ProjectCostSummary[] = await Promise.all(
    (projects.results ?? []).map(async (project: ProjectRow) => {
      const [modelBreakdown, issueCosts] = await Promise.all([
        getModelProviderBreakdown(db, project.id),
        getIssueCostDetails(db, project.id),
      ]);

      const totalCost = modelBreakdown.reduce((sum, row) => sum + row.totalCost, 0);

      return {
        id: project.id,
        name: project.name,
        totalCost,
        modelProviderBreakdown: modelBreakdown,
        issueCostDetails: issueCosts,
      };
    })
  );

  return summaries;
}

export async function getModelProviderBreakdown(
  db: DB,
  projectId: number
): Promise<ModelProviderBreakdown[]> {
  const result = await db
    .prepare(
      `SELECT model, provider, SUM(amount_usd) AS total_cost
       FROM cost_records
       WHERE project_id = ?
       GROUP BY model, provider
       ORDER BY total_cost DESC`
    )
    .bind(projectId)
    .all<{ model: string | null; provider: string | null; total_cost: number }>();

  return (result.results ?? []).map((row: { model: string | null; provider: string | null; total_cost: number }) => ({
    model: row.model,
    provider: row.provider,
    totalCost: row.total_cost,
  }));
}

export async function getIssueCostDetails(
  db: DB,
  projectId: number
): Promise<IssueCostDetail[]> {
  const issueResult = await db
    .prepare(
      `SELECT issue_number, SUM(amount_usd) AS total_cost, GROUP_CONCAT(id) AS record_ids
       FROM cost_records
       WHERE project_id = ?
       GROUP BY issue_number
       ORDER BY issue_number ASC`
    )
    .bind(projectId)
    .all<{ issue_number: number | null; total_cost: number; record_ids: string }>();

  const details: IssueCostDetail[] = await Promise.all(
    (issueResult.results ?? []).map(async (row: { issue_number: number | null; total_cost: number; record_ids: string }) => {
      const recordIds = row.record_ids ? row.record_ids.split(',').map(Number) : [];

      let tokenUsage: TokenUsageSummary[] = [];
      if (recordIds.length > 0) {
        const placeholders = recordIds.map(() => '?').join(',');
        const tokenResult = await db
          .prepare(
            `SELECT token_type, SUM(count) AS total_count
             FROM token_usage
             WHERE cost_record_id IN (${placeholders})
             GROUP BY token_type
             ORDER BY token_type ASC`
          )
          .bind(...recordIds)
          .all<{ token_type: string; total_count: number }>();

        tokenUsage = (tokenResult.results ?? []).map((t: { token_type: string; total_count: number }) => ({
          tokenType: t.token_type,
          count: t.total_count,
        }));
      }

      return {
        issueNumber: row.issue_number,
        totalCost: row.total_cost,
        tokenUsage,
      };
    })
  );

  return details;
}
