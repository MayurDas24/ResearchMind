import AppRoutes from "@/routes";
import useSocket from "./hooks/useSocket";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/ui/Toast";

function App() {
  useSocket();
  return (
    <ToastProvider>
      <AppRoutes />
      <ToastContainer />
    </ToastProvider>
  );
}

export default App;