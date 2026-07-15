import { useResearchList } from "@/hooks/useResearch";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentResearchList from "@/components/dashboard/RecentResearchList";
import HeroEmptyState from "@/components/dashboard/HeroEmptyState";
import Skeleton from "@/components/ui/Skeleton";

const Dashboard = () => {
  const { data: research, isLoading, isError, error, refetch } = useResearchList();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="mt-2 text-zinc-400">AI Powered Research Workspace</p>
      </div>

      {isLoading && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-400 font-medium">Failed to load research data</p>
          <p className="text-sm text-zinc-400 mt-1">
            {(error as Error)?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && research && research.length === 0 && (
        <HeroEmptyState />
      )}

      {!isLoading && !isError && research && research.length > 0 && (
        <>
          <StatsCards research={research} />
          <RecentResearchList research={research} />
        </>
      )}
    </div>
  );
};

export default Dashboard;