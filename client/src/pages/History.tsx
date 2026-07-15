import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History as HistoryIcon, Loader2 } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { useResearchList } from "@/hooks/useResearch";
import { useDeleteResearch } from "@/hooks/useDeleteResearch";
import { ResearchStatus } from "@/types/research";
import { useToast } from "@/context/ToastContext";

import SearchBar from "@/components/research/SearchBar";
import ResearchCard from "@/components/research/ResearchCard";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const STATUS_FILTERS: { label: string; value: ResearchStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "In Progress", value: "searching" },
  { label: "Failed", value: "failed" },
];

const History = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ResearchStatus | "all">("all");
  const [pendingDelete, setPendingDelete] = useState<{ id: string; topic: string } | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: research, isLoading, isError, refetch } = useResearchList();
  const deleteMutation = useDeleteResearch();

  const filtered = useMemo(() => {
    if (!research) return [];

    return research.filter((r) => {
      const matchesSearch = r.topic.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "searching"
          ? !["completed", "failed"].includes(r.status)
          : r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [research, search, statusFilter]);

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => showToast("Research deleted", "success"),
      onError: () => showToast("Failed to delete research", "error"),
    });

    setPendingDelete(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Research History</h1>
      <p className="mt-2 text-zinc-400">All your past and ongoing research.</p>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === f.value
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-400 font-medium">Failed to load research history</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            icon={HistoryIcon}
            title={search || statusFilter !== "all" ? "No matching research found" : "No research yet"}
            description={
              search || statusFilter !== "all"
                ? "Try adjusting your search or filter."
                : "Start your first research from the New Research page."
            }
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <ResearchCard
                key={r._id}
                research={r}
                onClick={() => navigate(`/research/${r._id}`)}
                onDelete={() => setPendingDelete({ id: r._id, topic: r.topic })}
              />
            ))}
          </div>
        )}

        {deleteMutation.isPending && (
          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-4">
            <Loader2 size={14} className="animate-spin" />
            Deleting...
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this research?"
        description={pendingDelete ? `"${pendingDelete.topic}" will be permanently deleted. This cannot be undone.` : ""}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default History;