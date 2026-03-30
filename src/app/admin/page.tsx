import type { Metadata } from 'next';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { auth } from '@/auth';
import { getProjectCostSummaries } from '@/lib/costs';
import ProjectCostCard from '@/components/ProjectCostCard';

export const metadata: Metadata = { title: 'Admin — Cost per Project' };

export default async function AdminPage() {
  const session = await auth();
  const { env } = await getCloudflareContext({ async: true });

  const projects = await getProjectCostSummaries(env.DB);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Cost per Project</h1>
        <span className="text-sm text-[var(--muted)]">{session?.user?.email}</span>
      </div>

      {projects.length === 0 ? (
        <p className="text-[var(--muted)]">No projects found.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCostCard
              key={project.id}
              name={project.name}
              totalCost={project.totalCost}
              modelProviderBreakdown={project.modelProviderBreakdown}
              issueCostDetails={project.issueCostDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
