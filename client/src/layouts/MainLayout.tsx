import { Outlet } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

const MainLayout = () => {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;