import { Research } from "@/types/research";
import { Gauge, Clock, Calendar } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface Props {
  research: Research;
}

const confidenceColor = (score: number) => {
  if (score >= 7) return "text-emerald-400 bg-emerald-500/10";
  if (score >= 4) return "text-amber-400 bg-amber-500/10";
  return "text-red-400 bg-red-500/10";
};

const formatRuntime = (seconds: number) => {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

const MetadataPanel = ({ research }: Props) => {
  const items = [
    {
      icon: Gauge,
      label: "Confidence",
      value: `${research.confidence.toFixed(1)}/10`,
      color: confidenceColor(research.confidence),
    },
    {
      icon: Clock,
      label: "Runtime",
      value: formatRuntime(research.runtime),
      color: "text-zinc-300 bg-zinc-800",
    },
    {
      icon: Calendar,
      label: "Generated",
      value: new Date(research.updatedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      color: "text-zinc-300 bg-zinc-800",
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">Status</span>
        <StatusBadge status={research.status} />
      </div>

      {items.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">{label}</span>
          <span className={`flex items-center gap-1.5 text-sm font-medium px-2 py-1 rounded-md ${color}`}>
            <Icon size={13} />
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MetadataPanel;