import { FaRobot } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <FaRobot className="text-indigo-500 text-2xl" />
        <div>
          <h1 className="font-bold text-xl text-white">
            ResearchMind AI
          </h1>

          <p className="text-xs text-zinc-400">
            Multi-Agent Research Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">

        <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-white">
          New Research
        </button>

        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          M
        </div>

      </div>
    </header>
  );
};

export default Navbar;