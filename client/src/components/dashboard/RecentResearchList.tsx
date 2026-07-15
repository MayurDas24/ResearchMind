import { Research } from "@/types/research";
import StatusBadge from "@/components/ui/StatusBadge";
import { FileSearch } from "lucide-react";

interface Props {
  research: Research[];
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

const RecentResearchList = ({ research }: Props) => {
  const recent = [...research]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
        <FileSearch className="mx-auto text-zinc-600" size={36} />
        <p className="mt-3 text-zinc-400">No research yet</p>
        <p className="text-sm text-zinc-500 mt-1">Start a new research to see it appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Recent Research</h2>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800">
        {recent.map((r) => (
          <div key={r._id} className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-900 transition-colors">
            <div className="min-w-0">
              <p className="font-medium truncate">{r.topic}</p>
              <p className="text-xs text-zinc-500 mt-1">{formatDate(r.createdAt)}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {r.status === "completed" && (
                <span className="text-sm text-zinc-400">{r.confidence.toFixed(1)}/10</span>
              )}
              <StatusBadge status={r.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentResearchList;