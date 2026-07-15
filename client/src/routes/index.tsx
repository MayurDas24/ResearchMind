import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Research from "@/pages/Research";
import ResearchDetails from "@/pages/ResearchDetails";
import History from "@/pages/History";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:id" element={<ResearchDetails />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;