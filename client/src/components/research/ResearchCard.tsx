import { Research } from "@/types/research";
import StatusBadge from "@/components/ui/StatusBadge";
import { Trash2 } from "lucide-react";

interface Props {
  research: Research;
  onClick: () => void;
  onDelete: () => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ResearchCard = ({ research, onClick, onDelete }: Props) => {
  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{research.topic}</h3>
          <p className="text-xs text-zinc-500 mt-1">
            {formatDate(research.createdAt)}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all p-1.5 rounded-md hover:bg-red-500/10 shrink-0"
          aria-label="Delete research"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <StatusBadge status={research.status} />
        {research.status === "completed" && (
          <span className="text-sm text-zinc-400">
            {research.confidence.toFixed(1)}/10
          </span>
        )}
      </div>
    </div>
  );
};

export default ResearchCard;