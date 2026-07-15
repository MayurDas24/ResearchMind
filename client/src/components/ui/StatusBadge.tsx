//client/src/components/ui/StatusBadge.tsx
import { ResearchStatus } from "@/types/research";

interface StatusConfigEntry {
  label: string;
  className: string;
}

const statusConfig: Record<ResearchStatus, StatusConfigEntry> = {
  queued: { label: "Queued", className: "bg-zinc-700 text-zinc-200" },
  searching: { label: "Searching", className: "bg-blue-500/20 text-blue-400" },
  reading: { label: "Reading", className: "bg-blue-500/20 text-blue-400" },
  rag: { label: "Retrieving", className: "bg-purple-500/20 text-purple-400" },
  writing: { label: "Writing", className: "bg-amber-500/20 text-amber-400" },
  critic: { label: "Reviewing", className: "bg-amber-500/20 text-amber-400" },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/20 text-emerald-400",
  },
  failed: { label: "Failed", className: "bg-red-500/20 text-red-400" },
};

interface Props {
  status: ResearchStatus;
}

const StatusBadge = ({ status }: Props) => {
  const config = statusConfig[status] ?? statusConfig.queued;

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;