import {
  FaChartBar,
  FaClock,
  FaHome,
  FaRobot,
  FaUser,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const links = [
  {
    path: "/",
    icon: <FaHome />,
    title: "Dashboard",
  },

  {
    path: "/research",
    icon: <FaRobot />,
    title: "Research",
  },

  {
    path: "/history",
    icon: <FaClock />,
    title: "History",
  },

  {
    path: "/analytics",
    icon: <FaChartBar />,
    title: "Analytics",
  },

  {
    path: "/profile",
    icon: <FaUser />,
    title: "Profile",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 h-[calc(100vh-64px)]">

      <nav className="p-4 flex flex-col gap-2">

        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`
            }
          >
            {link.icon}

            {link.title}
          </NavLink>
        ))}

      </nav>
    </aside>
  );
};

export default Sidebar;