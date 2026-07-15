import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const HeroEmptyState = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 p-10 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
        <Sparkles size={26} />
      </div>

      <h2 className="text-2xl font-bold mt-5">Start your first research</h2>
      <p className="text-zinc-400 mt-2 max-w-md mx-auto">
        Give ResearchMind a topic and its multi-agent pipeline will search the web,
        read sources, and write a fully cited report for you — in under a minute.
      </p>

      <button
        onClick={() => navigate("/research")}
        className="mt-6 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        Start Research
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
};

export default HeroEmptyState;