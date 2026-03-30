'use client';

import { useState } from 'react';
import type { ModelProviderBreakdown, IssueCostDetail } from '@/types/cost';

interface ProjectCostCardProps {
  name: string;
  totalCost: number;
  modelProviderBreakdown: ModelProviderBreakdown[];
  issueCostDetails: IssueCostDetail[];
}

function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export default function ProjectCostCard({
  name,
  totalCost,
  modelProviderBreakdown,
  issueCostDetails,
}: ProjectCostCardProps) {
  const [showModels, setShowModels] = useState(false);
  const [showIssues, setShowIssues] = useState(false);

  return (
    <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <span className="text-xl font-bold text-[var(--accent)]">{formatUsd(totalCost)}</span>
      </div>

      {/* Cost by Model & Provider */}
      <div className="mb-3">
        <button
          onClick={() => setShowModels((v) => !v)}
          className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <span>{showModels ? '▾' : '▸'}</span>
          Cost by Model &amp; Provider
        </button>
        {showModels && (
          <div className="mt-2 overflow-x-auto">
            {modelProviderBreakdown.length === 0 ? (
              <p className="text-sm text-[var(--muted)] pl-4">No records</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
                    <th className="pb-1 pr-4 font-medium">Model</th>
                    <th className="pb-1 pr-4 font-medium">Provider</th>
                    <th className="pb-1 font-medium text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {modelProviderBreakdown.map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-1 pr-4">{row.model ?? '—'}</td>
                      <td className="py-1 pr-4">{row.provider ?? '—'}</td>
                      <td className="py-1 text-right">{formatUsd(row.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Cost by Issue */}
      <div>
        <button
          onClick={() => setShowIssues((v) => !v)}
          className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <span>{showIssues ? '▾' : '▸'}</span>
          Cost by Issue
        </button>
        {showIssues && (
          <div className="mt-2 space-y-3">
            {issueCostDetails.length === 0 ? (
              <p className="text-sm text-[var(--muted)] pl-4">No records</p>
            ) : (
              issueCostDetails.map((issue, i) => (
                <div key={i} className="pl-4 border-l-2 border-[var(--border)]">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>
                      {issue.issueNumber != null ? `#${issue.issueNumber}` : 'No issue'}
                    </span>
                    <span>{formatUsd(issue.totalCost)}</span>
                  </div>
                  {issue.tokenUsage.length > 0 && (
                    <table className="mt-1 w-full text-xs border-collapse">
                      <thead>
                        <tr className="text-left text-[var(--muted)]">
                          <th className="pb-0.5 pr-4 font-medium">Token type</th>
                          <th className="pb-0.5 font-medium text-right">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issue.tokenUsage.map((t, j) => (
                          <tr key={j}>
                            <td className="pr-4 text-[var(--muted)]">{t.tokenType}</td>
                            <td className="text-right text-[var(--muted)]">
                              {t.count.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
