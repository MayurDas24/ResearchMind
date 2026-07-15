import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, FlaskConical, History as HistoryIcon } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/research", label: "New Research", icon: FlaskConical },
  { to: "/history", label: "History", icon: HistoryIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-60 border-r border-zinc-800 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className="relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-emerald-500/10 rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}

              <span
                className={`relative z-10 flex items-center gap-3 ${
                  isActive ? "text-emerald-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;