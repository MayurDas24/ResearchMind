import { Research } from "@/types/research";
import { FlaskConical, CheckCircle2, Loader2, Gauge } from "lucide-react";

interface Props {
  research: Research[];
}

const StatsCards = ({ research }: Props) => {
  const total = research.length;
  const completed = research.filter((r) => r.status === "completed").length;
  const inProgress = research.filter(
    (r) => r.status !== "completed" && r.status !== "failed"
  ).length;

  const scored = research.filter(
    (r) => r.status === "completed" && r.confidence > 0
  );
  const avgConfidence =
    scored.length > 0
      ? (scored.reduce((sum, r) => sum + r.confidence, 0) / scored.length).toFixed(1)
      : "—";

  const cards = [
    {
      label: "Total Research",
      value: total,
      icon: FlaskConical,
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Loader2,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      label: "Avg Confidence",
      value: avgConfidence === "—" ? avgConfidence : `${avgConfidence}/10`,
      icon: Gauge,
      color: "text-purple-400 bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 flex items-center gap-4"
        >
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-zinc-400">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
