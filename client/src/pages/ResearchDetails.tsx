//client/src/pages/ResearchDetails.tsx
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import ExportButtons from "@/components/report/ExportButtons";
import { useResearchDetail } from "@/hooks/useResearchDetail";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressTimeline from "@/components/research/ProgressTimeline";
import ReportRenderer from "@/components/report/ReportRenderer";
import TableOfContents from "@/components/report/TableOfContents";
import MetadataPanel from "@/components/report/MetadataPanel";
import { extractHeadings } from "@/lib/markdown";

const ResearchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: research, isLoading, isError } = useResearchDetail(id);

  const headings = useMemo(() => {
    if (!research?.report) return [];
    return extractHeadings(research.report);
  }, [research]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-zinc-400">
        <Loader2 size={18} className="animate-spin" />
        Loading research...
      </div>
    );
  }

  if (isError || !research) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <p className="text-red-400 font-medium">Research not found</p>
        <button
          onClick={() => navigate("/history")}
          className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700 transition-colors"
        >
          Back to History
        </button>
      </div>
    );
  }

  const isCompleted = research.status === "completed" && !!research.report;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{research.topic}</h1>
        {!isCompleted && <StatusBadge status={research.status} />}
      </div>

      <p className="text-sm text-zinc-500 mt-2">
        Started {new Date(research.createdAt).toLocaleString("en-IN")}
      </p>

      {!isCompleted && (
        <div className="mt-8 max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Progress</h2>
          <ProgressTimeline status={research.status} />
        </div>
      )}

      {isCompleted && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
          <div className="min-w-0">
            <div className="mb-6">
              <ExportButtons topic={research.topic} content={research.report} />
            </div>

            <ReportRenderer content={research.report} />
          </div>

          <div className="space-y-4">
            <MetadataPanel research={research} />
            <TableOfContents items={headings} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchDetails;