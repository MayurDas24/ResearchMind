import { ResearchStatus } from "@/types/research";
import { Check, Loader2 } from "lucide-react";

const STAGES: { key: ResearchStatus; label: string }[] = [
  { key: "queued", label: "Queued" },
  { key: "searching", label: "Searching" },
  { key: "reading", label: "Reading" },
  { key: "rag", label: "Retrieving" },
  { key: "writing", label: "Writing" },
  { key: "critic", label: "Reviewing" },
  { key: "completed", label: "Completed" },
];

interface Props {
  status: ResearchStatus;
}

const ProgressTimeline = ({ status }: Props) => {
  if (status === "failed") {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
        <p className="text-red-400 font-medium">Research failed</p>
        <p className="text-sm text-zinc-400 mt-1">
          Something went wrong while generating this report. You can try creating a new research on the same topic.
        </p>
      </div>
    );
  }

  const currentIndex = STAGES.findIndex((s) => s.key === status);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex flex-col gap-4">
        {STAGES.map((stage, i) => {
          const isDone = i < currentIndex || status === "completed";
          const isActive = i === currentIndex && status !== "completed";

          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isDone
                    ? "bg-emerald-500/20 text-emerald-400"
                    : isActive
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-zinc-800 text-zinc-600"
                }`}
              >
                {isDone ? (
                  <Check size={14} />
                ) : isActive ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <span className="text-xs">{i + 1}</span>
                )}
              </div>
              <span
                className={`text-sm ${
                  isDone || isActive ? "text-white" : "text-zinc-600"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTimeline;