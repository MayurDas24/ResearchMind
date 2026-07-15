import { FileDown, FileText, Printer } from "lucide-react";
import { exportAsMarkdown, exportAsText, printReport } from "@/lib/exportReport";
import { useToast } from "@/context/ToastContext";

interface Props {
  topic: string;
  content: string;
}

const ExportButtons = ({ topic, content }: Props) => {
  const { showToast } = useToast();

  const handleMarkdown = () => {
    exportAsMarkdown(topic, content);
    showToast("Downloaded as Markdown", "success");
  };

  const handleText = () => {
    exportAsText(topic, content);
    showToast("Downloaded as TXT", "success");
  };

  const handlePrint = () => {
    printReport();
  };

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button
        onClick={handleMarkdown}
        className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        <FileDown size={14} />
        Markdown
      </button>
      <button
        onClick={handleText}
        className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        <FileText size={14} />
        TXT
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        <Printer size={14} />
        Print / PDF
      </button>
    </div>
  );
};

export default ExportButtons;