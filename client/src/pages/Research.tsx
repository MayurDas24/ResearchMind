import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, Loader2 } from "lucide-react";
import { useCreateResearch } from "@/hooks/useCreateResearch";
import { useToast } from "@/context/ToastContext";

const Research = () => {
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { mutate, isPending } = useCreateResearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) return;

    mutate(topic.trim(), {
      onSuccess: (data) => {
        showToast("Research started", "success");
        navigate(`/research/${data.researchId}`);
      },
      onError: () => {
        showToast("Failed to start research. Please try again.", "error");
      },
    });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold">Research Workspace</h1>
      <p className="mt-2 text-zinc-400">
        Enter a topic and let the multi-agent pipeline search, read, and write a report for you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Research Topic
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The impact of quantum computing on cryptography"
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || !topic.trim()}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <FlaskConical size={16} />
              Start Research
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Research;